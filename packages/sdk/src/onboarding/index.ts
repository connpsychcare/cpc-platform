import apiClient, { executeApi } from "../lib/api-client";
import type {
  OnboardingFormResponseType,
  OnboardingStatusResponse,
  SubmitOnboardingType,
} from "@workspace/contracts/onboarding";

export type FormResponsePayload = OnboardingFormResponseType;
export type SubmitOnboardingFormsPayload = SubmitOnboardingType;

export const submitOnboardingForms = (data: SubmitOnboardingFormsPayload) =>
  executeApi<{ completedAt: string }>(() =>
    apiClient.post("/patients/me/onboarding", data),
  );

// ── Teacher Assessment Token ────────────────────────────────────

export type SendTeacherTokenPayload = {
  patientId: string;
  teacherEmail: string;
  teacherName?: string;
  schoolName?: string;
  appointmentId?: string;
};

export const sendTeacherAssessmentToken = (data: SendTeacherTokenPayload) =>
  executeApi<{ tokenId: string; expiresAt: string }>(() =>
    apiClient.post("/teacher-tokens", data),
  );

export const listTeacherTokens = (patientId: string) =>
  executeApi<{
    tokens: Array<{
      id: string;
      teacherEmail: string;
      teacherName: string | null;
      status: string;
      createdAt: string;
      expiresAt: string;
      submittedAt: string | null;
    }>;
  }>(() => apiClient.get(`/teacher-tokens?patientId=${patientId}`));

export type ValidateTokenResponse =
  | { valid: true; studentFirstName: string; teacherName: string | null; schoolName: string | null; expiresAt: string }
  | { valid: false; reason: "not_found" | "already_submitted" | "expired" };

export const validateTeacherToken = (token: string) =>
  executeApi<ValidateTokenResponse>(() =>
    apiClient.get(`/teacher-tokens/${token}/validate`),
  );

export type SubmitTeacherFormPayload = {
  inattentionItems: number[];
  hyperactivityItems: number[];
  performanceItems: number[];
  teacherName?: string;
  schoolName?: string;
};

export const submitTeacherForm = (token: string, data: SubmitTeacherFormPayload) =>
  executeApi<{ formResponseId: string; interpretation: string }>(() =>
    apiClient.post(`/teacher-tokens/${token}/submit`, data),
  );

export const getOnboardingStatus = () =>
  executeApi<OnboardingStatusResponse>(() =>
    apiClient.get("/patients/me/onboarding"),
  );
