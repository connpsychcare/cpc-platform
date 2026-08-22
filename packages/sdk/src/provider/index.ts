import apiClient, { executeApi } from "../lib/api-client";
import type {
  CreateProviderType,
  ProviderProfileResponse,
  ProviderProfileType,
  ProviderQueryResponse,
  ProviderQueryType,
} from "@workspace/contracts/provider";

export const createProvider = (data: CreateProviderType) =>
  executeApi<ProviderProfileResponse>(() => apiClient.post("/providers", data));

export const getMyProviderProfile = () =>
  executeApi<ProviderProfileResponse>(() => apiClient.get("/providers/me"));

export const listProviders = (params?: ProviderQueryType) =>
  executeApi<ProviderQueryResponse>(() => apiClient.get("/providers", { params }));

export const getProvider = (identifier: string) =>
  executeApi<ProviderProfileResponse>(() =>
    apiClient.get(`/providers/${identifier}`),
  );

export const updateProvider = (id: string, data: ProviderProfileType) => {
  console.log("[debug] from provider sdk providerId:", id);

  return executeApi<ProviderProfileResponse>(() =>
    apiClient.put(`/providers/${id}`, data),
  );
};
