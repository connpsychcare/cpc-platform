"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, Clock, MessageSquare, Search, X } from "lucide-react";
import { formatDate } from "@workspace/shared/utils";
import { Badge } from "../components/badge";
import { Button } from "../components/button";
import { Input } from "../components/input";
import { Skeleton } from "../components/skeleton";
import SectionCard from "./SectionCard";
import { cn, getStatusVariant } from "../lib/utils";
import type { ConversationResponse } from "@workspace/contracts/chat";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const pill = (active: boolean) =>
  cn(
    "whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors cursor-pointer",
    active
      ? "border-primary bg-primary text-primary-foreground"
      : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
  );

interface ConversationListProps {
  conversations: ConversationResponse[];
  isLoading: boolean;
  /** Base path for conversation threads, e.g. "/messages" */
  basePath: string;
  /** Base path for appointment detail links, e.g. "/provider/appointments" */
  appointmentBasePath: string;
  title?: string;
  description?: string;
}

const ConversationList = ({
  conversations,
  isLoading,
  basePath,
  title = "Conversations",
}: ConversationListProps) => {
  const [search, setSearch] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = conversations
    .filter((c) => !unreadOnly || (c.unreadCount ?? 0) > 0)
    .filter((c) => statusFilter === "all" || c.status === statusFilter)
    .filter((c) => typeFilter === "all" || c.type === typeFilter)
    .filter((c) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        (c.patient?.user?.displayName?.toLowerCase().includes(q) ?? false) ||
        (c.subject?.toLowerCase().includes(q) ?? false) ||
        (c.appointment?.provider?.user?.displayName
          ?.toLowerCase()
          .includes(q) ??
          false)
      );
    });

  const clearFilters = () => {
    setSearch("");
    setUnreadOnly(false);
    setStatusFilter("all");
    setTypeFilter("all");
  };

  return (
    <SectionCard title={title} contentClassName="space-y-3">
      {!isLoading && conversations.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pb-1">
          <div className="relative min-w-48 flex-1">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search conversations…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 pr-7 text-sm"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setUnreadOnly(!unreadOnly)}
              className={pill(unreadOnly)}
            >
              Unread
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={pill(statusFilter === "all")}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("open")}
              className={pill(statusFilter === "open")}
            >
              Open
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("closed")}
              className={pill(statusFilter === "closed")}
            >
              Closed
            </button>
            <button
              type="button"
              onClick={() =>
                setTypeFilter(
                  typeFilter === "appointment" ? "all" : "appointment",
                )
              }
              className={pill(typeFilter === "appointment")}
            >
              Appointment
            </button>
            <button
              type="button"
              onClick={() =>
                setTypeFilter(typeFilter === "support" ? "all" : "support")
              }
              className={pill(typeFilter === "support")}
            >
              Support
            </button>
          </div>
        </div>
      )}

      {isLoading &&
        Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2 rounded-xl border p-4">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        ))}

      {!isLoading && !conversations.length && (
        <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-xl border border-dashed text-center">
          <MessageSquare className="size-8 text-muted-foreground" />
          <div>
            <p className="font-medium">No conversations yet</p>
            <p className="text-sm text-muted-foreground">
              Conversations open automatically when appointments are booked.
            </p>
          </div>
        </div>
      )}

      {!isLoading && conversations.length > 0 && !filtered.length && (
        <div className="flex min-h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed text-center">
          <p className="text-sm font-medium text-muted-foreground">
            No conversations match your filters
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-muted-foreground underline hover:text-foreground"
          >
            Clear filters
          </button>
        </div>
      )}

      {filtered.map((conv) => {
        const appt = conv.appointment;
        const patientName = conv.patient?.user?.displayName ?? "Patient";
        const appointmentId = appt?.id;
        const hasUnread = (conv.unreadCount ?? 0) > 0;
        const lastMsg = conv.lastMessage;

        return (
          <Link
            key={conv.id}
            href={appointmentId ? `${basePath}/${appointmentId}` : basePath}
            className="block"
          >
            <div
              className={cn(
                "rounded-xl border p-4 transition-colors hover:bg-secondary/50",
                hasUnread && "border-primary/30 bg-primary/5",
              )}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {getInitials(patientName)}
                    {hasUnread && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {(conv.unreadCount ?? 0) > 9 ? "9+" : conv.unreadCount}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{patientName}</p>
                      {appt && (
                        <Badge
                          variant={getStatusVariant(appt.status)}
                          className="capitalize text-xs"
                        >
                          {appt.status}
                        </Badge>
                      )}
                      {hasUnread && (
                        <Badge className="text-xs">
                          {conv.unreadCount} new
                        </Badge>
                      )}
                    </div>
                    {lastMsg ? (
                      <p className="truncate text-sm text-muted-foreground">
                        {lastMsg.body || "Attachment"}
                      </p>
                    ) : (
                      <p className="text-sm italic text-muted-foreground">
                        No messages yet
                      </p>
                    )}
                    {appt && (
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="size-3" />
                          {formatDate(appt.scheduledStartAt, { mode: "date" })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {formatDate(appt.scheduledStartAt, { mode: "time" })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm" className="shrink-0">
                  Open Chat
                </Button>
              </div>
            </div>
          </Link>
        );
      })}
    </SectionCard>
  );
};

export default ConversationList;
