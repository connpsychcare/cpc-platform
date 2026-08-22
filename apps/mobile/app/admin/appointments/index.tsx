import { InternalAppointmentsList } from "@/components/internal/appointments-list";

export default function AdminAppointmentsRoute() {
  return <InternalAppointmentsList rolePrefix="/admin" />;
}
