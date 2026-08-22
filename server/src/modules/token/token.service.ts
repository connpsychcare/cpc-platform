import { ulid } from "ulid";
import argon2 from "argon2";
import type { Request, Response } from "express";
import { SignJWT, errors, jwtVerify, type JWTPayload } from "jose";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { futureDate } from "@workspace/shared/utils";
import {
  ClientApp,
  UserRole,
  UserStatus,
  type Prisma,
} from "@workspace/db/client";

import { EnvService } from "@/modules/env/env.service";
import { ClientService } from "@/modules/client/client.service";
import { PrismaService } from "@/modules/prisma/prisma.service";

type TokenType = "accessToken" | "refreshToken";
type TokenErrorReason = "missing" | "expired" | "invalid";

export interface JwtPayload {
  sub: string;
  aud: string;
  sid: string;
  rol: UserRole;
  sts: UserStatus;
  dem?: boolean;
}

export interface ClientAuthTokens {
  accessToken: string;
  refreshToken: string;
  deviceId: string;
}

const TOKEN_CONFIG: Record<
  TokenType,
  {
    header: string;
    cookieKey: TokenType;
    label: string;
    errorPrefix: string;
    expiresInEnvKey: "ACCESS_TOKEN_EXP" | "REFRESH_TOKEN_EXP";
  }
> = {
  accessToken: {
    header: "x-access-token",
    cookieKey: "accessToken",
    label: "Access token",
    errorPrefix: "access_token",
    expiresInEnvKey: "ACCESS_TOKEN_EXP",
  },
  refreshToken: {
    header: "x-refresh-token",
    cookieKey: "refreshToken",
    label: "Refresh token",
    errorPrefix: "refresh_token",
    expiresInEnvKey: "REFRESH_TOKEN_EXP",
  },
};

@Injectable()
export class TokenService {
  private readonly encoder = new TextEncoder();
  private readonly accessSecret: Uint8Array;
  private readonly refreshSecret: Uint8Array;

  constructor(
    private readonly env: EnvService,
    private readonly prisma: PrismaService,
    private readonly client: ClientService,
  ) {
    this.accessSecret = this.encoder.encode(this.env.get("JWT_ACCESS_SECRET"));
    this.refreshSecret = this.encoder.encode(
      this.env.get("JWT_REFRESH_SECRET"),
    );
  }

  private throwAuthError(errorCode: string, message: string): never {
    throw new UnauthorizedException({ errorCode, message });
  }

  private throwTokenError(type: TokenType, reason: TokenErrorReason): never {
    const config = TOKEN_CONFIG[type];

    if (type === "refreshToken") {
      const errorCode = `${config.errorPrefix}_${reason}`;

      this.throwAuthError(
        errorCode,
        "Your session has expired. Please sign in again.",
      );
    }

    const messages: Record<TokenErrorReason, string> = {
      missing: `${config.label} is missing.`,
      expired: `${config.label} has expired.`,
      invalid: `${config.label} is invalid.`,
    };

    this.throwAuthError(`${config.errorPrefix}_${reason}`, messages[reason]);
  }

  private throwSessionExpired(): never {
    this.throwAuthError(
      "session_expired",
      "Your session has expired. Please sign in again.",
    );
  }

  private getTokenSecret(type: TokenType): Uint8Array {
    return type === "accessToken" ? this.accessSecret : this.refreshSecret;
  }

  private getCookieKey(clientApp: ClientApp, key: TokenType | "deviceId"): string {
    return `${clientApp}_${key}`;
  }

  private getCookieCandidates(
    req: Request,
    key: TokenType | "deviceId",
  ): string[] {
    return [this.getCookieKey(req.clientApp, key), key];
  }

  private getCookieValue(
    req: Request,
    key: TokenType | "deviceId",
  ): string | undefined {
    for (const cookieKey of this.getCookieCandidates(req, key)) {
      const value = req.cookies[cookieKey];

      if (typeof value === "string" && value.length > 0) {
        return value;
      }
    }

    return undefined;
  }

  private getIncomingDeviceId(req: Request): string | undefined {
    const cookieDeviceId = this.getCookieValue(req, "deviceId");
    const headerDeviceId = req.headers["x-device-id"];

    if (cookieDeviceId) {
      return cookieDeviceId;
    }

    if (typeof headerDeviceId === "string" && headerDeviceId.length > 0) {
      return headerDeviceId;
    }

    return undefined;
  }

  private async findReusableActiveSession(
    userId: string,
    clientApp: ClientApp,
    ctx: Pick<Prisma.SessionUncheckedCreateInput, "ip" | "deviceType" | "deviceInfo">,
  ) {
    const matchingSessions = await this.prisma.session.findMany({
      where: {
        userId,
        clientApp,
        status: "active",
        expiresAt: { gt: new Date() },
        ip: ctx.ip,
        deviceType: ctx.deviceType,
        deviceInfo: ctx.deviceInfo,
      },
      orderBy: { lastSeenAt: "desc" },
      select: {
        id: true,
        deviceId: true,
      },
      take: 2,
    });

    return matchingSessions.length === 1 ? matchingSessions[0] : null;
  }

  private buildRequestUser(payload: JwtPayload): AuthUser {
    return {
      id: payload.sub,
      role: payload.rol,
      status: payload.sts,
      sessionId: payload.sid,
      isDemo: payload.dem ?? false,
    };
  }

  private getTokenFromRequest(req: Request, type: TokenType): string {
    const config = TOKEN_CONFIG[type];

    // 1. Custom header (standard for all axios requests)
    const headerValue = req.headers[config.header];
    const tokenFromHeader =
      typeof headerValue === "string" ? headerValue : undefined;

    // 2. httpOnly cookie (browser clients - Next.js web / dashboard)
    const tokenFromCookie = this.getCookieValue(req, config.cookieKey);

    // 3. Query param - fallback for EventSource / SSE connections that cannot
    //    send custom headers (e.g. Expo mobile clients using a session adapter)
    const queryValue = req.query[config.cookieKey];
    const tokenFromQuery =
      typeof queryValue === "string" ? queryValue : undefined;

    const token = tokenFromHeader ?? tokenFromCookie ?? tokenFromQuery;

    if (!token) {
      this.throwTokenError(type, "missing");
    }

    return token;
  }

  private async signToken(
    payload: JWTPayload & JwtPayload,
    type: TokenType,
  ): Promise<string> {
    const { expiresInEnvKey } = TOKEN_CONFIG[type];

    return new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(this.env.get(expiresInEnvKey))
      .sign(this.getTokenSecret(type));
  }

  async generateTokens(req: Request, user: AuthUser) {
    const ctx = await this.client.buildSessionContext(req);

    const isTrusted = req.headers["x-trusted-device"] === "true";
    const incomingDeviceId = this.getIncomingDeviceId(req);
    const reusableSession =
      !incomingDeviceId && !user.sessionId
        ? await this.findReusableActiveSession(user.id, req.clientApp, ctx)
        : null;
    const deviceId = incomingDeviceId ?? reusableSession?.deviceId ?? ulid();
    const sessionId = user.sessionId ?? reusableSession?.id ?? ulid();

    const payload = {
      sid: sessionId,
      aud: req.clientApp,
      sub: user.id,
      rol: user.role,
      sts: user.status,
      ...(user.isDemo && { dem: true }),
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(payload, "accessToken"),
      this.signToken(payload, "refreshToken"),
    ]);

    const refreshTokenHash = await argon2.hash(refreshToken);
    const refreshExpiresAt = futureDate(this.env.get("REFRESH_TOKEN_EXP"));

    const sessionData: Prisma.SessionUncheckedCreateInput = {
      ...ctx,
      id: payload.sid,
      userId: payload.sub,
      deviceId,
      clientApp: req.clientApp,
      refreshTokenHash,
      status: "active",
      lastSeenAt: new Date(),
      expiresAt: refreshExpiresAt,
    };

    const where = user.sessionId
      ? { id: user.sessionId }
      : {
          userId_clientApp_deviceId: {
            userId: user.id,
            clientApp: req.clientApp,
            deviceId,
          },
        };

    await this.prisma.session.upsert({
      where,
      update: sessionData,
      create: { ...sessionData, isTrusted },
    });

    return {
      accessToken,
      refreshToken,
      deviceId,
      payload,
      isTrusted,
    };
  }

  async verifyToken(req: Request, type: TokenType): Promise<JwtPayload> {
    const token = this.getTokenFromRequest(req, type);

    try {
      const { payload } = await jwtVerify<JWTPayload & JwtPayload>(
        token,
        this.getTokenSecret(type),
      );

      if (payload.aud !== req.clientApp) {
        this.throwAuthError("unauthorized", "Token audience mismatch.");
      }

      return payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }

      if (error instanceof errors.JWTExpired) {
        this.throwTokenError(type, "expired");
      }

      this.throwTokenError(type, "invalid");
    }
  }

  async refreshSession(req: Request, res: Response) {
    try {
      const payload = await this.verifyToken(req, "refreshToken");
      await this.client.assertRoleAccess(req, payload.rol);

      const result = await this.refreshTokens(req, res, payload);

      return {
        message: "Session refreshed successfully.",
        data: {
          id: result.user.id,
          role: result.user.role,
        },
        meta: result.tokens,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        this.clearAuthCookies(res, req);
      }

      throw error;
    }
  }

  async refreshTokens(req: Request, res: Response, payload: JwtPayload) {
    const refreshToken = this.getTokenFromRequest(req, "refreshToken");

    return this.prisma.$transaction(async (tx) => {
      const session = await tx.session.findUnique({
        where: { id: payload.sid },
      });

      if (!session || session.status !== "active") {
        this.throwSessionExpired();
      }

      if (session.clientApp !== req.clientApp) {
        await this.revokeSession(session.id, undefined, tx);
        this.throwSessionExpired();
      }

      if (session.expiresAt <= new Date()) {
        await tx.session.update({
          where: { id: session.id },
          data: { status: "expired" },
        });

        this.throwSessionExpired();
      }

      const isValid = await argon2.verify(
        session.refreshTokenHash,
        refreshToken,
      );

      if (!isValid) {
        await this.revokeSession(session.id, undefined, tx);
        this.throwSessionExpired();
      }

      const user = this.buildRequestUser(payload);
      const tokens = await this.createAuthSession(req, res, user);

      return { user, tokens };
    });
  }

  async createAuthSession(
    req: Request,
    res: Response,
    user: AuthUser,
  ): Promise<ClientAuthTokens | undefined> {
    const tokens = await this.generateTokens(req, user);
    this.attachAuthContext(req, tokens.payload);
    if (req.clientApp === "mobile") {
      return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        deviceId: tokens.deviceId,
      };
    }

    this.setAuthCookies(req, res, tokens, tokens.isTrusted);
    return undefined;
  }

  attachAuthContext(req: Request, payload: JwtPayload): void {
    req["user"] = this.buildRequestUser(payload);
  }

  setAuthCookies(
    req: Request,
    res: Response,
    tokens: ClientAuthTokens,
    isTrusted: boolean,
  ): void {
    const accessExpiresAt = futureDate(this.env.get("ACCESS_TOKEN_EXP"));
    const refreshExpiresAt = futureDate(this.env.get("REFRESH_TOKEN_EXP"));

    this.client.setCookie(
      res,
      this.getCookieKey(req.clientApp, "accessToken"),
      tokens.accessToken,
      {
        expires: accessExpiresAt,
      },
    );

    this.client.setCookie(
      res,
      this.getCookieKey(req.clientApp, "refreshToken"),
      tokens.refreshToken,
      {
        expires: isTrusted ? refreshExpiresAt : undefined,
      },
    );

    this.client.setCookie(
      res,
      this.getCookieKey(req.clientApp, "deviceId"),
      tokens.deviceId,
      {
        expires: futureDate("1y"),
      },
    );
  }

  clearAuthCookies(res: Response, req?: Request): void {
    const keys = req
      ? [
          ...this.getCookieCandidates(req, "accessToken"),
          ...this.getCookieCandidates(req, "refreshToken"),
          ...this.getCookieCandidates(req, "deviceId"),
        ]
      : [
          "accessToken",
          "refreshToken",
          "deviceId",
          ...Object.values(ClientApp).flatMap((clientApp) => [
            this.getCookieKey(clientApp, "accessToken"),
            this.getCookieKey(clientApp, "refreshToken"),
            this.getCookieKey(clientApp, "deviceId"),
          ]),
        ];

    for (const key of new Set(keys)) {
      this.client.clearCookie(res, key);
    }
  }

  async getUserSessions(user: AuthUser) {
    const sessions = await this.prisma.session.findMany({
      where: { userId: user.id, status: "active" },
      orderBy: { lastSeenAt: "desc" },
      select: {
        id: true,
        clientApp: true,
        ip: true,
        isp: true,
        location: true,
        timezone: true,
        deviceType: true,
        deviceInfo: true,
        status: true,
        isTrusted: true,
        lastSeenAt: true,
        createdAt: true,
        expiresAt: true,
        revokedAt: true,
      },
    });

    const currentSessionId = user.sessionId;

    const sortedSessions = [
      ...sessions.filter((session) => session.id === currentSessionId),
      ...sessions.filter((session) => session.id !== currentSessionId),
    ];

    return {
      message: "Sessions fetched successfully.",
      data: sortedSessions,
    };
  }

  async revokeSession(
    sessionId: string,
    res?: Response,
    tx?: Prisma.TransactionClient,
    req?: Request,
  ) {
    const db = tx ?? this.prisma;

    await db.session.updateMany({
      where: { id: sessionId, status: "active" },
      data: { status: "revoked", revokedAt: new Date() },
    });

    if (res) {
      this.clearAuthCookies(res, req);
    }

    return { message: "Session revoked successfully." };
  }

  async revokeAllSessions(user: AuthUser) {
    await this.prisma.session.updateMany({
      where: {
        userId: user.id,
        status: "active",
        NOT: { id: user.sessionId },
      },
      data: { status: "revoked", revokedAt: new Date() },
    });

    return { message: "All sessions revoked successfully." };
  }
}
