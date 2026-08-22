import { apiClient, executeApi } from "../lib";
import type {
  AdminDashboardOverview,
  ProviderDashboardOverview,
  PatientDashboardOverview,
  StaffDashboardOverview,
} from "@workspace/contracts/dashboard";

export const getAdminDashboard = () =>
  executeApi<AdminDashboardOverview>(() => apiClient.get("/dashboard/admin"));

export const getProviderDashboard = () =>
  executeApi<ProviderDashboardOverview>(() => apiClient.get("/dashboard/provider"));

export const getStaffDashboard = () =>
  executeApi<StaffDashboardOverview>(() => apiClient.get("/dashboard/staff"));

export const getPatientDashboard = () =>
  executeApi<PatientDashboardOverview>(() => apiClient.get("/dashboard/patient"));

export interface PublicStats {
  patientsServed: number;
  staffCount: number;
  yearsInOperation: number;
  satisfactionRate: number;
}

export const getPublicStats = () =>
  executeApi<PublicStats>(() => apiClient.get("/dashboard/stats"));
