import { Pressable, Text, View } from "react-native";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FieldContent,
  FieldDescription,
  FieldTitle,
} from "@/components/ui/field";
import { FormField, type BaseFieldProps } from "@/components/ui/form";
import { cn } from "@/lib/utils";

interface CheckboxFieldProps<TFormData> extends BaseFieldProps<TFormData> {
  variant?: "card" | "inline";
}

export function CheckboxField<TFormData>({
  label,
  desc,
  className,
  variant = "card",
  ...props
}: CheckboxFieldProps<TFormData>) {
  return (
    <FormField
      {...props}
      className={cn(
        variant === "card" &&
          "rounded-2xl border border-input bg-card p-4",
        className,
      )}
    >
      {({ value, onChange, isInvalid, disabled }) => (
        <Pressable
          onPress={() => !disabled && onChange(!value)}
          className={cn(
            "flex-row items-start gap-3",
            variant === "inline" && "items-center",
            variant === "card" && "justify-between",
            disabled && "opacity-50",
          )}
        >
          {variant === "card" ? (
            <>
              <FieldContent>
                {label ? <FieldTitle>{label}</FieldTitle> : null}
                {desc ? <FieldDescription>{desc}</FieldDescription> : null}
              </FieldContent>
              <Checkbox
                checked={!!value}
                onCheckedChange={onChange}
                disabled={disabled}
              />
            </>
          ) : (
            <>
              <Checkbox
                checked={!!value}
                onCheckedChange={onChange}
                disabled={disabled}
              />
              <View className="gap-0.5">
                {label ? (
                  <Text className="font-body-semibold text-sm text-foreground">
                    {label}
                  </Text>
                ) : null}
                {desc ? (
                  <Text className="font-secondary text-sm text-muted-foreground">
                    {desc}
                  </Text>
                ) : null}
              </View>
            </>
          )}
        </Pressable>
      )}
    </FormField>
  );
}
