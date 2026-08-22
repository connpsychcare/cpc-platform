"use client";

import { ClipboardList, UserRound } from "lucide-react";
import type {
  TreatmentPlanQueryType,
  TreatmentPlanResponse,
} from "@workspace/contracts/treatment-plan";
import { formatDate } from "@workspace/shared/utils";
import { Badge } from "@workspace/ui/components/badge";
import { getStatusVariant } from "@workspace/ui/lib/utils";
import type { ColumnConfig } from "@workspace/ui/shared/GenericTable";
import ListPage from "@workspace/ui/shared/ListPage";

import { useTreatmentPlans } from "@/hooks/treatment-plan";

const columns: ColumnConfig<TreatmentPlanResponse, TreatmentPlanQueryType>[] = [
  {
    header: "Plan",
    accessor: (plan) => (
      <div className="min-w-0 max-w-88 space-y-1">
        <p className="truncate font-semibold">{plan.title}</p>
        <p className="truncate text-sm text-muted-foreground">
          {plan.description ?? "Psychiatric treatment plan"}
        </p>
      </div>
    ),
    sortKey: "title",
    className: "w-[24rem]",
    wrapperCn: "max-w-[24rem]",
  },
  {
    header: "Patient",
    accessor: (plan) => (
      <div className="min-w-0 max-w-[16rem] space-y-1">
        <p className="truncate font-medium">{plan.patient?.user.displayName}</p>
        <p className="truncate text-sm text-muted-foreground">
          {plan.patient?.user.email ?? "No email"}
        </p>
      </div>
    ),
    className: "w-[17rem]",
    wrapperCn: "max-w-[17rem]",
  },
  {
    header: "Status",
    accessor: (plan) => (
      <Badge variant={getStatusVariant(plan.status)}>{plan.status}</Badge>
    ),
    sortKey: "status",
  },
  {
    header: "Dates",
    accessor: (plan) => (
      <div className="space-y-1 text-sm">
        <p>
          Start: {formatDate(plan.startDate ?? undefined, { mode: "date" })}
        </p>
        <p className="text-muted-foreground">
          End: {formatDate(plan.endDate ?? undefined, { mode: "date" })}
        </p>
      </div>
    ),
    sortKey: "startDate",
  },
  {
    header: "Provider",
    accessor: (plan) => <p className="truncate">{plan.provider?.user.displayName}</p>,
    className: "w-[14rem]",
    wrapperCn: "max-w-[14rem]",
  },
];

const getMoreActions = (plan: TreatmentPlanResponse) => [
  {
    label: "Open patient",
    href: `/patients/${plan.patientId}`,
    icon: <UserRound className="size-4" />,
  },
  {
    label: "Open plan",
    href: `/patients/${plan.patientId}/treatment-plans/${plan.id}`,
    icon: <ClipboardList className="size-4" />,
  },
];

const TreatmentPlansClinicalPage = () => {
  return (
    <ListPage
      dataKey="treatmentPlans"
      entityType="Treatment Plans"
      columns={columns}
      useDefaultActions={false}
      moreActions={getMoreActions}
      defaultSortBy="createdAt"
      defaultSearchBy="title"
      searchByOptions={[{ label: "Title", value: "title" }]}
      useListHook={useTreatmentPlans}
      filterConfig={[
        {
          key: "status",
          label: "Status",
          options: [
            { label: "Draft", value: "draft" },
            { label: "Active", value: "active" },
            { label: "Completed", value: "completed" },
            { label: "Discontinued", value: "discontinued" },
          ],
        },
      ]}
    />
  );
};

export default TreatmentPlansClinicalPage;
