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
import { BehaviorProgramProgressCard } from "@/components/shared/behavior-program-progress-card";
import { PatientScreen } from "@/components/shared/patient-screen";
import { SectionCard } from "@/components/shared/section-card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useBehaviorPrograms, useTreatmentPlan } from "@/hooks/use-healthcare";
import { formatDate } from "@workspace/shared/utils";

const PLAN_STATUS_VARIANTS = {
  draft: "secondary",
  active: "success",
  completed: "primary",
  discontinued: "destructive",
} as const satisfies Record<string, AppUIVariant>;

const PROGRAM_STATUS_VARIANTS = {
  active: "success",
  mastered: "primary",
  onHold: "warning",
  discontinued: "destructive",
} as const satisfies Record<string, AppUIVariant>;

const PROGRAM_TYPE_LABELS: Record<string, string> = {
  skillAcquisition: "Skill Acquisition",
  behaviorReduction: "Behavior Reduction",
};

type TreatmentPlanDetailScreenProps = {
  planId?: string;
  backHref: string;
  backLabel: string;
  emptyHref: string;
  emptyLabel: string;
  bannerTitle?: string;
  bannerDescription?: string;
};

function TreatmentPlanDetailSkeleton() {
  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pt-6">
        <Skeleton className="h-10 w-44 rounded-full" />
        <Skeleton className="h-72 w-full rounded-[28px]" />
        <Skeleton className="h-96 w-full rounded-[28px]" />
      </View>
    </PatientScreen>
  );
}

export function TreatmentPlanDetailScreen({
  planId,
  backHref,
  backLabel,
  emptyHref,
  emptyLabel,
  bannerTitle,
  bannerDescription,
}: TreatmentPlanDetailScreenProps) {
  const { data: plan, isLoading: isPlanLoading } = useTreatmentPlan(planId);
  const { data: programData, isLoading: isProgramsLoading } = useBehaviorPrograms({
    treatmentPlanId: planId,
    limit: 50,
  });

  if (isPlanLoading) {
    return <TreatmentPlanDetailSkeleton />;
  }

  if (!plan) {
    return (
      <PatientScreen>
        <View className="section-wrapper pt-6">
          <Empty>
            <EmptyMedia variant="icon">
              <AppIcon name="ClipboardListIcon" size="md" variant="primary" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>Treatment plan not found</EmptyTitle>
              <EmptyDescription>
                We could not find the treatment plan you were looking for.
              </EmptyDescription>
            </EmptyHeader>
            <Button href={emptyHref} variant="outline" fullWidth>
              {emptyLabel}
            </Button>
          </Empty>
        </View>
      </PatientScreen>
    );
  }

  const programs = programData?.programs ?? [];

  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pb-8 pt-6">
        <Button href={backHref} variant="ghost" size="sm">
          <AppIcon name="ArrowLeftIcon" size="sm" variant="primary" /> {backLabel}
        </Button>

        {bannerTitle && bannerDescription ? (
          <SectionCard
            title={bannerTitle}
            description={bannerDescription}
            className="shadow-soft bg-info/10"
            contentClassName="gap-2"
          >
            <Text className="font-secondary text-sm leading-6 text-muted-foreground">
              Clinical details remain read-only and reflect the information
              shared by the patient care team.
            </Text>
          </SectionCard>
        ) : null}

        <SectionCard
          title={plan.title}
          description={
            plan.description ??
            "Your care team uses this plan to guide session goals and care programs."
          }
          action={
            <Badge variant={PLAN_STATUS_VARIANTS[plan.status] ?? "secondary"}>
              {plan.status}
            </Badge>
          }
          className="shadow-soft bg-primary/10"
          contentClassName="gap-4"
        >
          <View className="gap-4">
            <View className="gap-1">
              <Text className="font-secondary text-xs uppercase tracking-[1.5px] text-muted-foreground">
                Status
              </Text>
              <Badge variant={PLAN_STATUS_VARIANTS[plan.status] ?? "secondary"}>
                {plan.status}
              </Badge>
            </View>

            <View className="gap-1">
              <Text className="font-secondary text-xs uppercase tracking-[1.5px] text-muted-foreground">
                Start Date
              </Text>
              <Text className="font-body-semibold text-base text-foreground">
                {plan.startDate
                  ? formatDate(plan.startDate, { mode: "date" })
                  : "Not set"}
              </Text>
            </View>

            <View className="gap-1">
              <Text className="font-secondary text-xs uppercase tracking-[1.5px] text-muted-foreground">
                End Date
              </Text>
              <Text className="font-body-semibold text-base text-foreground">
                {plan.endDate
                  ? formatDate(plan.endDate, { mode: "date" })
                  : "Not set"}
              </Text>
            </View>

            {plan.goals ? (
              <>
                <Separator />
                <View className="gap-1">
                  <Text className="font-secondary text-xs uppercase tracking-[1.5px] text-muted-foreground">
                    Goals
                  </Text>
                  <Text className="font-secondary text-sm leading-6 text-muted-foreground">
                    {plan.goals}
                  </Text>
                </View>
              </>
            ) : null}
          </View>
        </SectionCard>

        <SectionCard
          title="Care Programs"
          description="Programs connected to this treatment plan."
          className="shadow-soft"
          contentClassName="gap-3"
        >
          {isProgramsLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-28 w-full rounded-2xl" />
            ))
          ) : programs.length ? (
            programs.map((program) => (
              <View
                key={program.id}
                className="gap-3 rounded-[24px] border border-border bg-background px-4 py-4"
              >
                <View className="gap-2">
                  <Text className="font-body-semibold text-base text-foreground">
                    {program.name}
                  </Text>
                  <View className="flex-row flex-wrap items-center gap-2">
                    <Badge
                      variant={
                        PROGRAM_STATUS_VARIANTS[program.status] ?? "secondary"
                      }
                    >
                      {program.status}
                    </Badge>
                    <Badge variant="outline">
                      {PROGRAM_TYPE_LABELS[program.type] ?? program.type}
                    </Badge>
                  </View>
                </View>

                {program.description ? (
                  <Text className="font-secondary text-sm leading-6 text-muted-foreground">
                    {program.description}
                  </Text>
                ) : null}

                {program.masteryDefinition ? (
                  <View className="gap-1">
                    <Text className="font-secondary text-xs uppercase tracking-[1.5px] text-muted-foreground">
                      Mastery definition
                    </Text>
                    <Text className="font-secondary text-sm leading-6 text-muted-foreground">
                      {program.masteryDefinition}
                    </Text>
                  </View>
                ) : null}

                {program.baselineData ? (
                  <View className="gap-1">
                    <Text className="font-secondary text-xs uppercase tracking-[1.5px] text-muted-foreground">
                      Baseline
                    </Text>
                    <Text className="font-secondary text-sm leading-6 text-muted-foreground">
                      {program.baselineData}
                    </Text>
                  </View>
                ) : null}

                <BehaviorProgramProgressCard
                  programId={program.id}
                  programName={program.name}
                  programStatus={program.status}
                  masteryDefinition={program.masteryDefinition}
                  baselineData={program.baselineData}
                />
              </View>
            ))
          ) : (
            <Empty>
              <EmptyMedia variant="icon">
                <AppIcon name="BrainIcon" size="md" variant="primary" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No care programs yet</EmptyTitle>
                <EmptyDescription>
                  Programs connected to this plan will appear here once they are
                  created by your care team.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </SectionCard>
      </View>
    </PatientScreen>
  );
}
