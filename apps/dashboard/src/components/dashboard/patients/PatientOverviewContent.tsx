"use client";

import Link from "next/link";

import type { PatientProfileResponse } from "@workspace/contracts/patient";
import { formatDate } from "@workspace/shared/utils";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  GenericDetailsSections,
  type SectionConfig,
} from "@workspace/ui/shared/GenericDetailsPage";
import DetailsPageSkeleton from "@workspace/ui/skeleton/DetailsPageSkeleton";
import { getStatusVariant } from "@workspace/ui/lib/utils";
import { useCurrentUser } from "@workspace/ui/hooks/use-user";

import { usePatient } from "@/hooks/patient";
import { SendTeacherTokenModal } from "@/components/clinical/SendTeacherTokenModal";
import PatientBriefingPanel from "./PatientBriefingPanel";

const renderBadge = (value?: string | null) => (
  <Badge variant={getStatusVariant(value ?? "")} className="capitalize">
    {value ?? "Not set"}
  </Badge>
);

const renderDocumentLink = (document?: { url?: string | null } | null) =>
  document?.url ? (
    <Link
      href={document.url}
      target="_blank"
      rel="noreferrer"
      className="text-primary hover:underline"
    >
      View document
    </Link>
  ) : (
    "Not uploaded"
  );

const overviewSections: SectionConfig<PatientProfileResponse>[] = [
  {
    title: "Patient Account",
    description: () =>
      "Linked user details, demographic profile, and branch preference for this patient.",
    columns: 3,
    fields: [
      {
        label: "Name",
        accessor: (data) => data.user?.displayName,
      },
      {
        label: "Email",
        accessor: (data) => data.user?.email ?? "No email",
      },
      {
        label: "Phone",
        accessor: (data) => data.user?.phone ?? "No phone",
      },
      {
        label: "Gender",
        accessor: "gender",
        render: (value) => renderBadge(value),
      },
      {
        label: "Date of Birth",
        accessor: "birthDate",
        render: (value) => (value ? formatDate(value) : "Not provided"),
      },
      {
        label: "Address",
        accessor: "address",
      },
      {
        label: "Occupation",
        accessor: "occupation",
      },
      {
        label: "Profile Updated",
        accessor: "updatedAt",
        render: (value) =>
          formatDate(value, { mode: "datetime", fallback: "Not recorded" }),
      },
    ],
  },
  {
    title: "Emergency and Insurance",
    description: () =>
      "The best fallback contact information and current insurance details for care coordination.",
    columns: 2,
    fields: [
      {
        label: "Emergency Contact Name",
        accessor: "emergencyContactName",
      },
      {
        label: "Emergency Contact Number",
        accessor: "emergencyContactNumber",
      },
      {
        label: "Emergency Contact Relationship",
        accessor: "emergencyContactRelationship",
      },
      {
        label: "Insurance Provider",
        accessor: "insuranceProvider",
      },
      {
        label: "Member ID",
        accessor: (d) =>
          (d as any).insuranceMemberId ?? d.insurancePolicyNumber,
      },
      {
        label: "Group Number",
        accessor: (d) => (d as any).insuranceGroupNumber,
      },
      {
        label: "Auth Number",
        accessor: (d) => (d as any).insuranceAuthNumber,
      },
      {
        label: "Copay / Deductible",
        accessor: (d) =>
          (d as any).insuranceCopay != null
            ? `$${(d as any).insuranceCopay} / $${(d as any).insuranceDeductible ?? "?"}`
            : undefined,
      },
      {
        label: "Insurance Phone",
        accessor: (d) => (d as any).insurancePhone,
      },
      {
        label: "Policy Holder",
        accessor: (d) =>
          (d as any).insurancePolicyHolder
            ? `${(d as any).insurancePolicyHolder} (${(d as any).insuranceRelationship ?? ""})`
            : undefined,
      },
    ],
  },
  {
    title: "Medical Information",
    description: () =>
      "Important health context captured for safer appointments and follow-up planning.",
    columns: 2,
    fields: [
      {
        label: "Allergies",
        accessor: "allergies",
      },
      {
        label: "Current Medications",
        accessor: "currentMedication",
      },
      {
        label: "Family Medical History",
        accessor: "familyMedicalHistory",
      },
      {
        label: "Past Medical History",
        accessor: "pastMedicalHistory",
      },
    ],
  },
  {
    title: "Identification and Verification",
    columns: 3,
    fields: [
      {
        label: "Identification Type",
        accessor: "identificationType",
        render: (value) => renderBadge(value),
      },
      {
        label: "Identification Number",
        accessor: "identificationNumber",
      },
      {
        label: "Scanned Document",
        accessor: "identificationDocument",
        render: (value) => renderDocumentLink(value),
      },
    ],
  },
];

interface PatientOverviewContentProps {
  patientId: string;
}

const PatientOverviewContent = ({ patientId }: PatientOverviewContentProps) => {
  const { data, isLoading, fetchError } = usePatient(patientId);
  const { currentUser } = useCurrentUser();

  if (isLoading) {
    return <DetailsPageSkeleton sections={overviewSections} />;
  }

  if (fetchError || !data) {
    return (
      <div className="rounded-xl border bg-card p-6 text-sm">
        <p className="font-medium text-destructive">
          {fetchError?.message || "Failed to load patient details."}
        </p>
        <Button variant="outline" href="/patients" className="mt-4">
          Back to Patients
        </Button>
      </div>
    );
  }

  const isAdolescent = (data as any).ageGroup === "adolescent";
  const canSendTeacherForm =
    isAdolescent &&
    (currentUser?.role === "admin" || currentUser?.role === "staff");

  return (
    <div className="space-y-6">
      <PatientBriefingPanel patientId={patientId} patient={data} />

      {canSendTeacherForm && (
        <div className="flex items-center justify-between rounded-xl border border-info/25 bg-info/10 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-info">Adolescent Patient</p>
            <p className="text-xs text-info mt-0.5">
              Send a Vanderbilt Teacher Rating Scale to this patient&apos;s
              teacher.
            </p>
          </div>
          <SendTeacherTokenModal
            patientId={patientId}
            patientName={data.user?.displayName}
          />
        </div>
      )}
      <GenericDetailsSections data={data} sections={overviewSections} />
    </div>
  );
};

export default PatientOverviewContent;
