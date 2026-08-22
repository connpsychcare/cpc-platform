import { z } from "zod";
import ms, { type StringValue } from "ms";

const zMsString = z
  .string()
  .transform((val) => val as StringValue)
  .refine((val) => {
    try {
      const parsed = ms(val);
      return typeof parsed === "number" && parsed > 0;
    } catch {
      return false;
    }
  }, "Invalid ms() duration string");

export const envSchema = z.object({
  // ==============================
  // APP - CONFIG
  // ==============================
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  APP_PORT: z.coerce.number(),
  APP_ENDPOINT: z.string(),
  PATIENT_ENDPOINT: z.string(),
  DASHBOARD_ENDPOINT: z.string(),
  CORS_ORIGIN: z
    .string()
    .transform((val) => val.split(",").map((origin) => origin.trim())),

  // ==============================
  // Database
  // ==============================
  DB_URI: z.string(),

  // ==============================
  // Media Storage
  // ==============================
  CLOUDINARY_URL: z.string(),
  CLOUDINARY_ROOT_FOLDER: z.string(),

  // ==============================
  // OTP and Auth
  // ==============================
  OTP_EXP: zMsString,
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  ACCESS_TOKEN_EXP: zMsString,
  REFRESH_TOKEN_EXP: zMsString,

  // ==============================
  // OAuth Providers
  // ==============================
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CALLBACK_URL: z.string(),
  APPLE_BUNDLE_ID: z.string().optional().default("com.zhxlabs.ConnectedPsychiatricCare"),
  APPLE_WEB_CLIENT_ID: z.string().optional().default(""),
  APPLE_TEAM_ID: z.string().optional().default(""),
  APPLE_KEY_ID: z.string().optional().default(""),
  APPLE_PRIVATE_KEY_BASE64: z.string().optional().default(""),
  APPLE_WEB_CALLBACK_URL: z.string().optional().default(""),

  // ==============================
  // Firebase Admin / Push
  // ==============================
  FIREBASE_SERVICE_ACCOUNT_BASE64: z.string().optional().default(""),
  FIREBASE_SERVICE_ACCOUNT_JSON: z.string().optional().default(""),
  FIREBASE_SERVICE_ACCOUNT_PATH: z.string().optional().default(""),
  GOOGLE_APPLICATION_CREDENTIALS: z.string().optional().default(""),

  // ==============================
  // Email Delivery
  // ==============================
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),

  // ==============================
  // SMS / WhatsApp (Twilio)
  // ==============================
  TWILIO_ACCOUNT_SID: z.string(),
  TWILIO_AUTH_TOKEN: z.string(),
  TWILIO_PHONE_NUMBER: z.string(),
  TWILIO_WHATSAPP_NUMBER: z.string(),

  // ==============================
  // External APIs
  // ==============================
  IP_STACK_API_KEY: z.string(),

  // ==============================
  // Payments
  // ==============================
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_PUBLISHABLE_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),

  PAYPAL_CLIENT_ID: z.string().optional().default(""),
  PAYPAL_CLIENT_SECRET: z.string().optional().default(""),
  PAYPAL_MODE: z.enum(["sandbox", "live"]).optional().default("sandbox"),
  PAYPAL_WEBHOOK_ID: z.string().optional().default(""),

  // ==============================
  // Admin Bootstrap
  // ==============================
  ADMIN_NAME: z.string(),
  ADMIN_EMAIL: z.string(),
  ADMIN_PASSWORD: z.string(),
});

export function validateEnv(config: Record<string, any>) {
  const normalized = {
    ...config,
    APP_PORT: config.NODE_ENV === "production" ? config.PORT : config.APP_PORT,
  };

  const parsed = envSchema.safeParse(normalized);

  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:",
      z.flattenError(parsed.error).fieldErrors,
    );
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
}

export type EnvSchema = z.infer<typeof envSchema>;
