import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
  type OnModuleInit,
} from "@nestjs/common";
import type { Request } from "express";
import passport from "passport";
import { OAuth2Client } from "google-auth-library";
import { createRemoteJWKSet, jwtVerify } from "jose";
import {
  Strategy as GoogleStrategy,
  type Profile as GoogleProfile,
} from "passport-google-oauth20";
import AppleStrategy from "passport-apple";
import { slugify } from "@workspace/shared/utils";
import type { OAuthProvider } from "@workspace/contracts";

import { EnvService } from "@/modules/env/env.service";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { OtpService } from "./otp.service";
import { NotificationService } from "../notification/notification.service";
import type {
  GoogleMobileSignInDto,
  AppleMobileSignInDto,
} from "@workspace/contracts/auth/dto";

const appleJWKS = createRemoteJWKSet(
  new URL("https://appleid.apple.com/auth/keys"),
);

interface OAuthProfile {
  provider: OAuthProvider;
  id: string;
  email: string | null;
  firstName: string;
  lastName: string;
  displayName: string;
  imageUrl?: string;
}

@Injectable()
export class OAuthService implements OnModuleInit {
  private readonly logger = new Logger(OAuthService.name);
  private readonly googleClient: OAuth2Client;

  constructor(
    private readonly env: EnvService,
    private readonly prisma: PrismaService,
    private readonly otpService: OtpService,
    private readonly notify: NotificationService,
  ) {
    this.googleClient = new OAuth2Client(this.env.get("GOOGLE_CLIENT_ID"));
  }

  onModuleInit() {
    this.initGoogleStrategy();
    this.initAppleWebStrategy();
  }

  private initGoogleStrategy() {
    passport.use(
      "google",
      new GoogleStrategy(
        {
          clientID: this.env.get("GOOGLE_CLIENT_ID"),
          clientSecret: this.env.get("GOOGLE_CLIENT_SECRET"),
          callbackURL: this.env.get("GOOGLE_CALLBACK_URL"),
          scope: ["profile", "email"],
          passReqToCallback: true,
        },
        async (req: Request, _, __, profile: GoogleProfile, done) => {
          try {
            const user = await this.validateNormalizedProfile(
              req,
              this.normalizePassportProfile(profile),
            );
            done(null, user);
          } catch (err) {
            done(err, false);
          }
        },
      ),
    );
  }

  private initAppleWebStrategy() {
    const clientID = this.env.get("APPLE_WEB_CLIENT_ID");
    const keyID = this.env.get("APPLE_KEY_ID");
    const teamID = this.env.get("APPLE_TEAM_ID");
    const privateKeyBase64 = this.env.get("APPLE_PRIVATE_KEY_BASE64");
    const callbackURL = this.env.get("APPLE_WEB_CALLBACK_URL");

    if (!clientID || !keyID || !teamID || !privateKeyBase64 || !callbackURL) {
      return;
    }

    const privateKeyString = Buffer.from(privateKeyBase64, "base64").toString(
      "utf-8",
    );

    passport.use(
      "apple",
      new AppleStrategy(
        {
          clientID,
          teamID,
          keyID,
          privateKeyString,
          callbackURL,
          scope: ["name", "email"],
          passReqToCallback: true,
        } as any,
        async (req: Request, _: any, __: any, idToken: any, profile: any, done: any) => {
          try {
            const email = idToken?.email ?? null;
            const firstName = profile?.name?.firstName ?? "Patient";
            const lastName = profile?.name?.lastName ?? "";

            if (!email) {
              return done(
                new UnauthorizedException(
                  "Email not provided by Apple Sign In. Please allow email access.",
                ),
              );
            }

            const normalized: OAuthProfile = {
              provider: "apple",
              id: idToken.sub,
              email,
              firstName,
              lastName,
              displayName:
                [firstName, lastName].filter(Boolean).join(" ").trim() ||
                "Patient",
            };

            const user = await this.validateNormalizedProfile(req, normalized);
            done(null, user);
          } catch (err) {
            done(err, false);
          }
        },
      ),
    );
  }

  async validateMobileGoogleSignIn(req: Request, dto: GoogleMobileSignInDto) {
    let ticket;
    try {
      ticket = await this.googleClient.verifyIdToken({
        idToken: dto.idToken,
        audience: this.env.get("GOOGLE_CLIENT_ID"),
      });
    } catch {
      throw new UnauthorizedException("Google ID token is invalid.");
    }

    const payload = ticket.getPayload();

    if (!payload?.email) {
      throw new UnauthorizedException("No email in Google token.");
    }

    const [firstName = "Guest", lastName = ""] = [
      payload.given_name,
      payload.family_name,
    ];

    const normalized: OAuthProfile = {
      provider: "google",
      id: payload.sub,
      email: payload.email,
      firstName,
      lastName,
      displayName: `${firstName} ${lastName}`.trim(),
      imageUrl: payload.picture,
    };

    return this.validateNormalizedProfile(req, normalized);
  }

  async validateMobileAppleSignIn(req: Request, dto: AppleMobileSignInDto) {
    const bundleId = this.env.get("APPLE_BUNDLE_ID");

    let payload: Record<string, unknown>;
    try {
      const result = await jwtVerify(dto.identityToken, appleJWKS, {
        issuer: "https://appleid.apple.com",
        audience: bundleId,
      });
      payload = result.payload as Record<string, unknown>;
    } catch {
      throw new UnauthorizedException("Apple identity token is invalid.");
    }

    const appleUserId = payload.sub as string;
    const tokenEmail = payload.email as string | undefined;
    const email = dto.email ?? tokenEmail ?? null;

    if (!email) {
      throw new UnauthorizedException(
        "Unable to retrieve email from Apple Sign In. Please try again or use a different sign-in method.",
      );
    }

    const firstName = dto.firstName ?? "Patient";
    const lastName = dto.lastName ?? "";

    const normalized: OAuthProfile = {
      provider: "apple",
      id: appleUserId,
      email,
      firstName,
      lastName,
      displayName: [firstName, lastName].filter(Boolean).join(" ").trim() || "Patient",
    };

    return this.validateNormalizedProfile(req, normalized);
  }

  private async validateNormalizedProfile(
    req: Request,
    normalized: OAuthProfile,
  ) {
    if (!normalized.email) {
      throw new BadRequestException("No email found");
    }

    let user = await this.prisma.user.findUnique({
      where: { email: normalized.email },
      include: { avatar: true },
    });

    if (!user) {
      if (req.clientApp === "dashboard") {
        throw new ForbiddenException({
          errorCode: "app_access_forbidden",
          message: "User not found. Need access? Contact an administrator.",
        });
      }

      user = await this.prisma.user.create({
        data: {
          email: normalized.email.toLowerCase(),
          firstName:
            normalized.firstName || normalized.displayName || "Patient",
          lastName: normalized.lastName || null,
          displayName:
            normalized.displayName ||
            [normalized.firstName, normalized.lastName]
              .filter(Boolean)
              .join(" ") ||
            "Patient",
          role: "patient",
          status: "active",
          isEmailVerified: true,
        },
        include: { avatar: true },
      });

      this.notify.sendNotification({
        user,
        identifier: normalized.email,
        purpose: "signUp",
      }).catch((err) => this.logger.warn("Sign-up welcome email failed - sign-in continues", err));

      await this.prisma.patientProfile.create({ data: { userId: user.id } });
    } else if (!user.isEmailVerified) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { isEmailVerified: true },
        include: { avatar: true },
      });
    }

    if (normalized.imageUrl && user.avatar?.url !== normalized.imageUrl) {
      const avatar = await this.prisma.media.upsert({
        where: {
          url: normalized.imageUrl,
        },
        create: {
          type: "avatar",
          url: normalized.imageUrl,
          name: `${slugify(normalized.displayName)}-avatar`,
          mimeType: "image/jpeg",
          resourceType: "image",
          publicId: normalized.imageUrl,
          size: 0,
          hash: normalized.imageUrl,
          uploadedById: user.id,
        },
        update: {
          name: `${slugify(normalized.displayName)}-avatar`,
          uploadedById: user.id,
        },
      });

      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { avatarId: avatar.id },
        include: { avatar: true },
      });
    }

    const { password, ...rest } = user;

    if (!password) {
      this.otpService.sendOtp({
        user: rest,
        type: "secureToken",
        purpose: "setPassword",
        identifier: normalized.email,
      }).catch((err) => this.logger.warn("Set-password OTP email failed - sign-in continues", err));
    }

    return {
      id: rest.id,
      role: user.role,
      status: user.status,
      isDemo: rest.isDemo,
    };
  }

  private normalizePassportProfile(profile: GoogleProfile): OAuthProfile {
    const provider = profile.provider as OAuthProvider;
    const email = profile.emails?.[0]?.value || null;

    const displayName =
      profile.displayName ||
      `${profile.name?.givenName || ""} ${profile.name?.familyName || ""}`.trim();

    const firstName = profile.name?.givenName || "";
    const lastName = profile.name?.familyName || "";

    const imageUrl = profile.photos?.[0]?.value;

    return {
      id: profile.id,
      provider,
      email,
      displayName,
      firstName,
      lastName,
      imageUrl,
    };
  }
}
