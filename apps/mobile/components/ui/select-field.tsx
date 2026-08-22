import { useMemo } from "react";
import { Text, View } from "react-native";

import { FormField, type BaseFieldProps } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectOption {
  label: React.ReactNode;
  value: string;
}

interface SelectFieldProps<TFormData> extends BaseFieldProps<TFormData> {
  options: string[] | SelectOption[];
  multiple?: boolean;
  title?: string;
}

export function SelectField<TFormData>({
  options,
  multiple = false,
  title,
  disabled,
  ...props
}: SelectFieldProps<TFormData>) {
  const normalized = useMemo<SelectOption[]>(
    () =>
      options.map((o) => (typeof o === "string" ? { label: o, value: o } : o)),
    [options],
  );

  return (
    <FormField {...props} disabled={disabled}>
      {({ value, onChange, placeholder, disabled: fieldDisabled }) => {
        const current = value ?? (multiple ? [] : "");

        const handleChange = (selected: string) => {
          if (!multiple) {
            onChange(selected);
            return;
          }

          const arr = Array.isArray(current) ? current : [];
          onChange(
            arr.includes(selected)
              ? arr.filter((v: string) => v !== selected)
              : [...arr, selected],
          );
        };

        const displayValue = multiple
          ? Array.isArray(current) && current.length
            ? normalized
                .filter((o) => current.includes(o.value))
                .map((o) =>
                  typeof o.label === "string" || typeof o.label === "number"
                    ? String(o.label)
                    : o.value,
                )
                .join(", ")
            : undefined
          : (normalized.find((o) => o.value === current)?.label ?? undefined);

        return (
          <Select
            value={current}
            onValueChange={handleChange}
            multiple={multiple}
            disabled={fieldDisabled}
            placeholder={placeholder}
          >
              <SelectTrigger>
                <SelectValue placeholder={placeholder}>
                  {displayValue ? (
                    typeof displayValue === "string" ||
                    typeof displayValue === "number" ? (
                      <Text
                        className="flex-1 font-secondary text-base text-foreground"
                        numberOfLines={1}
                      >
                        {displayValue}
                      </Text>
                    ) : (
                      <View className="flex-1">{displayValue}</View>
                    )
                  ) : null}
                </SelectValue>
              </SelectTrigger>

            <SelectContent title={title}>
              {normalized.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }}
    </FormField>
  );
}
