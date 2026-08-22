import { Image } from "expo-image";
import { Text, View } from "react-native";

import { SectionHeader } from "@/components/shared/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  publicAboutContent,
  publicAboutPageContent,
  publicHomeAboutStats,
} from "@workspace/shared/constants";

const THERAPY_PHOTO =
  "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=900&q=80";

function HomeAboutPreview() {
  const careSteps = publicAboutContent.careProcess.slice(0, 3);

  return (
    <View className="section-wrapper mt-12 gap-6">
      <View className="self-start">
        <Badge variant="secondary" appearance="soft">
          {publicAboutPageContent.missionBadge}
        </Badge>
      </View>

      <SectionHeader
        title={publicAboutContent.businessTitle}
        description={publicAboutContent.intro}
      />

      {/* Care process steps */}
      <View className="gap-3">
        {careSteps.map((step, index) => (
          <Card key={step.key} className="bg-surface-elevated shadow-soft">
            <CardContent className="flex-row gap-4 py-1">
              <View className="size-10 items-center justify-center rounded-full bg-primary/10">
                <Text className="font-body-semibold text-sm text-primary">
                  {index + 1}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="font-body-semibold text-sm text-foreground">
                  {step.title}
                </Text>
                <Text className="mt-1 font-secondary text-sm leading-6 text-muted-foreground">
                  {step.description}
                </Text>
              </View>
            </CardContent>
          </Card>
        ))}
      </View>

      {/* CTAs */}
      <View className="flex-row gap-3">
        <View className="flex-1">
          <Button href="/about" fullWidth>
            Learn About Us
          </Button>
        </View>
        <View className="flex-1">
          <Button href="/providers" variant="outline" fullWidth>
            Meet Our Team
          </Button>
        </View>
      </View>

      {/* Therapy photo */}
      <Card className="overflow-hidden bg-card p-0 shadow-soft">
        <View className="h-80 bg-muted">
          <Image
            source={{ uri: THERAPY_PHOTO }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            contentPosition="top center"
          />
        </View>
      </Card>

      {/* Stats / mission dark card */}
      <View className="rounded-[28px] bg-dark-section p-6 shadow-soft">
        <Text className="font-body-semibold text-xs uppercase tracking-[2px] text-white/55">
          {publicAboutPageContent.ownerBadge}
        </Text>

        <View className="mt-5 gap-3">
          {publicHomeAboutStats.map((stat) => (
            <View
              key={stat.label}
              className="flex-row items-baseline gap-3 border-b border-white/10 pb-3 last:border-0"
            >
              <Text className="font-primary text-3xl text-white">
                {stat.value}
              </Text>
              <Text className="font-secondary text-sm text-white/60">
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        <Text className="mt-5 font-secondary text-sm leading-7 text-white/70">
          {publicAboutContent.mission}
        </Text>

        <Button href="/about" variant="secondary" className="mt-6">
          Read Our Story
        </Button>
      </View>
    </View>
  );
}

export default HomeAboutPreview;
