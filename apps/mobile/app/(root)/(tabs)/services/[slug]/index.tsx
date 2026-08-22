import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { publicServices, publicServicesPageContent } from "@workspace/shared/constants";
import { ArrowLeft } from "lucide-react-native";

import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const SERVICE_PHOTOS: Record<string, string> = {
  "psychiatric-evaluation":     "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&q=80",
  "medication-management":      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
  "telehealth-psychiatry":      "https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=800&q=80",
  "depression-treatment":       "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80",
  "anxiety-treatment":          "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&q=80",
  "adhd-treatment":             "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
  "child-adolescent-psychiatry":"https://images.unsplash.com/photo-1596542519315-6db93bdf7548?w=800&q=80",
  "bipolar-disorder-treatment": "https://images.unsplash.com/photo-1532094349884-543559c6c0a3?w=800&q=80",
  "trauma-ptsd-treatment":      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
  default:                      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
};

export default function ServiceDetailRoute() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const service = publicServices.find((s) => s.slug === slug);

  if (!service) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background">
        <Text className="font-primary text-xl text-foreground">Service not found</Text>
        <Button href="/services" variant="outline" className="mt-4">
          Browse Services
        </Button>
      </SafeAreaView>
    );
  }

  const photo = SERVICE_PHOTOS[service.slug] ?? SERVICE_PHOTOS.default;

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Photo */}
        <View className="relative h-64 bg-muted">
          <Image
            source={{ uri: photo }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
            contentPosition="top center"
          />
          <View className="absolute inset-0 bg-black/30" />
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute left-4 top-4 size-10 items-center justify-center rounded-full bg-black/30"
          >
            <ArrowLeft size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View className="section-wrapper gap-6 py-6">
          {/* Icon + title + subtitle */}
          <View className="flex-row items-start gap-4">
            <AppIcon name={service.icon} mode="wrap" size="lg" variant="primary" />
            <View className="flex-1">
              <Text className="font-primary text-2xl leading-tight text-foreground">
                {service.title}
              </Text>
              <Text className="mt-1 font-body-semibold text-sm text-primary">
                {service.subtitle}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text className="font-secondary text-base leading-7 text-muted-foreground">
            {service.description}
          </Text>

          {/* Highlights */}
          <View className="gap-3">
            <Text className="font-body-semibold text-xs uppercase tracking-widest text-foreground">
              {"What's Included"}
            </Text>
            {service.highlights.map((item) => (
              <View key={item} className="flex-row items-start gap-3">
                <AppIcon name="CheckIcon" size="sm" variant="primary" />
                <Text className="flex-1 font-secondary text-sm leading-6 text-muted-foreground">
                  {item}
                </Text>
              </View>
            ))}
          </View>

          {/* Best For */}
          <Card className="border-border bg-secondary shadow-none">
            <CardContent className="gap-1 py-1">
              <Text className="font-body-semibold text-xs uppercase tracking-widest text-muted-foreground">
                Best For
              </Text>
              <Text className="font-secondary text-sm leading-7 text-muted-foreground">
                {service.who}
              </Text>
            </CardContent>
          </Card>

          {/* CTAs */}
          <View className="gap-3">
            <Button href="/contact" fullWidth>
              {publicServicesPageContent.inquireLabel}
            </Button>
            <Button href="/auth/[type]?type=sign-up" variant="outline" fullWidth>
              Create an Account
            </Button>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
