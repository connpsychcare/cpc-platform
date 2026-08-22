import type z from "zod";
import * as schema from "./schema";
import type { Session } from "@workspace/db/browser";
import type { Sanitize, UserRole } from "../lib/types";

export type SignInType = z.input<typeof schema.signInSchema>;
export type SignUpType = z.input<typeof schema.signUpSchema>;
export type RequestOtpType = z.input<typeof schema.requestOtpSchema>;
export type ValidateOtpType = z.input<typeof schema.validateOtpSchema>;
export type ResetPasswordType = z.input<typeof schema.resetPasswordSchema>;
export type UpdateMfaType = z.input<typeof schema.updateMfaSchema>;
export type UpdateIdentifierType = z.input<
  typeof schema.updateIdentifierSchema
>;
export type GoogleMobileSignInType = z.input<
  typeof schema.googleMobileSignInSchema
>;
export type AppleMobileSignInType = z.input<
  typeof schema.appleMobileSignInSchema
>;

export interface AuthTokensResponse {
  deviceId: string;
  accessToken: string;
  refreshToken: string;
}

export interface SignInResponse {
  id: string;
  role: UserRole;
  onboardingCompletedAt?: string;
  meta?: AuthTokensResponse;
}

export interface ValidateOtpResponse {
  id?: string;
  role?: UserRole;
  secret?: string;
  onboardingCompletedAt?: string;
  meta?: AuthTokensResponse;
}

export interface ValidateSessionResponse {
  id: string;
  role: UserRole;
  /** Only present for staff role - list of PermissionModule values the staff member has been granted. */
  permissions?: string[];
}

export type SessionResponse = Pick<
  Sanitize<Session>,
  | "id"
  | "clientApp"
  | "ip"
  | "isp"
  | "location"
  | "timezone"
  | "deviceType"
  | "deviceInfo"
  | "status"
  | "isTrusted"
  | "lastSeenAt"
  | "createdAt"
  | "expiresAt"
  | "revokedAt"
>;
