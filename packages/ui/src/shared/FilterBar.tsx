"use client";

import * as React from "react";
import {
  Check,
  ChevronDown,
  Filter,
  Plus,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Badge } from "@workspace/ui/components/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Separator } from "@workspace/ui/components/separator";
import type { BaseQueryType } from "@workspace/contracts";

// ─── Types ───────────────────────────────────────────────────────────────────

export type FilterOption = string | { value: string; label: string };

export interface FilterConfigItem<TQuery = unknown> {
  /** Query param key this filter controls (e.g. "status", "includeDeleted") */
  key: string;
  /** Display label shown in the filter popover */
  label: string;
  options: FilterOption[];
  /** Default value - "All" is shown when nothing is selected or value === default */
  default?: string;
}

export interface SearchByOption<TQuery extends BaseQueryType = BaseQueryType> {
  value: TQuery["searchBy"];
  label: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getOptionValue(opt: FilterOption): string {
  return typeof opt === "string" ? opt : opt.value;
}

export function getOptionLabel(opt: FilterOption): string {
  return typeof opt === "string" ? opt : opt.label;
}

// ─── FilterBar ───────────────────────────────────────────────────────────────

interface FilterBarProps<TQuery extends BaseQueryType> {
  search: string;
  setSearch: (v: string) => void;
  searchBy?: TQuery["searchBy"];
  setSearchBy: (v: TQuery["searchBy"]) => void;
  searchByOptions: SearchByOption<TQuery>[];

  filters: Record<string, string | undefined>;
  setFilters: (v: Record<string, string | undefined>) => void;
  filterConfig?: FilterConfigItem[];

  canAdd?: boolean;
  entityType?: string;
  setPage: (n: number) => void;
}

export function FilterBar<TQuery extends BaseQueryType>({
  search,
  setSearch,
  searchBy,
  setSearchBy,
  searchByOptions,
  filters,
  setFilters,
  filterConfig,
  canAdd = true,
  entityType,
  setPage,
}: FilterBarProps<TQuery>) {
  const pathname = usePathname();

  const activeFilterCount =
    filterConfig?.filter((fc) => {
      const val = filters[fc.key];
      return val !== undefined && val !== "" && val !== fc.default;
    }).length ?? 0;

  const clearAllFilters = () => {
    setFilters({});
    setPage(1);
  };

  const currentSearchByLabel =
    searchByOptions.find((o) => o.value === searchBy)?.label ?? "field";

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* ── Search input + search-by popover ── */}
      <div className="flex min-w-48 flex-1 items-center gap-1">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={`Search by ${currentSearchByLabel}…`}
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="h-9 pl-8 pr-7"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        {searchByOptions.length > 1 && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-9 shrink-0"
                title={`Searching by ${currentSearchByLabel}`}
              >
                <SlidersHorizontal className="size-3.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-44 p-1.5">
              <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Search by
              </p>
              {searchByOptions.map((opt) => (
                <button
                  key={opt.value as string}
                  type="button"
                  onClick={() => {
                    setSearchBy(opt.value);
                    setSearch("");
                    setPage(1);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-accent",
                    searchBy === opt.value && "text-primary",
                  )}
                >
                  <Check
                    className={cn(
                      "size-3.5 shrink-0",
                      searchBy === opt.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {opt.label}
                </button>
              ))}
            </PopoverContent>
          </Popover>
        )}
      </div>

      {/* ── Filters popover ── */}
      {filterConfig && filterConfig.length > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-9 shrink-0 gap-1.5"
            >
              <Filter className="size-3.5" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="h-4.5 min-w-4.5 rounded-full px-1 text-[10px] leading-none">
                  {activeFilterCount}
                </Badge>
              )}
              <ChevronDown className="size-3 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-64 space-y-3 p-3">
            {filterConfig.map((fc, i) => {
              const current = filters[fc.key];
              const isAll = !current || current === "";
              return (
                <div key={fc.key}>
                  {i > 0 && <Separator className="mb-3" />}
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {fc.label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const next = { ...filters };
                        delete next[fc.key];
                        setFilters(next);
                        setPage(1);
                      }}
                      className={cn(
                        "rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors",
                        isAll
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
                      )}
                    >
                      All
                    </button>
                    {fc.options.map((opt) => {
                      const val = getOptionValue(opt);
                      const label = getOptionLabel(opt);
                      const active = current === val;
                      return (
                        <button
                          key={val}
                          type="button"
                          onClick={() => {
                            setFilters({ ...filters, [fc.key]: val });
                            setPage(1);
                          }}
                          className={cn(
                            "rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize transition-colors",
                            active
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
                          )}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {hasActiveFilters && (
              <>
                <Separator />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 w-full text-xs text-muted-foreground"
                  onClick={clearAllFilters}
                >
                  <X className="mr-1 size-3" />
                  Clear all
                </Button>
              </>
            )}
          </PopoverContent>
        </Popover>
      )}

      {/* ── Add button ── */}
      {canAdd && entityType && (
        <Button
          href={`${pathname}/new`}
          size="sm"
          className="ml-auto h-9 shrink-0 gap-1.5 capitalize"
        >
          <Plus className="size-3.5" />
          New {entityType.split("/").pop()?.replace(/s$/, "")}
        </Button>
      )}
    </div>
  );
}

export default FilterBar;
