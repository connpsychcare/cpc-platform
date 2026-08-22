import { Link, type Href } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";
import {
  Children,
  Fragment,
  isValidElement,
  type ComponentProps,
  type ReactElement,
  type ReactNode,
} from "react";

import { useAppThemeColors } from "@/lib/theme";
import { cn } from "@/lib/utils";

export type ButtonVariants = {
  variant?: AppUIVariant | "outline" | "ghost" | "link" | "gradient";
  appearance?: Extract<AppUIAppearance, "solid" | "soft">;
  size?: "default" | "sm" | "lg" | "icon";
};

export type ButtonProps = ComponentProps<typeof Pressable> &
  ButtonVariants & {
    asChild?: boolean;
    label?: string;
    pulseDelay?: number;
    fullWidth?: boolean;
    textClassName?: string;
    contentClassName?: string;
    children?: ReactNode;
    href?: Href | string;
    replace?: boolean;
    push?: boolean;
    dismissTo?: boolean;
    relativeToDirectory?: boolean;
    withAnchor?: boolean;
    prefetch?: boolean;
    target?: "_self" | "_blank" | "_parent" | "_top" | (string & object);
    rel?: string;
    download?: string;
  };

const sizeClasses = {
  default: "min-h-11 rounded-[28px] px-4 py-3",
  sm: "min-h-9 rounded-[28px] px-3 py-2",
  lg: "min-h-12 rounded-[28px] px-6 py-3.5",
  icon: "size-11 rounded-full p-0",
} as const;

const solidVariantClasses = {
  primary: "border-primary bg-primary",
  destructive: "border-destructive bg-destructive",
  secondary: "border-secondary bg-secondary",
  muted: "border-muted bg-muted",
  accent: "border-accent bg-accent",
  success: "border-success bg-success",
  warning: "border-warning bg-warning",
  info: "border-info bg-info",
  card: "border-border bg-card",
  outline: "border-border bg-transparent",
  ghost: "border-transparent bg-transparent",
  link: "border-transparent bg-transparent px-0 py-0",
  gradient: "border-transparent overflow-hidden",
} as const;

const softVariantClasses = {
  primary: "border-transparent bg-primary/10",
  destructive: "border-transparent bg-destructive/10",
  secondary: "border-transparent bg-secondary",
  muted: "border-transparent bg-muted",
  accent: "border-transparent bg-accent",
  success: "border-transparent bg-success/10",
  warning: "border-transparent bg-warning/10",
  info: "border-transparent bg-info/10",
  card: "border-border bg-card",
  outline: "border-border bg-transparent",
  ghost: "border-transparent bg-transparent",
  link: "border-transparent bg-transparent px-0 py-0",
  gradient: "border-transparent overflow-hidden",
} as const;

const solidTextClasses = {
  primary: "text-primary-foreground",
  destructive: "text-destructive-foreground",
  secondary: "text-secondary-foreground",
  muted: "text-muted-foreground",
  accent: "text-accent-foreground",
  success: "text-success-foreground",
  warning: "text-warning-foreground",
  info: "text-info-foreground",
  card: "text-card-foreground",
  outline: "text-foreground",
  ghost: "text-foreground",
  link: "text-primary",
  gradient: "text-white",
} as const;

const softTextClasses = {
  primary: "text-primary",
  destructive: "text-destructive",
  secondary: "text-secondary-foreground",
  muted: "text-muted-foreground",
  accent: "text-accent-foreground",
  success: "text-success",
  warning: "text-warning",
  info: "text-info",
  card: "text-card-foreground",
  outline: "text-foreground",
  ghost: "text-foreground",
  link: "text-primary",
  gradient: "text-white",
} as const;

export function buttonVariants({
  variant = "primary",
  appearance = "solid",
  size = "default",
}: ButtonVariants = {}) {
  return cn(
    "items-center justify-center border active:opacity-90 disabled:opacity-50",
    sizeClasses[size],
    appearance === "solid"
      ? solidVariantClasses[variant]
      : softVariantClasses[variant],
  );
}

const renderButtonContent = (
  content: ReactNode,
  textClass: string,
  textClassName?: string,
): ReactNode =>
  Children.toArray(content).map((child, index) => {
    if (typeof child === "string" || typeof child === "number") {
      if (typeof child === "string" && child.trim().length === 0) {
        return null;
      }

      return (
        <Text
          key={`button-text-${index}`}
          className={cn("font-body-semibold text-sm", textClass, textClassName)}
        >
          {child}
        </Text>
      );
    }

    if (isValidElement(child) && child.type === Fragment) {
      const fragmentChild = child as ReactElement<{ children?: ReactNode }>;

      return (
        <Fragment key={`button-fragment-${index}`}>
          {renderButtonContent(
            fragmentChild.props.children,
            textClass,
            textClassName,
          )}
        </Fragment>
      );
    }

    return child;
  });

export function Button({
  asChild: _asChild,
  label,
  variant = "primary",
  appearance = "solid",
  size = "default",
  textClassName,
  contentClassName,
  disabled,
  pulseDelay,
  children,
  href,
  replace,
  push,
  dismissTo,
  relativeToDirectory,
  withAnchor,
  prefetch,
  target,
  rel,
  download,
  style,
  className,
  ...props
}: ButtonProps) {
  const themeColors = useAppThemeColors();
  const isGradient = variant === "gradient";

  const textClass =
    appearance === "solid"
      ? solidTextClasses[variant]
      : softTextClasses[variant];

  const content =
    typeof children !== "undefined" ? (
      children
    ) : (
      <Text
        className={cn("font-body-semibold text-sm", textClass, textClassName)}
      >
        {label}
      </Text>
    );

  const pressable = (
    <Pressable
      disabled={disabled}
      className={cn(buttonVariants({ variant, appearance, size }), className)}
      style={
        typeof style === "function"
          ? style
          : [pulseDelay ? { opacity: 1 } : undefined, style]
      }
      {...props}
    >
      {isGradient ? (
        <LinearGradient
          colors={[themeColors.primary.base, themeColors.info.base]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          pointerEvents="none"
        />
      ) : null}
      <View
        className={cn(
          "flex-row items-center justify-center gap-1",
          contentClassName,
        )}
      >
        {renderButtonContent(content, textClass, textClassName)}
      </View>
    </Pressable>
  );

  if (!href || disabled) {
    return pressable;
  }

  return (
    <Link
      href={href as Href}
      asChild
      replace={replace}
      push={push}
      dismissTo={dismissTo}
      relativeToDirectory={relativeToDirectory}
      withAnchor={withAnchor}
      prefetch={prefetch}
      target={target}
      rel={rel}
      download={download}
    >
      {pressable}
    </Link>
  );
}
