import { Text, View } from "react-native";

import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import { PatientScreen } from "@/components/shared/patient-screen";
import { SectionCard } from "@/components/shared/section-card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyOnboardingStatus } from "@/hooks/use-healthcare";
import { formatDate } from "@workspace/shared/utils";

const STEP_LABELS: Record<string, string> = {
  personalInfo: "Personal Information",
  insurance: "Insurance Details",
  intakeForm: "Psychiatric Intake Form",
  screeningForms: "Screening Questionnaires",
  consent: "Consent & Signature",
};

function OnboardingSkeleton() {
  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pt-6">
        <Skeleton className="h-10 w-40 rounded-full" />
        <Skeleton className="h-48 w-full rounded-[28px]" />
        <Skeleton className="h-80 w-full rounded-[28px]" />
      </View>
    </PatientScreen>
  );
}

export default function PatientOnboardingRoute() {
  const { data, isLoading } = useMyOnboardingStatus();

  if (isLoading) return <OnboardingSkeleton />;

  const isComplete = Boolean(data?.completedAt);
  const steps = data?.steps;

  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pb-8 pt-6">
        <View className="gap-2">
          <Text className="font-primary text-3xl text-foreground">My Intake</Text>
          <Text className="font-secondary text-sm leading-7 text-muted-foreground">
            Your onboarding intake status and steps completed with Connected
            Psychiatric Care.
          </Text>
        </View>

        {/* Status card */}
        <SectionCard title="Onboarding Status">
          <View className="flex-row items-center gap-3 py-2">
            <AppIcon
              name={isComplete ? "CheckCircleIcon" : "Clock3Icon"}
              size="md"
              variant={isComplete ? "success" : "warning"}
            />
            <View className="flex-1">
              <Text className="font-secondary text-sm font-semibold text-foreground">
                {isComplete ? "Intake Complete" : "Intake In Progress"}
              </Text>
              {isComplete && data?.completedAt ? (
                <Text className="font-secondary text-xs text-muted-foreground">
                  Completed {formatDate(data.completedAt, { mode: "date" })}
                </Text>
              ) : (
                <Text className="font-secondary text-xs text-muted-foreground">
                  Complete your intake to unlock full care access.
                </Text>
              )}
            </View>
            <Badge variant={isComplete ? "success" : "warning"}>
              {isComplete ? "Done" : "Pending"}
            </Badge>
          </View>
        </SectionCard>

        {/* Step checklist */}
        {steps && (
          <SectionCard title="Intake Steps">
            <View>
              {Object.entries(STEP_LABELS).map(([key, label], idx) => {
                const done = Boolean(steps[key as keyof typeof steps]);
                return (
                  <View key={key}>
                    {idx > 0 && <Separator />}
                    <View className="flex-row items-center gap-3 py-3">
                      <AppIcon
                        name={done ? "CheckCircleIcon" : "Clock3Icon"}
                        size="sm"
                        variant={done ? "success" : "muted"}
                      />
                      <Text
                        className={`flex-1 font-secondary text-sm ${
                          done ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {label}
                      </Text>
                      {done && (
                        <Badge variant="success" className="shrink-0">
                          Done
                        </Badge>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </SectionCard>
        )}

        {!isComplete && (
          <SectionCard>
            <View className="py-1">
              <Text className="font-secondary text-sm text-muted-foreground text-center">
                To complete your intake, please contact your care team or visit
                the patient portal on a desktop browser.
              </Text>
            </View>
          </SectionCard>
        )}
      </View>
    </PatientScreen>
  );
}
