"use client";

import type { FormSectionType } from "@workspace/contracts";
import { sessionNoteSchema } from "@workspace/contracts/session-note";
import { ComboboxField } from "@workspace/ui/components/combobox-field";
import { DatePickerField } from "@workspace/ui/components/date-field";
import { FormField, FormSection } from "@workspace/ui/components/form";
import { InputField } from "@workspace/ui/components/input-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import CUFormSkeleton from "@workspace/ui/skeleton/CUFormSkeleton";
import { useCurrentUser } from "@workspace/ui/hooks/use-user";
import { GenericForm } from "@workspace/ui/shared/GenericForm";
import { usePatients } from "@/hooks/patient";
import { useSessionNote } from "@/hooks/session-note";
import { useTreatmentPlans } from "@/hooks/treatment-plan";

interface SessionNoteFormProps {
  patientId?: string;
  noteId?: string;
  formType: FormSectionType;
}

const SessionNoteForm = ({
  patientId,
  noteId,
  formType,
}: SessionNoteFormProps) => {
  const { currentUser } = useCurrentUser();
  const { data: plansData } = useTreatmentPlans(
    patientId ? ({ patientId, limit: 50 } as any) : undefined,
  );
  const currentDate = new Date().toISOString();
  const plans = plansData?.treatmentPlans ?? [];

  if (formType === "add" && !currentUser) return <CUFormSkeleton />;

  return (
    <GenericForm
      entityId={noteId}
      formType={formType}
      entityName="Session Note"
      description={
        formType === "add"
          ? "Record a structured clinical session note for this patient."
          : "Update the session note details and clinical observations."
      }
      schema={sessionNoteSchema}
      useQuery={useSessionNote}
      defaultValues={{
        patientId: patientId ?? "",
        therapistId: currentUser?.id ?? "",
        sessionDate: currentDate,
      }}
    >
      {(form) => (
        <>
          {!patientId && (
            <FormSection
              title="Patient"
              description="Select the patient this session note belongs to."
            >
              <ComboboxField
                form={form}
                name="patientId"
                label="Patient"
                placeholder="Search and select a patient…"
                dataKey="patients"
                useQuery={usePatients}
                queryArgs={{ limit: 200 }}
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
            title="Session Details"
            description="Set the date, duration, and linked treatment plan."
          >
            <DatePickerField
              form={form}
              name="sessionDate"
              label="Session Date"
              placeholder="Select session date"
            />
            <InputField
              form={form}
              name="durationMinutes"
              label="Duration (minutes)"
              type="number"
              min={1}
              max={480}
              placeholder="e.g. 60"
            />
            <FormField
              form={form}
              name="treatmentPlanId"
              label="Linked Treatment Plan"
              className="md:col-span-2"
            >
              {({ value, onChange }) => (
                <Select
                  value={value ?? "none"}
                  onValueChange={(v) => onChange(v === "none" ? undefined : v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a treatment plan (optional)" />
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
          </FormSection>

          <FormSection
            title="Clinical Notes"
            description="Document session observations, behavior, and next steps."
          >
            <InputField
              form={form}
              name="summary"
              label="Session Summary"
              type="textarea"
              rows={4}
              placeholder="Describe what was covered during this session..."
              className="md:col-span-2"
            />
            <InputField
              form={form}
              name="clientBehavior"
              label="Behavioral Observations"
              type="textarea"
              rows={4}
              placeholder="Note observable behaviors, responses, and engagement level..."
              className="md:col-span-2"
            />
            <InputField
              form={form}
              name="nextSteps"
              label="Next Steps"
              type="textarea"
              rows={3}
              placeholder="Goals for the next session, parent instructions, follow-ups..."
              className="md:col-span-2"
            />
          </FormSection>
        </>
      )}
    </GenericForm>
  );
};

export default SessionNoteForm;
