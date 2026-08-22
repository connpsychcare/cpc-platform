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
import { useTreatmentPlans } from "@/hooks/use-healthcare";
import { formatDate } from "@workspace/shared/utils";

const STATUS_VARIANTS = {
  draft: "secondary",
  active: "success",
  completed: "primary",
  discontinued: "destructive",
} as const satisfies Record<string, AppUIVariant>;

function TreatmentPlansSkeleton() {
  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pt-6">
        <Skeleton className="h-10 w-48 rounded-full" />
        <Skeleton className="h-96 w-full rounded-[28px]" />
      </View>
    </PatientScreen>
  );
}

export default function PatientTreatmentPlansRoute() {
  const { data, isLoading } = useTreatmentPlans({ limit: 50 });

  if (isLoading) {
    return <TreatmentPlansSkeleton />;
  }

  const plans = data?.treatmentPlans ?? [];

  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pb-8 pt-6">
        <View className="gap-2">
          <Text className="font-primary text-3xl text-foreground">
            Treatment Plans
          </Text>
          <Text className="font-secondary text-sm leading-7 text-muted-foreground">
            Review your treatment plans and the programs your care team is
            working on with you.
          </Text>
        </View>

        <SectionCard
          title="All plans"
          description="Read-only treatment plans prepared by your care team."
          className="shadow-soft"
          contentClassName="gap-3"
        >
          {plans.length ? (
            plans.map((plan) => (
              <GradientCard key={plan.id} variant="primary">
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
                    href={`/patient/care/treatment-plans/${plan.id}`}
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
                <AppIcon name="ClipboardListIcon" size="md" variant="primary" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No treatment plans yet</EmptyTitle>
                <EmptyDescription>
                  Your care team will add a treatment plan after your
                  assessment is complete.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </SectionCard>
      </View>
    </PatientScreen>
  );
}
