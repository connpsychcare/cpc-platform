import { InternalPatientsList } from "@/components/internal/patients-list";

export default function AdminPatientsRoute() {
  return <InternalPatientsList rolePrefix="/admin" />;
}
