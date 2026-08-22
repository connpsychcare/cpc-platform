import { useLocalSearchParams } from "expo-router";

import { TreatmentPlanDetailScreen } from "@/components/shared/treatment-plan-detail-screen";

export default function PatientTreatmentPlanDetailRoute() {
  const { planId } = useLocalSearchParams<{ planId?: string | string[] }>();
  const resolvedPlanId = Array.isArray(planId) ? planId[0] : planId;

  return (
    <TreatmentPlanDetailScreen
      planId={resolvedPlanId}
      backHref="/patient/care/treatment-plans"
      backLabel="Back to treatment plans"
      emptyHref="/patient/care/treatment-plans"
      emptyLabel="Back to treatment plans"
    />
  );
}
