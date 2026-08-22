"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import * as chat from "@workspace/sdk/chat";
import type { ConversationResponse } from "@workspace/contracts/chat";
import { getChatSocket } from "../lib/socket";

export function useConversations() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["conversations"],
    queryFn: () => chat.listConversations(),
    select: (res) => res.data as ConversationResponse[],
    staleTime: 1000 * 60,
    retry: false,
  });

  // Invalidate conversations list in real time.
  // - "message" fires when the user is inside a conversation room (active chat).
  // - "conversation-updated" fires via the user-specific room for every screen,
  //   so the list updates even when the user is not in any chat thread.
  React.useEffect(() => {
    const socket = getChatSocket();

    const refresh = () => {
      void queryClient.invalidateQueries({ queryKey: ["conversations"] });
    };

    socket.connect();
    socket.on("message", refresh);
    socket.on("conversation-updated", refresh);

    return () => {
      socket.off("message", refresh);
      socket.off("conversation-updated", refresh);
    };
  }, [queryClient]);

  const conversations = query.data ?? [];
  const totalUnread = conversations.reduce(
    (sum, c) => sum + (c.unreadCount ?? 0),
    0,
  );

  return {
    conversations,
    totalUnread,
    isLoading: query.isLoading,
  };
}
