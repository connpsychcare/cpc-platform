import apiClient, { executeApi } from "../lib/api-client";
import type {
  SessionNoteType,
  SessionNoteQueryType,
  SessionNoteResponse,
  SessionNoteQueryResponse,
} from "@workspace/contracts/session-note";

export const listSessionNotes = (query?: SessionNoteQueryType) =>
  executeApi<SessionNoteQueryResponse>(() =>
    apiClient.get("/session-notes", { params: query }),
  );

export const getSessionNote = (id: string) =>
  executeApi<SessionNoteResponse>(() =>
    apiClient.get(`/session-notes/${id}`),
  );

export const createSessionNote = (data: SessionNoteType) =>
  executeApi<SessionNoteResponse>(() =>
    apiClient.post("/session-notes", data),
  );

export const updateSessionNote = (id: string, data: Partial<SessionNoteType>) =>
  executeApi<SessionNoteResponse>(() =>
    apiClient.patch(`/session-notes/${id}`, data),
  );

export const deleteSessionNote = (id: string) =>
  executeApi(() => apiClient.delete(`/session-notes/${id}`));
