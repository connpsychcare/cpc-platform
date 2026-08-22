import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { GradientCard } from "@/components/shared/gradient-card";
import { PatientScreen } from "@/components/shared/patient-screen";
import { SectionCard } from "@/components/shared/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useMyCaregiverPatients,
  useTreatmentPlans,
} from "@/hooks/use-healthcare";
import { formatDate } from "@workspace/shared/utils";

const STATUS_VARIANTS = {
  draft: "secondary",
  active: "success",
  completed: "primary",
  discontinued: "destructive",
} as const satisfies Record<string, AppUIVariant>;

function LinkedTreatmentPlansSkeleton() {
  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pt-6">
        <Skeleton className="h-10 w-52 rounded-full" />
        <Skeleton className="h-24 w-full rounded-[28px]" />
        <Skeleton className="h-96 w-full rounded-[28px]" />
      </View>
    </PatientScreen>
  );
}

export default function LinkedPatientTreatmentPlansRoute() {
  const { patientId } = useLocalSearchParams<{ patientId?: string | string[] }>();
  const resolvedPatientId = Array.isArray(patientId) ? patientId[0] : patientId;
  const { data: caregiverData, isLoading: isCaregiverLoading } =
    useMyCaregiverPatients();
  const { data, isLoading } = useTreatmentPlans({
    patientId: resolvedPatientId,
    limit: 50,
  });

  if (isLoading || isCaregiverLoading) {
    return <LinkedTreatmentPlansSkeleton />;
  }

  const linkedPatient = caregiverData?.caregiverAccesses?.find(
    (access) => access.patientId === resolvedPatientId && access.isActive,
  );
  const patientName = linkedPatient?.patient?.user.displayName;
  const plans = data?.treatmentPlans ?? [];

  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pb-8 pt-6">
        <Button href="/patient" variant="ghost" size="sm">
          <AppIcon name="ArrowLeftIcon" size="sm" variant="primary" /> Back to
          overview
        </Button>

        <SectionCard
          title="Read-only caregiver access"
          description={`You are viewing treatment plans for ${patientName}.`}
          className="shadow-soft bg-info/10"
          contentClassName="gap-2"
        >
          <Text className="font-secondary text-sm leading-6 text-muted-foreground">
            This area is read-only and reflects the patient’s clinical records
            as shared with you by the care team.
          </Text>
          <Button
            href={`/patient/care/linked/${resolvedPatientId}/session-notes`}
            variant="secondary"
            fullWidth
          >
            Open session notes for {patientName}
          </Button>
        </SectionCard>

        <SectionCard
          title={`${patientName} treatment plans`}
          description="Current plans shared with you through caregiver access."
          className="shadow-soft"
          contentClassName="gap-3"
        >
          {plans.length ? (
            plans.map((plan) => (
              <GradientCard key={plan.id} variant="info">
                <View className="gap-3">
                  <View className="flex-row items-start justify-between gap-3">
                    <View className="flex-1 gap-1">
                      <Text className="font-body-semibold text-base text-foreground">
                        {plan.title}
                      </Text>
                      {plan.description ? (
                        <Text className="font-secondary text-sm leading-6 text-muted-foreground">
                          {plan.description}
                        </Text>
                      ) : null}
                    </View>
                    <Badge
                      variant={STATUS_VARIANTS[plan.status] ?? "secondary"}
                    >
                      {plan.status}
                    </Badge>
                  </View>

                  <View className="gap-1">
                    {plan.startDate ? (
                      <Text className="font-secondary text-xs text-muted-foreground">
                        Started {formatDate(plan.startDate, { mode: "date" })}
                      </Text>
                    ) : null}
                    {plan.endDate ? (
                      <Text className="font-secondary text-xs text-muted-foreground">
                        Ends {formatDate(plan.endDate, { mode: "date" })}
                      </Text>
                    ) : null}
                  </View>

                  <Button
                    href={`/patient/care/linked/${resolvedPatientId}/treatment-plans/${plan.id}`}
                    variant="secondary"
                    fullWidth
                  >
                    Open treatment plan
                  </Button>
                </View>
              </GradientCard>
            ))
          ) : (
            <Empty>
              <EmptyMedia variant="icon">
                <AppIcon name="UsersIcon" size="md" variant="info" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No treatment plans shared yet</EmptyTitle>
                <EmptyDescription>
                  Treatment plans for {patientName} will appear here when they
                  are available to view.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </SectionCard>
      </View>
    </PatientScreen>
  );
}
