import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getChatSocket } from "../lib/socket";
import type {
  AppointmentQueryType,
  CreateAppointmentType,
  UpdateAppointmentStatusType,
} from "@workspace/contracts/appointment";
import type { SendMessageType } from "@workspace/contracts/chat";
import type { BehaviorProgramQueryType } from "@workspace/contracts/behavior-program";
import type { ProviderQueryType } from "@workspace/contracts/provider";
import type {
  CreateDependentType,
  PatientProfileType,
  PatientQueryType,
} from "@workspace/contracts/patient";
import type { PaymentQueryType } from "@workspace/contracts/payment";
import type { SessionNoteQueryType } from "@workspace/contracts/session-note";
import type { TreatmentPlanQueryType } from "@workspace/contracts/treatment-plan";
import type { ApiException } from "@workspace/sdk";
import type { SubmitTestimonialType } from "@workspace/contracts/testimonial";
import type {
  StaffQueryType,
  StaffProfileType,
  CreateStaffType,
} from "@workspace/contracts/staff";
import type {
  ProviderProfileType,
  CreateProviderType,
} from "@workspace/contracts/provider";
import type { InsuranceAuthorizationQueryType } from "@workspace/contracts/insurance-authorization";
import type { CaregiverAccessQueryType } from "@workspace/contracts/caregiver-access";
import type { UserQueryType } from "@workspace/contracts/admin";
import type { ContactMessageQueryType } from "@workspace/contracts/contact";
import type { NewsletterSubscriberQueryType } from "@workspace/contracts/newsletter";
import type {
  TestimonialQueryType,
  TestimonialType,
} from "@workspace/contracts/testimonial";
import type {
  JobListingQueryType,
  JobListingType,
} from "@workspace/contracts/job-listing";
import type { AuditLogQueryType } from "@workspace/contracts/audit";
import type {
  BranchQueryType,
  CUBranchType,
  BusinessProfileType,
} from "@workspace/contracts/business";
import type {
  CampaignQueryType,
  NotificationCampaignType,
  UpdateCampaignStatusType,
} from "@workspace/contracts/campaign";
import type { TrafficSourceQueryType } from "@workspace/contracts/traffic";
import * as jobListing from "@workspace/sdk/job-listing";
import * as audit from "@workspace/sdk/audit";
import * as business from "@workspace/sdk/business";
import * as campaign from "@workspace/sdk/campaign";
import * as traffic from "@workspace/sdk/traffic";
import type { StaffAssignmentQueryType } from "@workspace/contracts/staff-assignment";
import * as staffAssignment from "@workspace/sdk/staff-assignment";
import * as appointment from "@workspace/sdk/appointment";
import * as availability from "@workspace/sdk/availability";
import * as behaviorProgram from "@workspace/sdk/behavior-program";
import * as caregiverAccess from "@workspace/sdk/caregiver-access";
import * as chat from "@workspace/sdk/chat";
import * as dashboard from "@workspace/sdk/dashboard";
import * as provider from "@workspace/sdk/provider";
import * as patient from "@workspace/sdk/patient";
import * as payment from "@workspace/sdk/payment";
import * as staff from "@workspace/sdk/staff";
import * as sessionNote from "@workspace/sdk/session-note";
import * as treatmentPlan from "@workspace/sdk/treatment-plan";
import * as testimonial from "@workspace/sdk/testimonial";
import * as insuranceAuthorization from "@workspace/sdk/insurance-authorization";
import * as admin from "@workspace/sdk/admin";
import * as contact from "@workspace/sdk/contact";
import * as newsletter from "@workspace/sdk/newsletter";
import * as progressReport from "@workspace/sdk/progress-report";
import type { ProgressReportQueryType } from "@workspace/contracts/progress-report";
import * as staffPermission from "@workspace/sdk/staff-permission";
import type { GrantStaffPermissionsType } from "@workspace/contracts/staff-permission";
import { parseDuration } from "@workspace/shared/utils";

const STALE_TIME = parseDuration("10m");

const queryDefaults = {
  staleTime: STALE_TIME,
  gcTime: STALE_TIME,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  retry: false,
} as const;

export function usePatientDashboard() {
  const query = useQuery({
    queryKey: ["dashboard", "patient"],
    queryFn: dashboard.getPatientDashboard,
    select: (res) => res.data,
    ...queryDefaults,
  });

  return {
    data: query.data,
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
    ...queryDefaults,
  });

  const mutation = useMutation({
    mutationFn: (data: PatientProfileType) =>
      patient.updateMyPatientProfile(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["patient", "me"] });
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      await queryClient.invalidateQueries({
        queryKey: ["dashboard", "patient"],
      });
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
      queryClient.invalidateQueries({
        queryKey: ["caregiver-access", "my-profile"],
      });
    },
  });
  return {
    createAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    mutateError: mutation.error as ApiException | null,
  };
}

export function useAppointments(params?: AppointmentQueryType) {
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

export function useTreatmentPlans(params?: TreatmentPlanQueryType) {
  const query = useQuery({
    queryKey: ["treatment-plans", params],
    queryFn: () => treatmentPlan.listTreatmentPlans(params),
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

export function useTreatmentPlan(id?: string) {
  const query = useQuery({
    queryKey: ["treatment-plan", id],
    queryFn: () => treatmentPlan.getTreatmentPlan(id!),
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

export function useBehaviorPrograms(params?: BehaviorProgramQueryType) {
  const query = useQuery({
    queryKey: ["behavior-programs", params],
    queryFn: () => behaviorProgram.listBehaviorPrograms(params),
    select: (res) => res.data,
    placeholderData: (prev) => prev,
    enabled: Boolean(params?.treatmentPlanId),
    ...queryDefaults,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

export function useBehaviorProgramProgress(id?: string) {
  const query = useQuery({
    queryKey: ["behavior-program-progress", id],
    queryFn: () => behaviorProgram.getBehaviorProgramProgress(id!),
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

export function useSessionNotes(params?: SessionNoteQueryType) {
  const query = useQuery({
    queryKey: ["session-notes", params],
    queryFn: () => sessionNote.listSessionNotes(params),
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

export function useSessionNote(id?: string) {
  const query = useQuery({
    queryKey: ["session-note", id],
    queryFn: () => sessionNote.getSessionNote(id!),
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

export function useMyCaregiverPatients() {
  const query = useQuery({
    queryKey: ["caregiver-access", "mine"],
    queryFn: caregiverAccess.getMyCaregiverAccesses,
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

export function useMyProfileCaregivers() {
  const query = useQuery({
    queryKey: ["caregiver-access", "my-profile"],
    queryFn: caregiverAccess.getMyProfileCaregivers,
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

export function useMyPatientInvitations() {
  const query = useQuery({
    queryKey: ["caregiver-invitations", "my-patient"],
    queryFn: caregiverAccess.getMyInvitations,
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

export function useSendCaregiverInvitation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (
      data: Parameters<typeof caregiverAccess.sendCaregiverInvitation>[0],
    ) => caregiverAccess.sendCaregiverInvitation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caregiver-invitations"] });
      queryClient.invalidateQueries({
        queryKey: ["caregiver-access", "my-profile"],
      });
    },
  });
  return {
    sendAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

export function useCaregiverInvitationByToken(token?: string) {
  const query = useQuery({
    queryKey: ["caregiver-invitation-token", token],
    queryFn: () => caregiverAccess.getCaregiverInvitationByToken(token!),
    select: (res) => res.data,
    enabled: Boolean(token),
    ...queryDefaults,
  });
  return {
    data: query.data,
    isLoading: query.isLoading,
    fetchError: query.error as ApiException | null,
  };
}

export function useAcceptCaregiverInvitation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (token: string) =>
      caregiverAccess.acceptCaregiverInvitation(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caregiver-access"] });
      queryClient.invalidateQueries({ queryKey: ["caregiver-invitations"] });
    },
  });
  return {
    acceptAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

export function useRejectCaregiverInvitation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (token: string) =>
      caregiverAccess.rejectCaregiverInvitation(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caregiver-invitations"] });
    },
  });
  return {
    rejectAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

export function useRevokeCaregiverInvitation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => caregiverAccess.revokeCaregiverInvitation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caregiver-invitations"] });
      queryClient.invalidateQueries({
        queryKey: ["caregiver-access", "my-profile"],
      });
    },
  });
  return {
    revokeAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

export function useRevokeCaregiverAccess() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => caregiverAccess.revokeCaregiverAccess(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caregiver-access"] });
    },
  });
  return {
    revokeAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

export function usePayments(params?: PaymentQueryType) {
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

export function useStaffAssignments(params?: StaffAssignmentQueryType) {
  const query = useQuery({
    queryKey: ["staff-assignments", params],
    queryFn: () => staffAssignment.listStaffAssignments(params),
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

export function useConversations() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["conversations"],
    queryFn: () => chat.listConversations(),
    select: (res) => res.data,
    staleTime: 30_000,
    gcTime: 30_000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: false,
  });

  // Re-fetch the list in real time.
  // "message" fires when inside a conversation room; "conversation-updated"
  // fires via the user-specific room on every screen so the list stays fresh.
  useEffect(() => {
    let active = true;
    let registeredSock: Awaited<ReturnType<typeof getChatSocket>> | null = null;

    const refresh = () => {
      void queryClient.invalidateQueries({ queryKey: ["conversations"] });
    };

    getChatSocket().then((sock) => {
      if (!active) return;
      registeredSock = sock;
      sock.on("message", refresh);
      sock.on("conversation-updated", refresh);
      if (!sock.connected) sock.connect();
    });

    return () => {
      active = false;
      registeredSock?.off("message", refresh);
      registeredSock?.off("conversation-updated", refresh);
    };
  }, [queryClient]);

  return {
    data: query.data,
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
  const queryClient = useQueryClient();
  const socketRef = useRef<Awaited<ReturnType<typeof getChatSocket>> | null>(
    null,
  );
  const [deliveredIds, setDeliveredIds] = useState<Set<string>>(new Set());

  const query = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const res = await chat.listMessages(conversationId!);
      return res.data;
    },
    enabled: Boolean(conversationId),
    ...queryDefaults,
  });

  useEffect(() => {
    if (!conversationId) return;

    let active = true;

    const onMessage = (msg: any) => {
      queryClient.setQueryData<any[]>(
        ["messages", conversationId],
        (prev = []) =>
          prev.some((m: any) => m.id === msg.id) ? prev : [...prev, msg],
      );
      void queryClient.invalidateQueries({ queryKey: ["conversations"] });
    };
    const onMessageRead = (data: { messageId: string; readAt: string }) => {
      queryClient.setQueryData<any[]>(
        ["messages", conversationId],
        (prev = []) =>
          prev.map((m: any) =>
            m.id === data.messageId ? { ...m, readAt: data.readAt } : m,
          ),
      );
    };
    const onDelivered = (data: { messageId: string }) => {
      setDeliveredIds((prev) => new Set([...prev, data.messageId]));
    };
    const onConversationUpdated = (data: { conversationId?: string }) => {
      if (data.conversationId !== conversationId) return;
      void queryClient.invalidateQueries({
        queryKey: ["messages", conversationId],
      });
      void queryClient.invalidateQueries({ queryKey: ["conversations"] });
    };

    const joinRoom = () => {
      if (socketRef.current) socketRef.current.emit("join", conversationId);
    };

    getChatSocket().then((sock) => {
      if (!active) return;
      socketRef.current = sock;

      sock.on("message", onMessage);
      sock.on("message-read", onMessageRead);
      sock.on("message-delivered", onDelivered);
      sock.on("conversation-updated", onConversationUpdated);
      sock.on("connect", joinRoom);

      if (sock.connected) {
        joinRoom();
      } else {
        sock.connect();
      }
    });

    return () => {
      active = false;
      const sock = socketRef.current;
      if (sock) {
        sock.emit("leave", conversationId);
        sock.off("connect", joinRoom);
        sock.off("message", onMessage);
        sock.off("message-read", onMessageRead);
        sock.off("message-delivered", onDelivered);
        sock.off("conversation-updated", onConversationUpdated);
      }
    };
  }, [conversationId, queryClient]);

  return {
    data: query.data ?? [],
    deliveredIds,
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
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["messages", conversationId],
      });
      await queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  return {
    sendMessage: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

export function useMarkChatMessageRead() {
  return useMutation({
    mutationFn: (messageId: string) => chat.markMessageRead(messageId),
  });
}

export function useProviders(params?: ProviderQueryType) {
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

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateAppointmentType) =>
      appointment.createAppointment(data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  return {
    createAppointment: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

export function useUpdateAppointmentStatus(id?: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: UpdateAppointmentStatusType) =>
      appointment.updateAppointmentStatus(id!, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
      await queryClient.invalidateQueries({ queryKey: ["appointment", id] });
    },
  });

  return {
    updateStatus: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

// ── Testimonials ────────────────────────────────────────────

export function useMyTestimonials() {
  const query = useQuery({
    queryKey: ["my-testimonials"],
    queryFn: () => testimonial.listMyTestimonials(),
    select: (res) => res.data,
    placeholderData: (prev) => prev,
    staleTime: parseDuration("5m"),
    gcTime: parseDuration("5m"),
    refetchOnWindowFocus: true,
    retry: false,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

// ─── Internal (admin / provider / staff) hooks ─────────────────────────────────

export function useAdminDashboard() {
  const query = useQuery({
    queryKey: ["dashboard", "admin"],
    queryFn: dashboard.getAdminDashboard,
    select: (res) => res.data,
    ...queryDefaults,
  });
  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

export function useProviderDashboard() {
  const query = useQuery({
    queryKey: ["dashboard", "provider"],
    queryFn: dashboard.getProviderDashboard,
    select: (res) => res.data,
    ...queryDefaults,
  });
  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

export function useStaffDashboard() {
  const query = useQuery({
    queryKey: ["dashboard", "staff"],
    queryFn: dashboard.getStaffDashboard,
    select: (res) => res.data,
    ...queryDefaults,
  });
  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

export function useInternalPatients(params?: PatientQueryType) {
  const query = useQuery({
    queryKey: ["patients", "list", params],
    queryFn: () => patient.listPatients(params),
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

export function useInternalPatient(id?: string) {
  const query = useQuery({
    queryKey: ["patients", "detail", id],
    queryFn: () => patient.getPatient(id!),
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

export function useInternalStaff(params?: StaffQueryType) {
  const query = useQuery({
    queryKey: ["staff", "list", params],
    queryFn: () => staff.listStaff(params),
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

export function useInternalStaffMember(id?: string) {
  const query = useQuery({
    queryKey: ["staff", "detail", id],
    queryFn: () => staff.getStaff(id!),
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

export function useInsuranceAuthorizations(
  params?: InsuranceAuthorizationQueryType,
) {
  const query = useQuery({
    queryKey: ["insurance-authorizations", params],
    queryFn: () => insuranceAuthorization.listInsuranceAuthorizations(params),
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

export function useInsuranceAuthorization(id?: string) {
  const query = useQuery({
    queryKey: ["insurance-authorization", id],
    queryFn: () => insuranceAuthorization.getInsuranceAuthorization(id!),
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

export function usePatientCaregiverAccesses(patientId?: string) {
  const query = useQuery({
    queryKey: ["caregiver-access", "patient", patientId],
    queryFn: () =>
      caregiverAccess.listCaregiverAccesses({
        patientId,
        limit: 50,
      } as CaregiverAccessQueryType),
    select: (res) => res.data,
    enabled: Boolean(patientId),
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

export function useMyProviderProfile() {
  const query = useQuery({
    queryKey: ["my-provider-profile"],
    queryFn: () => provider.getMyProviderProfile(),
    select: (res) => res.data,
    ...queryDefaults,
  });
  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

export function useMyStaffProfile() {
  const query = useQuery({
    queryKey: ["my-staff-profile"],
    queryFn: () => staff.getMyStaffProfile(),
    select: (res) => res.data,
    ...queryDefaults,
  });
  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

export function useMyProviderAvailability(providerId?: string) {
  const query = useQuery({
    queryKey: ["provider-availability", providerId],
    queryFn: () => availability.getProviderAvailability(providerId!),
    select: (res) => res.data,
    enabled: Boolean(providerId),
    ...queryDefaults,
  });
  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

// ── Product CRUD ──────────────────────────────────────────────────────────────

// ── Categories ────────────────────────────────────────────────────────────────

// ── Providers management (admin) ────────────────────────────────────────────────

export function useCreateProvider() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: CreateProviderType) => provider.createProvider(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
    },
  });
  return {
    createAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

export function useUpdateProvider(id?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: ProviderProfileType) =>
      provider.updateProvider(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] });
      queryClient.invalidateQueries({ queryKey: ["provider", id] });
    },
  });
  return {
    updateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

export function useCreateStaff() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: CreateStaffType) => staff.createStaff(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff", "list"] });
    },
  });
  return {
    createAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

export function useUpdateStaff(id?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: StaffProfileType) => staff.updateStaff(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff", "list"] });
      queryClient.invalidateQueries({ queryKey: ["staff", "detail", id] });
    },
  });
  return {
    updateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

// ── Users management (admin) ──────────────────────────────────────────────────

export function useAdminUsers(params?: UserQueryType) {
  const query = useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => admin.findAllUsers(params),
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

export function useAdminUser(id?: string) {
  const query = useQuery({
    queryKey: ["admin-user", id],
    queryFn: () => admin.findUser(id!),
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

// ── Contact messages (admin) ──────────────────────────────────────────────────

export function useContactMessages(params?: ContactMessageQueryType) {
  const query = useQuery({
    queryKey: ["contact-messages", params],
    queryFn: () => contact.getContactMessages(params),
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

export function useContactMessage(id?: string) {
  const query = useQuery({
    queryKey: ["contact-message", id],
    queryFn: () => contact.getContactMessage(id!),
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

// ── Testimonials management (admin) ──────────────────────────────────────────

export function useCreateTestimonial() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: TestimonialType) => testimonial.createTestimonial(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
    },
  });
  return {
    createAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

export function useAdminTestimonials(params?: TestimonialQueryType) {
  const query = useQuery({
    queryKey: ["admin-testimonials", params],
    queryFn: () => testimonial.listTestimonials(params),
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

export function useUpdateTestimonial(id?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: Partial<TestimonialType>) =>
      testimonial.updateTestimonial(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
    },
  });
  return {
    updateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => testimonial.deleteTestimonial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] });
    },
  });
  return {
    deleteAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

// ── Job listings management (admin) ──────────────────────────────────────────

export function useJobListings(params?: JobListingQueryType) {
  const query = useQuery({
    queryKey: ["job-listings", params],
    queryFn: () => jobListing.listJobListings(params),
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

export function useJobListing(id?: string) {
  const query = useQuery({
    queryKey: ["job-listing", id],
    queryFn: () => jobListing.getJobListing(id!),
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

export function useCreateJobListing() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: JobListingType) => jobListing.createJobListing(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-listings"] });
    },
  });
  return {
    createAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

export function useUpdateJobListing(id?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: Partial<JobListingType>) =>
      jobListing.updateJobListing(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-listings"] });
      queryClient.invalidateQueries({ queryKey: ["job-listing", id] });
    },
  });
  return {
    updateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

export function useDeleteJobListing() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => jobListing.deleteJobListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["job-listings"] });
    },
  });
  return {
    deleteAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

// ── Audit logs (admin) ────────────────────────────────────────────────────────

export function useAuditLogs(params?: AuditLogQueryType) {
  const query = useQuery({
    queryKey: ["audit-logs", params],
    queryFn: () => audit.getAuditLogs(params),
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

// ── Business profile & branches (admin) ──────────────────────────────────────

export function useBusinessProfile() {
  const query = useQuery({
    queryKey: ["business-profile"],
    queryFn: () => business.getBusinessProfile(),
    select: (res) => res.data,
    ...queryDefaults,
  });
  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

export function useUpsertBusinessProfile() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: BusinessProfileType) =>
      business.upsertBusinessProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-profile"] });
    },
  });
  return {
    upsertAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
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

export function useBranch(id?: string) {
  const query = useQuery({
    queryKey: ["branch", id],
    queryFn: () => business.getBranch(id!),
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

export function useCreateBranch() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: CUBranchType) => business.createBranch(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
  return {
    createAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

export function useUpdateBranch(id?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: Partial<CUBranchType>) =>
      business.updateBranch(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
      queryClient.invalidateQueries({ queryKey: ["branch", id] });
    },
  });
  return {
    updateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

export function useDeleteBranch() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => business.deleteBranch(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
  return {
    deleteAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

// ── Newsletter subscribers (admin) ────────────────────────────────────────────

export function useNewsletterSubscribers(
  params?: NewsletterSubscriberQueryType,
) {
  const query = useQuery({
    queryKey: ["newsletter-subscribers", params],
    queryFn: () => newsletter.listNewsletterSubscribers(params),
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

// ── Campaigns (admin) ─────────────────────────────────────────────────────────

export function useCampaigns(params?: CampaignQueryType) {
  const query = useQuery({
    queryKey: ["campaigns", params],
    queryFn: () => campaign.listCampaigns(params),
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

export function useCampaign(id?: string) {
  const query = useQuery({
    queryKey: ["campaign", id],
    queryFn: () => campaign.getCampaign(id!),
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

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: NotificationCampaignType) =>
      campaign.createCampaign(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
  });
  return {
    createAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    mutateError: mutation.error as ApiException | null,
  };
}

export function useUpdateCampaignStatus(id?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: UpdateCampaignStatusType) =>
      campaign.updateCampaignStatus(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["campaign", id] });
    },
  });
  return {
    updateStatusAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    mutateError: mutation.error as ApiException | null,
  };
}

export function useSendCampaign(id?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: () => campaign.sendCampaign(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["campaign", id] });
    },
  });
  return {
    sendAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    mutateError: mutation.error as ApiException | null,
  };
}

// ── Traffic Sources (admin) ───────────────────────────────────────────────────

export function useTrafficSources(params?: TrafficSourceQueryType) {
  const query = useQuery({
    queryKey: ["traffic-sources", params],
    queryFn: () => traffic.getTrafficSources(params),
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

export function useTrafficSource(id?: string) {
  const query = useQuery({
    queryKey: ["traffic-source", id],
    queryFn: () => traffic.getTrafficSource(id!),
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

// ── Staff Permissions (admin) ─────────────────────────────────────────────────

export function useStaffPermissions(staffId?: string) {
  const query = useQuery({
    queryKey: ["staff-permissions", staffId],
    queryFn: () => staffPermission.getStaffPermissions(staffId!),
    select: (res) => res.data,
    enabled: Boolean(staffId),
    ...queryDefaults,
  });
  return {
    data: query.data,
    isLoading: query.isLoading,
    fetchError: query.error as ApiException | null,
  };
}

export function useSyncStaffPermissions(staffId?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: GrantStaffPermissionsType) =>
      staffPermission.syncStaffPermissions(staffId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["staff-permissions", staffId],
      });
      queryClient.invalidateQueries({ queryKey: ["staff", "detail", staffId] });
    },
  });
  return {
    syncAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

// ── Clinical Forms (patient) ──────────────────────────────────────────────────

import type { ClinicalFormQueryType } from "@workspace/contracts/clinical-form";
import { listClinicalForms } from "@workspace/sdk/clinical-form";
import { getOnboardingStatus } from "@workspace/sdk/onboarding";

export function useMyClinicalForms(query: ClinicalFormQueryType = {}) {
  const q = useQuery({
    queryKey: ["my-clinical-forms", query],
    queryFn: () => listClinicalForms(query),
    select: (res) => res.data,
    placeholderData: (prev) => prev,
    ...queryDefaults,
  });
  return {
    data: q.data,
    isLoading: q.isLoading,
    isFetching: q.isFetching,
    fetchError: q.error as ApiException | null,
  };
}

export function useMyOnboardingStatus() {
  const q = useQuery({
    queryKey: ["my-onboarding-status"],
    queryFn: getOnboardingStatus,
    select: (res) => res.data,
    ...queryDefaults,
  });
  return {
    data: q.data,
    isLoading: q.isLoading,
    fetchError: q.error as ApiException | null,
  };
}
