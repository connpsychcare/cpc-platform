import { createZodDto } from "nestjs-zod";
import { postSchema, postQuerySchema, trackPostViewSchema } from "./schema";

export class PostDto extends createZodDto(postSchema) {}
export class PostQueryDto extends createZodDto(postQuerySchema) {}
export class TrackPostViewDto extends createZodDto(trackPostViewSchema) {}
