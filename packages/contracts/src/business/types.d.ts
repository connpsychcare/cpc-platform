import type z from "zod";
import type {
  CUBranchSchema,
  branchQuerySchema,
  businessProfileSchema,
} from "./schema";
import type {
  Branch,
  BranchTiming,
  BusinessProfile,
} from "@workspace/db/browser";
import type { BaseQueryResponse, Sanitize } from "../lib/types";
import type { MediaResponse } from "../media/types";
import type { ProviderProfileResponse } from "../provider";

export type BranchQueryType = z.input<typeof branchQuerySchema>;
export type CUBranchType = z.input<typeof CUBranchSchema>;
export type BusinessProfileType = z.input<typeof businessProfileSchema>;

export type BranchTimingResponse = Sanitize<BranchTiming>;
export type BranchResponse = Sanitize<Branch> & {
  branchTimings: BranchTimingResponse[];
  providers: ProviderProfileResponse[];
};

export type BusinessProfileResponse = Sanitize<BusinessProfile> & {
  logoLight: MediaResponse;
  logoDark: MediaResponse;
  favicon: MediaResponse;
  cover?: MediaResponse;
  branches: BranchResponse[];
};

export interface BranchQueryResponse extends BaseQueryResponse {
  branches: BranchResponse[];
}
