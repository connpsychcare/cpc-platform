import apiClient, { executeApi } from "../lib/api-client";
import type {
  TreatmentPlanType,
  TreatmentPlanQueryType,
  TreatmentPlanResponse,
  TreatmentPlanQueryResponse,
} from "@workspace/contracts/treatment-plan";

export const listTreatmentPlans = (query?: TreatmentPlanQueryType) =>
  executeApi<TreatmentPlanQueryResponse>(() =>
    apiClient.get("/treatment-plans", { params: query }),
  );

export const getTreatmentPlan = (id: string) =>
  executeApi<TreatmentPlanResponse>(() =>
    apiClient.get(`/treatment-plans/${id}`),
  );

export const createTreatmentPlan = (data: TreatmentPlanType) =>
  executeApi<TreatmentPlanResponse>(() =>
    apiClient.post("/treatment-plans", data),
  );

export const updateTreatmentPlan = (id: string, data: Partial<TreatmentPlanType>) =>
  executeApi<TreatmentPlanResponse>(() =>
    apiClient.patch(`/treatment-plans/${id}`, data),
  );

export const deleteTreatmentPlan = (id: string) =>
  executeApi(() => apiClient.delete(`/treatment-plans/${id}`));
