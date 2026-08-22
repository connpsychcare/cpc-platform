"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/utils";
import { FormField, type BaseFieldProps } from "./form";
import { Input } from "./input";
import { formatUsPhone, toE164Us } from "./phone-field";

/** A number-led entry of at least three digits reads as a phone; anything containing a
 *  letter or "@" reads as an email. Below three digits we leave the value alone so the
 *  first keystrokes never get reformatted out from under the typist. */
function looksLikePhone(val: string): boolean {
  const trimmed = val.trim();
  if (!trimmed || /[a-zA-Z@]/.test(trimmed)) return false;
  if (!/^[+\d]/.test(trimmed)) return false;
  return trimmed.replace(/\D/g, "").length >= 3;
}

interface IdentifierInputProps {
  value: string;
  onChange: (val: string) => void;
  onBlur: () => void;
  placeholder?: string;
  disabled?: boolean;
  isInvalid?: boolean;
}

function IdentifierInput({
  value,
  onChange,
  onBlur,
  placeholder = "Email or phone number",
  disabled,
  isInvalid,
}: IdentifierInputProps) {
  // The stored value is E.164 once it is a phone, so the field keeps its own display copy.
  const [display, setDisplay] = useState("");
  const init = useRef(false);

  useEffect(() => {
    if (init.current || !value) return;
    init.current = true;
    setDisplay(value.startsWith("+") ? formatUsPhone(value.replace(/^\+1/, "")) : value);
  }, [value]);

  const handleChange = (raw: string) => {
    if (looksLikePhone(raw)) {
      setDisplay(formatUsPhone(raw));
      onChange(toE164Us(raw));
      return;
    }
    setDisplay(raw);
    onChange(raw);
  };

  return (
    <Input
      type="text"
      value={display}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={isInvalid}
      className={cn(isInvalid && "border-destructive")}
      autoComplete="username"
    />
  );
}

export const IdentifierField = <TFormData,>(props: BaseFieldProps<TFormData>) => (
  <FormField {...props}>
    {({ value, onChange, onBlur, placeholder, disabled, isInvalid }) => (
      <IdentifierInput
        value={value ?? ""}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        isInvalid={isInvalid}
      />
    )}
  </FormField>
);
