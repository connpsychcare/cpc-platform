import admin from "firebase-admin";
import { readFileSync } from "node:fs";
import { Injectable, type OnModuleInit } from "@nestjs/common";
import { InjectLogger } from "@/decorators/logger.decorator";
import { LoggerService } from "@/modules/logger/logger.service";
import { PrismaService } from "@/modules/prisma/prisma.service";
import type { SafeUser } from "@workspace/contracts/user";

@Injectable()
export class PushService implements OnModuleInit {
  @InjectLogger()
  private readonly logger!: LoggerService;

  constructor(private readonly prisma: PrismaService) {}

  onModuleInit() {
    this.ensureFirebase();
  }

  private ensureFirebase() {
    if (admin.apps.length > 0) return;

    const { credential, source } = this.resolveFirebaseCredential();

    admin.initializeApp({
      credential,
    });

    this.logger.log(`Firebase Admin initialized (${source})`);
  }

  private resolveFirebaseCredential(): {
    credential: admin.credential.Credential;
    source: string;
  } {
    const base64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64?.trim();
    if (base64) {
      return {
        credential: admin.credential.cert(
          JSON.parse(Buffer.from(base64, "base64").toString("utf8")),
        ),
        source: "service account env base64",
      };
    }

    const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
    if (json) {
      return {
        credential: admin.credential.cert(JSON.parse(json)),
        source: "service account env json",
      };
    }

    const path =
      process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim() ||
      process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
    if (path) {
      return {
        credential: admin.credential.cert(
          JSON.parse(readFileSync(path, "utf8")),
        ),
        source: "service account file",
      };
    }

    // Cloud Run can use ADC. Local dev can use `gcloud auth application-default login`.
    return {
      credential: admin.credential.applicationDefault(),
      source: "application default credentials",
    };
  }

  async sendPush(
    user: SafeUser,
    title: string,
    body: string,
    href?: string,
    notificationId?: string,
  ) {
    const sessions = await this.prisma.session.findMany({
      where: { userId: user.id, status: "active", pushToken: { not: null } },
      select: { pushToken: true, pushProvider: true },
    });

    // Run in parallel for performance
    await Promise.all(
      sessions.map((s) => {
        if (s.pushProvider === "fcm") {
          return this.sendWithFCM(
            s.pushToken!,
            title,
            body,
            user.id,
            href,
            notificationId,
          );
        } else if (s.pushProvider === "expo") {
          return this.sendWithExpo(
            s.pushToken!,
            title,
            body,
            href,
            notificationId,
          );
        }
      }),
    );
  }

  private async sendWithFCM(
    token: string,
    title: string,
    body: string,
    userId: string,
    href?: string,
    notificationId?: string,
  ) {
    try {
      const data: Record<string, string> = {};
      if (href) data.href = href;
      if (href) data.actionUrl = href;
      if (href) data.url = href;
      if (notificationId) data.notificationId = notificationId;

      const message: admin.messaging.Message = {
        token,
        notification: { title, body },
        data: Object.keys(data).length ? data : undefined,
        webpush: {
          fcmOptions: {
            link: href,
          },
        },
      };

      await admin.messaging().send(message);
      this.logger.log("FCM push sent", { userId, token });
    } catch (err: any) {
      this.logger.error("FCM push failed", { token, error: err?.message });

      // Clean up dead tokens
      if (
        [
          "messaging/registration-token-not-registered",
          "messaging/invalid-registration-token",
        ].includes(err?.code)
      ) {
        await this.prisma.session.updateMany({
          where: { pushToken: token },
          data: { pushToken: null, pushProvider: null },
        });
      }
    }
  }

  private async sendWithExpo(
    token: string,
    title: string,
    body: string,
    href?: string,
    notificationId?: string,
  ) {
    try {
      const res = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: token,
          title,
          body,
          data: { href, actionUrl: href, url: href, notificationId },
          sound: "default",
        }),
      });

      const result = (await res.json()) as any;
      if (result.data?.[0]?.status === "error") {
        const detail = result.data[0].details?.error;
        if (detail === "DeviceNotRegistered") {
          await this.prisma.session.updateMany({
            where: { pushToken: token },
            data: { pushToken: null, pushProvider: null },
          });
        }
      }
    } catch (err: any) {
      this.logger.error("Expo push failed", { token, error: err?.message });
    }
  }
}
