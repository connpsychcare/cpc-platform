import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { Pressable, Text, View } from "react-native";

import { cn } from "@/lib/utils";

// ─── Context ─────────────────────────────────────────────────────────────────

type RadioGroupContextValue = {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
};

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

function useRadioGroupContext() {
  const ctx = useContext(RadioGroupContext);
  if (!ctx) throw new Error("RadioGroupItem must be used within RadioGroup.");
  return ctx;
}

// ─── RadioGroup ──────────────────────────────────────────────────────────────

interface RadioGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

export function RadioGroup({
  value,
  onValueChange,
  disabled,
  children,
  className,
}: RadioGroupProps) {
  const ctx = useMemo<RadioGroupContextValue>(
    () => ({ value, onValueChange, disabled }),
    [value, onValueChange, disabled],
  );

  return (
    <RadioGroupContext.Provider value={ctx}>
      <View className={cn("gap-2", className)}>{children}</View>
    </RadioGroupContext.Provider>
  );
}

// ─── RadioGroupItem ──────────────────────────────────────────────────────────

interface RadioGroupItemProps {
  value: string;
  disabled?: boolean;
  className?: string;
}

export function RadioGroupItem({
  value,
  disabled: itemDisabled,
  className,
}: RadioGroupItemProps) {
  const { value: selected, onValueChange, disabled: groupDisabled } =
    useRadioGroupContext();

  const isDisabled = itemDisabled ?? groupDisabled;
  const isSelected = selected === value;

  return (
    <Pressable
      accessibilityRole="radio"
      aria-checked={isSelected}
      disabled={isDisabled}
      onPress={() => onValueChange(value)}
      className={cn(
        "size-5 items-center justify-center rounded-full border-2",
        isSelected ? "border-primary" : "border-input",
        isDisabled && "opacity-50",
        className,
      )}
    >
      {isSelected ? (
        <View className="size-2.5 rounded-full bg-primary" />
      ) : null}
    </Pressable>
  );
}

// ─── RadioItem (convenience - label + item in a row) ─────────────────────────

interface RadioItemProps {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function RadioItem({
  value,
  label,
  description,
  disabled,
  className,
}: RadioItemProps) {
  const { value: selected, onValueChange, disabled: groupDisabled } =
    useRadioGroupContext();

  const isDisabled = disabled ?? groupDisabled;
  const isSelected = selected === value;

  return (
    <Pressable
      onPress={() => !isDisabled && onValueChange(value)}
      className={cn(
        "flex-row items-start gap-3 rounded-2xl border p-3",
        isSelected ? "border-primary bg-primary/5" : "border-input bg-card",
        isDisabled && "opacity-50",
        className,
      )}
    >
      <View className="mt-0.5">
        <RadioGroupItem value={value} disabled={isDisabled} />
      </View>
      <View className="flex-1 gap-0.5">
        <Text
          className={cn(
            "font-body-semibold text-sm",
            isSelected ? "text-primary" : "text-foreground",
          )}
        >
          {label}
        </Text>
        {description ? (
          <Text className="font-secondary text-xs leading-5 text-muted-foreground">
            {description}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}
