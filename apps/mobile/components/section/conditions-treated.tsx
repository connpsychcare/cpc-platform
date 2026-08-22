import { Text, View } from "react-native";
import { publicConditions } from "@workspace/shared/constants";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ConditionsTreated() {
  return (
    <View className="section-wrapper mt-12 gap-6">
      {/* Heading block */}
      <View className="gap-3">
        <Text className="font-body-semibold text-xs uppercase tracking-widest text-primary">
          Mental Health Conditions
        </Text>
        <Text className="font-primary text-4xl leading-tight text-foreground">
          What We Treat
        </Text>
        <Text className="font-secondary text-base leading-7 text-muted-foreground">
          Our board-certified psychiatric providers treat a broad range of
          mental health conditions for adults and adolescents entirely
          via secure telehealth across California.
        </Text>
      </View>

      {/* Condition card grid - 2 columns */}
      <View className="flex-row flex-wrap gap-3">
        {publicConditions.map(({ label, icon }) => (
          <View key={label} style={{ width: "47.5%" }}>
            <Button
              href="/services"
              variant="ghost"
              className="min-h-0 items-stretch rounded-2xl border border-border bg-card px-4 py-4"
              contentClassName="flex-col items-center gap-3 w-full"
            >
              <AppIcon
                name={icon}
                size="md"
                mode="wrap"
                appearance="soft"
                variant="primary"
              />
              <Text className="text-center font-body-medium text-sm leading-snug text-foreground">
                {label}
              </Text>
            </Button>
          </View>
        ))}
      </View>

      {/* Evidence-based care callout */}
      <Card className="bg-secondary shadow-soft">
        <CardContent className="flex-row gap-3 py-2">
          <AppIcon name="BrainIcon" size="md" mode="wrap" appearance="soft" variant="primary" />
          <View className="flex-1">
            <Text className="font-body-semibold text-sm text-foreground">
              Evidence-Based Care
            </Text>
            <Text className="mt-1 font-secondary text-xs leading-5 text-muted-foreground">
              We use validated clinical tools - PHQ-9, GAD-7, ASRS, Vanderbilt
              - to assess and monitor every patient.
            </Text>
          </View>
        </CardContent>
      </Card>

      {/* CTAs */}
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Button href="/services" fullWidth>
            View All Services
          </Button>
        </View>
        <View className="flex-1">
          <Button href="/contact" variant="outline" fullWidth>
            Ask About Your Condition
          </Button>
        </View>
      </View>
    </View>
  );
}
