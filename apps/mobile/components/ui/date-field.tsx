import { useState } from "react";
import { Pressable, Text } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { AppIcon } from "@/components/ui/app-icon";
import { FormField, type BaseFieldProps } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { formatDate, parseDate } from "@workspace/shared/utils";

export interface DatePickerFieldProps<
  TFormData,
> extends BaseFieldProps<TFormData> {
  mode?: "date" | "range" | "time" | "datetime";
  minDate?: string | Date;
  maxDate?: string | Date;
}

export function DatePickerField<TFormData>({
  mode = "date",
  minDate,
  maxDate,
  ...props
}: DatePickerFieldProps<TFormData>) {
  const [open, setOpen] = useState(false);

  if (mode === "range") return null;

  return (
    <FormField {...props}>
      {({ value, onChange, placeholder, disabled }) => {
        const dateValue = parseDate(value);
        const minimumDate = parseDate(minDate);
        const maximumDate = parseDate(maxDate);

        return (
          <>
            <Pressable
              onPress={() => {
                if (!disabled) setOpen(true);
              }}
              className={cn(
                "min-h-11 w-full flex-row items-center justify-between rounded-2xl border border-input bg-transparent px-3 py-2",
                disabled && "opacity-60",
              )}
            >
              <Text
                className={cn(
                  "flex-1 font-secondary text-base",
                  value ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {value ? formatDate(dateValue) : (placeholder ?? "Select date")}
              </Text>

              <AppIcon name="CalendarDaysIcon" size="sm" variant="primary" />
            </Pressable>

            <DateTimePickerModal
              mode={mode}
              isVisible={open}
              date={dateValue}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              onConfirm={(date) => {
                if (!date) {
                  onChange(undefined);
                  setOpen(false);
                  return;
                }
                onChange(date.toISOString());
                setOpen(false);
              }}
              onCancel={() => setOpen(false)}
              onHide={() => {}}
            />
          </>
        );
      }}
    </FormField>
  );
}
