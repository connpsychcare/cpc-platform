import { useState } from "react";
import { Pressable, Text } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { AppIcon } from "@/components/ui/app-icon";
import { FormField, type BaseFieldProps } from "@/components/ui/form";
import { cn } from "@/lib/utils";

/** Parses "HH:MM" → Date with that time set on today's date */
function parseTime(value?: string): Date {
  const d = new Date();
  if (!value) return d;
  const [h, m] = value.split(":").map(Number);
  d.setHours(h ?? 9, m ?? 0, 0, 0);
  return d;
}

/** Formats Date → "HH:MM" */
function formatTime(date: Date): string {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

export function TimePickerField<TFormData>(props: BaseFieldProps<TFormData>) {
  const [open, setOpen] = useState(false);

  return (
    <FormField {...props}>
      {({ value, onChange, placeholder, disabled }) => {
        const dateValue = parseTime(value as string | undefined);

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
                {value ? (value as string) : (placeholder ?? "Select time")}
              </Text>
              <AppIcon name="Clock3Icon" size="sm" variant="primary" />
            </Pressable>

            <DateTimePickerModal
              mode="time"
              isVisible={open}
              date={dateValue}
              is24Hour={false}
              onConfirm={(date) => {
                onChange(formatTime(date));
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
