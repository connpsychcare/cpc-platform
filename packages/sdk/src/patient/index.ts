import apiClient, { executeApi } from "../lib/api-client";
import type {
  CreateDependentType,
  CreatePatientType,
  PatientProfileResponse,
  PatientProfileType,
  PatientQueryResponse,
  PatientQueryType,
} from "@workspace/contracts/patient";

export const getMyPatientProfile = () =>
  executeApi<PatientProfileResponse>(() => apiClient.get("/patients/me"));

export const updateMyPatientProfile = (data: PatientProfileType) =>
  executeApi<PatientProfileResponse>(() => apiClient.put("/patients/me", data));

export const listPatients = (params?: PatientQueryType) =>
  executeApi<PatientQueryResponse>(() =>
    apiClient.get("/patients", { params }),
  );

export const getPatient = (id: string) =>
  executeApi<PatientProfileResponse>(() => apiClient.get(`/patients/${id}`));

export const createPatient = (data: CreatePatientType) =>
  executeApi<PatientProfileResponse>(() => apiClient.post("/patients", data));

export const updatePatient = (id: string, data: PatientProfileType) =>
  executeApi<PatientProfileResponse>(() =>
    apiClient.put(`/patients/${id}`, data),
  );

export const createDependent = (data: CreateDependentType) =>
  executeApi<{ patientId: string; displayName: string }>(() =>
    apiClient.post("/patients/dependent", data),
  );
