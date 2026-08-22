import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";

import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = {
  label: string;
  value: string;
};

type MobileFilterBarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  setPage?: (value: number) => void;
  placeholder?: string;
  summary?: string;
  searchBy?: string;
  onSearchByChange?: (value: string) => void;
  searchByOptions?: Option[];
  sortBy?: string;
  onSortByChange?: (value: string) => void;
  sortOptions?: Option[];
  sortOrder?: "asc" | "desc";
  onToggleSort?: () => void;
  activeCount?: number;
  onClear?: () => void;
  footer?: ReactNode;
};

export function MobileFilterBar({
  search,
  onSearchChange,
  setPage,
  placeholder = "Search...",
  summary,
  searchBy,
  onSearchByChange,
  searchByOptions = [],
  sortBy,
  onSortByChange,
  sortOptions = [],
  sortOrder = "desc",
  onToggleSort,
  activeCount = 0,
  onClear,
  footer,
}: MobileFilterBarProps) {
  const hasSearchByOptions = searchByOptions.length > 1;
  const hasSortOptions = sortOptions.length > 1;
  const hasActiveFilters = activeCount > 0 || search.trim().length > 0;

  const clearAll = () => {
    onSearchChange("");
    setPage?.(1);
    onClear?.();
  };

  return (
    <View className="gap-3 rounded-[28px] border border-border bg-card p-4 shadow-soft">
      {summary ? (
        <Text className="font-secondary text-xs text-muted-foreground">
          {summary}
        </Text>
      ) : null}

      <View className="flex-row items-center gap-2">
        <View className="relative flex-1">
          <View className="absolute bottom-0 left-3.5 top-0 z-10 justify-center">
            <AppIcon name="SearchIcon" size="sm" variant="primary" />
          </View>

          <Input
            value={search}
            onChangeText={(value) => {
              setPage?.(1);
              onSearchChange(value);
            }}
            placeholder={placeholder}
            style={{ paddingLeft: 44, paddingRight: 44 }}
          />

          {search ? (
            <Pressable
              onPress={() => {
                setPage?.(1);
                onSearchChange("");
              }}
              className="absolute bottom-0 right-3.5 top-0 z-10 justify-center"
            >
              <AppIcon name="XIcon" size="sm" variant="primary" />
            </Pressable>
          ) : null}
        </View>

        {hasSearchByOptions ? (
          <Popover>
            <PopoverTrigger>
              <Button variant="outline" size="icon">
                <AppIcon
                  name="SlidersHorizontalIcon"
                  size="sm"
                  variant="primary"
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" width={180}>
              <Text className="px-3 py-2 font-body-semibold text-xs uppercase tracking-[0.18em] text-muted-foreground">
                Search By
              </Text>

              <View className="gap-1">
                {searchByOptions.map((option) => {
                  const isActive = searchBy === option.value;

                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => {
                        setPage?.(1);
                        onSearchByChange?.(option.value);
                        onSearchChange("");
                      }}
                      className="flex-row items-center gap-2 rounded-2xl px-3 py-2.5"
                    >
                      <View className="w-4 items-center">
                        {isActive ? (
                          <AppIcon
                            name="CheckIcon"
                            size="sm"
                            variant="primary"
                          />
                        ) : null}
                      </View>
                      <Text
                        className={
                          isActive
                            ? "font-body-semibold text-sm text-primary"
                            : "font-secondary text-sm text-foreground"
                        }
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </PopoverContent>
          </Popover>
        ) : null}

        {hasSortOptions ? (
          <Select
            value={sortBy}
            onValueChange={(value) => {
              setPage?.(1);
              onSortByChange?.(value);
            }}
          >
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent title="Sort By">
              <SelectGroup>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <Text className="font-secondary text-base text-foreground">
                      {option.label}
                    </Text>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        ) : null}

        {onToggleSort ? (
          <Button variant="outline" size="icon" onPress={onToggleSort}>
            <AppIcon
              name={
                sortOrder === "asc"
                  ? "IconSortAscending2"
                  : "IconSortDescending2"
              }
              size="sm"
              variant="primary"
            />
          </Button>
        ) : null}

        {hasActiveFilters ? (
          <Button variant="ghost" size="sm" onPress={clearAll}>
            Clear
          </Button>
        ) : null}
      </View>

      {footer ? <View>{footer}</View> : null}
    </View>
  );
}
