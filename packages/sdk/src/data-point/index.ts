import apiClient, { executeApi } from "../lib/api-client";
import type {
  DataPointType,
  DataPointQueryType,
  DataPointResponse,
  DataPointQueryResponse,
} from "@workspace/contracts/data-point";

export const listDataPoints = (query?: DataPointQueryType) =>
  executeApi<DataPointQueryResponse>(() =>
    apiClient.get("/data-points", { params: query }),
  );

export const getDataPoint = (id: string) =>
  executeApi<DataPointResponse>(() => apiClient.get(`/data-points/${id}`));

export const createDataPoint = (data: DataPointType) =>
  executeApi<DataPointResponse>(() => apiClient.post("/data-points", data));

export const updateDataPoint = (id: string, data: Partial<DataPointType>) =>
  executeApi<DataPointResponse>(() =>
    apiClient.patch(`/data-points/${id}`, data),
  );

export const deleteDataPoint = (id: string) =>
  executeApi(() => apiClient.delete(`/data-points/${id}`));
