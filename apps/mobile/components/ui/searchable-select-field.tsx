import { useState } from "react";
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

interface SelectOption {
  label: string;
  value: string;
}

interface SearchableSelectFieldProps<TFormData> extends BaseFieldProps<TFormData> {
  options: SelectOption[];
  title?: string;
}

export function SearchableSelectField<TFormData>({
  options,
  title,
  disabled,
  ...props
}: SearchableSelectFieldProps<TFormData>) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const borderColor = useThemeColor("border");
  const placeholderColor = useThemeColor("muted", "foreground");

  const filtered = query
    ? options.filter((o) =>
        o.label.toLowerCase().includes(query.toLowerCase()),
      )
    : options;

  return (
    <FormField {...props} disabled={disabled}>
      {({ value, onChange, placeholder, isInvalid, disabled: fieldDisabled }) => {
        const displayLabel = options.find((o) => o.value === value)?.label ?? "";

        return (
          <>
            <Pressable
              onPress={() => !fieldDisabled && setOpen(true)}
              className={cn(
                "min-h-11 w-full flex-row items-center justify-between rounded-2xl border border-input bg-transparent px-3 py-2",
                fieldDisabled && "opacity-50",
                isInvalid && "border-destructive",
              )}
              disabled={fieldDisabled}
            >
              <Text
                className={cn(
                  "flex-1 font-secondary text-base",
                  displayLabel ? "text-foreground" : "text-muted-foreground",
                )}
                numberOfLines={1}
              >
                {displayLabel || placeholder || "Select an option"}
              </Text>
              <AppIcon name="IconChevronDown" size="sm" variant="muted" />
            </Pressable>

            <Modal
              visible={open}
              animationType="slide"
              transparent
              statusBarTranslucent
              onRequestClose={() => {
                setOpen(false);
                setQuery("");
              }}
            >
              <Pressable
                className="flex-1 bg-dark-section/35"
                onPress={() => {
                  setOpen(false);
                  setQuery("");
                }}
              />
              <View className="rounded-t-4xl border border-border bg-popover">
                <SafeAreaView edges={["bottom"]}>
                  <View className="border-b border-border px-5 py-4">
                    <Text className="font-primary text-lg text-popover-foreground">
                      {title ?? placeholder ?? "Select"}
                    </Text>
                  </View>
                  <View className="px-3 pb-2 pt-3">
                    <TextInput
                      value={query}
                      onChangeText={setQuery}
                      placeholder="Search..."
                      placeholderTextColor={placeholderColor}
                      className="rounded-xl border border-input bg-transparent px-3 py-2 font-secondary text-sm text-foreground"
                      style={{ borderColor }}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                  <ScrollView
                    className="max-h-72"
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                  >
                    <View className="gap-1 px-2 pb-2">
                      {filtered.map((opt) => {
                        const isSelected = opt.value === value;
                        return (
                          <Pressable
                            key={opt.value}
                            onPress={() => {
                              onChange(opt.value);
                              setOpen(false);
                              setQuery("");
                            }}
                            className={cn(
                              "flex-row items-center justify-between rounded-2xl px-4 py-3",
                              isSelected ? "bg-primary/10" : "active:bg-accent",
                            )}
                          >
                            <Text
                              className={cn(
                                "font-secondary text-base",
                                isSelected
                                  ? "text-primary"
                                  : "text-popover-foreground",
                              )}
                            >
                              {opt.label}
                            </Text>
                            {isSelected && (
                              <AppIcon
                                name="CheckIcon"
                                size="sm"
                                variant="primary"
                              />
                            )}
                          </Pressable>
                        );
                      })}
                      {filtered.length === 0 && (
                        <Text className="px-4 py-3 font-secondary text-sm text-muted-foreground">
                          No results found.
                        </Text>
                      )}
                    </View>
                  </ScrollView>
                </SafeAreaView>
              </View>
            </Modal>
          </>
        );
      }}
    </FormField>
  );
}
