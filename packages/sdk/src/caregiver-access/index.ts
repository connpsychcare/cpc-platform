import apiClient, { executeApi } from "../lib/api-client";
import type {
  CaregiverAccessType,
  RevokeCaregiverAccessType,
  CaregiverAccessQueryType,
  CaregiverAccessResponse,
  CaregiverAccessQueryResponse,
  SendCaregiverInvitationType,
  CaregiverInvitationQueryType,
  CaregiverInvitationResponse,
  CaregiverInvitationQueryResponse,
} from "@workspace/contracts/caregiver-access";

export const listCaregiverAccesses = (query?: CaregiverAccessQueryType) =>
  executeApi<CaregiverAccessQueryResponse>(() =>
    apiClient.get("/caregiver-access", { params: query }),
  );

export const getMyCaregiverAccesses = () =>
  executeApi<CaregiverAccessQueryResponse>(() =>
    apiClient.get("/caregiver-access/mine"),
  );

export const getMyProfileCaregivers = () =>
  executeApi<CaregiverAccessQueryResponse>(() =>
    apiClient.get("/caregiver-access/my-profile"),
  );

export const getMyInvitations = () =>
  executeApi<CaregiverInvitationQueryResponse>(() =>
    apiClient.get("/caregiver-access/my-invitations"),
  );

export const getCaregiverAccess = (id: string) =>
  executeApi<CaregiverAccessResponse>(() =>
    apiClient.get(`/caregiver-access/${id}`),
  );

export const grantCaregiverAccess = (data: CaregiverAccessType) =>
  executeApi<CaregiverAccessResponse>(() =>
    apiClient.post("/caregiver-access", data),
  );

export const revokeCaregiverAccess = (
  id: string,
  data?: RevokeCaregiverAccessType,
) =>
  executeApi<CaregiverAccessResponse>(() =>
    apiClient.patch(`/caregiver-access/${id}/revoke`, data ?? {}),
  );

export const deleteCaregiverAccess = (id: string) =>
  executeApi(() => apiClient.delete(`/caregiver-access/${id}`));

// ── Invitations ───────────────────────────────────────────────────────────────

export const sendCaregiverInvitation = (data: SendCaregiverInvitationType) =>
  executeApi<CaregiverInvitationResponse>(() =>
    apiClient.post("/caregiver-access/invitations", data),
  );

export const listCaregiverInvitations = (
  query?: CaregiverInvitationQueryType,
) =>
  executeApi<CaregiverInvitationQueryResponse>(() =>
    apiClient.get("/caregiver-access/invitations", { params: query }),
  );

export const getCaregiverInvitationByToken = (token: string) =>
  executeApi<CaregiverInvitationResponse>(() =>
    apiClient.get(`/caregiver-access/invitations/token/${token}`),
  );

export const acceptCaregiverInvitation = (token: string) =>
  executeApi<CaregiverAccessResponse>(() =>
    apiClient.post(`/caregiver-access/invitations/token/${token}/accept`),
  );

export const rejectCaregiverInvitation = (token: string) =>
  executeApi<CaregiverInvitationResponse>(() =>
    apiClient.post(`/caregiver-access/invitations/token/${token}/reject`),
  );

export const revokeCaregiverInvitation = (id: string) =>
  executeApi<CaregiverInvitationResponse>(() =>
    apiClient.patch(`/caregiver-access/invitations/${id}/revoke`),
  );
