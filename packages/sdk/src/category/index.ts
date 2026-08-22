import apiClient, { executeApi } from "../lib/api-client";
import type {
  CategoryListResponse,
  CategoryQueryType,
  CategoryResponse,
  CategoryType,
} from "@workspace/contracts/category";

export const listCategories = (params?: CategoryQueryType) =>
  executeApi<CategoryListResponse>(() =>
    apiClient.get("/categories", { params }),
  );

export const getCategory = (id: string) =>
  executeApi<CategoryResponse>(() => apiClient.get(`/categories/${id}`));

export const createCategory = (data: CategoryType) =>
  executeApi<CategoryResponse>(() => apiClient.post("/categories", data));

export const updateCategory = (id: string, data: CategoryType) =>
  executeApi<CategoryResponse>(() =>
    apiClient.patch(`/categories/${id}`, data),
  );

export const deleteCategory = (id: string, force = false) =>
  executeApi<null>(() =>
    apiClient.delete(`/categories/${id}`, { params: { force } }),
  );

export const restoreCategory = (id: string) =>
  executeApi<CategoryResponse>(() =>
    apiClient.patch(`/categories/${id}/restore`),
  );

export const listPublicCategories = () =>
  executeApi<CategoryResponse[]>(() => apiClient.get("/categories/public"));
