import { useMemo, useState } from "react";
import { useStore } from "@tanstack/react-form";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SearchIcon } from "lucide-react-native";
import type { ApiException } from "@workspace/sdk";
import type {
  BaseQueryResponse,
  BaseQueryType,
  BaseResponse,
} from "@workspace/contracts";

import { AppIcon } from "@/components/ui/app-icon";
import { FormField, type BaseFieldProps } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { useThemeColor } from "@/lib/theme";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

export type ComboboxOption<TData, TValue = TData[keyof TData] & string> = {
  id?: string;
  key: TValue & string;
  value: TValue;
  label: React.ReactNode;
  content: React.ReactNode;
};

export type UseEntitiesResult<TKey extends string, TData> = {
  data?: BaseQueryResponse & { [K in TKey]: TData[] };
  isFetching: boolean;
  fetchError: ApiException | null;
};

interface ComboboxFieldProps<
  TFormData,
  TData,
  TQuery extends BaseQueryType | undefined,
  TKey extends string,
> extends BaseFieldProps<TFormData> {
  dataKey: TKey;
  useQuery: (args?: TQuery) => UseEntitiesResult<TKey, TData>;
  queryArgs?: TQuery;
  getOption: (item: TData) => ComboboxOption<TData>;
  multiple?: boolean;
  title?: string;
}

// ─── ComboboxField ────────────────────────────────────────────────────────────

export function ComboboxField<
  TFormData,
  TData extends BaseResponse,
  TQuery extends BaseQueryType | undefined,
  TKey extends string,
>({
  dataKey,
  useQuery,
  queryArgs,
  getOption,
  multiple = false,
  title,
  disabled,
  ...props
}: ComboboxFieldProps<TFormData, TData, TQuery, TKey>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const mutedForeground = useThemeColor("muted", "foreground");

  const fieldValue = useStore(
    props.form.store,
    (state: any) => state.values[props.name],
  );

  const selectedIds = useMemo(() => {
    if (multiple) {
      return Array.isArray(fieldValue)
        ? fieldValue.filter(
            (value): value is string => typeof value === "string",
          )
        : [];
    }

    return typeof fieldValue === "string" && fieldValue.length > 0
      ? [fieldValue]
      : [];
  }, [fieldValue, multiple]);

  const mergedQueryArgs = useMemo(() => {
    if (!selectedIds.length) {
      return queryArgs;
    }

    const includeIds = Array.from(
      new Set([...((queryArgs?.includeIds ?? []) as string[]), ...selectedIds]),
    );

    return {
      ...(queryArgs ?? ({} as NonNullable<TQuery>)),
      includeIds,
    } as TQuery;
  }, [queryArgs, selectedIds]);

  const { data, isFetching } = useQuery(mergedQueryArgs);

  const options = useMemo(() => {
    if (!data) return [];
    return (data[dataKey] ?? []).map((d: TData) => getOption(d));
  }, [data, dataKey, getOption]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.key.toLowerCase().includes(q));
  }, [options, search]);

  const close = () => {
    setOpen(false);
    setSearch("");
  };

  return (
    <FormField {...props} disabled={disabled}>
      {({ value, onChange, placeholder, disabled: fieldDisabled }) => {
        const currentSelectedIds: string[] = multiple
          ? Array.isArray(value)
            ? value
            : []
          : value
            ? [value]
            : [];

        const selectedOptions = currentSelectedIds
          .map((id) => options.find((o) => o.value === id))
          .filter(Boolean);

        const displayLabel = multiple
          ? selectedOptions.map((o) => o?.label).join(", ")
          : (selectedOptions[0]?.label ?? "");

        const handleSelect = (optionValue: string) => {
          if (multiple) {
            const arr = Array.isArray(value) ? value : [];
            onChange(
              arr.includes(optionValue)
                ? arr.filter((v: string) => v !== optionValue)
                : [...arr, optionValue],
            );
          } else {
            onChange(optionValue);
            close();
          }
        };

        return (
          <>
            <Pressable
              onPress={() => !fieldDisabled && setOpen(true)}
              disabled={fieldDisabled}
              className={cn(
                "min-h-11 w-full flex-row items-center justify-between rounded-2xl border border-input bg-transparent px-3 py-2",
                fieldDisabled && "opacity-50",
              )}
            >
              <Text
                className={cn(
                  "flex-1 font-secondary text-base",
                  displayLabel ? "text-foreground" : "text-muted-foreground",
                )}
                numberOfLines={1}
              >
                {displayLabel || placeholder || "Select..."}
              </Text>
              <AppIcon name="IconChevronDown" size="sm" variant="muted" />
            </Pressable>

            <Modal
              visible={open}
              animationType="slide"
              transparent
              statusBarTranslucent
              onRequestClose={close}
            >
              <Pressable
                className="flex-1 bg-dark-section/35"
                onPress={close}
              />

              <View className="rounded-t-4xl border border-border bg-popover">
                <SafeAreaView edges={["bottom"]}>
                  <View className="border-b border-border px-5 py-4">
                    <Text className="font-primary text-lg text-popover-foreground">
                      {title ??
                        (typeof props.label === "string"
                          ? props.label
                          : "Select")}
                    </Text>
                  </View>

                  <View className="border-b border-border px-4 py-3">
                    <View className="flex-row items-center gap-2 rounded-2xl border border-input bg-input/30 px-3 py-2">
                      <SearchIcon
                        size={16}
                        color={mutedForeground}
                        strokeWidth={1.75}
                      />
                      <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder="Search..."
                        placeholderTextColor={mutedForeground}
                        className="flex-1 font-secondary text-base text-foreground"
                        autoFocus
                      />
                      {search ? (
                        <Pressable onPress={() => setSearch("")}>
                          <AppIcon name="XIcon" size="sm" variant="muted" />
                        </Pressable>
                      ) : null}
                    </View>
                  </View>

                  <ScrollView
                    className="max-h-80"
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                  >
                    {isFetching ? (
                      <View className="items-center py-8">
                        <Spinner />
                      </View>
                    ) : filtered.length === 0 ? (
                      <View className="items-center py-8">
                        <Text className="font-secondary text-sm text-muted-foreground">
                          {search
                            ? "No results found."
                            : "No options available."}
                        </Text>
                      </View>
                    ) : (
                      <View className="gap-1 px-2 pb-2 pt-1">
                        {filtered.map((option) => {
                          const isSelected = currentSelectedIds.includes(
                            option.value,
                          );
                          return (
                            <Pressable
                              key={option.key}
                              onPress={() => handleSelect(option.value)}
                              className={cn(
                                "flex-row items-center justify-between rounded-2xl px-4 py-3",
                                isSelected
                                  ? "bg-primary/10"
                                  : "active:bg-accent",
                              )}
                            >
                              <View className="flex-1 pr-2">
                                {option.content}
                              </View>
                              {isSelected ? (
                                <AppIcon
                                  name="CheckIcon"
                                  size="sm"
                                  variant="primary"
                                />
                              ) : null}
                            </Pressable>
                          );
                        })}
                      </View>
                    )}
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
