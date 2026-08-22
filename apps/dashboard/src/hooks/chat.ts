"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ConversationResponse,
  MessageResponse,
  SendMessageType,
} from "@workspace/contracts/chat";
import type { ApiException } from "@workspace/sdk";
import * as chat from "@workspace/sdk/chat";
import { parseDuration } from "@workspace/shared/utils";

const queryDefaults = {
  staleTime: 0,
  gcTime: parseDuration("5m"),
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
  retry: false,
};

export function useConversationByAppointment(appointmentId?: string) {
  const query = useQuery({
    queryKey: ["conversation", appointmentId],
    queryFn: () => chat.getConversationByAppointment(appointmentId!),
    select: (res) => res.data as ConversationResponse,
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
    select: (res) => res.data as MessageResponse[],
    enabled: Boolean(conversationId),
    refetchInterval: 8_000,
    ...queryDefaults,
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
          "This appointment conversation is not ready yet. Please refresh and try again.",
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
    },
  });

  return {
    sendMessage: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

export function useMarkMessageRead() {
  return useMutation({
    mutationFn: (messageId: string) => chat.markMessageRead(messageId),
  });
}

export function useConversations() {
  const query = useQuery({
    queryKey: ["conversations"],
    queryFn: () => chat.listConversations(),
    select: (res) => res.data as ConversationResponse[],
    staleTime: 0,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
    retry: false,
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    fetchError: query.error as ApiException | null,
  };
}
