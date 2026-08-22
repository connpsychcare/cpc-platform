"use client";

import ListPage from "@workspace/ui/shared/ListPage";
import type { ColumnConfig } from "@workspace/ui/shared/GenericTable";
import type {
  CategoryQueryType,
  CategoryResponse,
} from "@workspace/contracts/category";
import { formatDate } from "@workspace/shared/utils";
import { useCategories } from "@/hooks/content-cms";

const columns: ColumnConfig<CategoryResponse, CategoryQueryType>[] = [
  {
    header: "Name",
    accessor: (category) => (
      <div className="min-w-50">
        <p className="font-semibold">{category.name}</p>
        <p className="text-xs text-muted-foreground">/{category.slug}</p>
      </div>
    ),
    sortKey: "name",
  },
  {
    header: "Parent",
    accessor: (category) => category.parent?.name ?? "Top level",
  },
  {
    header: "Posts",
    accessor: (category) => category.postCount ?? 0,
  },
  {
    header: "Created",
    accessor: (category) => formatDate(category.createdAt, { mode: "date" }),
    sortKey: "createdAt",
  },
];

const CategoriesPage = () => (
  <ListPage
    dataKey="categories"
    canAdd
    canEdit
    columns={columns}
    defaultSortBy="name"
    defaultSearchBy="name"
    searchByOptions={[
      { label: "Name", value: "name" },
      { label: "Slug", value: "slug" },
    ]}
    useListHook={useCategories}
  />
);

export default CategoriesPage;
