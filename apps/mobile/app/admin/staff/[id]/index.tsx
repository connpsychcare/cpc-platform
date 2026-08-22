import { useLocalSearchParams } from "expo-router";
import { InternalStaffForm } from "@/components/internal/forms/staff-form";

export default function AdminStaffDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <InternalStaffForm staffId={id} />;
}
