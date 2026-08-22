import { Text, View } from "react-native";

import { FormField, type BaseFieldProps } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface SwitchFieldProps<TFormData> extends BaseFieldProps<TFormData> {
  variant?: "card" | "inline";
}

export function SwitchField<TFormData>({
  label,
  desc,
  className,
  variant = "card",
  ...rest
}: SwitchFieldProps<TFormData>) {
  return (
    <FormField
      {...rest}
      className={cn(
        variant === "card" &&
          "rounded-2xl border border-input bg-card p-4",
        className,
      )}
    >
      {({ value, onChange, disabled }) => (
        <View
          className={cn(
            "flex-row items-start justify-between gap-4",
            variant === "inline" && "items-center",
          )}
        >
          {(label || desc) ? (
            <View className="flex-1 gap-0.5">
              {label ? (
                <Text className="font-body-semibold text-sm leading-5 text-foreground">
                  {label}
                </Text>
              ) : null}
              {desc ? (
                <Text className="font-secondary text-sm leading-5 text-muted-foreground">
                  {desc}
                </Text>
              ) : null}
            </View>
          ) : null}

          <Switch
            value={!!value}
            onValueChange={onChange}
            disabled={disabled}
          />
        </View>
      )}
    </FormField>
  );
}
