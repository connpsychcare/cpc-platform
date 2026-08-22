import z from "zod";
import { booleanSchema, idSchema, nameSchema } from "../lib/schema";
import { ThemeModeEnum } from "../lib/enums";

export const userProfileSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema.optional(),
  displayName: nameSchema,
  avatarId: idSchema.optional(),

  preferredTheme: ThemeModeEnum.default("system"),
  loginAlerts: booleanSchema.default(true),
});
