"use client";

import * as React from "react";
import type { ApiException } from "@workspace/sdk";
import { useConfirm } from "@workspace/ui/hooks/use-confirm";
import GenericTable, {
  type ColumnConfig,
  type RowActionItem,
} from "./GenericTable";
import { InfoNotice } from "./InfoNotice";
import type { FilterConfigItem, SearchByOption } from "./FilterBar";
import type {
  BaseQueryResponse,
  BaseQueryType,
  BaseResponse,
  SortOrderType,
} from "@workspace/contracts";

interface UseListResult<TKey extends string, TData> {
  data?: BaseQueryResponse & {
    [K in TKey]: TData[];
  };
  isLoading?: boolean;
  fetchError?: unknown;
}

interface ListPageConfig<
  TData extends BaseResponse,
  TQuery extends BaseQueryType,
  TKey extends string,
> {
  dataKey: TKey;
  entityType?: string;
  canEdit?: boolean;
  canAdd?: boolean;
  columns: ColumnConfig<TData, TQuery>[];
  useDefaultActions?: boolean;
  moreActions?: (row: TData) => RowActionItem<TData>[];
  searchByOptions: SearchByOption<TQuery>[];

  defaultParams?: TQuery;
  useListHook: (params: TQuery) => UseListResult<TKey, TData>;
  useDeleteHook?: () => {
    deleteAsync: (args: { id: string; force?: boolean }) => Promise<unknown>;
    isDeleting: boolean;
    deleteError: ApiException | null;
  };
  useRestoreHook?: () => {
    restoreAsync: (id: string) => Promise<unknown>;
    isRestoring: boolean;
    restoreError: ApiException | null;
  };

  defaultSortBy: TQuery["sortBy"];
  defaultSearchBy: TQuery["searchBy"];

  /** Array of filter configs. Use key `"includeDeleted"` to enable soft-delete toggle. */
  filterConfig?: FilterConfigItem[];
}

function ListPage<
  TData extends BaseResponse,
  TQuery extends BaseQueryType,
  TKey extends string,
>({
  dataKey,
  entityType,
  canEdit,
  canAdd,
  columns,
  useDefaultActions,
  moreActions,
  defaultSearchBy,
  defaultSortBy,
  searchByOptions,
  useListHook,
  useDeleteHook,
  useRestoreHook,
  defaultParams,
  filterConfig,
}: ListPageConfig<TData, TQuery, TKey>) {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [searchBy, setSearchBy] =
    React.useState<TQuery["searchBy"]>(defaultSearchBy);
  const [sortBy, setSortBy] = React.useState<TQuery["sortBy"]>(defaultSortBy);
  const [sortOrder, setSortOrder] = React.useState<SortOrderType>("desc");
  const [filters, setFilters] = React.useState<
    Record<string, string | undefined>
  >({});

  // Detect soft-delete filter: auto-detected when key === "includeDeleted"
  const softDeleteFilter = filterConfig?.find(
    (fc) => fc.key === "includeDeleted",
  );
  const showDeleted = softDeleteFilter
    ? filters[softDeleteFilter.key] === "true"
    : false;

  // Build query - spread all active filter values as query params
  const filterParams = (filterConfig ?? []).reduce(
    (acc, fc) => {
      const val = filters[fc.key];
      if (val !== undefined && val !== "") acc[fc.key] = val;
      return acc;
    },
    {} as Record<string, string>,
  );

  const query = {
    ...defaultParams,
    page,
    limit,
    search,
    searchBy,
    sortBy,
    sortOrder,
    ...filterParams,
  } as unknown as TQuery;

  const { data, isLoading, fetchError } = useListHook(query);
  const deleteHook = useDeleteHook?.();
  const restoreHook = useRestoreHook?.();
  const { confirm } = useConfirm();
  const tableData = data?.[dataKey] ?? [];
  if (!entityType) entityType = dataKey;

  const handleDelete = async (row: TData) => {
    if (!deleteHook) return;
    const ok = await confirm({
      title: "Are you sure you want to delete this item?",
      description:
        "This item will be moved to trash. You can restore it later.",
      confirmText: "Move to trash",
      cancelText: "Cancel",
    });
    if (!ok) return;
    await deleteHook.deleteAsync({ id: row.id, force: false });
  };

  const handleRestore = async (row: TData) => {
    if (!restoreHook) return;
    const ok = await confirm({
      title: "Restore record",
      description:
        "This will restore the deleted record and make it active again.",
      confirmText: "Restore",
    });
    if (!ok) return;
    await restoreHook.restoreAsync(row.id);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold capitalize">
          {entityType} Management
        </h1>
        <p className="text-muted-foreground">
          Manage your {entityType} here. View, edit, or delete existing records.
        </p>
      </div>

      {/* A failed request is not an empty table. Showing the failure keeps a
          broken endpoint visible instead of reading as "no records yet". */}
      {fetchError ? (
        <InfoNotice
          variant="error"
          message={
            (fetchError as { message?: string }).message ??
            "Could not load these records. Please refresh and try again."
          }
        />
      ) : (
        <GenericTable
          entityType={entityType}
          canAdd={canAdd && !showDeleted}
          canEdit={canEdit && !showDeleted}
          useDefaultActions={useDefaultActions}
          moreActions={moreActions}
          data={tableData}
          total={data?.total || 0}
          limit={data?.limit || 10}
          currentPage={data?.page || 1}
          totalPages={data?.totalPages || 1}
          isLoading={isLoading}
          search={search}
          setSearch={setSearch}
          searchBy={searchBy}
          setSearchBy={setSearchBy}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          setPage={setPage}
          setLimit={setLimit}
          onDelete={!showDeleted && deleteHook ? handleDelete : undefined}
          onRestore={showDeleted && restoreHook ? handleRestore : undefined}
          filters={filters}
          setFilters={setFilters}
          filterConfig={filterConfig}
          columns={columns}
          searchByOptions={searchByOptions}
        />
      )}
    </div>
  );
}

export default ListPage;
