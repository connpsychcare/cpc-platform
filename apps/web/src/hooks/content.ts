"use client";

import { useQuery } from "@tanstack/react-query";
import { getPublicStats } from "@workspace/sdk/dashboard";
import { getBusinessProfile } from "@workspace/sdk/business";
import type { PublicStats } from "@workspace/sdk/dashboard";
import { getProvider, listProviders } from "@workspace/sdk/provider";
import { listTestimonials } from "@workspace/sdk/testimonial";
import { listJobListings } from "@workspace/sdk/job-listing";
import type { ProviderProfileResponse } from "@workspace/contracts/provider";
import type { TestimonialResponse } from "@workspace/contracts/testimonial";
import type { JobListingResponse } from "@workspace/contracts/job-listing";
import type { ApiSuccess } from "@workspace/sdk";
import { parseDuration } from "@workspace/shared/utils";

const STALE_TIME = parseDuration("1h");

const queryDefaults = {
  staleTime: STALE_TIME,
  gcTime: STALE_TIME,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  retry: false,
} as const;

export function usePublicStats() {
  return useQuery<ApiSuccess<PublicStats>, Error, PublicStats>({
    queryKey: ["public", "stats"],
    queryFn: getPublicStats,
    select: (res) => res.data,
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: false,
  });
}

export function usePublicBusinessProfile() {
  const query = useQuery({
    queryKey: ["public", "business-profile"],
    queryFn: getBusinessProfile,
    select: (res) => res.data,
    ...queryDefaults,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  };
}

export function usePublicTestimonials() {
  return useQuery({
    queryKey: ["public", "testimonials"],
    queryFn: () => listTestimonials({ isPublished: true }),
    select: (res) => res.data.testimonials as TestimonialResponse[],
    staleTime: 1000 * 60 * 60,
    retry: false,
  });
}

export function usePublicCareers() {
  return useQuery({
    queryKey: ["public", "careers"],
    queryFn: () => listJobListings({ isActive: true }),
    select: (res) => res.data.jobListings as JobListingResponse[],
    staleTime: 1000 * 60 * 60,
    retry: false,
  });
}

export function usePublicProviders() {
  return useQuery({
    queryKey: ["public", "providers"],
    queryFn: () =>
      listProviders({
        isAvailable: true,
        sortBy: "displayName",
        sortOrder: "desc",
        limit: 24,
        page: 1,
      }),
    select: (res) => res.data.providers as ProviderProfileResponse[],
    staleTime: 1000 * 60 * 60,
    retry: false,
  });
}

/** Single provider by slug (the endpoint resolves either a slug or an id). */
export function usePublicProvider(slug?: string) {
  return useQuery({
    queryKey: ["public", "provider", slug],
    queryFn: () => getProvider(slug!),
    select: (res) => res.data,
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 60,
    retry: false,
  });
}
