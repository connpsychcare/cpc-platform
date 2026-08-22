"use client";

import * as React from "react";
import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  Check,
  CheckCheck,
  MessageSquare,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import * as chatSdk from "@workspace/sdk/chat";
import { getChatSocket } from "../lib/socket";
import type {
  ConversationResponse,
  MessageResponse,
  SendMessageType,
} from "@workspace/contracts/chat";
import { formatDate, parseDuration } from "@workspace/shared/utils";

import { Button } from "../components/button";
import { Separator } from "../components/separator";
import { Skeleton } from "../components/skeleton";
import { Textarea } from "../components/textarea";
import { cn } from "../lib/utils";
import {
  useNotificationActions,
  useNotifications,
} from "../hooks/use-notification";
import { useCurrentUser } from "../hooks/use-user";
import { InfoNotice } from "./InfoNotice";
import SectionCard from "./SectionCard";

type ConversationThreadProps = {
  /** Omit when `conversation` is supplied; only used to look the thread up. */
  appointmentId?: string;
  /**
   * A conversation the caller already has. Supplying it lets support threads and
   * any conversation without an appointment open, which an appointment-only
   * lookup cannot do.
   */
  conversation?: ConversationResponse;
  title?: React.ReactNode;
  description?: React.ReactNode;
  placeholder?: string;
  emptyMessage?: string;
};

const queryDefaults = {
  staleTime: parseDuration("5m"),
  gcTime: parseDuration("10m"),
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  retry: false,
};

function groupMessages(messages: MessageResponse[]) {
  const groups: { senderId: string; messages: MessageResponse[] }[] = [];
  for (const msg of messages) {
    const last = groups[groups.length - 1];
    if (last && last.senderId === msg.senderId) {
      last.messages.push(msg);
    } else {
      groups.push({ senderId: msg.senderId, messages: [msg] });
    }
  }
  return groups;
}

function useConversationByAppointment(appointmentId?: string) {
  const query = useQuery({
    queryKey: ["conversation", appointmentId],
    queryFn: () => chatSdk.getConversationByAppointment(appointmentId!),
    select: (res) => res.data as ConversationResponse,
    enabled: Boolean(appointmentId),
    ...queryDefaults,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as { message?: string } | null,
  };
}

function useMessages(conversationId?: string) {
  const query = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      const res = await chatSdk.listMessages(conversationId!);
      return res.data as MessageResponse[];
    },
    enabled: Boolean(conversationId),
    ...queryDefaults,
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as { message?: string } | null,
  };
}

function useSendMessage(conversationId?: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: Omit<SendMessageType, "conversationId">) => {
      if (!conversationId) {
        throw new Error(
          "This appointment conversation is not ready yet. Please try again in a moment.",
        );
      }

      return chatSdk.sendMessage({
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
    error: mutation.error as { message?: string } | null,
  };
}

function useMarkMessageRead() {
  return useMutation({
    mutationFn: (messageId: string) => chatSdk.markMessageRead(messageId),
  });
}

const ROLE_LABEL: Record<string, string> = {
  provider: "Provider",
  staff: "Staff",
  admin: "Admin",
  patient: "Patient",
};

export default function ConversationThread({
  appointmentId,
  conversation: conversationProp,
  title = "Conversation",
  description,
  placeholder = "Type a message...",
  emptyMessage = "No messages yet. Start the conversation.",
}: ConversationThreadProps) {
  const { currentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const [body, setBody] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const bottomRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [showScrollBtn, setShowScrollBtn] = React.useState(false);
  const [isOtherTyping, setIsOtherTyping] = React.useState(false);
  const [deliveredIds, setDeliveredIds] = React.useState<Set<string>>(
    new Set(),
  );
  const typingTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const typingCooldownRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const conversationQuery = useConversationByAppointment(
    conversationProp ? undefined : appointmentId,
  );
  const conversation = conversationProp ?? conversationQuery.data;
  const conversationId = conversation?.id;
  const messagesQuery = useMessages(conversationId);
  const { sendMessage, isPending } = useSendMessage(conversationId);
  const markRead = useMarkMessageRead();
  const { data: notifications } = useNotifications({ suppressChatToast: true });
  const { markAsReadAsync } = useNotificationActions();

  const messages = messagesQuery.data;
  const appointmentStatus = conversation?.appointment?.status;
  const canSendMessages =
    Boolean(conversationId) &&
    ["booked", "confirmed"].includes(appointmentStatus ?? "");
  const messagingNotice = !conversationId
    ? (conversationQuery.fetchError?.message ??
      "This appointment conversation is not ready yet.")
    : !canSendMessages
      ? "Messaging is only available while the appointment is booked or confirmed."
      : null;

  React.useEffect(() => {
    // Also re-fires once canSendMessages flips true after loading, so the
    // very-first-load case focuses too, not just switching conversations.
    if (!canSendMessages) return;
    textareaRef.current?.focus();
  }, [conversationId, canSendMessages]);

  React.useEffect(() => {
    if (!messages.length) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  React.useEffect(() => {
    if (!conversationId) return;

    const socket = getChatSocket();

    const onMessage = (msg: MessageResponse) => {
      queryClient.setQueryData<MessageResponse[]>(
        ["messages", conversationId],
        (prev = []) =>
          prev.some((m) => m.id === msg.id) ? prev : [...prev, msg],
      );
      void queryClient.invalidateQueries({ queryKey: ["conversations"] });
    };
    const onMessageRead = (data: { messageId: string; readAt: string }) => {
      queryClient.setQueryData<MessageResponse[]>(
        ["messages", conversationId],
        (prev = []) =>
          prev.map((m) =>
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
      void queryClient.invalidateQueries({
        queryKey: ["conversation", appointmentId],
      });
      void queryClient.invalidateQueries({ queryKey: ["conversations"] });
    };
    const onTyping = (data: { conversationId: string }) => {
      if (data.conversationId !== conversationId) return;
      setIsOtherTyping(true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => setIsOtherTyping(false), 3000);
    };
    const onStopTyping = () => setIsOtherTyping(false);

    const joinRoom = () => socket.emit("join", conversationId);

    socket.on("message", onMessage);
    socket.on("message-read", onMessageRead);
    socket.on("message-delivered", onDelivered);
    socket.on("conversation-updated", onConversationUpdated);
    socket.on("typing", onTyping);
    socket.on("stop-typing", onStopTyping);

    socket.on("connect", joinRoom);
    if (socket.connected) {
      joinRoom();
    } else {
      socket.connect();
    }

    return () => {
      socket.emit("leave", conversationId);
      socket.off("connect", joinRoom);
      socket.off("message", onMessage);
      socket.off("message-read", onMessageRead);
      socket.off("message-delivered", onDelivered);
      socket.off("conversation-updated", onConversationUpdated);
      socket.off("typing", onTyping);
      socket.off("stop-typing", onStopTyping);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    };
  }, [appointmentId, conversationId, queryClient]);

  const markUnreadVisible = React.useCallback(() => {
    if (!messages.length || !currentUser?.id) return;
    if (
      typeof document !== "undefined" &&
      (document.visibilityState !== "visible" || !document.hasFocus())
    )
      return;
    const unread = messages.filter(
      (m) => m.senderId !== currentUser.id && !m.readAt,
    );
    for (const msg of unread) {
      markRead.mutate(msg.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, currentUser?.id]);

  React.useEffect(() => {
    markUnreadVisible();
  }, [markUnreadVisible]);

  React.useEffect(() => {
    if (typeof document === "undefined") return;
    document.addEventListener("visibilitychange", markUnreadVisible);
    window.addEventListener("focus", markUnreadVisible);
    return () => {
      document.removeEventListener("visibilitychange", markUnreadVisible);
      window.removeEventListener("focus", markUnreadVisible);
    };
  }, [markUnreadVisible]);

  React.useEffect(() => {
    if (!notifications || !conversationId) return;
    const unreadChatNotifs = notifications.filter(
      (n) => !n.readAt && n.purpose === "newChatMessage",
    );
    for (const notif of unreadChatNotifs) {
      markAsReadAsync(notif.id).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications, conversationId]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 120);
  };

  const notifyTyping = React.useCallback(() => {
    if (!conversationId || typingCooldownRef.current || !canSendMessages)
      return;
    getChatSocket().emit("typing", conversationId);
    typingCooldownRef.current = setTimeout(() => {
      typingCooldownRef.current = null;
    }, 2000);
  }, [canSendMessages, conversationId]);

  const submit = async () => {
    if (!body.trim() || !canSendMessages) return;
    try {
      await sendMessage({ body: body.trim(), attachmentIds: [] });
      setBody("");
    } catch (error: unknown) {
      toast.error("Failed to send message", {
        description: (error as { message?: string })?.message,
      });
    }
  };

  const messageGroups = groupMessages(messages);

  // Internal users (admin/provider/staff) all share the "right" side -
  // any message from an internal role is treated as "mine" when the viewer
  // is also an internal user.  Patients only see their own messages on the right.
  const INTERNAL_ROLES = ["admin", "provider", "staff"];
  const viewerIsInternal = INTERNAL_ROLES.includes(
    (currentUser?.role as string) ?? "",
  );
  const isMySide = (group: {
    senderId: string;
    messages: MessageResponse[];
  }) => {
    const senderRole = group.messages[0]?.sender?.role as string | undefined;
    if (viewerIsInternal) return INTERNAL_ROLES.includes(senderRole ?? "");
    return group.senderId === currentUser?.id;
  };

  return (
    <SectionCard
      title={title}
      description={description}
      className="flex h-full min-h-0 flex-col shadow-sm"
      contentClassName="flex min-h-0 flex-1 flex-col gap-4"
    >
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="min-h-40 flex-1 overflow-y-auto rounded-xl border border-border/60 p-4"
        >
          {messagesQuery.isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="mb-3 space-y-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-10 w-3/4 rounded-2xl" />
              </div>
            ))}

          {!messagesQuery.isLoading && !messages.length && (
            <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
              <MessageSquare className="size-7 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{emptyMessage}</p>
            </div>
          )}

          <div className="flex flex-col gap-2">
            {messageGroups.map((group, groupIdx) => {
              const isMe = isMySide(group);
              // "You" label only when this user personally sent the messages
              const isMyMessage = group.senderId === currentUser?.id;
              const senderUser = group.messages[0]?.sender;
              const senderName = isMyMessage
                ? "You"
                : (senderUser?.displayName ?? "Unknown");
              const senderRole = isMyMessage
                ? null
                : (senderUser?.role as string | undefined);

              return (
                <div
                  key={`${group.senderId}-${groupIdx}`}
                  className={cn(
                    "flex flex-col gap-0.5",
                    isMe ? "items-end" : "items-start",
                  )}
                >
                  <p className="mb-0.5 px-1 text-xs text-muted-foreground">
                    {senderName}
                    {senderRole && (
                      <span className="ml-1 opacity-60">
                        · {ROLE_LABEL[senderRole] ?? senderRole}
                      </span>
                    )}
                  </p>

                  {group.messages.map((msg) => {
                    const isRead = !!msg.readAt;
                    const isDelivered = isRead || deliveredIds.has(msg.id);
                    const tickIcon = isRead ? (
                      <CheckCheck
                        className={cn(
                          "size-3",
                          isMe ? "text-primary-foreground" : "text-primary",
                        )}
                      />
                    ) : isDelivered ? (
                      <CheckCheck
                        className={cn(
                          "size-3",
                          isMe
                            ? "text-primary-foreground/60"
                            : "text-muted-foreground",
                        )}
                      />
                    ) : (
                      <Check
                        className={cn(
                          "size-3",
                          isMe
                            ? "text-primary-foreground/60"
                            : "text-muted-foreground",
                        )}
                      />
                    );

                    return (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex flex-col",
                          isMe ? "items-end" : "items-start",
                        )}
                      >
                        <div
                          className={cn(
                            "min-w-30 max-w-[75%] overflow-hidden rounded-2xl p-2",
                            isMe
                              ? "bg-primary text-primary-foreground rounded-tr-sm"
                              : "bg-muted text-foreground rounded-tl-sm",
                          )}
                        >
                          {/* MEDIA */}
                          {(msg?.attachments?.length || 0) > 0 && (
                            <div className="mb-1 overflow-hidden rounded-xl">
                              {msg.attachments?.map((att: any) => {
                                const url = att.media?.url;
                                const isImage =
                                  att.media?.mimeType?.startsWith("image/");
                                if (!url) return null;

                                return isImage ? (
                                  <a key={att.id} href={url} target="_blank">
                                    <Image
                                      src={url}
                                      width={300}
                                      height={200}
                                      alt="attachment"
                                      className="max-h-60 w-auto rounded-lg object-cover"
                                    />
                                  </a>
                                ) : (
                                  <a
                                    key={att.id}
                                    href={url}
                                    target="_blank"
                                    className="flex items-center gap-1 text-xs underline"
                                  >
                                    📎 {att.media?.originalName ?? "File"}
                                  </a>
                                );
                              })}
                            </div>
                          )}

                          {/* TEXT + TIME: phantom matches bubble bg color → invisible but reserves layout space for overlay */}
                          {msg.body && (
                            <div className="relative">
                              <p className="whitespace-pre-wrap wrap-break-word px-1 text-sm leading-relaxed">
                                {msg.body}
                                {"  "}
                                <span
                                  className={
                                    isMe
                                      ? "text-[10px] text-primary"
                                      : "text-[10px] text-muted"
                                  }
                                >
                                  {isMe
                                    ? `${formatDate(msg.createdAt, { mode: "time" })} ✓✓`
                                    : formatDate(msg.createdAt, {
                                        mode: "time",
                                      })}
                                </span>
                              </p>
                              <span
                                className={cn(
                                  "absolute bottom-0 right-1 inline-flex items-center gap-1 text-[10px]",
                                  isMe
                                    ? "text-primary-foreground/70"
                                    : "text-muted-foreground",
                                )}
                              >
                                {formatDate(msg.createdAt, { mode: "time" })}
                                {isMe && tickIcon}
                              </span>
                            </div>
                          )}

                          {/* MEDIA ONLY */}
                          {!msg.body && (msg?.attachments?.length || 0) > 0 && (
                            <div
                              className={cn(
                                "flex justify-end mt-1 text-[10px] gap-1",
                                isMe
                                  ? "text-primary-foreground/70"
                                  : "text-muted-foreground",
                              )}
                            >
                              {formatDate(msg.createdAt, { mode: "time" })}
                              {isMe && tickIcon}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {isOtherTyping && (
            <div className="mt-1 flex items-start gap-1">
              <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-2.5 text-sm text-muted-foreground">
                <span className="animate-pulse">...</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {showScrollBtn && (
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-2 right-2 size-8 rounded-full shadow-md"
            onClick={() =>
              bottomRef.current?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <ArrowDown className="size-4" />
          </Button>
        )}
      </div>

      <Separator />

      {messagingNotice ? (
        <InfoNotice
          variant={conversationId ? "info" : "warning"}
          message={messagingNotice}
        />
      ) : null}

      <div className="flex items-end gap-2">
        <div className="min-w-0 flex-1">
          <Textarea
            ref={textareaRef}
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              notifyTyping();
            }}
            placeholder={placeholder}
            rows={3}
            className="w-full min-w-0 resize-none field-sizing-fixed overflow-x-hidden"
            disabled={!canSendMessages}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void submit();
              }
            }}
          />
        </div>
        <Button
          type="button"
          size="icon"
          onClick={submit}
          disabled={!canSendMessages || isPending || !body.trim()}
          className="shrink-0"
        >
          <Send className="size-4" />
        </Button>
      </div>
    </SectionCard>
  );
}
