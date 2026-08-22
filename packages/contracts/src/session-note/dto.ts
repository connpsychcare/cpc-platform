import { createZodDto } from "nestjs-zod";
import { sessionNoteSchema, sessionNoteQuerySchema } from "./schema";

export class SessionNoteDto extends createZodDto(sessionNoteSchema) {}
export class SessionNoteQueryDto extends createZodDto(sessionNoteQuerySchema) {}
