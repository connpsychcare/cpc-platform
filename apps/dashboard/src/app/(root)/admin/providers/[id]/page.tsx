"use client";

import React from "react";

import type { ProviderProfileResponse } from "@workspace/contracts/provider";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Badge } from "@workspace/ui/components/badge";

import { useProvider } from "@/hooks/provider";
import {
  type SectionConfig,
  GenericDetailsPage,
} from "@workspace/ui/shared/GenericDetailsPage";
import { formatDate, formatPrice } from "@workspace/shared/utils";
import Link from "next/link";
import { getStatusVariant } from "@workspace/ui/lib/utils";

const formatDateTime = (value?: string) =>
  formatDate(value, { mode: "datetime", fallback: "Not recorded" });

const renderStatusBadge = (value?: string | null, label?: string) => (
  <Badge variant={getStatusVariant(value ?? "")} className="capitalize">
    {label ?? value ?? "Not set"}
  </Badge>
);

const renderDocumentLink = (
  document?: { url?: string | null } | null,
  label = "Open document",
) =>
  document?.url ? (
    <Link
      href={document.url}
      target="_blank"
      rel="noreferrer"
      className="text-primary hover:underline"
    >
      {label}
    </Link>
  ) : (
    "Not uploaded"
  );

const sections: SectionConfig<ProviderProfileResponse>[] = [
  {
    title: "Profile Overview",
    description: () =>
      "Core account, branch, credentials, and commercial setup for this provider profile.",
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
        label: "Branch",
        accessor: (data) => data.branch?.name ?? "Unassigned",
      },
      {
        label: "Professional Title",
        accessor: "title",
      },
      {
        label: "Years of Experience",
        accessor: "yearsExperience",
        render: (value) =>
          value === null || value === undefined ? "Not set" : `${value} years`,
      },
      {
        label: "Consultation Fee",
        accessor: "consultationFee",
        render: (value) => (value ? formatPrice(value) : "Not set"),
      },
      {
        label: "Commission Percent",
        accessor: "commissionPercent",
        render: (value) =>
          value === null || value === undefined || value === ""
            ? "Not set"
            : `${value}%`,
      },
    ],
  },
  {
    title: "Credentials and Documents",
    description: () =>
      "Verification inputs, qualification details, and uploaded compliance files.",
    columns: 3,
    fields: [
      {
        label: "License Number",
        accessor: "licenseNumber",
      },
      {
        label: "Education",
        accessor: "education",
      },
      {
        label: "Credentials",
        accessor: "credentials",
        render: (value) =>
          Array.isArray(value) && value.length ? value.join(", ") : "Not set",
      },
      {
        label: "Public Specialties",
        accessor: "specialties",
        render: (value) =>
          Array.isArray(value) && value.length ? value.join(", ") : "Not set",
      },
      {
        label: "Languages",
        accessor: "languages",
        render: (value) =>
          Array.isArray(value) && value.length ? value.join(", ") : "Not set",
      },
      {
        label: "License Document",
        accessor: "licenseDocument",
        render: (value) => renderDocumentLink(value, "Open license file"),
      },
    ],
  },
  {
    title: "Availability and Audit",
    description: () =>
      "Booking availability and profile maintenance details.",
    columns: 3,
    fields: [
      {
        label: "Availability",
        accessor: "isAvailable",
        render: (value) =>
          renderStatusBadge(
            value ? "active" : "closed",
            value ? "Available" : "Unavailable",
          ),
      },
      {
        label: "Created By",
        accessor: (data) => data.createdBy?.displayName ?? "System",
      },
      {
        label: "Updated At",
        accessor: "updatedAt",
        render: (value) => formatDateTime(value),
      },
    ],
  },
  {
    title: "Profile Notes",
    columns: 1,
    fields: [
      {
        label: "Professional Bio",
        accessor: "bio",
      },
    ],
  },
];

const renderHeader = (data: ProviderProfileResponse) => {
  const initials = `${data.user?.firstName?.[0] ?? "D"}${data.user?.lastName?.[0] ?? "R"}`;

  return (
    <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
      <div className="flex items-start gap-4">
        <Avatar className="size-20 border border-border/60">
          <AvatarImage
            src={data.user?.avatar?.url ?? undefined}
            alt={data.user?.displayName}
            width={200}
            height={200}
            className="object-cover"
          />
          <AvatarFallback className="text-lg font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              {data.user?.displayName}
            </h2>
            <p className="text-sm text-muted-foreground">
              {data.title}
              {data.branch?.name ? ` • ${data.branch.name}` : ""}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {renderStatusBadge(
              data.isAvailable ? "active" : "closed",
              data.isAvailable ? "Available" : "Unavailable",
            )}
            {data.title ? <Badge variant="outline">{data.title}</Badge> : null}
          </div>
        </div>
      </div>
    </div>
  );
};

const Page = ({ params }: PageProps<"/admin/providers/[id]">) => {
  const { id } = React.use(params);

  return (
    <GenericDetailsPage
      entityId={id}
      entityName="Provider"
      description={(data) =>
        `Review ${data.user?.displayName}'s profile, credentials, and booking availability from one place.`
      }
      useQuery={useProvider}
      sections={sections}
      renderHeader={renderHeader}
    />
  );
};

export default Page;
