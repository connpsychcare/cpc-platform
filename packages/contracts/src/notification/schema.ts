import { z } from "zod";
import { PushProviderEnum } from "../lib/enums";
import { requiredStringSchema } from "../lib/schema";

export const configurePushNotificationsSchema = z.discriminatedUnion(
  "enabled",
  [
    z.object({
      enabled: z.literal(true),
      token: requiredStringSchema,
      provider: PushProviderEnum,
    }),
    z.object({
      enabled: z.literal(false),
    }),
  ],
);
