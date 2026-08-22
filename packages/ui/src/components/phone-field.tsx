"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "../lib/utils";
import { FormField, type BaseFieldProps } from "./form";
import { Input } from "./input";

/** The practice is licensed in California only, so every number is US. Rather than show a
 *  country selector that can never change, the field formats as US and submits E.164. */
export const US_PHONE_PLACEHOLDER = "(555) 555-5555";

export const formatUsPhone = (raw: string) => {
  const digits = raw.replace(/\D/g, "").replace(/^1(?=\d)/, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export const toE164Us = (raw: string) => {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";

  const normalized =
    digits.length === 11 && digits.startsWith("1")
      ? digits.slice(1)
      : digits.slice(0, 10);

  return normalized ? `+1${normalized}` : "";
};

export interface PhoneInputProps {
  value: string;
  onChange: (e164: string) => void;
  onBlur: () => void;
  placeholder?: string;
  disabled?: boolean;
  isInvalid?: boolean;
  className?: string;
}

export function PhoneInput({
  value,
  onChange,
  onBlur,
  placeholder = US_PHONE_PLACEHOLDER,
  disabled,
  isInvalid,
  className,
}: PhoneInputProps) {
  const [display, setDisplay] = useState("");
  const init = useRef(false);

  useEffect(() => {
    if (init.current || !value) return;
    init.current = true;
    setDisplay(formatUsPhone(value.replace(/^\+1/, "")));
  }, [value]);

  const handleInput = (raw: string) => {
    setDisplay(formatUsPhone(raw));
    onChange(toE164Us(raw));
  };

  return (
    <Input
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      value={display}
      onChange={(e) => handleInput(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={isInvalid}
      className={cn(isInvalid && "border-destructive", className)}
    />
  );
}

export const PhoneField = <TFormData,>(props: BaseFieldProps<TFormData>) => (
  <FormField {...props}>
    {({ value, onChange, onBlur, placeholder, disabled, isInvalid }) => (
      <PhoneInput
        value={value ?? ""}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder ?? US_PHONE_PLACEHOLDER}
        disabled={disabled}
        isInvalid={isInvalid}
      />
    )}
  </FormField>
);
