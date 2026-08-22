import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/app-icon";
import { cn } from "@/lib/utils";

// ─── Context ─────────────────────────────────────────────────────────────────

type SelectContextValue = {
  value: string | string[];
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  multiple?: boolean;
  disabled?: boolean;
  placeholder?: string;
};

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelectContext() {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error("Select components must be used within Select.");
  return ctx;
}

// ─── Select ──────────────────────────────────────────────────────────────────

interface SelectProps {
  value?: string | string[];
  onValueChange?: (value: string) => void;
  multiple?: boolean;
  disabled?: boolean;
  children: ReactNode;
  placeholder?: string;
}

export function Select({
  value = "",
  onValueChange,
  multiple = false,
  disabled = false,
  children,
  placeholder,
}: SelectProps) {
  const [open, setOpen] = useState(false);

  const ctx = useMemo<SelectContextValue>(
    () => ({
      value,
      onValueChange: onValueChange ?? (() => {}),
      open,
      setOpen,
      multiple,
      disabled,
      placeholder,
    }),
    [value, onValueChange, open, multiple, disabled, placeholder],
  );

  return (
    <SelectContext.Provider value={ctx}>{children}</SelectContext.Provider>
  );
}

// ─── SelectTrigger ───────────────────────────────────────────────────────────

interface SelectTriggerProps {
  children: ReactNode;
  className?: string;
}

export function SelectTrigger({ children, className }: SelectTriggerProps) {
  const { setOpen, disabled } = useSelectContext();

  return (
    <Pressable
      onPress={() => !disabled && setOpen(true)}
      className={cn(
        "min-h-11 w-full flex-row items-center justify-between rounded-2xl border border-input bg-transparent px-3 py-2",
        disabled && "opacity-50",
        className,
      )}
    >
      {children}
      <AppIcon name="IconChevronDown" size="sm" variant="muted" />
    </Pressable>
  );
}

// ─── SelectValue ─────────────────────────────────────────────────────────────

interface SelectValueProps {
  placeholder?: string;
  children?: ReactNode;
}

export function SelectValue({ placeholder, children }: SelectValueProps) {
  const { value, multiple } = useSelectContext();

  const isEmpty = multiple
    ? !Array.isArray(value) || value.length === 0
    : !value;

  if (children && !isEmpty) {
    return <>{children}</>;
  }

  return (
    <Text
      className={cn(
        "flex-1 font-secondary text-base",
        isEmpty ? "text-muted-foreground" : "text-foreground",
      )}
      numberOfLines={1}
    >
      {isEmpty ? (placeholder ?? "Select an option") : String(value)}
    </Text>
  );
}

// ─── SelectContent ───────────────────────────────────────────────────────────

interface SelectContentProps {
  children: ReactNode;
  title?: string;
}

export function SelectContent({ children, title }: SelectContentProps) {
  const { open, setOpen } = useSelectContext();

  if (!open) return null;

  return (
    <Modal
      visible={open}
      animationType="slide"
      transparent
      statusBarTranslucent
      onRequestClose={() => setOpen(false)}
    >
      <Pressable
        className="flex-1 bg-dark-section/35"
        onPress={() => setOpen(false)}
      />
      <View className="rounded-t-4xl border border-border bg-popover">
        <SafeAreaView edges={["bottom"]}>
          {title ? (
            <View className="border-b border-border px-5 py-4">
              <Text className="font-primary text-lg text-popover-foreground">
                {title}
              </Text>
            </View>
          ) : (
            <View className="items-center py-3">
              <View className="h-1 w-10 rounded-full bg-border" />
            </View>
          )}
          <ScrollView
            className="max-h-80"
            bounces={false}
            showsVerticalScrollIndicator={false}
          >
            <View className="gap-1 px-2 pb-2">{children}</View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

// ─── SelectItem ──────────────────────────────────────────────────────────────

interface SelectItemProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function SelectItem({ value, children, className }: SelectItemProps) {
  const {
    value: selected,
    onValueChange,
    setOpen,
    multiple,
  } = useSelectContext();

  const isSelected = multiple
    ? Array.isArray(selected) && selected.includes(value)
    : selected === value;

  const handlePress = () => {
    onValueChange(value);
    if (!multiple) setOpen(false);
  };

  return (
    <Pressable
      onPress={handlePress}
      className={cn(
        "flex-row items-center justify-between rounded-2xl px-4 py-3",
        isSelected ? "bg-primary/10" : "active:bg-accent",
        className,
      )}
    >
      {typeof children === "string" || typeof children === "number" ? (
        <Text
          className={cn(
            "font-secondary text-base",
            isSelected ? "font-body-semibold text-primary" : "text-foreground",
          )}
        >
          {children}
        </Text>
      ) : (
        <View className="flex-1">{children}</View>
      )}
      {isSelected ? (
        <AppIcon name="CheckIcon" size="sm" variant="primary" />
      ) : null}
    </Pressable>
  );
}

// ─── SelectGroup ─────────────────────────────────────────────────────────────

export function SelectGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <View className={cn("gap-1", className)}>{children}</View>;
}

// ─── SelectLabel ─────────────────────────────────────────────────────────────

export function SelectLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Text
      className={cn(
        "px-4 py-2 font-body-semibold text-xs uppercase tracking-widest text-muted-foreground",
        className,
      )}
    >
      {children}
    </Text>
  );
}
