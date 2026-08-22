"use client";

import {
  TreatmentPlanStatusEnum,
  type FormSectionType,
} from "@workspace/contracts";
import { treatmentPlanSchema } from "@workspace/contracts/treatment-plan";
import { ComboboxField } from "@workspace/ui/components/combobox-field";
import { DatePickerField } from "@workspace/ui/components/date-field";
import { FormSection } from "@workspace/ui/components/form";
import { InputField } from "@workspace/ui/components/input-field";
import { SelectField } from "@workspace/ui/components/select-field";
import { GenericForm } from "@workspace/ui/shared/GenericForm";
import { usePatients } from "@/hooks/patient";
import { useTreatmentPlan } from "@/hooks/treatment-plan";

interface TreatmentPlanFormProps {
  patientId?: string;
  treatmentPlanId?: string;
  formType: FormSectionType;
}

const TreatmentPlanForm = ({
  patientId,
  treatmentPlanId,
  formType,
}: TreatmentPlanFormProps) => (
  <GenericForm
    entityId={treatmentPlanId}
    formType={formType}
    entityName="Treatment Plan"
    description={
      formType === "add"
        ? "Create an individualized psychiatric treatment plan for this patient."
        : "Update the plan details, goals, and timeline for this patient."
    }
    schema={treatmentPlanSchema}
    useQuery={useTreatmentPlan}
    defaultValues={{
      patientId: patientId ?? "",
      title: "",
      status: "draft",
    }}
  >
    {(form) => (
      <>
        {!patientId && (
          <FormSection
            title="Patient"
            description="Select the patient this treatment plan belongs to."
          >
            <ComboboxField
              form={form}
              name="patientId"
              label="Patient"
              placeholder="Search and select a patient…"
              dataKey="patients"
              useQuery={usePatients}
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
          title="Plan Details"
          description="Define the plan title, status, and timeline."
        >
          <InputField
            form={form}
            name="title"
            label="Title"
            placeholder="e.g. Communication Skills BIP 2026"
            className="md:col-span-2"
          />
          <SelectField
            form={form}
            name="status"
            label="Status"
            options={TreatmentPlanStatusEnum.options}
          />
          <div />
          <DatePickerField
            form={form}
            name="startDate"
            label="Start Date"
            placeholder="Select start date"
          />
          <DatePickerField
            form={form}
            name="endDate"
            label="End Date"
            placeholder="Select end date"
          />
          <InputField
            form={form}
            name="description"
            label="Description"
            type="textarea"
            rows={3}
            placeholder="Brief overview of this treatment plan..."
            className="md:col-span-2"
          />
          <InputField
            form={form}
            name="goals"
            label="Goals"
            type="textarea"
            rows={3}
            placeholder="List the overarching goals for this plan..."
            className="md:col-span-2"
          />
        </FormSection>
      </>
    )}
  </GenericForm>
);

export default TreatmentPlanForm;
