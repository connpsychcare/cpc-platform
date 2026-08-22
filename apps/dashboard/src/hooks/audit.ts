"use client";
import * as audit from "@workspace/sdk/audit";
import { createCrudHooks } from "@workspace/ui/hooks/use-crud";

export const {
  useEntity: useAuditLog,
  useEntities: useAuditLogs,
  useRestoreEntity: abc,
  useCreateEntity: aaa,
} = createCrudHooks(
  {
    findOne: audit.getAuditLog,
    findAll: audit.getAuditLogs,
  },
  {
    single: "auditLog",
    list: "auditLogs",
  },
);
