import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { GradientCard } from "@/components/shared/gradient-card";
import { InternalScreen } from "@/components/internal/internal-screen";

const CLINICAL_LINKS = [
  {
    label: "Treatment Plans",
    description: "View and manage active treatment plans.",
    icon: "IconClipboardList" as const,
    href: "/patients" as const,
  },
  {
    label: "Session Notes",
    description: "Review and submit session documentation.",
    icon: "IconNotes" as const,
    href: "/patients" as const,
  },
  {
    label: "Authorizations",
    description: "Track insurance authorization status.",
    icon: "ShieldCheckIcon" as const,
    href: "/patients" as const,
  },
  {
    label: "Caregivers",
    description: "View caregiver access for your caseload.",
    icon: "IconUsers" as const,
    href: "/patients" as const,
  },
];

export default function StaffClinicalRoute() {
  const insets = useSafeAreaInsets();

  return (
    <InternalScreen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="section-wrapper gap-6 pt-6">
          <View className="gap-2">
            <Text className="font-primary text-3xl text-foreground">Clinical Records</Text>
            <Text className="font-secondary text-sm leading-7 text-muted-foreground">
              Access treatment plans, session notes, authorizations, and caregiver records. Navigate to a patient to view their clinical detail.
            </Text>
          </View>

          <View className="gap-3">
            {CLINICAL_LINKS.map((link) => (
              <GradientCard key={link.label} variant="info">
                <View className="flex-row items-center gap-4">
                  <View className="flex-center size-11 rounded-2xl bg-primary/10">
                    <AppIcon name={link.icon} size="sm" variant="primary" />
                  </View>
                  <View className="flex-1 gap-0.5">
                    <Text className="font-body-semibold text-base text-foreground">{link.label}</Text>
                    <Text className="font-secondary text-xs leading-5 text-muted-foreground">{link.description}</Text>
                  </View>
                  <Button
                    href={"/staff/patients" as any}
                    variant="secondary"
                    size="sm"
                  >
                    Open
                  </Button>
                </View>
              </GradientCard>
            ))}
          </View>

          <View className="rounded-2xl border border-border bg-muted/30 p-4">
            <View className="flex-row items-start gap-3">
              <AppIcon name="ShieldAlertIcon" size="sm" variant="primary" />
              <Text className="flex-1 font-secondary text-xs leading-5 text-muted-foreground">
                Clinical records are accessed per patient. Go to Patients, select a patient, then navigate to their clinical tabs for treatment plans, session notes, and more.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </InternalScreen>
  );
}
