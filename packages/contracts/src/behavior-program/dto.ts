import { createZodDto } from "nestjs-zod";
import { behaviorProgramSchema, behaviorProgramQuerySchema } from "./schema";

export class BehaviorProgramDto extends createZodDto(behaviorProgramSchema) {}
export class BehaviorProgramQueryDto extends createZodDto(
  behaviorProgramQuerySchema,
) {}
