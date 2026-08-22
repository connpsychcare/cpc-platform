import { createZodDto } from "nestjs-zod";
import {
  staffAssignmentSchema,
  staffAssignmentQuerySchema,
  unassignStaffSchema,
} from "./schema";

export class StaffAssignmentDto extends createZodDto(staffAssignmentSchema) {}
export class StaffAssignmentQueryDto extends createZodDto(
  staffAssignmentQuerySchema,
) {}
export class UnassignStaffDto extends createZodDto(unassignStaffSchema) {}
