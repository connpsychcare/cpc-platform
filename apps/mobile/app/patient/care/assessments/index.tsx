import { Text, View } from "react-native";

import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { PatientScreen } from "@/components/shared/patient-screen";
import { SectionCard } from "@/components/shared/section-card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyClinicalForms } from "@/hooks/use-healthcare";
import { formatDate } from "@workspace/shared/utils";

const FORM_LABELS: Record<string, string> = {
  phq9: "PHQ-9 Depression Screening",
  gad7: "GAD-7 Anxiety Screening",
  asrsAdult: "ASRS ADHD Screening",
  vanderbiltParent: "Vanderbilt Parent Assessment",
  vanderbiltTeacher: "Vanderbilt Teacher Assessment",
  adultPsychiatricIntake: "Adult Psychiatric Intake",
  adolescentPsychiatricIntake: "Adolescent Psychiatric Intake",
};

type BadgeVariant = "success" | "warning" | "destructive" | "secondary" | "outline";

function getSeverityVariant(interpretation?: string | null): BadgeVariant {
  if (!interpretation) return "outline";
  const lower = interpretation.toLowerCase();
  if (lower.includes("none") || lower.includes("minimal") || lower.includes("negative"))
    return "success";
  if (lower.includes("mild") || lower.includes("moderate")) return "warning";
  if (lower.includes("severe") || lower.includes("positive")) return "destructive";
  return "secondary";
}

function ScreeningsSkeleton() {
  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pt-6">
        <Skeleton className="h-10 w-56 rounded-full" />
        <Skeleton className="h-72 w-full rounded-[28px]" />
      </View>
    </PatientScreen>
  );
}

export default function PatientAssessmentsRoute() {
  const { data, isLoading } = useMyClinicalForms({ limit: 50, sortOrder: "desc" });

  if (isLoading) return <ScreeningsSkeleton />;

  const forms = data?.forms ?? [];

  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pb-8 pt-6">
        <View className="gap-2">
          <Text className="font-primary text-3xl text-foreground">
            Assessments & Forms
          </Text>
          <Text className="font-secondary text-sm leading-7 text-muted-foreground">
            Your completed screening questionnaires and intake forms.
          </Text>
        </View>

        <SectionCard title="Completed Screenings">
          {forms.length === 0 ? (
            <Empty>
              <EmptyMedia variant="icon">
                <AppIcon name="IconClipboardList" size="md" variant="primary" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No assessments yet</EmptyTitle>
                <EmptyDescription>
                  Your questionnaires and intake forms will appear here after
                  your onboarding.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <View>
              {forms.map((form, idx) => (
                <View key={form.id}>
                  {idx > 0 && <Separator />}
                  <View className="flex-row items-start justify-between gap-3 py-3">
                    <View className="flex-1 gap-1">
                      <Text className="font-secondary text-sm font-semibold text-foreground">
                        {FORM_LABELS[form.formType] ?? form.formType}
                      </Text>
                      <Text className="font-secondary text-xs text-muted-foreground">
                        {formatDate(form.completedAt, { mode: "date" })}
                        {form.isOnboarding ? " · Initial intake" : ""}
                      </Text>
                      {form.totalScore != null && (
                        <Text className="font-secondary text-xs text-muted-foreground">
                          Score: <Text className="font-semibold text-foreground">{form.totalScore}</Text>
                        </Text>
                      )}
                    </View>
                    {form.interpretation ? (
                      <Badge variant={getSeverityVariant(form.interpretation)} className="shrink-0 capitalize">
                        {form.interpretation}
                      </Badge>
                    ) : null}
                  </View>
                </View>
              ))}
            </View>
          )}
        </SectionCard>
      </View>
    </PatientScreen>
  );
}
