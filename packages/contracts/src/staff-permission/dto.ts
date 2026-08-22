import { createZodDto } from "nestjs-zod";
import {
  grantStaffPermissionsSchema,
  staffPermissionQuerySchema,
} from "./schema";

export class GrantStaffPermissionsDto extends createZodDto(
  grantStaffPermissionsSchema,
) {}
export class StaffPermissionQueryDto extends createZodDto(
  staffPermissionQuerySchema,
) {}
