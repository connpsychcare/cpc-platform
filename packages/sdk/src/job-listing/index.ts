import apiClient, { executeApi } from "../lib/api-client";
import type { JobListingType, JobListingQueryType, JobListingResponse, JobListingQueryResponse } from "@workspace/contracts/job-listing";

export const listJobListings = (query?: JobListingQueryType) =>
  executeApi<JobListingQueryResponse>(() =>
    apiClient.get("/job-listings", { params: query }),
  );

export const getJobListing = (id: string) =>
  executeApi<JobListingResponse>(() => apiClient.get(`/job-listings/${id}`));

export const createJobListing = (data: JobListingType) =>
  executeApi<JobListingResponse>(() =>
    apiClient.post("/job-listings", data),
  );

export const updateJobListing = (id: string, data: Partial<JobListingType>) =>
  executeApi<JobListingResponse>(() =>
    apiClient.patch(`/job-listings/${id}`, data),
  );

export const deleteJobListing = (id: string) =>
  executeApi(() => apiClient.delete(`/job-listings/${id}`));
