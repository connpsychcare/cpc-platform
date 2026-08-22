import { createZodDto } from "nestjs-zod";
import {
  createProviderSchema,
  providerProfileSchema,
  providerQuerySchema,
} from "./schema";

export class ProviderProfileDto extends createZodDto(providerProfileSchema) {}
export class CreateProviderDto extends createZodDto(createProviderSchema) {}
export class ProviderQueryDto extends createZodDto(providerQuerySchema) {}
