import { createZodDto } from "nestjs-zod";
import {
  insuranceAuthorizationSchema,
  updateInsuranceAuthorizationSchema,
  insuranceAuthorizationQuerySchema,
} from "./schema";

export class InsuranceAuthorizationDto extends createZodDto(
  insuranceAuthorizationSchema,
) {}

export class UpdateInsuranceAuthorizationDto extends createZodDto(
  updateInsuranceAuthorizationSchema,
) {}

export class InsuranceAuthorizationQueryDto extends createZodDto(
  insuranceAuthorizationQuerySchema,
) {}
