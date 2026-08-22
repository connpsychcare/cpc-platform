"use client";

import { ShieldCheck, UserRound } from "lucide-react";
import type {
  CaregiverAccessQueryType,
  CaregiverAccessResponse,
} from "@workspace/contracts/caregiver-access";
import { formatDate } from "@workspace/shared/utils";
import { Badge } from "@workspace/ui/components/badge";
import type { ColumnConfig } from "@workspace/ui/shared/GenericTable";
import ListPage from "@workspace/ui/shared/ListPage";

import { useCaregiverAccesses } from "@/hooks/caregiver-access";

const columns: ColumnConfig<
  CaregiverAccessResponse,
  CaregiverAccessQueryType
>[] = [
  {
    header: "Patient",
    accessor: (access) => (
      <div className="min-w-0 max-w-[16rem] space-y-1">
        <p className="truncate font-medium">{access.patient?.user.displayName}</p>
        <p className="truncate text-sm text-muted-foreground">
          {access.patient?.user.email ?? "No email"}
        </p>
      </div>
    ),
    className: "w-[17rem]",
    wrapperCn: "max-w-[17rem]",
  },
  {
    header: "Caregiver",
    accessor: (access) => (
      <div className="min-w-0 max-w-[16rem] space-y-1">
        <p className="truncate font-medium">
          {access.caregiver?.displayName ?? "Unknown caregiver"}
        </p>
        <p className="truncate text-sm text-muted-foreground">
          {access.caregiver?.email ?? "No email"}
        </p>
      </div>
    ),
    className: "w-[17rem]",
    wrapperCn: "max-w-[17rem]",
  },
  {
    header: "Status",
    accessor: (access) => (
      <Badge variant={access.isActive ? "success" : "secondary"}>
        {access.isActive ? "Active" : "Revoked"}
      </Badge>
    ),
    sortKey: "grantedAt",
  },
  {
    header: "Granted",
    accessor: (access) => (
      <div className="space-y-1 text-sm">
        <p>{formatDate(access.grantedAt, { mode: "datetime" })}</p>
        <p className="text-muted-foreground">
          {access.grantedBy?.displayName
            ? `By ${access.grantedBy.displayName}`
            : "Grant source unavailable"}
        </p>
      </div>
    ),
    sortKey: "grantedAt",
  },
  {
    header: "Notes",
    accessor: (access) => <p className="truncate">{access.notes ?? "No notes"}</p>,
    className: "w-[20rem]",
    wrapperCn: "max-w-[20rem]",
  },
];

const getMoreActions = (access: CaregiverAccessResponse) => [
  {
    label: "Open patient",
    href: `/patients/${access.patientId}`,
    icon: <UserRound className="size-4" />,
  },
  {
    label: "Open patient caregivers",
    href: `/patients/${access.patientId}/caregivers`,
    icon: <ShieldCheck className="size-4" />,
  },
];

const CaregiversClinicalPage = () => {
  return (
    <ListPage
      dataKey="caregiverAccesses"
      entityType="Caregiver Access"
      columns={columns}
      useDefaultActions={false}
      moreActions={getMoreActions}
      defaultSortBy="grantedAt"
      defaultSearchBy="notes"
      searchByOptions={[{ label: "Notes", value: "notes" }]}
      useListHook={useCaregiverAccesses}
      filterConfig={[
        {
          key: "isActive",
          label: "Status",
          options: [
            { label: "Active", value: "true" },
            { label: "Revoked", value: "false" },
          ],
        },
      ]}
    />
  );
};

export default CaregiversClinicalPage;
