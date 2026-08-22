"use client";

import * as React from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MessageSquare,
  Search,
  X,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "@workspace/shared/utils";
import type { ConversationResponse } from "@workspace/contracts/chat";
import * as chatSdk from "@workspace/sdk/chat";
import { Badge } from "../components/badge";
import { Button } from "../components/button";
import { Input } from "../components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/select";
import { Skeleton } from "../components/skeleton";
import { cn, getStatusVariant } from "../lib/utils";
import ConversationThread from "./ConversationThread";
import { InfoNotice } from "./InfoNotice";

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const pill = (active: boolean) =>
  cn(
    "whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors cursor-pointer shrink-0",
    active
      ? "border-primary bg-primary text-primary-foreground"
      : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
  );

type StatusFilter = "all" | "unread" | "open" | "closed";
type TypeFilter = "all" | "appointment" | "support";

interface MessagesWorkspaceProps {
  conversations: ConversationResponse[];
  isLoading: boolean;
  /** The list query's error, so a failed fetch does not read as "no conversations". */
  error?: { message?: string } | null;
  /** "patient" shows the patient name (dashboard); "provider" shows the provider (patient portal) */
  nameFrom?: "patient" | "provider";
  /** CTA rendered inside the empty-no-conversations state */
  emptyAction?: React.ReactNode;
  /** Let internal users open or close a thread from its header. */
  canChangeStatus?: boolean;
}

function useUpdateConversationStatus() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "open" | "closed" }) =>
      chatSdk.updateConversation(id, { status }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
  return { updateStatus: mutation.mutateAsync, isPending: mutation.isPending };
}

export default function MessagesWorkspace({
  conversations,
  isLoading,
  error,
  nameFrom = "patient",
  emptyAction,
  canChangeStatus = false,
}: MessagesWorkspaceProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [activeStatusFilter, setActiveStatusFilter] =
    React.useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = React.useState<TypeFilter>("all");
  const { updateStatus, isPending: isStatusPending } =
    useUpdateConversationStatus();

  // Deep link: /messages?id=<conversationId> opens that thread, so notification
  // action URLs can land the reader straight in the right conversation.
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const id = new URLSearchParams(window.location.search).get("id");
    if (id) setSelectedId(id);
  }, []);

  const selectConversation = React.useCallback((id: string | null) => {
    setSelectedId(id);
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("id", id);
    else url.searchParams.delete("id");
    window.history.replaceState(null, "", url.toString());
  }, []);

  const getName = (c: ConversationResponse) =>
    nameFrom === "patient"
      ? (c.patient?.user?.displayName ?? "Patient")
      : (c.appointment?.provider?.user?.displayName ?? "Provider");

  const hasActiveFilter =
    activeStatusFilter !== "all" || typeFilter !== "all" || !!search;

  const clearFilters = () => {
    setSearch("");
    setActiveStatusFilter("all");
    setTypeFilter("all");
  };

  const setStatusFilter = (f: StatusFilter) =>
    setActiveStatusFilter((prev) => (prev === f ? "all" : f));

  const filtered = conversations
    .filter((c) => {
      const statusMatch =
        activeStatusFilter === "unread"
          ? (c.unreadCount ?? 0) > 0
          : activeStatusFilter === "open"
            ? c.status === "open"
            : activeStatusFilter === "closed"
              ? c.status === "closed"
              : true;
      const typeMatch = typeFilter === "all" || c.type === typeFilter;
      return statusMatch && typeMatch;
    })
    .filter((c) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        getName(c).toLowerCase().includes(q) ||
        (c.subject?.toLowerCase().includes(q) ?? false)
      );
    });

  const totalUnread = conversations.reduce(
    (n, c) => n + (c.unreadCount ?? 0),
    0,
  );

  // Selection is keyed on the conversation's own id. Keying it on the appointment
  // meant any conversation without one (a support thread, or a payload where the
  // appointment relation is absent) resolved to null and silently refused to open.
  const selectedConv = selectedId
    ? (conversations.find((c) => c.id === selectedId) ?? null)
    : null;

  const threadTitle = selectedConv
    ? `Chat with ${getName(selectedConv)}`
    : undefined;
  const threadDescription = selectedConv?.appointment
    ? `${formatDate(selectedConv.appointment.scheduledStartAt, { mode: "date" })} · ${formatDate(selectedConv.appointment.scheduledStartAt, { mode: "time" })}`
    : undefined;

  // md:h-150 = 600px fixed height only on wide screens; mobile flows naturally
  return (
    <div className="flex gap-4 md:h-150">
      {/* LEFT: conversation sidebar */}
      <div
        className={cn(
          "flex shrink-0 flex-col rounded-xl border bg-card shadow-sm md:h-full md:w-72 md:overflow-hidden lg:w-80",
          selectedId ? "hidden w-full md:flex" : "flex w-full",
        )}
      >
        <div className="flex shrink-0 items-center gap-2 border-b px-4 py-3">
          <MessageSquare className="size-4 shrink-0 text-muted-foreground" />
          <p className="text-sm font-semibold">Messages</p>
          <span className="text-xs tabular-nums text-muted-foreground">
            ({conversations.length})
          </span>
          <div className="ml-auto flex items-center gap-2">
            {!isLoading && conversations.length > 0 && (
              <Select
                value={typeFilter}
                onValueChange={(v) => setTypeFilter(v as TypeFilter)}
              >
                <SelectTrigger className="h-7 w-24 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="appointment">Appointment</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select>
            )}
            {totalUnread > 0 && (
              <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                {totalUnread > 99 ? "99+" : totalUnread}
              </span>
            )}
          </div>
        </div>

        {!isLoading && conversations.length > 0 && (
          <div className="shrink-0 border-b">
            <div className="relative px-3 pb-1.5 pt-2">
              <Search className="pointer-events-none absolute left-5.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 pr-7 text-sm"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-5.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Single-select pills; clicking the active pill resets to All */}
            <div className="flex items-center gap-1 overflow-x-auto px-3 pb-2 scrollbar-hidden">
              {(
                [
                  { key: "all", label: "All" },
                  { key: "unread", label: "Unread" },
                  { key: "open", label: "Open" },
                  { key: "closed", label: "Closed" },
                ] as const
              ).map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setStatusFilter(key)}
                  className={pill(activeStatusFilter === key)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* On md+: flex-1 + min-h-0 confines the list to the 600px container */}
        <div className="overflow-y-auto md:min-h-0 md:flex-1">
          {isLoading &&
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 border-b px-4 py-3"
              >
                <Skeleton className="size-9 shrink-0 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-3 w-40" />
                </div>
              </div>
            ))}

          {error && (
            <div className="p-3">
              <InfoNotice
                variant="error"
                message={
                  error.message ??
                  "Could not load conversations. Please refresh and try again."
                }
              />
            </div>
          )}

          {!error && !isLoading && !conversations.length && (
            <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
              <MessageSquare className="size-8 text-muted-foreground/50" />
              <div>
                <p className="text-sm font-medium">No conversations yet</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Conversations open when appointments are booked.
                </p>
              </div>
              {emptyAction}
            </div>
          )}

          {!isLoading && conversations.length > 0 && !filtered.length && (
            <div className="flex flex-col items-center justify-center gap-2 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No conversations match your filters
              </p>
              {hasActiveFilter && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs text-muted-foreground underline hover:text-foreground"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

          {filtered.map((conv) => {
            const name = getName(conv);
            const appt = conv.appointment;
            const hasUnread = (conv.unreadCount ?? 0) > 0;
            const isSelected = conv.id === selectedId;

            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => selectConversation(conv.id)}
                className={cn(
                  "flex w-full items-start gap-3 border-b px-4 py-3 text-left transition-colors hover:bg-secondary/60",
                  isSelected &&
                    "border-l-2 border-l-primary bg-primary/10 hover:bg-primary/10",
                  hasUnread && !isSelected && "bg-primary/5",
                )}
              >
                <div className="relative shrink-0">
                  <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {initials(name)}
                  </div>
                  {hasUnread && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {(conv.unreadCount ?? 0) > 9 ? "9+" : conv.unreadCount}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p
                      className={cn(
                        "truncate text-sm",
                        hasUnread ? "font-semibold" : "font-medium",
                      )}
                    >
                      {name}
                    </p>
                    {appt && (
                      <Badge
                        variant={getStatusVariant(appt.status)}
                        className="shrink-0 text-[10px] capitalize"
                      >
                        {appt.status}
                      </Badge>
                    )}
                    {conv.lastMessage && (
                      <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">
                        {formatDate(conv.lastMessage.createdAt, {
                          mode: "time",
                        })}
                      </span>
                    )}
                  </div>

                  {conv.lastMessage ? (
                    <p
                      className={cn(
                        "mt-0.5 truncate text-xs",
                        hasUnread
                          ? "font-medium text-foreground"
                          : "text-muted-foreground",
                      )}
                    >
                      {conv.lastMessage.body || "Attachment"}
                    </p>
                  ) : (
                    <p className="mt-0.5 text-xs italic text-muted-foreground">
                      No messages yet
                    </p>
                  )}

                  {appt && (
                    <p className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                      <CalendarDays className="size-2.5 shrink-0" />
                      {formatDate(appt.scheduledStartAt, { mode: "date" })}
                      <Clock className="ml-1 size-2.5 shrink-0" />
                      {formatDate(appt.scheduledStartAt, { mode: "time" })}
                    </p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* RIGHT: thread panel */}
      <div
        className={cn(
          "flex min-w-0 flex-1 flex-col md:h-full md:overflow-y-auto",
          !selectedId ? "hidden md:flex" : "flex",
        )}
      >
        {selectedId && (
          <div className="mb-3 flex shrink-0 items-center justify-between gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => selectConversation(null)}
              className="gap-1.5 pl-1 md:hidden"
            >
              <ArrowLeft className="size-4" />
              All conversations
            </Button>

            {canChangeStatus && selectedConv && (
              <Select
                value={selectedConv.status}
                disabled={isStatusPending}
                onValueChange={(status) =>
                  void updateStatus({
                    id: selectedConv.id,
                    status: status as "open" | "closed",
                  })
                }
              >
                <SelectTrigger className="ml-auto h-8 w-28 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        )}

        {selectedConv ? (
          <ConversationThread
            conversation={selectedConv}
            appointmentId={selectedConv.appointment?.id}
            title={threadTitle}
            description={threadDescription}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-card p-16 text-center md:h-full md:p-0">
            <MessageSquare className="size-10 text-muted-foreground/30" />
            <div>
              <p className="font-medium text-muted-foreground">
                Select a conversation
              </p>
              <p className="mt-1 text-sm text-muted-foreground/60">
                Pick a thread from the list to open the chat.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
