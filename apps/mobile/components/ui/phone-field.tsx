import { useEffect, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/app-icon";
import { FormField, type BaseFieldProps } from "@/components/ui/form";
import { useThemeColor } from "@/lib/theme";
import { cn } from "@/lib/utils";

const US_COUNTRY = {
  dialCode: "+1",
  flag: "🇺🇸",
  name: "United States",
};

const formatUsPhone = (raw: string) => {
  const digits = raw.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const toE164Us = (raw: string) => {
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
}

export function PhoneInput({
  value,
  onChange,
  onBlur,
  placeholder = "Phone number",
  disabled,
  isInvalid,
}: PhoneInputProps) {
  const [display, setDisplay] = useState("");
  const [open, setOpen] = useState(false);
  const init = useRef(false);

  const textColor = useThemeColor("foreground");
  const borderColor = useThemeColor("border");
  const placeholderColor = useThemeColor("muted", "foreground");

  useEffect(() => {
    if (init.current || !value) return;
    init.current = true;
    setDisplay(formatUsPhone(value.replace(/^\+1/, "")));
  }, [value]);

  const handleInput = (raw: string) => {
    setDisplay(formatUsPhone(raw));
    onChange(toE164Us(raw));
  };

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <View
      className={cn(
        "min-h-11 flex-row items-center overflow-hidden rounded-2xl border border-input bg-transparent",
        isInvalid && "border-destructive",
        disabled && "opacity-50",
      )}
    >
      <Pressable
        onPress={() => !disabled && setOpen(true)}
        disabled={disabled}
        className="flex-row items-center gap-1 border-r border-input px-3 py-2.5"
        style={{ borderColor }}
      >
        <Text className="font-secondary text-sm text-foreground">
          {US_COUNTRY.flag}
        </Text>
        <Text
          className="font-secondary text-sm text-foreground"
          style={{ color: textColor }}
        >
          {US_COUNTRY.dialCode}
        </Text>
        <AppIcon name="IconChevronDown" size="sm" variant="muted" />
      </Pressable>

      <TextInput
        value={display}
        onChangeText={handleInput}
        onBlur={onBlur}
        placeholder={placeholder}
        editable={!disabled}
        keyboardType="phone-pad"
        placeholderTextColor={placeholderColor}
        underlineColorAndroid="transparent"
        style={{
          flex: 1,
          paddingHorizontal: 12,
          paddingVertical: 8,
          fontFamily: "Inter_400Regular",
          fontSize: 14,
          color: textColor,
        }}
      />

      <Modal
        visible={open}
        animationType="slide"
        transparent
        statusBarTranslucent
        onRequestClose={closeModal}
      >
        <Pressable className="flex-1 bg-black/40" onPress={closeModal} />
        <View className="rounded-t-4xl border border-border bg-popover">
          <SafeAreaView edges={["bottom"]}>
            <View className="border-b border-border px-5 py-4">
              <Text className="font-primary text-lg text-popover-foreground">
                Select Country
              </Text>
            </View>
            <ScrollView
              className="max-h-72"
              bounces={false}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View className="gap-1 px-2 pb-4">
                <Pressable
                  onPress={closeModal}
                  className="flex-row items-center gap-3 rounded-2xl bg-primary/10 px-4 py-3"
                >
                  <Text className="w-8 font-secondary text-sm text-foreground">
                    {US_COUNTRY.flag}
                  </Text>
                  <Text className="w-12 font-secondary text-sm text-muted-foreground">
                    {US_COUNTRY.dialCode}
                  </Text>
                  <Text className="flex-1 font-secondary text-base text-primary">
                    {US_COUNTRY.name}
                  </Text>
                  <AppIcon name="CheckIcon" size="sm" variant="primary" />
                </Pressable>
              </View>
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

export function PhoneField<TFormData>(props: BaseFieldProps<TFormData>) {
  return (
    <FormField {...props}>
      {({ value, onChange, onBlur, placeholder, disabled, isInvalid }) => (
        <PhoneInput
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
}
