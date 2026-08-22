import { InternalConversationsList } from "@/components/internal/conversations-list";

export default function AdminMessagesRoute() {
  return <InternalConversationsList rolePrefix="/admin" />;
}
