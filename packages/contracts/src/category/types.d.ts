import type z from "zod";
import type { Category } from "@workspace/db/browser";
import type { Sanitize } from "../lib/types";
import type { MediaResponse } from "../media/types";
import type { categorySchema, categoryQuerySchema } from "./schema";

export type CategoryType = z.input<typeof categorySchema>;
export type CategoryQueryType = z.input<typeof categoryQuerySchema>;

export type CategoryResponse = Sanitize<Category> & {
  cover?: MediaResponse;
  parent?: CategoryResponse;
  children?: CategoryResponse[];
  postCount?: number;
};

export interface CategoryListResponse {
  categories: CategoryResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
