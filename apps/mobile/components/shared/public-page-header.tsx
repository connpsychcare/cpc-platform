import type { ReactNode } from "react";
import { Text, View } from "react-native";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import GradientWrapper from "./bg-pattern";

type PublicPageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  actions?: ReactNode;
  className?: string;
};

export function PublicPageHeader({
  eyebrow,
  title,
  description,
  align = "left",
  actions,
  className,
}: PublicPageHeaderProps) {
  const isCenter = align === "center";

  return (
    <View className={cn("relative section-wrapper", className)}>
      <GradientWrapper minHeight={320}>
        <View
          className={cn(
            "relative gap-5",
            isCenter ? "items-center text-center" : "items-start",
          )}
        >
          <Badge
            variant="secondary"
            appearance="solid"
            className={cn(
              "border-white/25 bg-white/12 px-4 py-2 text-white",
              isCenter && "self-center",
            )}
          >
            {eyebrow}
          </Badge>
          <Text
            className={cn(
              "font-primary text-4xl leading-tight tracking-tight text-white",
              isCenter && "text-center",
            )}
          >
            {title}
          </Text>
          <Text
            className={cn(
              "font-secondary text-base leading-7 text-white/75",
              isCenter && "text-center",
            )}
          >
            {description}
          </Text>
          {actions ? (
            <View
              className={cn(
                "flex-row w-full gap-3 pt-2",
                isCenter && "items-center justify-center",
              )}
            >
              {actions}
            </View>
          ) : null}
        </View>
      </GradientWrapper>
    </View>
  );
}
