import { InternalConversationsList } from "@/components/internal/conversations-list";

export default function StaffMessagesRoute() {
  return <InternalConversationsList rolePrefix="/staff" />;
}
