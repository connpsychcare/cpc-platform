import apiClient, { executeApi } from "../lib/api-client";
import type {
  GrantStaffPermissionsType,
  StaffPermissionsResponse,
} from "@workspace/contracts/staff-permission";

export const getStaffPermissions = (staffId: string) =>
  executeApi<StaffPermissionsResponse>(() =>
    apiClient.get(`/staff-permissions/${staffId}`),
  );

export const syncStaffPermissions = (
  staffId: string,
  data: GrantStaffPermissionsType,
) =>
  executeApi<StaffPermissionsResponse>(() =>
    apiClient.put(`/staff-permissions/${staffId}`, data),
  );
