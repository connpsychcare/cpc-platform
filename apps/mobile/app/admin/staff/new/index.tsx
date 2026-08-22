import { InternalStaffForm } from "@/components/internal/forms/staff-form";
import { useCreateStaff } from "@/hooks/use-healthcare";

export default function AdminNewStaffRoute() {
  const { createAsync, isPending } = useCreateStaff();
  return <InternalStaffForm createAsync={createAsync} isCreating={isPending} />;
}
