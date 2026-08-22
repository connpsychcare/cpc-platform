import { useLocalSearchParams } from "expo-router";
import { InternalPatientDetail } from "@/components/internal/patient-detail";

export default function AdminPatientDetailRoute() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const resolvedId = Array.isArray(id) ? id[0] : id;
  if (!resolvedId) return null;
  return <InternalPatientDetail patientId={resolvedId} rolePrefix="/admin" />;
}
