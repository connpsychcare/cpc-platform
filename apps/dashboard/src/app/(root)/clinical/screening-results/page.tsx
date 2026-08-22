"use client";

import { FileText, UserRound } from "lucide-react";
import type {
  ClinicalFormItemResponse,
  ClinicalFormQueryType,
} from "@workspace/contracts/clinical-form";
import {
  clinicalFormLabels,
  clinicalFormShortLabels,
  screeningFormTypes,
  type ClinicalFormTypeKey,
} from "@workspace/shared/constants";
import { formatDate } from "@workspace/shared/utils";
import { Badge } from "@workspace/ui/components/badge";
import type { ColumnConfig } from "@workspace/ui/shared/GenericTable";
import ListPage from "@workspace/ui/shared/ListPage";

import { SeverityBadge } from "@/components/clinical/ClinicalFormAnswers";
import { useClinicalForms } from "@/hooks/clinical-forms";

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
      header: "Assessment",
      accessor: (form) => (
        <span className="text-sm font-medium">
          {clinicalFormShortLabels[form.formType as ClinicalFormTypeKey] ??
            form.formType}
        </span>
      ),
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
        <p className="max-w-[18rem] truncate text-sm text-muted-foreground">
          {form.interpretation ?? "Not recorded"}
        </p>
      ),
      className: "w-[19rem]",
      wrapperCn: "max-w-[19rem]",
    },
    {
      header: "Source",
      accessor: (form) => (
        <Badge variant={form.isOnboarding ? "outline" : "secondary"}>
          {form.isOnboarding ? "Onboarding" : "In care"}
        </Badge>
      ),
    },
    {
      header: "Completed",
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

const ScreeningResultsPage = () => {
  return (
    <ListPage
      dataKey="forms"
      entityType="Screening Results"
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
        { label: "Interpretation", value: "interpretation" },
      ]}
      useListHook={useClinicalForms}
      defaultParams={{ formTypes: screeningFormTypes } as ClinicalFormQueryType}
      filterConfig={[
        {
          key: "formType",
          label: "Assessment",
          options: screeningFormTypes.map((type) => ({
            label: clinicalFormLabels[type],
            value: type,
          })),
        },
        {
          key: "isOnboarding",
          label: "Source",
          options: [
            { label: "Onboarding", value: "true" },
            { label: "In care", value: "false" },
          ],
        },
      ]}
    />
  );
};

export default ScreeningResultsPage;
