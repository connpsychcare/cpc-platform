import type z from "zod";
import type { JobListing } from "@workspace/db/browser";
import type {
  jobListingSchema,
  jobListingQuerySchema,
  JobTypeEnum,
  JobLocationTypeEnum,
} from "./schema";
import type { BaseQueryResponse, Sanitize } from "../lib/types";

export type JobListingType = z.input<typeof jobListingSchema>;
export type JobListingQueryType = z.input<typeof jobListingQuerySchema>;
export type JobType = z.infer<typeof JobTypeEnum>;
export type JobLocationType = z.infer<typeof JobLocationTypeEnum>;

export type JobListingResponse = Sanitize<JobListing>;

export interface JobListingQueryResponse extends BaseQueryResponse {
  jobListings: JobListingResponse[];
}
