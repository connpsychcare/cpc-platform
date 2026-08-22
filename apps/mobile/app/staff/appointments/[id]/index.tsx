import { useLocalSearchParams } from "expo-router";
import { InternalAppointmentDetail } from "@/components/internal/appointment-detail";

export default function StaffAppointmentDetailRoute() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const resolvedId = Array.isArray(id) ? id[0] : id;
  if (!resolvedId) return null;
  return <InternalAppointmentDetail appointmentId={resolvedId} rolePrefix="/staff" />;
}
