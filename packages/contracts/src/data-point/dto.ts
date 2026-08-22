import { createZodDto } from "nestjs-zod";
import { dataPointSchema, dataPointQuerySchema } from "./schema";

export class DataPointDto extends createZodDto(dataPointSchema) {}
export class DataPointQueryDto extends createZodDto(dataPointQuerySchema) {}
