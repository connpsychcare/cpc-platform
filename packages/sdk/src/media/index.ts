import apiClient, {
  API_URL,
  executeApi,
  getApiClientRequestHeaders,
} from "../lib/api-client";
import type {
  MediaQueryResponse,
  MediaQueryType,
  MediaResponse,
  MediaUpdateType,
} from "@workspace/contracts/media";
import { ApiException, type ApiResponse } from "../lib/types";

export const createMedia = (data: FormData, config?: RequestInit) =>
  (async () => {
    const headers = await getApiClientRequestHeaders();
    const response = await fetch(`${API_URL}/media`, {
      method: "POST",
      headers,
      body: data,
      signal: config?.signal,
      credentials: "include",
    });

    const payload = (await response.json()) as ApiResponse<MediaResponse>;

    if (!payload.success) {
      throw new ApiException(payload);
    }

    return payload;
  })();

export const findAllMedia = (params?: MediaQueryType) =>
  executeApi<MediaQueryResponse>(() => apiClient.get("/media", { params }));

export const findMedia = (id: string) =>
  executeApi<MediaResponse>(() => apiClient.get(`/media/${id}`));

export const updateMedia = (id: string, data: MediaUpdateType) =>
  executeApi<MediaResponse>(() => apiClient.put(`/media/${id}`, data));

export const deleteMedia = (id: string) =>
  executeApi<MediaResponse>(() => apiClient.delete(`/media/${id}`));

export const restoreMedia = (id: string) =>
  executeApi<MediaResponse>(() => apiClient.post(`/media/${id}/restore`));
