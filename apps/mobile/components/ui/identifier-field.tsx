import { useState } from "react";
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

import { FormField, type BaseFieldProps } from "@/components/ui/form";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-field";

type Mode = "email" | "phone";

function looksLikePhone(val: string): boolean {
  const trimmed = val.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith("+")) return true;
  return /^[\d\s\-\(\)]+$/.test(trimmed) && trimmed.replace(/\D/g, "").length >= 3;
}

function looksLikeEmail(val: string): boolean {
  return val.includes("@") || /[a-zA-Z]/.test(val);
}

interface IdentifierInputProps {
  value: string;
  onChange: (val: string) => void;
  onBlur: () => void;
  placeholder?: string;
  disabled?: boolean;
  isInvalid?: boolean;
  label?: ReactNode;
}

function IdentifierInput({
  value,
  onChange,
  onBlur,
  placeholder = "Email or phone number",
  disabled,
  isInvalid,
  label,
}: IdentifierInputProps) {
  const [mode, setMode] = useState<Mode>("email");

  const handleEmailChange = (raw: string) => {
    if (looksLikePhone(raw) && !looksLikeEmail(raw)) {
      setMode("phone");
      onChange("");
      return;
    }
    onChange(raw);
  };

  const handlePhoneChange = (e164: string) => {
    onChange(e164);
  };

  const toggleMode = () => {
    setMode((m) => {
      const next = m === "email" ? "phone" : "email";
      onChange("");
      return next;
    });
  };

  return (
    <>
      <View className="flex-row items-center justify-between gap-3">
        {typeof label === "string" ? (
          <FieldLabel className="min-w-0 flex-1">{label}</FieldLabel>
        ) : label ? (
          <View className="min-w-0 flex-1">{label}</View>
        ) : (
          <View className="flex-1" />
        )}
        <Pressable onPress={toggleMode} hitSlop={8} className="shrink-0">
          <Text className="font-secondary text-xs text-primary">
            {mode === "email" ? "Use phone instead" : "Use email instead"}
          </Text>
        </Pressable>
      </View>

      {mode === "email" ? (
        <Input
          type="email"
          value={value}
          onChangeText={handleEmailChange}
          onBlur={onBlur}
          placeholder={placeholder}
          editable={!disabled}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      ) : (
        <PhoneInput
          value={value}
          onChange={handlePhoneChange}
          onBlur={onBlur}
          disabled={disabled}
          isInvalid={isInvalid}
        />
      )}
    </>
  );
}

export function IdentifierField<TFormData>(props: BaseFieldProps<TFormData>) {
  const { label, placeholder, ...fieldProps } = props;
  const resolvedPlaceholder =
    placeholder ?? (typeof label === "string" ? label : undefined);

  return (
    <FormField {...fieldProps} placeholder={resolvedPlaceholder}>
      {({ value, onChange, onBlur, placeholder, disabled, isInvalid }) => (
        <IdentifierInput
          value={value ?? ""}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          isInvalid={isInvalid}
          label={label}
        />
      )}
    </FormField>
  );
}
