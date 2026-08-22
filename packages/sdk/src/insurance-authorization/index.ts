import apiClient, { executeApi } from "../lib/api-client";
import type {
  InsuranceAuthorizationType,
  UpdateInsuranceAuthorizationType,
  InsuranceAuthorizationQueryType,
  InsuranceAuthorizationResponse,
  InsuranceAuthorizationQueryResponse,
} from "@workspace/contracts/insurance-authorization";

export const listInsuranceAuthorizations = (
  query?: InsuranceAuthorizationQueryType,
) =>
  executeApi<InsuranceAuthorizationQueryResponse>(() =>
    apiClient.get("/insurance-authorizations", { params: query }),
  );

export const getInsuranceAuthorization = (id: string) =>
  executeApi<InsuranceAuthorizationResponse>(() =>
    apiClient.get(`/insurance-authorizations/${id}`),
  );

export const createInsuranceAuthorization = (
  data: InsuranceAuthorizationType,
) =>
  executeApi<InsuranceAuthorizationResponse>(() =>
    apiClient.post("/insurance-authorizations", data),
  );

export const updateInsuranceAuthorization = (
  id: string,
  data: UpdateInsuranceAuthorizationType,
) =>
  executeApi<InsuranceAuthorizationResponse>(() =>
    apiClient.patch(`/insurance-authorizations/${id}`, data),
  );

export const deleteInsuranceAuthorization = (id: string) =>
  executeApi(() => apiClient.delete(`/insurance-authorizations/${id}`));
