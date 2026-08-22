"use client";

import React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ChevronDown, ShieldOff, ShieldCheck, Trash2 } from "lucide-react";

import type { UserResponse } from "@workspace/contracts/user";
import { formatDate } from "@workspace/shared/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { getStatusVariant } from "@workspace/ui/lib/utils";
import { useConfirm } from "@workspace/ui/hooks/use-confirm";
import {
  type SectionConfig,
  GenericDetailsPage,
} from "@workspace/ui/shared/GenericDetailsPage";
import { useDeleteUser, useUser } from "@/hooks/admin";

const sections: SectionConfig<UserResponse>[] = [
  {
    title: "Profile Information",
    fields: [
      { label: "First Name", accessor: "firstName" },
      { label: "Last Name", accessor: "lastName" },
      { label: "Display Name", accessor: "displayName" },
      { label: "Email", accessor: "email" },
      {
        label: "Role",
        accessor: "role",
        render: (value) => (
          <Badge variant={getStatusVariant(value)}>{value}</Badge>
        ),
      },
      {
        label: "Status",
        accessor: "status",
        render: (value) => (
          <Badge variant={getStatusVariant(value)}>{value}</Badge>
        ),
      },
    ],
    columns: 3,
  },
  {
    title: "Account Details",
    fields: [
      {
        label: "Email Verified",
        accessor: "isEmailVerified",
        render: (value) => (
          <Badge variant={getStatusVariant(value ? "verified" : "pending")}>
            {value ? "Verified" : "Pending"}
          </Badge>
        ),
      },
      { label: "Theme", accessor: "preferredTheme" },
      {
        label: "Last Login",
        accessor: "lastLoginAt",
        format: (value) =>
          value ? formatDate(value, { mode: "datetime" }) : "Never",
      },
      {
        label: "Created At",
        accessor: "createdAt",
        format: (value) => formatDate(value, { mode: "datetime" }),
      },
    ],
    columns: 2,
  },
];

const renderHeader = (data: UserResponse) => (
  <div className="flex items-center gap-4">
    {data.avatar && (
      <Avatar className="size-20">
        <AvatarImage
          src={data.avatar.url}
          alt={data.displayName!}
          width={200}
          height={200}
          className="size-20 rounded-full object-cover"
        />
        <AvatarFallback className="bg-linear-to-br from-primary/50 to-secondary/50 text-2xl">
          {data.firstName.charAt(0)} {data.lastName?.charAt(0)}
        </AvatarFallback>
      </Avatar>
    )}
    <div>
      <h2 className="text-2xl font-bold">{data.displayName}</h2>
      <p className="text-muted-foreground">{data.email}</p>
      <div className="mt-2 flex items-center gap-2">
        <Badge variant="outline">{data.role}</Badge>
        <Badge variant={getStatusVariant(data.status)}>{data.status}</Badge>
      </div>
    </div>
  </div>
);

const UserActions = ({ id, data }: { id: string; data: UserResponse }) => {
  const router = useRouter();
  const { confirm } = useConfirm();
  const { mutateAsync, isPending: isUpdating } = useUser(id);
  const { deleteAsync, isDeleting } = useDeleteUser();

  const isPending = isUpdating || isDeleting;
  const isSuspended = data.status === "suspended";

  const handleToggleSuspend = async () => {
    const next = isSuspended ? "active" : "suspended";
    const ok = await confirm({
      title: isSuspended ? "Activate user" : "Suspend user",
      description: isSuspended
        ? "This will reactivate the user's access."
        : "This will prevent the user from logging in.",
      confirmText: isSuspended ? "Activate" : "Suspend",
    });
    if (!ok) return;
    try {
      await mutateAsync({
        identifier: data.email || data.phone || "",
        firstName: data.firstName,
        lastName: data.lastName ?? "",
        displayName: data.displayName ?? "",
        role: data.role as any,
        status: next as any,
      });
      toast.success(`User ${next === "active" ? "activated" : "suspended"}.`);
    } catch (error: any) {
      toast.error("Failed to update user", { description: error?.message });
    }
  };

  const handleDelete = async () => {
    const ok = await confirm({
      title: "Delete user",
      description:
        "This will soft-delete the user. They can be restored from the users list.",
      confirmText: "Delete",
    });
    if (!ok) return;
    try {
      await deleteAsync({ id });
      toast.success("User deleted.");
      router.push("/admin/users");
    } catch (error: any) {
      toast.error("Failed to delete user", { description: error?.message });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isPending}>
          Actions <ChevronDown className="ml-1 size-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>User Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleToggleSuspend}>
          {isSuspended ? (
            <>
              <ShieldCheck className="size-4" /> Activate
            </>
          ) : (
            <>
              <ShieldOff className="size-4" /> Suspend
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="size-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const UserDetailsPage = ({ params }: PageProps<"/admin/users/[id]">) => {
  const { id } = React.use(params);

  return (
    <GenericDetailsPage
      entityId={id}
      entityName="User"
      useQuery={useUser}
      sections={sections}
      renderHeader={renderHeader}
      renderActions={(data) => <UserActions id={id} data={data} />}
    />
  );
};

export default UserDetailsPage;
