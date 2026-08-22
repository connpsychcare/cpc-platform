"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import StaffCaseloadAssignForm from "@/components/forms/StaffCaseloadAssignForm";

const AdminAssignPatientPage = ({ params }: PageProps<"/admin/staff/[id]/caseload/assign">) => {
  const { id: staffId } = React.use(params);
  const caseloadHref = `/admin/staff/${staffId}/caseload`;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href={caseloadHref}
          className="flex items-center gap-1 hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Caseload
        </Link>
        <span>/</span>
        <span>Assign Patients</span>
      </div>

      <StaffCaseloadAssignForm staffId={staffId} />
    </div>
  );
};

export default AdminAssignPatientPage;
