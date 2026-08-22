"use client";

import * as sessionNoteSdk from "@workspace/sdk/session-note";
import { createCrudHooks } from "@workspace/ui/hooks/use-crud";

export const {
  useEntity: useSessionNote,
  useEntities: useSessionNotes,
  useCreateEntity: useCreateSessionNote,
  useUpdateEntity: useUpdateSessionNote,
  useDeleteEntity: useDeleteSessionNote,
} = createCrudHooks(
  {
    findOne: sessionNoteSdk.getSessionNote,
    findAll: sessionNoteSdk.listSessionNotes,
    create: sessionNoteSdk.createSessionNote,
    update: sessionNoteSdk.updateSessionNote,
    delete: sessionNoteSdk.deleteSessionNote,
  },
  {
    single: "session-note",
    list: "session-notes",
  },
);
