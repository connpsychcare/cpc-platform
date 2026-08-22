"use client";

import PageIntro from "@workspace/ui/shared/PageIntro";
import MessagesWorkspace from "@workspace/ui/shared/MessagesWorkspace";
import { useConversations } from "@/hooks/chat";
import { useCurrentUser } from "@workspace/ui/hooks/use-user";

// Keyed on the current roles only. A "provider" key lived here before the
// doctor role folded into staff, and was unreachable afterwards.
const copyByRole = {
  admin:
    "Monitor and participate in all patient conversations across the practice.",
  staff:
    "Each booked appointment opens a dedicated thread. Coordinate with patients directly from here.",
} as const;

const MessagesPage = () => {
  const { currentUser } = useCurrentUser();
  const { data: conversations, isLoading, fetchError } = useConversations();
  const role = currentUser?.role as keyof typeof copyByRole | undefined;
  const description = role ? copyByRole[role] : copyByRole.admin;

  return (
    <div className="space-y-6">
      <PageIntro title="Messages" description={description} />
      <MessagesWorkspace
        conversations={conversations}
        isLoading={isLoading}
        error={fetchError}
        nameFrom="patient"
        canChangeStatus
      />
    </div>
  );
};

export default MessagesPage;
