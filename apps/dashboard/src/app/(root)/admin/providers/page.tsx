"use client";

import ListPage from "@workspace/ui/shared/ListPage";
import type { ColumnConfig } from "@workspace/ui/shared/GenericTable";
import { useProviders } from "@/hooks/provider";
import type {
  ProviderProfileResponse,
  ProviderQueryType,
} from "@workspace/contracts/provider";
import { Badge } from "@workspace/ui/components/badge";
import { getStatusVariant } from "@workspace/ui/lib/utils";
import UserAvatar from "@workspace/ui/shared/UserAvatar";

const columns: ColumnConfig<ProviderProfileResponse, ProviderQueryType>[] = [
  {
    header: "Provider",
    accessor: (provider) => (
      <div className="flex items-center gap-4 min-w-50">
        <UserAvatar user={provider.user} />
        <p className="font-semibold">{provider.user?.displayName}</p>
      </div>
    ),
    sortKey: "displayName",
  },
  {
    header: "Title",
    accessor: (provider) => <Badge>{provider.title}</Badge>,
    sortKey: "title",
  },
  {
    header: "Branch",
    accessor: (provider) => provider.branch?.name ?? "Unassigned",
  },
  {
    header: "Status",
    accessor: (provider) => (
      <Badge
        variant={getStatusVariant(provider.isAvailable ? "active" : "closed")}
      >
        {provider.isAvailable ? "available" : "unavailable"}
      </Badge>
    ),
  },
];

const ProvidersPage = () => {
  return (
    <ListPage
      dataKey="providers"
      canEdit
      columns={columns}
      defaultSortBy="displayName"
      defaultSearchBy="displayName"
      searchByOptions={[
        { label: "Provider", value: "displayName" },
        { label: "Title", value: "title" },
        { label: "Slug", value: "slug" },
        { label: "License number", value: "licenseNumber" },
      ]}
      useListHook={useProviders}
      filterConfig={[
        { key: "isAvailable", label: "Availability", options: [{ value: "true", label: "Available" }, { value: "false", label: "Unavailable" }] },
      ]}
    />
  );
};

export default ProvidersPage;
