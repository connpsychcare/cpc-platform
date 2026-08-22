import { useQuery } from "@tanstack/react-query";
import type { ProviderProfileResponse } from "@workspace/contracts/provider";
import type { TestimonialResponse } from "@workspace/contracts/testimonial";
import { getPublicStats } from "@workspace/sdk/dashboard";
import { getBusinessProfile } from "@workspace/sdk/business";
import { listProviders } from "@workspace/sdk/provider";
import { listJobListings } from "@workspace/sdk/job-listing";
import { listTestimonials } from "@workspace/sdk/testimonial";
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
  const query = useQuery({
    queryKey: ["public", "stats"],
    queryFn: getPublicStats,
    select: (res) => res.data,
    ...queryDefaults,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  };
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
  const query = useQuery({
    queryKey: ["public", "testimonials"],
    queryFn: () => listTestimonials({ isPublished: true }),
    select: (res) => res.data.testimonials as TestimonialResponse[],
    ...queryDefaults,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  };
}

export function usePublicCareers() {
  const query = useQuery({
    queryKey: ["public", "careers"],
    queryFn: () => listJobListings({ isActive: true }),
    select: (res) => res.data.jobListings,
    ...queryDefaults,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  };
}

export function usePublicProviders() {
  const query = useQuery({
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
    ...queryDefaults,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  };
}
