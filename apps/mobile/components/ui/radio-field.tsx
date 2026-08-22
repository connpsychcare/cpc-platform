import { FormField, type BaseFieldProps } from "@/components/ui/form";
import {
  RadioGroup,
  RadioItem,
} from "@/components/ui/radio-group";

interface RadioFieldOption {
  label: string;
  value: string;
  description?: string;
}

interface RadioFieldProps<TFormData> extends BaseFieldProps<TFormData> {
  options: RadioFieldOption[];
  variant?: "card" | "inline";
}

export function RadioField<TFormData>({
  options,
  variant = "card",
  ...props
}: RadioFieldProps<TFormData>) {
  return (
    <FormField {...props}>
      {({ value, onChange, disabled }) => (
        <RadioGroup
          value={value ?? ""}
          onValueChange={onChange}
          disabled={disabled}
        >
          {options.map((option) => (
            <RadioItem
              key={option.value}
              value={option.value}
              label={option.label}
              description={variant === "card" ? option.description : undefined}
            />
          ))}
        </RadioGroup>
      )}
    </FormField>
  );
}
