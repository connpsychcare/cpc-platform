import { InternalPatientsList } from "@/components/internal/patients-list";

export default function StaffPatientsRoute() {
  return <InternalPatientsList rolePrefix="/staff" />;
}
