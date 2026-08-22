"use client";

import { toast } from "sonner";
import { ChevronDown } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import type { AppointmentStatus } from "@workspace/contracts";
import type { AppointmentResponse } from "@workspace/contracts/appointment";
import SectionCard from "@workspace/ui/shared/SectionCard";
import { getStatusVariant } from "@workspace/ui/lib/utils";

import { useUpdateAppointmentStatus } from "@/hooks/appointment";

interface AppointmentStatusPanelProps {
  appointment: AppointmentResponse;
  variant?: "card" | "toolbar";
}

// Valid next states for each current state
const transitions: Record<string, AppointmentStatus[]> = {
  booked: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled", "noShow"],
  completed: [],
  cancelled: [],
  noShow: [],
};

const statusLabels: Record<string, string> = {
  booked: "Booked",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  noShow: "No Show",
};

const statusVariants: Record<string, string> = {
  confirmed: "text-success",
  completed: "text-info",
  cancelled: "text-destructive",
  noShow: "text-warning",
};

const AppointmentStatusPanel = ({
  appointment,
  variant = "card",
}: AppointmentStatusPanelProps) => {
  const { updateStatus, isPending } = useUpdateAppointmentStatus(appointment.id);

  const setStatus = async (status: AppointmentStatus) => {
    try {
      await updateStatus({
        status,
        cancellationReason:
          status === "cancelled"
            ? "Updated from dashboard workflow."
            : undefined,
        cancellationSource: status === "cancelled" ? "admin" : undefined,
        adminNotes: appointment.adminNotes,
      });
      toast.success(`Appointment marked as ${statusLabels[status] ?? status}.`);
    } catch (error: any) {
      toast.error("Failed to update appointment", {
        description: error?.message,
      });
    }
  };

  const next = transitions[appointment.status] ?? [];
  const isTerminal = next.length === 0;

  const actions = isTerminal ? (
    <Badge
      variant={getStatusVariant(appointment.status)}
      className="capitalize h-9 px-3 text-sm font-medium"
    >
      {statusLabels[appointment.status] ?? appointment.status}
      &nbsp;· No further actions
    </Badge>
  ) : (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" disabled={isPending} className="h-9 gap-1.5">
          {isPending ? "Updating…" : "Change Status"}
          <ChevronDown className="size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Current: {statusLabels[appointment.status]}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {next.map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => setStatus(status)}
            className={statusVariants[status]}
          >
            {statusLabels[status] ?? status}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (variant === "toolbar") {
    return actions;
  }

  return (
    <SectionCard title="Status" className="shadow-sm">
      <div className="flex items-center gap-3">
        <Badge variant={getStatusVariant(appointment.status)} className="capitalize">
          {statusLabels[appointment.status] ?? appointment.status}
        </Badge>
        {!isTerminal && actions}
      </div>
    </SectionCard>
  );
};

export default AppointmentStatusPanel;
