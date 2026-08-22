import type { Href } from "expo-router";
import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";

type PublicCtaSectionProps = {
  eyebrow: string;
  title: string;
  description?: string;
  primaryLabel: string;
  primaryHref: Href;
  secondaryLabel?: string;
  secondaryHref?: Href;
};

export function PublicCtaSection({
  eyebrow,
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: PublicCtaSectionProps) {
  return (
    <View className="section-wrapper mt-12">
      <View className="relative overflow-hidden rounded-4xl bg-dark-section px-6 py-10">
        <View className="absolute -right-12 top-1/2 size-40 -translate-y-1/2 rounded-full border border-dark-section-foreground/10" />
        <Text className="text-center font-secondary text-sm text-dark-section-foreground/60">
          [{eyebrow}]
        </Text>
        <Text className="mt-3 text-center font-primary text-3xl leading-tight tracking-tight text-dark-section-foreground">
          {title}
        </Text>
        {description ? (
          <Text className="mt-3 text-center font-secondary text-base leading-7 text-dark-section-foreground/70">
            {description}
          </Text>
        ) : null}

        <View className="mt-8 gap-3">
          <Button
            fullWidth
            href={primaryHref}
            variant="outline"
            className="border-dark-section-foreground/20 bg-dark-section-foreground/6"
            textClassName="text-dark-section-foreground"
          >
            {primaryLabel}
          </Button>
          {secondaryLabel && secondaryHref ? (
            <Button
              href={secondaryHref}
              variant="secondary"
              fullWidth
            >
              {secondaryLabel}
            </Button>
          ) : null}
        </View>
      </View>
    </View>
  );
}
