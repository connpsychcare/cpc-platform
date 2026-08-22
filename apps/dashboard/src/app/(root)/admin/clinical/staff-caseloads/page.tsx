"use client";

import { BriefcaseMedical, UserRound } from "lucide-react";
import type {
  StaffAssignmentQueryType,
  StaffAssignmentResponse,
} from "@workspace/contracts/staff-assignment";
import { formatDate } from "@workspace/shared/utils";
import { Badge } from "@workspace/ui/components/badge";
import type { ColumnConfig } from "@workspace/ui/shared/GenericTable";
import ListPage from "@workspace/ui/shared/ListPage";

import { useStaffAssignments } from "@/hooks/staff-assignment";

const columns: ColumnConfig<
  StaffAssignmentResponse,
  StaffAssignmentQueryType
>[] = [
  {
    header: "Staff Member",
    accessor: (assignment) => (
      <div className="min-w-0 max-w-[16rem] space-y-1">
        <p className="truncate font-medium">
          {assignment.staff?.displayName ?? "Unknown staff"}
        </p>
        <p className="truncate text-sm text-muted-foreground">
          {assignment.staff?.email ?? "No email"}
        </p>
      </div>
    ),
    className: "w-[17rem]",
    wrapperCn: "max-w-[17rem]",
  },
  {
    header: "Patient",
    accessor: (assignment) => (
      <div className="min-w-0 max-w-[16rem] space-y-1">
        <p className="truncate font-medium">
          {assignment.patient?.user.displayName}
        </p>
        <p className="truncate text-sm text-muted-foreground">
          {assignment.patient?.user.email ?? "No email"}
        </p>
      </div>
    ),
    className: "w-[17rem]",
    wrapperCn: "max-w-[17rem]",
  },
  {
    header: "Status",
    accessor: (assignment) => (
      <Badge variant={assignment.isActive ? "success" : "secondary"}>
        {assignment.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
    sortKey: "isActive",
  },
  {
    header: "Assigned",
    accessor: (assignment) => (
      <div className="space-y-1 text-sm">
        <p>{formatDate(assignment.assignedAt, { mode: "date" })}</p>
        <p className="text-muted-foreground">
          {assignment.assignedBy?.displayName
            ? `By ${assignment.assignedBy.displayName}`
            : "Assignment source unavailable"}
        </p>
      </div>
    ),
    sortKey: "assignedAt",
  },
  {
    header: "Notes",
    accessor: (assignment) => (
      <p className="truncate">{assignment.notes ?? "No assignment notes"}</p>
    ),
    className: "w-[20rem]",
    wrapperCn: "max-w-[20rem]",
  },
];

const getMoreActions = (assignment: StaffAssignmentResponse) => [
  {
    label: "Open patient",
    href: `/patients/${assignment.patientId}`,
    icon: <UserRound />,
  },
  {
    label: "Open caseload",
    href: `/admin/staff/${assignment.staffId}/caseload`,
    icon: <BriefcaseMedical />,
  },
];

const StaffCaseloadsClinicalPage = () => {
  return (
    <ListPage
      dataKey="assignments"
      entityType="Staff Caseloads"
      columns={columns}
      useDefaultActions={false}
      moreActions={getMoreActions}
      defaultParams={{ isActive: true } as StaffAssignmentQueryType}
      defaultSortBy="assignedAt"
      defaultSearchBy="notes"
      searchByOptions={[{ label: "Notes", value: "notes" }]}
      useListHook={useStaffAssignments}
      filterConfig={[
        {
          key: "isActive",
          label: "Status",
          options: [
            { label: "Active", value: "true" },
            { label: "Inactive", value: "false" },
          ],
        },
      ]}
    />
  );
};

export default StaffCaseloadsClinicalPage;
