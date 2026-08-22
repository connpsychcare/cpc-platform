import apiClient, { executeApi } from "../lib/api-client";
import type {
  StaffAssignmentType,
  StaffAssignmentQueryType,
  StaffAssignmentResponse,
  StaffAssignmentQueryResponse,
  UnassignStaffType,
} from "@workspace/contracts/staff-assignment";

export const listStaffAssignments = (query?: StaffAssignmentQueryType) =>
  executeApi<StaffAssignmentQueryResponse>(() =>
    apiClient.get("/staff-assignments", { params: query }),
  );

export const getStaffAssignment = (id: string) =>
  executeApi<StaffAssignmentResponse>(() =>
    apiClient.get(`/staff-assignments/${id}`),
  );

export const assignPatients = (data: StaffAssignmentType) =>
  executeApi<StaffAssignmentResponse>(() =>
    apiClient.post("/staff-assignments", data),
  );

export const unassignPatient = (id: string, data?: UnassignStaffType) =>
  executeApi<StaffAssignmentResponse>(() =>
    apiClient.patch(`/staff-assignments/${id}/unassign`, data ?? {}),
  );

export const deleteStaffAssignment = (id: string) =>
  executeApi(() => apiClient.delete(`/staff-assignments/${id}`));
