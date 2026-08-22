"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  AppointmentQueryType,
  CreateAppointmentType,
  GuestAppointmentType,
  UpdateAppointmentStatusType,
} from "@workspace/contracts/appointment";
import type { SendMessageType } from "@workspace/contracts/chat";
import type { BranchQueryType } from "@workspace/contracts/business";
import type { ProviderQueryType } from "@workspace/contracts/provider";
import type { CreateDependentType, PatientProfileType } from "@workspace/contracts/patient";
import type {
  CreatePaymentIntentType,
  PaymentQueryType,
} from "@workspace/contracts/payment";
import type { ApiException } from "@workspace/sdk";
import type { SubmitTestimonialType } from "@workspace/contracts/testimonial";
import * as appointment from "@workspace/sdk/appointment";
import * as availability from "@workspace/sdk/availability";
import * as business from "@workspace/sdk/business";
import * as chat from "@workspace/sdk/chat";
import * as provider from "@workspace/sdk/provider";
import * as patient from "@workspace/sdk/patient";
import * as payment from "@workspace/sdk/payment";
import * as testimonial from "@workspace/sdk/testimonial";
import * as progressReport from "@workspace/sdk/progress-report";
import type { ProgressReportQueryType } from "@workspace/contracts/progress-report";
import { parseDuration } from "@workspace/shared/utils";

const STALE_TIME = parseDuration("10m");

const queryDefaults = {
  staleTime: STALE_TIME,
  gcTime: STALE_TIME,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  retry: false,
};

export function useProviders(params: ProviderQueryType) {
  const query = useQuery({
    queryKey: ["providers", params],
    queryFn: () => provider.listProviders(params),
    select: (res) => res.data,
    placeholderData: (prev) => prev,
    ...queryDefaults,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

export function useBranches(params?: BranchQueryType) {
  const query = useQuery({
    queryKey: ["branches", params],
    queryFn: () => business.listBranches(params),
    select: (res) => res.data,
    placeholderData: (prev) => prev,
    ...queryDefaults,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

export function useProvider(id?: string) {
  const query = useQuery({
    queryKey: ["provider", id],
    queryFn: () => provider.getProvider(id!),
    select: (res) => res.data,
    enabled: Boolean(id),
    ...queryDefaults,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

export function useProviderSlots(
  providerProfileId?: string,
  from?: string,
  to?: string,
) {
  const query = useQuery({
    queryKey: ["providerSlots", providerProfileId, from, to],
    queryFn: () =>
      availability.getProviderAvailableSlots(providerProfileId!, {
        from: from!,
        to: to!,
      }),
    select: (res) => res.data,
    placeholderData: (prev) => prev,
    enabled: Boolean(providerProfileId && from && to),
    ...queryDefaults,
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

export function useMyPatientProfile() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["patient", "me"],
    queryFn: patient.getMyPatientProfile,
    select: (res) => res.data,
    staleTime: STALE_TIME,
    gcTime: STALE_TIME,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: (data: PatientProfileType) =>
      patient.updateMyPatientProfile(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["patient", "me"] });
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,

    saveProfile: mutation.mutateAsync,
    isPending: mutation.isPending,
    mutateError: mutation.error as ApiException | null,
  };
}

export function useCreateDependent() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: CreateDependentType) => patient.createDependent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caregiver-access", "my-profile"] });
    },
  });
  return {
    createAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    mutateError: mutation.error as ApiException | null,
  };
}

export function useAppointments(params: AppointmentQueryType) {
  const query = useQuery({
    queryKey: ["appointments", params],
    queryFn: () => appointment.listAppointments(params),
    select: (res) => res.data,
    placeholderData: (prev) => prev,
    ...queryDefaults,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

export function useAppointment(id?: string) {
  const query = useQuery({
    queryKey: ["appointment", id],
    queryFn: () => appointment.getAppointment(id!),
    select: (res) => res.data,
    enabled: Boolean(id),
    ...queryDefaults,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateAppointmentType) =>
      appointment.createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  return {
    createAppointment: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

/** Public booking for visitors without an account - provisions the patient server-side. */
export function useCreateGuestAppointment() {
  const mutation = useMutation({
    mutationFn: (data: GuestAppointmentType) =>
      appointment.createGuestAppointment(data),
  });

  return {
    createGuestAppointment: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

export function useUpdateAppointmentStatus(id?: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: UpdateAppointmentStatusType) =>
      appointment.updateAppointmentStatus(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointment", id] });
    },
  });

  return {
    updateStatus: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

export function usePayments(params: PaymentQueryType) {
  const query = useQuery({
    queryKey: ["payments", params],
    queryFn: () => payment.listPayments(params),
    select: (res) => res.data,
    placeholderData: (prev) => prev,
    ...queryDefaults,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreatePaymentIntentType) => payment.createPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  return {
    createPayment: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

export function usePayment(id?: string) {
  const query = useQuery({
    queryKey: ["payment", id],
    queryFn: () => payment.getPayment(id!),
    select: (res) => res.data,
    enabled: Boolean(id),
    ...queryDefaults,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

export function useConversations() {
  const query = useQuery({
    queryKey: ["conversations"],
    queryFn: () => chat.listConversations(),
    select: (res) => res.data,
    staleTime: parseDuration("1m"),
    gcTime: parseDuration("5m"),
    refetchOnWindowFocus: true,
    retry: false,
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

export function useConversationByAppointment(appointmentId?: string) {
  const query = useQuery({
    queryKey: ["conversation", appointmentId],
    queryFn: () => chat.getConversationByAppointment(appointmentId!),
    select: (res) => res.data,
    enabled: Boolean(appointmentId),
    ...queryDefaults,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

export function useMessages(conversationId?: string) {
  const query = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => chat.listMessages(conversationId!),
    select: (res) => res.data,
    enabled: Boolean(conversationId),
    staleTime: 0,
    refetchInterval: 8_000,
    refetchOnWindowFocus: true,
    retry: false,
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

export function useSendMessage(conversationId?: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: Omit<SendMessageType, "conversationId">) => {
      if (!conversationId) {
        throw new Error(
          "This appointment conversation is not ready yet. Please try again in a moment.",
        );
      }

      return chat.sendMessage({
        conversationId,
        body: data.body,
        attachmentIds: data.attachmentIds,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  return {
    sendMessage: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

export function useMarkMessageRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => chat.markMessageRead(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

// ── Shop ──────────────────────────────────────────────────




// ── Orders ────────────────────────────────────────────────



// ── Testimonials ────────────────────────────────────────────

export function useMyTestimonials() {
  const query = useQuery({
    queryKey: ["my-testimonials"],
    queryFn: () => testimonial.listMyTestimonials(),
    select: (res) => res.data,
    placeholderData: (prev) => prev,
    ...queryDefaults,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

export function useProgressReports(params?: ProgressReportQueryType) {
  const query = useQuery({
    queryKey: ["progress-reports", params],
    queryFn: () => progressReport.listProgressReports(params),
    select: (res) => res.data,
    placeholderData: (prev) => prev,
    ...queryDefaults,
  });
  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

export function useProgressReport(id?: string) {
  const query = useQuery({
    queryKey: ["progress-report", id],
    queryFn: () => progressReport.getProgressReport(id!),
    select: (res) => res.data,
    enabled: Boolean(id),
    ...queryDefaults,
  });
  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

export function useDownloadProgressReportPdf() {
  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const blob = await progressReport.downloadProgressReportPdf(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `progress-report-${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    },
  });
  return {
    downloadAsync: mutation.mutateAsync,
    isDownloading: mutation.isPending,
    downloadError: mutation.error as ApiException | null,
  };
}

export function useSubmitTestimonial() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: SubmitTestimonialType) =>
      testimonial.submitTestimonial(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["my-testimonials"] });
    },
  });
  return {
    submitAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}
