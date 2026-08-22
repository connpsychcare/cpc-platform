import apiClient, { executeApi } from "../lib/api-client";
import type {
  TestimonialType,
  TestimonialQueryType,
  SubmitTestimonialType,
  TestimonialResponse,
  TestimonialQueryResponse,
} from "@workspace/contracts/testimonial";

export const listTestimonials = (query?: TestimonialQueryType) =>
  executeApi<TestimonialQueryResponse>(() =>
    apiClient.get("/testimonials", { params: query }),
  );

export const getTestimonial = (id: string) =>
  executeApi<TestimonialResponse>(() => apiClient.get(`/testimonials/${id}`));

export const createTestimonial = (data: TestimonialType) =>
  executeApi<TestimonialResponse>(() =>
    apiClient.post("/testimonials", data),
  );

export const updateTestimonial = (id: string, data: Partial<TestimonialType>) =>
  executeApi<TestimonialResponse>(() =>
    apiClient.patch(`/testimonials/${id}`, data),
  );

export const deleteTestimonial = (id: string) =>
  executeApi(() => apiClient.delete(`/testimonials/${id}`));

export const submitTestimonial = (data: SubmitTestimonialType) =>
  executeApi<TestimonialResponse>(() =>
    apiClient.post("/testimonials/submit", data),
  );

export const listMyTestimonials = () =>
  executeApi<TestimonialQueryResponse>(() =>
    apiClient.get("/testimonials/mine"),
  );
