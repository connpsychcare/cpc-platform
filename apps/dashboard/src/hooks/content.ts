"use client";
import * as testimonialSdk from "@workspace/sdk/testimonial";
import * as jobListingSdk from "@workspace/sdk/job-listing";
import { createCrudHooks } from "@workspace/ui/hooks/use-crud";

export const {
  useEntity: useTestimonial,
  useEntities: useTestimonials,
  useCreateEntity: useCreateTestimonial,
  useUpdateEntity: useUpdateTestimonial,
  useDeleteEntity: useDeleteTestimonial,
} = createCrudHooks(
  {
    findOne: testimonialSdk.getTestimonial,
    findAll: testimonialSdk.listTestimonials,
    create: testimonialSdk.createTestimonial,
    update: testimonialSdk.updateTestimonial,
    delete: testimonialSdk.deleteTestimonial,
  },
  {
    single: "testimonial",
    list: "testimonials",
  },
);

export const {
  useEntity: useJobListing,
  useEntities: useJobListings,
  useCreateEntity: useCreateJobListing,
  useUpdateEntity: useUpdateJobListing,
  useDeleteEntity: useDeleteJobListing,
} = createCrudHooks(
  {
    findOne: jobListingSdk.getJobListing,
    findAll: jobListingSdk.listJobListings,
    create: jobListingSdk.createJobListing,
    update: jobListingSdk.updateJobListing,
    delete: jobListingSdk.deleteJobListing,
  },
  {
    single: "job-listing",
    list: "job-listings",
  },
);
