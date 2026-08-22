"use client";

import { Badge } from "@workspace/ui/components/badge";

import ListPage from "@workspace/ui/shared/ListPage";
import type { ColumnConfig } from "@workspace/ui/shared/GenericTable";
import { useDeleteUser, useRestoreUser, useUsers } from "@/hooks/admin";
import type { UserQueryType } from "@workspace/contracts/admin";
import type { UserResponse } from "@workspace/contracts/user";
import { SafeUserRoleEnum } from "@workspace/contracts";
import { getStatusVariant } from "@workspace/ui/lib/utils";
import UserAvatar from "@workspace/ui/shared/UserAvatar";

const columns: ColumnConfig<UserResponse, UserQueryType>[] = [
  {
    header: "User",
    accessor: (user) => (
      <div className="flex items-center gap-4 min-w-50">
        <UserAvatar user={user} />
        <p className="font-semibold">{user.displayName}</p>
      </div>
    ),
    sortKey: "displayName",
  },
  {
    header: "Email",
    accessor: (user) => user.email ?? "N/A",
    sortKey: "email",
  },
  {
    header: "Phone",
    accessor: (user) => user.phone ?? "N/A",
    sortKey: "phone",
  },
  {
    header: "Role",
    accessor: (user) => (
      <Badge variant="info" className="capitalize">
        {user.role}
      </Badge>
    ),
    sortKey: "role",
  },
  {
    header: "Status",
    accessor: (user) => (
      <Badge variant={getStatusVariant(user.status)}>{user.status}</Badge>
    ),
    sortKey: "status",
  },
];

const UserListPage = () => {
  return (
    <ListPage<UserResponse, UserQueryType, "users">
      dataKey="users"
      entityType="users"
      canAdd={false}
      columns={columns}
      defaultSortBy="displayName"
      defaultSearchBy="displayName"
      searchByOptions={[
        { label: "Name", value: "displayName" },
        { label: "Email", value: "email" },
        { label: "Phone", value: "phone" },
        { label: "ID", value: "id" },
      ]}
      useListHook={useUsers}
      useDeleteHook={useDeleteUser}
      useRestoreHook={useRestoreUser}
      filterConfig={[
        { key: "role", label: "Role", options: SafeUserRoleEnum.options },
        {
          key: "status",
          label: "Status",
          options: ["pending", "active", "suspended"],
        },
        {
          key: "includeDeleted",
          label: "Show",
          options: [
            { value: "false", label: "Active" },
            { value: "true", label: "Deleted" },
          ],
        },
      ]}
    />
  );
};

export default UserListPage;
