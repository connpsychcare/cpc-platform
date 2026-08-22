import { useLocalSearchParams } from "expo-router";
import { InternalAppointmentDetail } from "@/components/internal/appointment-detail";

export default function StaffConversationThreadRoute() {
  const { appointmentId } = useLocalSearchParams<{ appointmentId?: string | string[] }>();
  const resolvedId = Array.isArray(appointmentId) ? appointmentId[0] : appointmentId;
  if (!resolvedId) return null;
  return <InternalAppointmentDetail appointmentId={resolvedId} rolePrefix="/staff" />;
}
