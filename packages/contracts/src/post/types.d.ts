import type z from "zod";
import type { Post, PostView } from "@workspace/db/browser";
import type { Sanitize } from "../lib/types";
import type { BaseUserResponse } from "../user/types";
import type { MediaResponse } from "../media/types";
import type { CategoryResponse } from "../category/types";
import type {
  postSchema,
  postQuerySchema,
  trackPostViewSchema,
} from "./schema";

export type PostType = z.input<typeof postSchema>;
export type PostQueryType = z.input<typeof postQuerySchema>;
export type TrackPostViewType = z.input<typeof trackPostViewSchema>;

export type PostResponse = Sanitize<Post> & {
  author?: BaseUserResponse;
  category?: CategoryResponse;
  cover?: MediaResponse;
  headerImage?: MediaResponse;
};

export type PostViewResponse = Sanitize<PostView>;

export interface PostListResponse {
  posts: PostResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
