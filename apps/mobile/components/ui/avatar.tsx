import { Image } from "expo-image";
import { Text, View } from "react-native";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function Avatar({
  className,
  ...props
}: ComponentProps<typeof View> & { className?: string }) {
  return (
    <View
      className={cn(
        "relative size-10 overflow-hidden rounded-full bg-muted",
        className,
      )}
      {...props}
    />
  );
}

export function AvatarImage({ style, ...props }: ComponentProps<typeof Image>) {
  return (
    <Image style={[{ width: "100%", height: "100%" }, style]} {...props} />
  );
}

export function AvatarFallback({
  className,
  ...props
}: ComponentProps<typeof Text> & { className?: string }) {
  return (
    <Text
      className={cn(
        "size-full text-center align-middle font-body-semibold text-sm text-foreground",
        className,
      )}
      {...props}
    />
  );
}
