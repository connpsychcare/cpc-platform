import type z from "zod";
import type { StaffPermission } from "@workspace/db/browser";
import type {
  grantStaffPermissionsSchema,
  staffPermissionQuerySchema,
} from "./schema";
import type { Sanitize } from "../lib/types";
import type { PermissionModule } from "../lib/types";

export type GrantStaffPermissionsType = z.input<
  typeof grantStaffPermissionsSchema
>;
export type StaffPermissionQueryType = z.input<
  typeof staffPermissionQuerySchema
>;

export type StaffPermissionResponse = Sanitize<StaffPermission>;

export interface StaffPermissionsResponse {
  staffId: string;
  modules: PermissionModule[];
}
