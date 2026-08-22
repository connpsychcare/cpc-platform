"use client";

import { FileText, UserRound } from "lucide-react";
import type {
  ClinicalFormItemResponse,
  ClinicalFormQueryType,
} from "@workspace/contracts/clinical-form";
import { formatDate } from "@workspace/shared/utils";
import type { ColumnConfig } from "@workspace/ui/shared/GenericTable";
import ListPage from "@workspace/ui/shared/ListPage";

import { SeverityBadge } from "@/components/clinical/ClinicalFormAnswers";
import { useClinicalForms } from "@/hooks/clinical-forms";

/**
 * Teacher identity comes from the token record when the link was sent, and from
 * the payload when the teacher typed it in themselves.
 */
const teacherOf = (form: ClinicalFormItemResponse) => {
  const responses = form.responses as Record<string, unknown>;
  return {
    name:
      form.teacherAssessmentToken?.teacherName ??
      (typeof responses.teacherName === "string"
        ? responses.teacherName
        : undefined),
    school:
      form.teacherAssessmentToken?.schoolName ??
      (typeof responses.schoolName === "string"
        ? responses.schoolName
        : undefined),
    email: form.teacherAssessmentToken?.teacherEmail,
  };
};

const columns: ColumnConfig<ClinicalFormItemResponse, ClinicalFormQueryType>[] =
  [
    {
      header: "Student",
      accessor: (form) => (
        <div className="min-w-0 max-w-64 space-y-1">
          <p className="truncate font-semibold">
            {form.patient?.user.displayName}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {form.patient?.user.email ?? "No email"}
          </p>
        </div>
      ),
      className: "w-68",
      wrapperCn: "max-w-68",
    },
    {
      header: "Teacher",
      accessor: (form) => {
        const teacher = teacherOf(form);
        return (
          <div className="min-w-0 max-w-56 space-y-1">
            <p className="truncate text-sm font-medium">
              {teacher.name ?? "Not provided"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {teacher.school ?? teacher.email ?? "No school recorded"}
            </p>
          </div>
        );
      },
      className: "w-60",
      wrapperCn: "max-w-60",
    },
    {
      header: "Result",
      accessor: (form) => (
        <SeverityBadge
          formType={form.formType}
          totalScore={form.totalScore}
          responses={form.responses}
        />
      ),
      sortKey: "totalScore",
    },
    {
      header: "Interpretation",
      accessor: (form) => (
        <p className="max-w-72 truncate text-sm text-muted-foreground">
          {form.interpretation ?? "Not recorded"}
        </p>
      ),
      className: "w-76",
      wrapperCn: "max-w-76",
    },
    {
      header: "Submitted",
      accessor: (form) => formatDate(form.completedAt, { mode: "date" }),
      sortKey: "completedAt",
    },
  ];

const getMoreActions = (form: ClinicalFormItemResponse) => [
  {
    label: "View responses",
    href: `/clinical/forms/${form.id}`,
    icon: <FileText className="size-4" />,
  },
  {
    label: "Open patient",
    href: `/patients/${form.patientId}`,
    icon: <UserRound className="size-4" />,
  },
];

const TeacherAssessmentsPage = () => {
  return (
    <ListPage
      dataKey="forms"
      entityType="Teacher Assessments"
      columns={columns}
      canAdd={false}
      canEdit={false}
      useDefaultActions={false}
      moreActions={getMoreActions}
      defaultSortBy="completedAt"
      defaultSearchBy="displayName"
      searchByOptions={[
        { label: "Student", value: "displayName" },
        { label: "Email", value: "email" },
        { label: "Interpretation", value: "interpretation" },
      ]}
      useListHook={useClinicalForms}
      defaultParams={
        { formType: "vanderbiltTeacher" } as ClinicalFormQueryType
      }
    />
  );
};

export default TeacherAssessmentsPage;
