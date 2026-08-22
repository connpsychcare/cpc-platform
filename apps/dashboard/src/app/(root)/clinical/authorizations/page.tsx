"use client";

import { ShieldCheck, UserRound } from "lucide-react";
import type {
  InsuranceAuthorizationQueryType,
  InsuranceAuthorizationResponse,
} from "@workspace/contracts/insurance-authorization";
import { formatDate } from "@workspace/shared/utils";
import { Badge } from "@workspace/ui/components/badge";
import { getStatusVariant } from "@workspace/ui/lib/utils";
import type { ColumnConfig } from "@workspace/ui/shared/GenericTable";
import ListPage from "@workspace/ui/shared/ListPage";

import { useInsuranceAuthorizations } from "@/hooks/insurance-authorization";

const columns: ColumnConfig<
  InsuranceAuthorizationResponse,
  InsuranceAuthorizationQueryType
>[] = [
  {
    header: "Patient",
    accessor: (authorization) => (
      <div className="min-w-0 max-w-[16rem] space-y-1">
        <p className="truncate font-medium">
          {authorization.patient?.user.displayName}
        </p>
        <p className="truncate text-sm text-muted-foreground">
          {authorization.patient?.user.email ?? "No email"}
        </p>
      </div>
    ),
    className: "w-[17rem]",
    wrapperCn: "max-w-[17rem]",
  },
  {
    header: "Authorization",
    accessor: (authorization) => (
      <div className="min-w-0 max-w-[16rem] space-y-1">
        <p className="truncate font-semibold">{authorization.insurancePlan}</p>
        <p className="truncate text-sm text-muted-foreground">
          #{authorization.authorizationNumber}
        </p>
      </div>
    ),
    className: "w-[17rem]",
    wrapperCn: "max-w-[17rem]",
  },
  {
    header: "Coverage",
    accessor: (authorization) => (
      <div className="space-y-1 text-sm">
        <p>{formatDate(authorization.startDate, { mode: "date" })}</p>
        <p className="text-muted-foreground">
          to {formatDate(authorization.endDate, { mode: "date" })}
        </p>
      </div>
    ),
    sortKey: "startDate",
  },
  {
    header: "Hours",
    accessor: (authorization) => (
      <div className="space-y-1 text-sm">
        <p>Approved: {authorization.approvedHours}</p>
        <p className="text-muted-foreground">Used: {authorization.usedHours}</p>
        <p className="text-muted-foreground">
          Remaining: {authorization.remainingHours ?? "-"}
        </p>
      </div>
    ),
    sortKey: "approvedHours",
  },
  {
    header: "Status",
    accessor: (authorization) => (
      <Badge variant={getStatusVariant(authorization.status)}>
        {authorization.status}
      </Badge>
    ),
  },
];

const getMoreActions = (authorization: InsuranceAuthorizationResponse) => [
  {
    label: "Open patient",
    href: `/patients/${authorization.patientId}`,
    icon: <UserRound className="size-4" />,
  },
  {
    label: "Open record",
    href: `/patients/${authorization.patientId}/authorizations/${authorization.id}/edit`,
    icon: <ShieldCheck className="size-4" />,
  },
];

const AuthorizationsClinicalPage = () => {
  return (
    <ListPage
      dataKey="authorizations"
      entityType="Authorizations"
      columns={columns}
      useDefaultActions={false}
      moreActions={getMoreActions}
      defaultSortBy="startDate"
      defaultSearchBy="insurancePlan"
      searchByOptions={[
        { label: "Insurance Plan", value: "insurancePlan" },
        { label: "Authorization #", value: "authorizationNumber" },
        { label: "Notes", value: "notes" },
      ]}
      useListHook={useInsuranceAuthorizations}
      filterConfig={[
        {
          key: "status",
          label: "Status",
          options: [
            { label: "Active", value: "active" },
            { label: "Expired", value: "expired" },
            { label: "Exhausted", value: "exhausted" },
          ],
        },
      ]}
    />
  );
};

export default AuthorizationsClinicalPage;
