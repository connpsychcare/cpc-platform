import type { ReactNode } from "react";
import { View } from "react-native";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type SectionCardProps = {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export function SectionCard({
  title,
  description,
  action,
  footer,
  children,
  className,
  headerClassName,
  contentClassName,
  footerClassName,
  titleClassName,
  descriptionClassName,
}: SectionCardProps) {
  const hasHeader = title || description || action;

  // If title is a plain string/number render it in CardTitle (Text).
  // Otherwise render the ReactNode directly to avoid nesting View inside Text.
  const titleNode =
    title !== undefined && title !== null ? (
      typeof title === "string" || typeof title === "number" ? (
        <CardTitle className={titleClassName}>{title}</CardTitle>
      ) : (
        <View className="min-w-0 flex-1">{title}</View>
      )
    ) : null;

  return (
    <Card className={cn("gap-6", className)}>
      {hasHeader ? (
        <CardHeader className={cn("gap-3", headerClassName)}>
          <View className="flex-row flex-wrap items-start justify-between gap-2">
            {titleNode}
            {action ? <CardAction className="max-w-full shrink-0 self-start">{action}</CardAction> : null}
          </View>
          {description ? (
            <CardDescription className={descriptionClassName}>
              {description}
            </CardDescription>
          ) : null}
        </CardHeader>
      ) : null}
      <CardContent className={contentClassName}>{children}</CardContent>
      {footer ? (
        <CardFooter className={footerClassName}>{footer}</CardFooter>
      ) : null}
    </Card>
  );
}
