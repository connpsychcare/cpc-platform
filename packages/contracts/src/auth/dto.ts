import {
  signInSchema,
  signUpSchema,
  requestOtpSchema,
  googleMobileSignInSchema,
  appleMobileSignInSchema,
  validateOtpSchema,
  resetPasswordSchema,
  updateIdentifierSchema,
  updateMfaSchema,
} from "./schema";
import { createZodDto } from "nestjs-zod";

export class SignInDto extends createZodDto(signInSchema) {}

export class SignUpDto extends createZodDto(signUpSchema) {}

export class RequestOtpDto extends createZodDto(requestOtpSchema) {}

export class ValidateOtpDto extends createZodDto(validateOtpSchema) {}

export class ResetPasswordDto extends createZodDto(resetPasswordSchema) {}

export class UpdateMfaDto extends createZodDto(updateMfaSchema) {}

export class UpdateIdentifierDto extends createZodDto(updateIdentifierSchema) {}

export class GoogleMobileSignInDto extends createZodDto(
  googleMobileSignInSchema,
) {}

export class AppleMobileSignInDto extends createZodDto(
  appleMobileSignInSchema,
) {}
