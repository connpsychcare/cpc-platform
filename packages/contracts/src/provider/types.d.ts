import type z from "zod";
import type { ProviderProfile } from "@workspace/db/browser";
import type {
  createProviderSchema,
  providerProfileSchema,
  providerQuerySchema,
} from "./schema";
import type {
  ClinicalCredential,
  ClinicalSpecialty,
  BaseQueryResponse,
  Sanitize,
  SpokenLanguage,
} from "../lib/types";
import type { UserResponse } from "../user/types";
import type { BranchResponse } from "../business/types";
import type { MediaResponse } from "../media/types";

export type ProviderProfileType = z.input<typeof providerProfileSchema>;
export type CreateProviderType = z.input<typeof createProviderSchema>;

export type ProviderQueryType = z.input<typeof providerQuerySchema>;

export type ProviderProfileResponse = Sanitize<ProviderProfile> & {
  credentials: ClinicalCredential[];
  specialties: ClinicalSpecialty[];
  languages: SpokenLanguage[];
  user: UserResponse;
  branch: BranchResponse;
  createdBy?: UserResponse;
  licenseDocument?: MediaResponse;
};

export interface ProviderQueryResponse extends BaseQueryResponse {
  providers: ProviderProfileResponse[];
}
