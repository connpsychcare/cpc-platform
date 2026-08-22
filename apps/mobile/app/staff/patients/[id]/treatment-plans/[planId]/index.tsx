import { useLocalSearchParams } from "expo-router";

import { TreatmentPlanDetailScreen } from "@/components/shared/treatment-plan-detail-screen";

export default function StaffTreatmentPlanDetailRoute() {
  const { id, planId } = useLocalSearchParams<{ id?: string | string[]; planId?: string | string[] }>();
  const patientId = Array.isArray(id) ? id[0] : id;
  const resolvedPlanId = Array.isArray(planId) ? planId[0] : planId;
  const backHref = `/staff/patients/${patientId}` as any;

  return (
    <TreatmentPlanDetailScreen
      planId={resolvedPlanId}
      backHref={backHref}
      backLabel="Back to patient"
      emptyHref={backHref}
      emptyLabel="Back to patient"
    />
  );
}
