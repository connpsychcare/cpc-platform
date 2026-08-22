import { z } from "zod";
import { MfaMethodEnum, OtpPurposeEnum, OtpTypeEnum } from "../lib/enums";
import {
  emailSchema,
  identifierSchema,
  nameSchema,
  passwordSchema,
  phoneSchema,
} from "../lib/schema";

export const signInSchema = z.object({
  identifier: identifierSchema,
  password: passwordSchema,
});

export const signUpSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema.optional(),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
});

export const requestOtpSchema = z.object({
  identifier: identifierSchema,
  purpose: OtpPurposeEnum,
});

export const validateOtpSchema = requestOtpSchema.extend({
  secret: z.string().min(6),
  type: OtpTypeEnum.default("numericCode"),
});

export const resetPasswordSchema = validateOtpSchema.extend({
  purpose: z.enum(["setPassword", "resetPassword", "changePassword"]),
  newPassword: passwordSchema,
});

export const updateMfaSchema = validateOtpSchema.extend({
  purpose: z.enum(["enableMfa", "changeMfa"]),
  preferredMfa: MfaMethodEnum,
});

export const updateIdentifierSchema = validateOtpSchema.extend({
  purpose: z.enum(["setIdentifier", "changeIdentifier"]),
  newIdentifier: identifierSchema,
});

export const googleMobileSignInSchema = z.object({
  idToken: z.string().min(1, "Google ID token is required"),
});

export const appleMobileSignInSchema = z.object({
  identityToken: z.string().min(1, "Apple identity token is required"),
  email: emailSchema.optional(),
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
});
