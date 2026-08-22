import type { Href } from "expo-router";
import { usePathname } from "expo-router";
import { Text, View } from "react-native";

import { MobileFooter } from "@/components/shared/mobile-footer";
import { PatientScreen } from "@/components/shared/patient-screen";
import { PublicHeader } from "@/components/shared/public-header";
import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Screen } from "@/components/ui/screen";

type PlaceholderScreenProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryHref?: Href | string;
  primaryLabel?: string;
  secondaryHref?: Href | string;
  secondaryLabel?: string;
};

export function PlaceholderScreen({
  eyebrow,
  title,
  description,
  primaryHref = "/",
  primaryLabel = "Back to Home",
  secondaryHref = "/contact",
  secondaryLabel = "Contact Us",
}: PlaceholderScreenProps) {
  const pathname = usePathname();
  const isPatientRoute = pathname?.startsWith("/patient") ?? false;

  const content = (
    <View className="section-wrapper pt-6">
      <View className="rounded-4xl border border-border bg-card px-6 py-8 shadow-soft">
        <Badge variant="secondary" appearance="solid">
          {eyebrow}
        </Badge>
        <Text className="mt-4 font-primary text-[30px] leading-9 text-foreground">
          {title}
        </Text>
        <Text className="mt-4 font-secondary text-base leading-7 text-muted-foreground">
          {description}
        </Text>

        <Card className="mt-6 bg-surface-elevated">
          <CardContent className="gap-4 py-1">
            <View className="flex-row items-center gap-3">
              <View className="flex-center size-11 rounded-2xl bg-primary/10">
                <AppIcon name="SparklesIcon" />
              </View>
              <Text className="flex-1 font-secondary text-sm leading-6 text-muted-foreground">
                This screen shell is now in place so header navigation and
                bottom tabs stay clean while we port the real web experience
                section by section.
              </Text>
            </View>
          </CardContent>
        </Card>

        <View className="mt-6 gap-3">
          <Button href={primaryHref} fullWidth>
            {primaryLabel}
          </Button>
          <Button href={secondaryHref} variant="outline" fullWidth>
            {secondaryLabel}
          </Button>
        </View>
      </View>
    </View>
  );

  if (isPatientRoute) {
    return <PatientScreen>{content}</PatientScreen>;
  }

  return (
    <Screen stickyHeader={<PublicHeader />}>
      {content}
      <MobileFooter />
    </Screen>
  );
}
