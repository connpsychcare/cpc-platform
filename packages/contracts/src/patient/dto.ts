import { createZodDto } from "nestjs-zod";
import {
  createDependentSchema,
  createPatientSchema,
  patientProfileSchema,
  patientQuerySchema,
} from "./schema";

export class PatientProfileDto extends createZodDto(patientProfileSchema) {}
export class CreatePatientDto extends createZodDto(createPatientSchema) {}
export class PatientQueryDto extends createZodDto(patientQuerySchema) {}
export class CreateDependentDto extends createZodDto(createDependentSchema) {}
