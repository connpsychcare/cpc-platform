import type {
  ClinicalFormItemResponse,
  ClinicalFormQueryResponse,
  ClinicalFormQueryType,
} from "@workspace/contracts/clinical-form";

import apiClient, { executeApi } from "../lib/api-client";

export const listClinicalForms = (query?: ClinicalFormQueryType) =>
  executeApi<ClinicalFormQueryResponse>(() =>
    apiClient.get("/clinical-forms", { params: query }),
  );

export const getClinicalForm = (id: string) =>
  executeApi<ClinicalFormItemResponse>(() =>
    apiClient.get(`/clinical-forms/${id}`),
  );
