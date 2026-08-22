"use client";

import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import MessagesWorkspace from "@workspace/ui/shared/MessagesWorkspace";
import { useConversations } from "@/hooks/healthcare";

export default function MessagesPage() {
  const { data: conversations, isLoading, fetchError } = useConversations();

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          My Care
        </span>
        <h1 className="mt-1 font-primary text-2xl font-extrabold tracking-tight text-foreground">
          Messages
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your conversations are linked to appointments. Select one to open the
          chat.
        </p>
      </div>

      <MessagesWorkspace
        conversations={conversations}
        isLoading={isLoading}
        error={fetchError}
        nameFrom="provider"
        emptyAction={
          <Button variant="outline" size="sm" asChild>
            <Link href="/patient/appointments">View Appointments</Link>
          </Button>
        }
      />
    </div>
  );
}
