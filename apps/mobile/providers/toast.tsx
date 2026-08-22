import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  FadeInDown,
  FadeOutDown,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon, type AppIconProps } from "@/components/ui/app-icon";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastVariant = "default" | "success" | "error" | "warning" | "info";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastOptions {
  description?: string;
  duration?: number;
  variant?: ToastVariant;
}

interface ToastContextValue {
  toast: (title: string, options?: ToastOptions) => void;
  success: (title: string, options?: Omit<ToastOptions, "variant">) => void;
  error: (title: string, options?: Omit<ToastOptions, "variant">) => void;
  warning: (title: string, options?: Omit<ToastOptions, "variant">) => void;
  info: (title: string, options?: Omit<ToastOptions, "variant">) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider.");
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const insets = useSafeAreaInsets();

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const show = useCallback(
    (title: string, options: ToastOptions = {}) => {
      const id = `${Date.now()}-${Math.random()}`;
      const duration = options.duration ?? 3500;

      setToasts((prev) => [
        ...prev.slice(-2), // keep max 3 toasts
        {
          id,
          title,
          description: options.description,
          variant: options.variant ?? "default",
        },
      ]);

      timers.current[id] = setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  const value: ToastContextValue = {
    toast: show,
    success: (title, opts) => show(title, { ...opts, variant: "success" }),
    error: (title, opts) => show(title, { ...opts, variant: "error" }),
    warning: (title, opts) => show(title, { ...opts, variant: "warning" }),
    info: (title, opts) => show(title, { ...opts, variant: "info" }),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <View
        className="pointer-events-box-none absolute inset-x-4 gap-2 z-50"
        style={{ bottom: insets.bottom + 16 }}
        pointerEvents="box-none"
      >
        {toasts.map((toast) => (
          <ToastView key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

// ─── Toast view ───────────────────────────────────────────────────────────────

const VARIANT_CONFIG: Record<
  ToastVariant,
  {
    containerClass: string;
    iconName: AppIconProps["name"];
    iconVariant: AppIconProps["variant"];
  }
> = {
  default: {
    containerClass: "bg-popover border border-border",
    iconName: "SparklesIcon",
    iconVariant: "primary",
  },
  success: {
    containerClass: "bg-popover border border-success/30",
    iconName: "CheckIcon",
    iconVariant: "success",
  },
  error: {
    containerClass: "bg-popover border border-destructive/30",
    iconName: "SmileIcon",
    iconVariant: "destructive",
  },
  warning: {
    containerClass: "bg-popover border border-warning/30",
    iconName: "StarIcon",
    iconVariant: "warning",
  },
  info: {
    containerClass: "bg-popover border border-info/30",
    iconName: "SparklesIcon",
    iconVariant: "info",
  },
};

function ToastView({
  toast,
  onDismiss,
}: {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}) {
  const config = VARIANT_CONFIG[toast.variant];

  return (
    <Animated.View
      entering={FadeInDown.springify().damping(18)}
      exiting={FadeOutDown.duration(200)}
    >
      <Pressable
        onPress={() => onDismiss(toast.id)}
        className={cn(
          "flex-row items-start gap-3 rounded-2xl px-4 py-3 shadow-soft",
          config.containerClass,
        )}
      >
        <AppIcon
          name={config.iconName}
          size="sm"
          variant={config.iconVariant}
          mode="wrap"
        />
        <View className="flex-1 gap-0.5">
          <Text className="font-body-semibold text-sm text-foreground">
            {toast.title}
          </Text>
          {toast.description ? (
            <Text className="font-secondary text-xs leading-5 text-muted-foreground">
              {toast.description}
            </Text>
          ) : null}
        </View>
      </Pressable>
    </Animated.View>
  );
}
