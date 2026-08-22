import apiClient, { executeApi } from "../lib/api-client";
import type {
  ProgressReportType,
  UpdateProgressReportType,
  ProgressReportQueryType,
  ProgressReportResponse,
  ProgressReportQueryResponse,
} from "@workspace/contracts/progress-report";

export const listProgressReports = (query?: ProgressReportQueryType) =>
  executeApi<ProgressReportQueryResponse>(() =>
    apiClient.get("/progress-reports", { params: query }),
  );

export const getProgressReport = (id: string) =>
  executeApi<ProgressReportResponse>(() =>
    apiClient.get(`/progress-reports/${id}`),
  );

export const createProgressReport = (data: ProgressReportType) =>
  executeApi<ProgressReportResponse>(() =>
    apiClient.post("/progress-reports", data),
  );

export const updateProgressReport = (
  id: string,
  data: UpdateProgressReportType,
) =>
  executeApi<ProgressReportResponse>(() =>
    apiClient.patch(`/progress-reports/${id}`, data),
  );

export const deleteProgressReport = (id: string) =>
  executeApi(() => apiClient.delete(`/progress-reports/${id}`));

/** Returns a Blob containing the generated PDF for direct download. */
export const downloadProgressReportPdf = async (id: string): Promise<Blob> => {
  const response = await apiClient.get(`/progress-reports/${id}/pdf`, {
    responseType: "blob",
  });
  return response.data as Blob;
};
