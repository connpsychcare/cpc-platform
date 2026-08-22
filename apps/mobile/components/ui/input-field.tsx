import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormField, type BaseFieldProps } from "@/components/ui/form";

type InputExtraProps =
  | {
      type?: "text" | "email" | "tel" | "url" | "password";
      autoComplete?: string;
      autoCapitalize?: "none" | "sentences" | "words" | "characters";
      keyboardType?: "default" | "email-address" | "numeric" | "phone-pad" | "url";
    }
  | { type: "number"; min?: number; max?: number }
  | {
      type: "textarea";
      rows?: number;
      maxLength?: number;
    };

export type InputFieldProps<TFormData> = BaseFieldProps<TFormData> &
  InputExtraProps;

export function InputField<TFormData>(props: InputFieldProps<TFormData>) {
  const { className, ...rest } = props;

  return (
    <FormField className={className} {...rest}>
      {({ isInvalid, onChange, value, placeholder, disabled }) => {
        if (rest.type === "textarea") {
          return (
            <Textarea
              value={value ?? ""}
              onChangeText={onChange}
              placeholder={placeholder}
              editable={!disabled}
              maxLength={(rest as any).maxLength}
              numberOfLines={(rest as any).rows}
            />
          );
        }

        return (
          <Input
            type={rest.type === "number" ? "text" : rest.type}
            value={value ?? ""}
            onChangeText={onChange}
            placeholder={placeholder}
            editable={!disabled}
            keyboardType={
              rest.type === "number"
                ? "numeric"
                : (rest as any).keyboardType
            }
            autoCapitalize={
              rest.type === "email" ? "none" : (rest as any).autoCapitalize
            }
            autoComplete={(rest as any).autoComplete}
          />
        );
      }}
    </FormField>
  );
}
