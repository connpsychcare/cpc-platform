"use client";

import { Mail, UserRound } from "lucide-react";
import type {
  CaregiverInvitationQueryType,
  CaregiverInvitationResponse,
} from "@workspace/contracts/caregiver-access";
import { formatDate } from "@workspace/shared/utils";
import { Badge } from "@workspace/ui/components/badge";
import type { ColumnConfig } from "@workspace/ui/shared/GenericTable";
import ListPage from "@workspace/ui/shared/ListPage";

import { useCaregiverInvitations } from "@/hooks/caregiver-access";

const RELATIONSHIP_LABELS: Record<string, string> = {
  parent: "Parent",
  guardian: "Legal Guardian",
  spouse: "Spouse / Partner",
  familyMember: "Family Member",
  authorizedCaregiver: "Authorized Caregiver",
  other: "Other",
};

const STATUS_VARIANT: Record<
  string,
  "success" | "warning" | "destructive" | "secondary"
> = {
  pending: "warning",
  accepted: "success",
  rejected: "destructive",
  revoked: "secondary",
  expired: "secondary",
};

const columns: ColumnConfig<
  CaregiverInvitationResponse,
  CaregiverInvitationQueryType
>[] = [
  {
    header: "Invited Email",
    accessor: (inv) => (
      <div className="flex items-center gap-2 min-w-0 max-w-[16rem]">
        <Mail className="size-3.5 shrink-0 text-muted-foreground" />
        <span className="truncate font-medium">{inv.invitedEmail}</span>
      </div>
    ),
    className: "w-[17rem]",
    wrapperCn: "max-w-[17rem]",
  },
  {
    header: "Patient",
    accessor: (inv) => (
      <div className="min-w-0 max-w-[16rem] space-y-1">
        <p className="truncate font-medium">
          {inv.patient?.user?.displayName ?? "Unknown patient"}
        </p>
        <p className="truncate text-sm text-muted-foreground">
          {inv.patient?.user?.email ?? "No email"}
        </p>
      </div>
    ),
    className: "w-[17rem]",
    wrapperCn: "max-w-[17rem]",
  },
  {
    header: "Relationship",
    accessor: (inv) => (
      <span className="text-sm">
        {RELATIONSHIP_LABELS[inv.relationship] ?? inv.relationship}
      </span>
    ),
  },
  {
    header: "Status",
    accessor: (inv) => (
      <Badge variant={STATUS_VARIANT[inv.status] ?? "secondary"}>
        {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
      </Badge>
    ),
  },
  {
    header: "Invited by",
    accessor: (inv) => (
      <span className="text-sm">
        {inv.invitedBy?.displayName ?? "Unknown"}
      </span>
    ),
  },
  {
    header: "Sent / Expires",
    accessor: (inv) => (
      <div className="space-y-1 text-sm">
        <p>{formatDate(inv.createdAt, { mode: "date" })}</p>
        <p className="text-muted-foreground">
          Expires {formatDate(inv.expiresAt, { mode: "date" })}
        </p>
      </div>
    ),
    sortKey: "createdAt",
  },
];

const getMoreActions = (inv: CaregiverInvitationResponse) => [
  {
    label: "Open patient",
    href: `/patients/${inv.patient?.id}`,
    icon: <UserRound className="size-4" />,
    hidden: !inv.patient?.id,
  },
];

const CaregiverInvitationsPage = () => {
  return (
    <ListPage
      dataKey="invitations"
      entityType="Caregiver Invitations"
      columns={columns}
      canAdd={false}
      useDefaultActions={false}
      moreActions={getMoreActions}
      defaultSortBy="createdAt"
      defaultSearchBy="invitedEmail"
      searchByOptions={[
        { label: "Email", value: "invitedEmail" },
        { label: "Status", value: "status" },
      ]}
      useListHook={useCaregiverInvitations}
      filterConfig={[
        {
          key: "status",
          label: "Status",
          options: [
            { label: "Pending", value: "pending" },
            { label: "Accepted", value: "accepted" },
            { label: "Rejected", value: "rejected" },
            { label: "Revoked", value: "revoked" },
            { label: "Expired", value: "expired" },
          ],
        },
      ]}
    />
  );
};

export default CaregiverInvitationsPage;
