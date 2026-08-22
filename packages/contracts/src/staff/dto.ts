import { createZodDto } from "nestjs-zod";
import {
  createStaffSchema,
  staffProfileSchema,
  staffQuerySchema,
} from "./schema";

export class StaffProfileDto extends createZodDto(staffProfileSchema) {}
export class CreateStaffDto extends createZodDto(createStaffSchema) {}
export class StaffQueryDto extends createZodDto(staffQuerySchema) {}
