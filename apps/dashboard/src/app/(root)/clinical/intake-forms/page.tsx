"use client";

import { FileText, UserRound } from "lucide-react";
import type {
  ClinicalFormItemResponse,
  ClinicalFormQueryType,
} from "@workspace/contracts/clinical-form";
import {
  clinicalFormShortLabels,
  describeClinicalForm,
  intakeFormTypes,
  type ClinicalFormTypeKey,
} from "@workspace/shared/constants";
import { formatDate } from "@workspace/shared/utils";
import { Badge } from "@workspace/ui/components/badge";
import type { ColumnConfig } from "@workspace/ui/shared/GenericTable";
import ListPage from "@workspace/ui/shared/ListPage";

import { useClinicalForms } from "@/hooks/clinical-forms";

/** The first answered question, as a one-line preview of the submission. */
const firstAnswer = (form: ClinicalFormItemResponse) => {
  const [section] = describeClinicalForm(form.formType, form.responses);
  const answered = section?.rows.find((row) => row.answer !== "Not answered");
  return answered?.answer ?? "No answers recorded";
};

/** How much of the questionnaire the patient actually filled in. */
const completeness = (form: ClinicalFormItemResponse) => {
  const [section] = describeClinicalForm(form.formType, form.responses);
  const rows = section?.rows ?? [];
  if (!rows.length) return null;
  const answered = rows.filter((row) => row.answer !== "Not answered").length;
  return { answered, total: rows.length };
};

const columns: ColumnConfig<ClinicalFormItemResponse, ClinicalFormQueryType>[] =
  [
    {
      header: "Patient",
      accessor: (form) => (
        <div className="min-w-0 max-w-[16rem] space-y-1">
          <p className="truncate font-semibold">
            {form.patient?.user.displayName}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {form.patient?.user.email ?? "No email"}
          </p>
        </div>
      ),
      className: "w-[17rem]",
      wrapperCn: "max-w-[17rem]",
    },
    {
      header: "Form",
      accessor: (form) => (
        <span className="text-sm font-medium">
          {clinicalFormShortLabels[form.formType as ClinicalFormTypeKey] ??
            form.formType}
        </span>
      ),
    },
    {
      header: "Presenting Concern",
      accessor: (form) => (
        <p className="max-w-[22rem] truncate text-sm text-muted-foreground">
          {firstAnswer(form)}
        </p>
      ),
      className: "w-[23rem]",
      wrapperCn: "max-w-[23rem]",
    },
    {
      header: "Completeness",
      accessor: (form) => {
        const progress = completeness(form);
        if (!progress) return <span className="text-sm">Unknown</span>;
        return (
          <Badge
            variant={
              progress.answered === progress.total ? "default" : "secondary"
            }
            className="tabular-nums"
          >
            {progress.answered} / {progress.total}
          </Badge>
        );
      },
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

const IntakeFormsPage = () => {
  return (
    <ListPage
      dataKey="forms"
      entityType="Intake Forms"
      columns={columns}
      canAdd={false}
      canEdit={false}
      useDefaultActions={false}
      moreActions={getMoreActions}
      defaultSortBy="completedAt"
      defaultSearchBy="displayName"
      searchByOptions={[
        { label: "Patient", value: "displayName" },
        { label: "Email", value: "email" },
      ]}
      useListHook={useClinicalForms}
      defaultParams={{ formTypes: intakeFormTypes } as ClinicalFormQueryType}
      filterConfig={[
        {
          key: "formType",
          label: "Form",
          options: [
            { label: "Adult Intake", value: "adultPsychiatricIntake" },
            {
              label: "Adolescent Intake",
              value: "adolescentPsychiatricIntake",
            },
          ],
        },
      ]}
    />
  );
};

export default IntakeFormsPage;
