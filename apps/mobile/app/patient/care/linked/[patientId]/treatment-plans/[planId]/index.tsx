import { useLocalSearchParams } from "expo-router";

import { TreatmentPlanDetailScreen } from "@/components/shared/treatment-plan-detail-screen";

export default function LinkedPatientTreatmentPlanDetailRoute() {
  const { patientId, planId } = useLocalSearchParams<{
    patientId?: string | string[];
    planId?: string | string[];
  }>();
  const resolvedPatientId = Array.isArray(patientId) ? patientId[0] : patientId;
  const resolvedPlanId = Array.isArray(planId) ? planId[0] : planId;

  return (
    <TreatmentPlanDetailScreen
      planId={resolvedPlanId}
      backHref={`/patient/care/linked/${resolvedPatientId}/treatment-plans`}
      backLabel="Back to linked treatment plans"
      emptyHref={`/patient/care/linked/${resolvedPatientId}/treatment-plans`}
      emptyLabel="Back to linked treatment plans"
      bannerTitle="Read-only caregiver access"
      bannerDescription="You are viewing a linked patient treatment plan through caregiver access."
    />
  );
}
