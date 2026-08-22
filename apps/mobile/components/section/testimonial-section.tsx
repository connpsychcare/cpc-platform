import { Text, View } from "react-native";
import { publicTestimonialsContent } from "@workspace/shared/constants";

import { usePublicTestimonials } from "@/hooks/use-public-content";
import { SectionHeader } from "@/components/shared/section-header";
import { AppIcon } from "@/components/ui/app-icon";
import { Carousel } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

function TestimonialsSection() {
  const { data } = usePublicTestimonials();
  const items =
    data?.map((item) => ({
      name: item.authorName,
      role: item.authorRole,
      text: item.content,
      rating: item.rating,
    })) ?? [];

  if (!items.length) {
    return null;
  }

  return (
    <View className="mt-12 section-wrapper">
      <SectionHeader
        eyebrow={publicTestimonialsContent.eyebrow}
        title={publicTestimonialsContent.title}
        description={publicTestimonialsContent.description}
        centered
      />

      <Carousel
        className="mt-6"
        data={items}
        keyExtractor={(item) => item.name}
        renderItem={(item) => (
          <Card className="bg-surface-elevated shadow-soft">
            <CardContent className="py-1">
              <View className="flex-row items-center gap-3">
                <View className="size-11 items-center justify-center rounded-full bg-secondary">
                  <Text className="font-body-semibold text-sm text-foreground">
                    {item.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="font-body-semibold text-sm text-foreground">
                    {item.name}
                  </Text>
                  {item.role ? (
                    <Text className="font-secondary text-xs text-muted-foreground">
                      {item.role}
                    </Text>
                  ) : null}
                </View>
              </View>

              <View className="mt-4 flex-row gap-1">
                {Array.from({ length: item.rating }).map((_, index) => (
                  <AppIcon
                    key={index}
                    name="StarIcon"
                    size="sm"
                    variant="warning"
                  />
                ))}
              </View>

              <Text className="mt-4 font-secondary text-sm leading-7 text-muted-foreground">
                {item.text}
              </Text>
            </CardContent>
          </Card>
        )}
      />
    </View>
  );
}

export default TestimonialsSection;
