import { Text, View } from "react-native";

import { SectionHeader } from "@/components/shared/section-header";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { AppIconName } from "@/lib/icons";
import {
  publicCareersContent,
  publicInsuranceContent,
  publicReferralContent,
  publicResourcesPageContent,
  publicServicesPageContent,
} from "@workspace/shared/constants";

const primaryItems = [
  {
    title: "Check Insurance Coverage",
    description:
      "Our intake team helps verify benefits, explain authorization steps, and answer coverage questions before care begins.",
    href: "/insurance",
    label: "Review insurance",
    icon: "ShieldCheckIcon",
  },
  {
    title: "Refer a Patient",
    description: publicReferralContent.followUp,
    href: "/refer",
    label: "Start referral",
    icon: "IconClipboardHeart",
  },
  {
    title: "Use the Patient Portal",
    description: publicServicesPageContent.portalDescription,
    href: "/auth/sign-in",
    label: "Sign in",
    icon: "IconMessageCircle",
  },
] as const;

const secondaryItems = [
  {
    title: publicResourcesPageContent.pageTitle,
    description: "Guides for intake, mental health resources, service options, and more.",
    href: "/resources",
    icon: "GraduationCapIcon",
  },
  {
    title: "Join the Team",
    description: publicCareersContent.perks.slice(0, 2).join(" - "),
    href: "/careers",
    icon: "IconBriefcase",
  },
] as const;

function HomeSupportHub() {
  return (
    <View className="mt-12 bg-secondary py-12">
      <View className="section-wrapper gap-6">
        <SectionHeader
          title="Everything Families Need After the First Click"
          description={publicInsuranceContent.description}
        />

        <View className="gap-4">
          {primaryItems.map((item, index) => (
            <Card
              key={item.title}
              className={index === 0 ? "border-primary/20 bg-primary/5" : ""}
            >
              <CardContent className="gap-5 py-1">
                <View className="flex-row items-start justify-between gap-4">
                  <View className="size-12 items-center justify-center rounded-2xl bg-primary/10">
                    <AppIcon name={item.icon as AppIconName} />
                  </View>
                  <Text className="font-primary text-5xl leading-none text-primary/10">
                    0{index + 1}
                  </Text>
                </View>
                <View>
                  <Text className="font-primary text-2xl leading-tight text-foreground">
                    {item.title}
                  </Text>
                  <Text className="mt-3 font-secondary text-sm leading-7 text-muted-foreground">
                    {item.description}
                  </Text>
                </View>
                <Button href={item.href} variant="link" className="self-start">
                  {item.label}
                </Button>
              </CardContent>
            </Card>
          ))}
        </View>

        <View className="gap-3">
          {secondaryItems.map((item) => (
            <Button
              key={item.title}
              href={item.href}
              variant="ghost"
              className="min-h-0 items-stretch rounded-3xl border border-border bg-card p-4"
              contentClassName="w-full justify-start gap-4"
            >
              <View className="size-11 items-center justify-center rounded-2xl bg-secondary">
                <AppIcon name={item.icon as AppIconName} />
              </View>
              <View className="min-w-0 flex-1">
                <Text className="font-body-semibold text-sm text-foreground">
                  {item.title}
                </Text>
                <Text
                  numberOfLines={2}
                  className="mt-1 font-secondary text-xs leading-5 text-muted-foreground"
                >
                  {item.description}
                </Text>
              </View>
              <AppIcon name="ChevronRightIcon" size="sm" />
            </Button>
          ))}
        </View>
      </View>
    </View>
  );
}

export default HomeSupportHub;
