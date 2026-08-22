import type z from "zod";
import type { PatientProfile, StaffAssignment } from "@workspace/db/browser";
import type {
  staffAssignmentSchema,
  staffAssignmentQuerySchema,
  unassignStaffSchema,
} from "./schema";
import type { BaseQueryResponse, Sanitize } from "../lib/types";
import type { BaseUserResponse } from "../user/types";

export type StaffAssignmentType = z.input<typeof staffAssignmentSchema>;
export type StaffAssignmentQueryType = z.input<
  typeof staffAssignmentQuerySchema
>;
export type UnassignStaffType = z.input<typeof unassignStaffSchema>;

export type StaffAssignmentPatientResponse = Sanitize<
  Pick<PatientProfile, "id">
> & {
  user: BaseUserResponse;
};

export type StaffAssignmentResponse = Sanitize<StaffAssignment> & {
  patient: StaffAssignmentPatientResponse;
  staff: BaseUserResponse;
  assignedBy: BaseUserResponse;
};

export interface StaffAssignmentQueryResponse extends BaseQueryResponse {
  assignments: StaffAssignmentResponse[];
}
