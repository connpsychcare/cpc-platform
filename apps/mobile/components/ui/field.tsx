import { Text, View } from "react-native";
import type { ComponentProps, ReactNode } from "react";

import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export function FieldSet({
  className,
  ...props
}: ComponentProps<typeof View> & { className?: string }) {
  return <View className={cn("gap-6", className)} {...props} />;
}

export function FieldLegend({
  className,
  variant = "legend",
  ...props
}: ComponentProps<typeof Text> & {
  className?: string;
  variant?: "legend" | "label";
}) {
  return (
    <Text
      className={cn(
        "font-body-semibold text-foreground",
        variant === "legend" ? "mb-3 text-base" : "mb-2 text-sm",
        className,
      )}
      {...props}
    />
  );
}

export function FieldGroup({
  className,
  ...props
}: ComponentProps<typeof View> & { className?: string }) {
  return <View className={cn("w-full gap-5", className)} {...props} />;
}

export function Field({
  className,
  orientation = "vertical",
  ...props
}: ComponentProps<typeof View> & {
  className?: string;
  orientation?: "vertical" | "horizontal" | "responsive";
}) {
  return (
    <View
      className={cn(
        "w-full gap-3",
        orientation === "horizontal" && "flex-row items-center",
        className,
      )}
      {...props}
    />
  );
}

export function FieldContent({
  className,
  ...props
}: ComponentProps<typeof View> & { className?: string }) {
  return <View className={cn("flex-1 gap-1.5", className)} {...props} />;
}

export function FieldLabel(props: ComponentProps<typeof Label>) {
  return <Label {...props} />;
}

export function FieldTitle({
  className,
  ...props
}: ComponentProps<typeof Text> & { className?: string }) {
  return (
    <Text
      className={cn("font-body-semibold text-sm text-foreground", className)}
      {...props}
    />
  );
}

export function FieldDescription({
  className,
  ...props
}: ComponentProps<typeof Text> & { className?: string }) {
  return (
    <Text
      className={cn(
        "font-secondary text-sm leading-5 text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function FieldSeparator({
  children,
  className,
  ...props
}: ComponentProps<typeof View> & { className?: string; children?: ReactNode }) {
  return (
    <View
      className={cn("my-1 flex-row items-center gap-3", className)}
      {...props}
    >
      <Separator className="flex-1" />
      {children ? (
        <Text className="font-secondary text-xs text-muted-foreground">
          {children}
        </Text>
      ) : null}
      <Separator className="flex-1" />
    </View>
  );
}

export function FieldError({
  className,
  children,
  errors,
  ...props
}: ComponentProps<typeof Text> & {
  className?: string;
  errors?: ({ message?: string } | undefined)[];
}) {
  const content =
    children ??
    (errors?.length
      ? [...new Map(errors.map((error) => [error?.message, error])).values()]
          .map((error) => error?.message)
          .filter(Boolean)
          .join("\n")
      : null);

  if (!content) {
    return null;
  }

  return (
    <Text
      className={cn(
        "font-secondary text-sm leading-5 text-destructive",
        className,
      )}
      {...props}
    >
      {content}
    </Text>
  );
}
