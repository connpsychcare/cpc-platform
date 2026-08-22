import { createZodDto } from "nestjs-zod";
import { categorySchema, categoryQuerySchema } from "./schema";

export class CategoryDto extends createZodDto(categorySchema) {}
export class CategoryQueryDto extends createZodDto(categoryQuerySchema) {}
