import React from "react";
import { FormField, type BaseFieldProps } from "./form";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./button";
import { parseDate } from "@workspace/shared/utils";

export interface DatePickerFieldProps<
  TFormData,
> extends BaseFieldProps<TFormData> {
  mode?: "date" | "range" | "time" | "datetime";
  minDate?: string | Date;
  maxDate?: string | Date;
  fromYear?: number;
  toYear?: number;
}

export const DatePickerField = <TFormData,>({
  // mode,
  disabled,
  minDate,
  maxDate,
  fromYear,
  toYear,
  ...props
}: DatePickerFieldProps<TFormData>) => {
  const [open, setOpen] = React.useState(false);
  return (
    <FormField {...props}>
      {({ isInvalid, ...field }) => {
        const dateValue = parseDate(field.value);
        const minimumDate = parseDate(minDate);
        const maximumDate = parseDate(maxDate);

        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild disabled={disabled}>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-between bg-transparent dark:bg-input/30 dark:hover:bg-input/50",
                  (field.value ?? "") === "" && "text-muted-foreground!",
                )}
                id={field.name}
                aria-invalid={isInvalid}
              >
                {dateValue?.toLocaleDateString() || field.placeholder}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit overflow-hidden p-0" align="start">
              <Calendar
                mode="single"
                selected={dateValue}
                showOutsideDays={false}
                captionLayout="dropdown"
                startMonth={fromYear ? new Date(fromYear, 0) : undefined}
                endMonth={toYear ? new Date(toYear, 11) : undefined}
                onSelect={(date) => {
                  if (!date) {
                    field.onChange(undefined);
                    setOpen(false);
                    return;
                  }
                  field.onChange(date.toISOString());
                  setOpen(false);
                }}
                disabled={{ before: minimumDate!, after: maximumDate }}
              />
            </PopoverContent>
          </Popover>
        );
      }}
    </FormField>
  );
};
