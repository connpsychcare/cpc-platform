import { Prisma } from "@workspace/db/browser";
import { z } from "zod";
import * as enums from "./enums";

export type DecimalInstance = InstanceType<typeof Prisma.Decimal>;
export type StrictOmit<T, K extends keyof T> = Omit<T, K>;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type ArrayItem<T> = T extends any[] ? T[number] : never;

export type Primitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | undefined
  | null;

export type Sanitize<T> = T extends DecimalInstance
  ? number
  : T extends Date
    ? string
    : T extends null
      ? undefined
      : T extends Primitive
        ? T
        : T extends Array<infer U>
          ? Array<Sanitize<U>>
          : { [K in keyof T]: Sanitize<T[K]> };

export type FormSectionType = "add" | "update";
export interface BaseCUFormProps {
  entityId?: string;
  formType: FormSectionType;
}

export type AuthFormType =
  | "sign-up"
  | "sign-in"
  | "reset-password"
  | "set-password";

export type OAuthProvider = "google" | "apple";
export type IdentifierType = "email" | "phone";

export type ClientApp = z.infer<typeof enums.ClientAppEnum>;
export type SortOrderType = z.infer<typeof enums.SortOrderEnum>;
export type ChartRangeType = z.infer<typeof enums.ChartRangeEnum>;
export type ThemeMode = z.infer<typeof enums.ThemeModeEnum>;

export type OtpPurpose = z.infer<typeof enums.OtpPurposeEnum>;
export type OtpType = z.infer<typeof enums.OtpTypeEnum>;
export type MfaMethod = z.infer<typeof enums.MfaMethodEnum>;
export type SessionStatus = z.infer<typeof enums.SessionStatusEnum>;

export type PushProvider = z.infer<typeof enums.PushProviderEnum>;
export type NotificationChannel = z.infer<typeof enums.NotificationChannelEnum>;
export type NotificationPurpose = z.infer<typeof enums.NotificationPurposeEnum>;
export type NotificationStatus = z.infer<typeof enums.NotificationStatusEnum>;

export interface BaseQueryType {
  page?: number;
  limit?: number;
  search?: string;
  sortOrder?: SortOrderType;
  sortBy?: string;
  searchBy?: string;
  includeIds?: string[];
  excludeIds?: string[];
  includeDeleted?: boolean;
}

export interface HealthCheckResponse {
  message: string;
  status: string;
  uptime: string;
  timestamp: string;
}

export interface BaseResponse {
  id: string;
}

export interface BaseQueryResponse {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type UserRole = z.infer<typeof enums.UserRoleEnum>;
export type SafeUserRole = z.infer<typeof enums.SafeUserRoleEnum>;
export type UserStatus = z.infer<typeof enums.UserStatusEnum>;
export type Gender = z.infer<typeof enums.GenderEnum>;
export type IdentificationType = z.infer<typeof enums.IdentificationTypeEnum>;
export type AuditAction = z.infer<typeof enums.AuditActionEnum>;

export type MediaType = z.infer<typeof enums.MediaTypeEnum>;
export type MediaVisibility = z.infer<typeof enums.MediaVisibilityEnum>;

export type Weekday = z.infer<typeof enums.WeekdayEnum>;
export type AppointmentChannel = z.infer<typeof enums.AppointmentChannelEnum>;
export type AppointmentStatus = z.infer<typeof enums.AppointmentStatusEnum>;
export type AppointmentCancellationSource = z.infer<
  typeof enums.AppointmentCancellationSourceEnum
>;
export type BookingSource = z.infer<typeof enums.BookingSourceEnum>;
export type ConversationType = z.infer<typeof enums.ConversationTypeEnum>;
export type ConversationStatus = z.infer<typeof enums.ConversationStatusEnum>;
export type PaymentProvider = z.infer<typeof enums.PaymentProviderEnum>;
export type PaymentMethodType = z.infer<typeof enums.PaymentMethodTypeEnum>;
export type PaymentStatus = z.infer<typeof enums.PaymentStatusEnum>;
export type RefundStatus = z.infer<typeof enums.RefundStatusEnum>;
export type CampaignStatus = z.infer<typeof enums.CampaignStatusEnum>;
export type CampaignAudience = z.infer<typeof enums.CampaignAudienceEnum>;

export type TreatmentPlanStatus = z.infer<typeof enums.TreatmentPlanStatusEnum>;
export type ProgramType = z.infer<typeof enums.ProgramTypeEnum>;
export type ProgramStatus = z.infer<typeof enums.ProgramStatusEnum>;
export type DataRecordingType = z.infer<typeof enums.DataRecordingTypeEnum>;
export type DataResponseType = z.infer<typeof enums.DataResponseEnum>;
export type ProgressReportStatus = z.infer<
  typeof enums.ProgressReportStatusEnum
>;
export type ClinicalFormType = z.infer<typeof enums.ClinicalFormTypeEnum>;
export type InsuranceAuthorizationStatus = z.infer<
  typeof enums.InsuranceAuthorizationStatusEnum
>;
export type PermissionModule = z.infer<typeof enums.PermissionModuleEnum>;
export type ClinicalCredential = z.infer<typeof enums.ClinicalCredentialEnum>;
export type ClinicalSpecialty = z.infer<typeof enums.ClinicalSpecialtyEnum>;
export type SpokenLanguage = z.infer<typeof enums.SpokenLanguageEnum>;
export type InsurancePayer = z.infer<typeof enums.InsurancePayerEnum>;
export type CaregiverInvitationStatus = z.infer<
  typeof enums.CaregiverInvitationStatusEnum
>;
export type CaregiverRelationship = z.infer<
  typeof enums.CaregiverRelationshipEnum
>;
