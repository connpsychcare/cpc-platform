import apiClient, { executeApi } from "../lib/api-client";
import type {
  BehaviorProgramType,
  BehaviorProgramQueryType,
  BehaviorProgramResponse,
  BehaviorProgramQueryResponse,
  BehaviorProgramProgressResponse,
} from "@workspace/contracts/behavior-program";

export const listBehaviorPrograms = (query?: BehaviorProgramQueryType) =>
  executeApi<BehaviorProgramQueryResponse>(() =>
    apiClient.get("/behavior-programs", { params: query }),
  );

export const getBehaviorProgram = (id: string) =>
  executeApi<BehaviorProgramResponse>(() =>
    apiClient.get(`/behavior-programs/${id}`),
  );

export const createBehaviorProgram = (data: BehaviorProgramType) =>
  executeApi<BehaviorProgramResponse>(() =>
    apiClient.post("/behavior-programs", data),
  );

export const updateBehaviorProgram = (id: string, data: Partial<BehaviorProgramType>) =>
  executeApi<BehaviorProgramResponse>(() =>
    apiClient.patch(`/behavior-programs/${id}`, data),
  );

export const deleteBehaviorProgram = (id: string) =>
  executeApi(() => apiClient.delete(`/behavior-programs/${id}`));

export const getBehaviorProgramProgress = (id: string) =>
  executeApi<BehaviorProgramProgressResponse>(() =>
    apiClient.get(`/behavior-programs/${id}/progress`),
  );
