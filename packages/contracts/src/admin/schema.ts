import {
  SafeUserRoleEnum,
  UserSearchByEnum,
  UserSortByEnum,
  UserStatusEnum,
} from "../lib/enums";
import {
  baseQuerySchema,
  booleanSchema,
  nameSchema,
  passwordSchema,
} from "../lib/schema";
import { signUpSchema } from "../auth";

export const CUUserSchema = signUpSchema.extend({
  displayName: nameSchema,
  status: UserStatusEnum,
  password: passwordSchema.optional(),
});

export const userQuerySchema = baseQuerySchema(
  UserSortByEnum,
  UserSearchByEnum,
).extend({
  role: SafeUserRoleEnum.optional(),
  isEmailVerified: booleanSchema.optional(),
  isPhoneVerified: booleanSchema.optional(),
  status: UserStatusEnum.optional(),
  hasNoProfile: booleanSchema.optional(),
  /** Staff users who do not yet own a ProviderProfile, for the provider picker. */
  hasNoProviderProfile: booleanSchema.optional(),
});
