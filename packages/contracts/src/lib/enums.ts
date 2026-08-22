import { z } from "zod";
import * as $Enums from "@workspace/db/enums";

export const BaseSortByEnum = z.enum(["createdAt"]);
export const SortOrderEnum = z.enum(["asc", "desc"]);
export const ChartRangeEnum = z.enum(["7d", "30d", "90d"]);
export const ThemeModeEnum = z.enum($Enums.ThemeMode);
export const ClientAppEnum = z.enum($Enums.ClientApp);

export const UserRoleEnum = z.enum($Enums.UserRole);
export const UserStatusEnum = z.enum($Enums.UserStatus);
export const SafeUserRoleEnum = z.enum(
  Object.values($Enums.UserRole).filter((role) => role !== "admin"),
);

export const GenderEnum = z.enum($Enums.Gender);
export const IdentificationTypeEnum = z.enum($Enums.IdentificationType);

export const OtpTypeEnum = z.enum($Enums.OtpType);
export const OtpPurposeEnum = z.enum($Enums.OtpPurpose);
export const MfaMethodEnum = z.enum($Enums.MfaMethod);
export const SessionStatusEnum = z.enum($Enums.SessionStatus);
export const AuditActionEnum = z.enum($Enums.AuditAction);

export const PushProviderEnum = z.enum($Enums.PushProvider);
export const NotificationChannelEnum = z.enum($Enums.NotificationChannel);
export const NotificationPurposeEnum = z.enum($Enums.NotificationPurpose);
export const NotificationStatusEnum = z.enum($Enums.NotificationStatus);

export const MediaTypeEnum = z.enum($Enums.MediaType);
export const MediaVisibilityEnum = z.enum($Enums.MediaVisibility);

export const WeekdayEnum = z.enum($Enums.Weekday);
export const AppointmentChannelEnum = z.enum($Enums.AppointmentChannel);
export const AppointmentStatusEnum = z.enum($Enums.AppointmentStatus);
export const AppointmentCancellationSourceEnum = z.enum(
  $Enums.AppointmentCancellationSource,
);
export const BookingSourceEnum = z.enum($Enums.BookingSource);
export const ConversationTypeEnum = z.enum($Enums.ConversationType);
export const ConversationStatusEnum = z.enum($Enums.ConversationStatus);
export const PaymentProviderEnum = z.enum($Enums.PaymentProvider);
export const PaymentMethodTypeEnum = z.enum($Enums.PaymentMethodType);
export const PaymentStatusEnum = z.enum($Enums.PaymentStatus);
export const RefundStatusEnum = z.enum($Enums.RefundStatus);
export const CampaignStatusEnum = z.enum($Enums.CampaignStatus);
export const CampaignAudienceEnum = z.enum($Enums.CampaignAudience);
export const ContactMessageStatusEnum = z.enum($Enums.ContactMessageStatus);

export const UserSearchByEnum = z.enum(["id", "email", "phone", "displayName"]);
export const UserSortByEnum = z.enum([
  "displayName",
  "email",
  "phone",
  "role",
  "status",
  "lastLoginAt",
]);

export const ProviderSearchByEnum = z.enum([
  "displayName",
  "title",
  "slug",
  "licenseNumber",
]);
export const ProviderSortByEnum = z.enum([
  "displayName",
  "title",
  "consultationFee",
]);

export const PatientSearchByEnum = z.enum(["displayName", "email", "phone"]);
export const PatientSortByEnum = z.enum(["displayName", "email", "createdAt"]);

export const AppointmentSearchByEnum = z.enum([
  "id",
  "status",
  "providerName",
  "patientName",
  "appointmentNumber",
]);
export const AppointmentSortByEnum = z.enum([
  "scheduledStartAt",
  "status",
  "createdAt",
]);

export const PaymentSearchByEnum = z.enum([
  "appointmentId",
  "status",
  "transactionId",
]);
export const PaymentSortByEnum = z.enum(["createdAt", "paidAt", "status"]);
export const CampaignSearchByEnum = z.enum(["title", "status", "audience"]);
export const CampaignSortByEnum = z.enum([
  "createdAt",
  "scheduledAt",
  "status",
]);

export const BranchSearchByEnum = z.enum(["name", "slug"]);
export const BranchSortByEnum = z.enum(["name", "createdAt"]);

export const MediaSearchByEnum = z.enum(["id", "name"]);
export const MediaSortByEnum = z.enum(["size", "name", "type"]);

export const AuditLogSearchByEnum = z.enum([
  "userId",
  "entityType",
  "entityId",
]);
export const AuditLogSortByEnum = z.enum(["createdAt", "entityType"]);

export const ContactMessageSortByEnum = z.enum([
  "name",
  "email",
  "phone",
  "subject",
  "repliedAt",
]);

export const ContactMessageSearchByEnum = z.enum([
  "name",
  "email",
  "phone",
  "subject",
]);

export const NewsletterSubscriberSortByEnum = z.enum([
  "name",
  "email",
  "subscribedAt",
  "unsubscribedAt",
]);

export const NewsletterSubscriberSearchByEnum = z.enum(["name", "email"]);

export const TrafficSourceSearchByEnum = z.enum([
  "utmSource",
  "utmMedium",
  "utmCampaign",
  "referrer",
  "landingPage",
]);
export const TrafficSourceSortByEnum = z.enum(["createdAt"]);

export const StaffSearchByEnum = z.enum(["displayName", "email", "title"]);
export const StaffSortByEnum = z.enum(["displayName", "title", "createdAt"]);

// ABA Clinical - DB-backed enums
export const TreatmentPlanStatusEnum = z.enum($Enums.TreatmentPlanStatus);
export const ProgramTypeEnum = z.enum($Enums.ProgramType);
export const ProgramStatusEnum = z.enum($Enums.ProgramStatus);
export const DataRecordingTypeEnum = z.enum($Enums.DataRecordingType);
export const DataResponseEnum = z.enum($Enums.DataResponse);
export const ProgressReportStatusEnum = z.enum($Enums.ProgressReportStatus);
export const InsuranceAuthorizationStatusEnum = z.enum(
  $Enums.InsuranceAuthorizationStatus,
);
export const ClinicalFormTypeEnum = z.enum($Enums.ClinicalFormType);

// Psychiatric Clinical - industry credential and specialty lists (stored as String[] in DB)
// These are NOT Prisma enums - they are Zod enums so callers can use
// .options for form arrays, the enum itself for schema validation,
// and z.infer<> for TypeScript types.
export const ClinicalCredentialEnum = z.enum([
  "PMHNP-BC",
  "APRN",
  "MD",
  "DO",
  "PA-C",
  "LCSW",
  "LMFT",
  "LPC",
  "Ph.D. Psychology",
  "Psy.D.",
  "M.S. Nursing",
  "M.S. Psychology",
  "M.S. Clinical Psychology",
  "M.S.N.",
  "M.A. Counseling",
  "B.S. Nursing",
  "B.S. Psychology",
  "Board Certified",
  "CPR",
  "Operations Lead",
]);

export const ClinicalSpecialtyEnum = z.enum([
  "Adult Psychiatry",
  "Child & Adolescent Psychiatry",
  "Medication Management",
  "Telehealth",
  "Depression Treatment",
  "Anxiety Treatment",
  "ADHD Treatment",
  "Bipolar Disorder",
  "Trauma & PTSD",
  "Psychotherapy",
  "Cognitive Behavioral Therapy",
  "Diagnostic Evaluation",
  "Crisis Intervention",
  "Family Therapy",
  "Caregiver Support",
  "Community Mental Health",
  "Transition Age Youth",
  "Program Oversight",
  "Care Coordination",
  "Staff Supervision",
]);

export const SpokenLanguageEnum = z.enum([
  "Arabic",
  "English",
  "Hindi",
  "Korean",
  "Urdu",
  "French",
  "Tagalog",
  "Spanish",
  "Amharic",
  "Mandarin",
  "Somali",
]);

export const PermissionModuleEnum = z.enum($Enums.PermissionModule);

export const CaregiverInvitationStatusEnum = z.enum(
  $Enums.CaregiverInvitationStatus,
);
export const CaregiverRelationshipEnum = z.enum($Enums.CaregiverRelationship);

// Insurance payers accepted by Connected Psychiatric Care.
// Verify against https://connectedpsychiatriccare.com/insurance before launch.
export const InsurancePayerEnum = z.enum([
  "Aetna",
  "Cigna",
  "UHC/Optum",
  "Anthem BCBS",
  "Carelon",
  "Saga",
  "Tricare",
  "Sutter Health",
  "Blue Shield of California",
  "MultiPlan",
  "Private Pay",
]);
