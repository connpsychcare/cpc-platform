"use client";

import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";

import type { FormSectionType } from "@workspace/contracts";
import {
  caregiverAccessSchema,
  type CaregiverAccessType,
} from "@workspace/contracts/caregiver-access";
import { Button } from "@workspace/ui/components/button";
import { ComboboxField } from "@workspace/ui/components/combobox-field";
import { Form, FormSection } from "@workspace/ui/components/form";
import { InputField } from "@workspace/ui/components/input-field";

import PageIntro from "@workspace/ui/shared/PageIntro";
import { useGrantCaregiverAccess } from "@/hooks/caregiver-access";
import { usePatients } from "@/hooks/patient";

interface CaregiverAccessFormProps {
  patientId?: string;
  formType: FormSectionType;
}

const CaregiverAccessForm = ({ patientId }: CaregiverAccessFormProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const listPath = pathname.substring(0, pathname.lastIndexOf("/"));

  const { grantAsync, isPending } = useGrantCaregiverAccess();

  const form = useForm({
    defaultValues: {
      patientIds: patientId ? [patientId] : ([] as string[]),
      caregiverIds: [] as string[],
      notes: "",
    } as CaregiverAccessType,
    validators: {
      onSubmit: caregiverAccessSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await grantAsync(value);
        toast.success("Caregiver access granted.");
        router.push(listPath);
      } catch (err: any) {
        toast.error("Failed to grant access.", { description: err?.message });
      }
    },
  });

  return (
    <Form
      form={form}
      header={
        <PageIntro
          title="Grant Caregiver Access"
          description="Link caregiver accounts to one or more patients, giving them read-only access to clinical data."
        />
      }
    >
      {!patientId && (
        <FormSection
          title="Patients"
          description="Select one or more patients whose clinical data will be shared with the caregivers below."
        >
          <ComboboxField
            form={form}
            name="patientIds"
            label="Patients"
            placeholder="Search and select patients…"
            dataKey="patients"
            useQuery={usePatients}
            multiple
            className="md:col-span-2"
            getOption={(p: any) => ({
              key: `${p.user.displayName} ${p.user.email ?? ""}`,
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
        </FormSection>
      )}

      <FormSection
        title="Caregivers"
        description="Select one or more patient accounts to grant caregiver access. Only patient-role users can be linked as caregivers."
      >
        <ComboboxField
          form={form}
          name="caregiverIds"
          label="Caregiver accounts"
          placeholder="Search patient accounts…"
          dataKey="patients"
          useQuery={usePatients}
          multiple
          className="md:col-span-2"
          getOption={(p: any) => ({
            key: `${p.user.displayName} ${p.user.email ?? ""}`,
            value: p.user.id,
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
          label="Notes (optional)"
          type="textarea"
          placeholder="e.g. Parent of patient, authorized on 2026-01-15"
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
              {isSubmitting || isPending ? "Granting…" : "Grant Access"}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </Form>
  );
};

export default CaregiverAccessForm;
