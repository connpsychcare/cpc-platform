"use client";

import {
  InsuranceAuthorizationStatusEnum,
  type FormSectionType,
} from "@workspace/contracts";
import { insuranceAuthorizationSchema } from "@workspace/contracts/insurance-authorization";
import { ComboboxField } from "@workspace/ui/components/combobox-field";
import { DatePickerField } from "@workspace/ui/components/date-field";
import { FormField, FormSection } from "@workspace/ui/components/form";
import { InputField } from "@workspace/ui/components/input-field";
import { SelectField } from "@workspace/ui/components/select-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { GenericForm } from "@workspace/ui/shared/GenericForm";
import { usePatients } from "@/hooks/patient";
import { useInsuranceAuthorization } from "@/hooks/insurance-authorization";
import { useTreatmentPlans } from "@/hooks/treatment-plan";

interface InsuranceAuthorizationFormProps {
  patientId?: string;
  authId?: string;
  formType: FormSectionType;
}

const InsuranceAuthorizationForm = ({
  patientId,
  authId,
  formType,
}: InsuranceAuthorizationFormProps) => {
  const { data: plansData } = useTreatmentPlans(
    patientId ? { patientId } : undefined,
  );
  const plans = plansData?.treatmentPlans ?? [];
  const currentDate = new Date().toISOString();

  return (
    <GenericForm
      entityId={authId}
      formType={formType}
      entityName="Insurance Authorization"
      description="Track authorized therapy hours and monitor usage against insurance approvals."
      schema={insuranceAuthorizationSchema}
      useQuery={useInsuranceAuthorization}
      defaultValues={{
        patientId: patientId ?? "",
        insurancePlan: "",
        authorizationNumber: "",
        startDate: currentDate,
        endDate: currentDate,
        approvedHours: 1,
        usedHours: 0,
        status: "active",
      }}
    >
      {(form) => (
        <>
          {!patientId && (
            <FormSection
              title="Patient"
              description="Select the patient this authorization belongs to."
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
            title="Authorization Details"
            description="Enter the insurance plan, authorization number, and date range."
          >
            <InputField
              form={form}
              name="insurancePlan"
              label="Insurance Plan"
              placeholder="e.g. Aetna, Cigna, Anthem BCBS"
            />
            <InputField
              form={form}
              name="authorizationNumber"
              label="Authorization Number"
              placeholder="e.g. AUTH-2024-001234"
            />
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
              name="approvedHours"
              label="Approved Hours"
              type="number"
              min={0}
              step={0.25}
              placeholder="e.g. 40"
            />
            <InputField
              form={form}
              name="usedHours"
              label="Used Hours"
              type="number"
              min={0}
              step={0.25}
              placeholder="0"
            />
            <SelectField
              form={form}
              name="status"
              label="Status"
              options={InsuranceAuthorizationStatusEnum.options}
            />
            <FormField
              form={form}
              name="treatmentPlanId"
              label="Treatment Plan (optional)"
            >
              {({ value, onChange }) => (
                <Select
                  value={value ?? "none"}
                  onValueChange={(v) => onChange(v === "none" ? undefined : v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Link to treatment plan…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {plans.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </FormField>
            <InputField
              form={form}
              name="notes"
              label="Notes"
              type="textarea"
              rows={3}
              placeholder="Optional notes about this authorization…"
              className="md:col-span-2"
            />
          </FormSection>
        </>
      )}
    </GenericForm>
  );
};

export default InsuranceAuthorizationForm;
