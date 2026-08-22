"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";

import type { FormSectionType } from "@workspace/contracts";
import {
  staffAssignmentSchema,
  type StaffAssignmentType,
} from "@workspace/contracts/staff-assignment";
import { Button } from "@workspace/ui/components/button";
import { ComboboxField } from "@workspace/ui/components/combobox-field";
import { Form, FormSection } from "@workspace/ui/components/form";
import { InputField } from "@workspace/ui/components/input-field";

import PageIntro from "@workspace/ui/shared/PageIntro";
import { usePatients } from "@/hooks/patient";
import { useStaffList } from "@/hooks/staff";
import { useAssignPatients, useStaffCaseload } from "@/hooks/staff-assignment";

interface StaffCaseloadAssignFormProps {
  staffId?: string;
  formType?: FormSectionType;
}

const StaffCaseloadAssignForm = ({ staffId }: StaffCaseloadAssignFormProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const listPath = pathname.substring(0, pathname.lastIndexOf("/"));

  const { assignAsync, isPending } = useAssignPatients();
  const { data: caseload } = useStaffCaseload(staffId);
  const assignedPatientIds = React.useMemo(
    () => (caseload?.assignments ?? []).map((a) => a.patientId),
    [caseload],
  );

  const form = useForm({
    defaultValues: {
      staffId: staffId ?? "",
      patientIds: [] as string[],
      notes: "",
    } as StaffAssignmentType,
    validators: { onSubmit: staffAssignmentSchema },
    onSubmit: async ({ value }) => {
      try {
        await assignAsync(value);
        toast.success(`${value.patientIds.length} patient(s) assigned.`);
        router.push(listPath);
      } catch (err: any) {
        toast.error("Failed to assign patients.", {
          description: err?.message,
        });
      }
    },
  });

  return (
    <Form
      form={form}
      header={
        <PageIntro
          title="Assign Patients"
          description="Add one or more patients to a staff member's active caseload."
        />
      }
    >
      {!staffId && (
        <FormSection
          title="Staff Member"
          description="Select the staff member to assign patients to."
        >
          <ComboboxField
            form={form}
            name="staffId"
            label="Staff Member"
            placeholder="Search and select a staff member…"
            dataKey="staff"
            useQuery={useStaffList}
            className="md:col-span-2"
            getOption={(s) => ({
              key: s.user.displayName,
              value: s.id,
              label: s.user.displayName,
              content: (
                <div className="flex flex-col">
                  <span className="font-medium">{s.user.displayName}</span>
                  {s.user?.email && (
                    <span className="text-xs text-muted-foreground">
                      {s.user.email}
                    </span>
                  )}
                </div>
              ),
            })}
          />
        </FormSection>
      )}

      <FormSection
        title="Assignment Details"
        description="Select all patients to assign in one operation. Already-assigned patients are silently skipped."
      >
        <ComboboxField
          form={form}
          name="patientIds"
          label="Patients"
          placeholder="Search and select patients…"
          dataKey="patients"
          useQuery={usePatients}
          excludeIds={assignedPatientIds}
          multiple
          className="md:col-span-2"
          getOption={(p) => ({
            key: p.user.displayName,
            value: p.id,
            label: p.user.displayName,
            content: (
              <div className="flex flex-col">
                <span className="font-medium">{p.user.displayName}</span>
                {p.user?.email && (
                  <span className="text-xs text-muted-foreground">
                    {p.user.email}
                  </span>
                )}
              </div>
            ),
          })}
        />

        <InputField
          form={form}
          name="notes"
          label="Notes"
          type="textarea"
          placeholder="Optional notes about this assignment…"
          className="md:col-span-2"
        />
      </FormSection>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(listPath)}
        >
          Cancel
        </Button>
        <form.Subscribe
          selector={(s) => [s.canSubmit, s.isSubmitting] as const}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              type="submit"
              disabled={!canSubmit || isSubmitting || isPending}
            >
              {isSubmitting || isPending ? "Assigning…" : "Assign Patients"}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </Form>
  );
};

export default StaffCaseloadAssignForm;
