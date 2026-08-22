"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "@tanstack/react-form";

import type { FormSectionType } from "@workspace/contracts";
import {
  dataPointSchema,
  type DataPointType,
} from "@workspace/contracts/data-point";
import { Button } from "@workspace/ui/components/button";
import { Form, FormField, FormSection } from "@workspace/ui/components/form";
import { InputField } from "@workspace/ui/components/input-field";
import { SelectField } from "@workspace/ui/components/select-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import CUFormSkeleton from "@workspace/ui/skeleton/CUFormSkeleton";

import PageIntro from "@workspace/ui/shared/PageIntro";
import { useRolePrefix } from "@/hooks/use-role-prefix";
import { useDataPoint } from "@/hooks/data-point";
import { useBehaviorPrograms, useTreatmentPlans } from "@/hooks/treatment-plan";

interface DataPointFormProps {
  patientId: string;
  sessionNoteId: string;
  dataPointId?: string;
  formType: FormSectionType;
}

const RECORDING_TYPE_OPTIONS = [
  { label: "Discrete Trial", value: "discreteTrial" },
  { label: "Interval Recording", value: "intervalRecording" },
  { label: "Frequency / Rate", value: "frequencyRate" },
  { label: "Duration", value: "duration" },
];

const RESPONSE_OPTIONS = [
  { label: "Correct", value: "correct" },
  { label: "Incorrect", value: "incorrect" },
  { label: "Prompted", value: "prompted" },
  { label: "No Response", value: "noResponse" },
];

const DataPointForm = ({
  patientId,
  sessionNoteId,
  dataPointId,
  formType,
}: DataPointFormProps) => {
  const router = useRouter();
  const rolePrefix = useRolePrefix();

  const {
    data: dataPoint,
    isLoading,
    mutateAsync,
    isPending,
  } = useDataPoint(dataPointId!);

  const { data: plansData } = useTreatmentPlans({
    patientId,
    limit: 50,
  });

  const firstPlanId = plansData?.treatmentPlans?.[0]?.id;
  const { data: programsData } = useBehaviorPrograms(
    firstPlanId ? { treatmentPlanId: firstPlanId, limit: 100 } : undefined,
  );
  const programs = programsData?.programs ?? [];

  const listPath = `${rolePrefix}/patients/${patientId}/session-notes/${sessionNoteId}/data-points`;
  const defaultValues: DataPointType = {
    sessionNoteId,
    programId: "",
    recordingType: "discreteTrial",
    response: undefined,
    value: undefined,
    trialNumber: undefined,
    notes: undefined,
    recordedAt: undefined,
  };

  const form = useForm({
    defaultValues,
    validators: { onSubmit: dataPointSchema },
    onSubmit: async ({ value }) => {
      if (!value.programId || !value.recordingType) {
        toast.error("Program and recording type are required.");
        return;
      }
      try {
        await mutateAsync({ ...value, sessionNoteId });
        toast.success(
          formType === "add" ? "Data point recorded." : "Data point updated.",
        );

        router.push(listPath);
      } catch (err: any) {
        toast.error(
          formType === "add"
            ? "Failed to record data point."
            : "Failed to update data point.",
          { description: err?.message },
        );
      }
    },
  });

  useEffect(() => {
    if (dataPoint && formType === "update") {
      form.reset(dataPoint);
    }
  }, [dataPoint, form, formType]);

  if (formType === "update" && isLoading) return <CUFormSkeleton />;

  return (
    <Form
      form={form}
      header={
        <PageIntro
          title={formType === "add" ? "Record Data Point" : "Edit Data Point"}
          description={
            formType === "add"
              ? "Record trial-by-trial data for a care program in this session."
              : "Update the recorded data point details."
          }
        />
      }
    >
      <FormSection
        title="Data Entry"
        description="Select the program, recording type, and response for this trial."
      >
        <FormField form={form} name="programId" label="Care Program">
          {({ value, onChange, isInvalid }) => (
            <Select value={value ?? ""} onValueChange={onChange}>
              <SelectTrigger aria-invalid={isInvalid}>
                <SelectValue placeholder="Select program…" />
              </SelectTrigger>
              <SelectContent>
                {programs.length === 0 ? (
                  <SelectItem value="_none" disabled>
                    No programs found
                  </SelectItem>
                ) : (
                  programs.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          )}
        </FormField>

        <SelectField
          form={form}
          name="recordingType"
          label="Recording Type"
          options={RECORDING_TYPE_OPTIONS}
        />

        <FormField form={form} name="response" label="Response">
          {({ value, onChange }) => (
            <Select
              value={value ?? "none"}
              onValueChange={(v) => onChange(v === "none" ? undefined : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select response…" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">- Not specified -</SelectItem>
                {RESPONSE_OPTIONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormField>

        <InputField
          form={form}
          name="value"
          label="Value"
          type="number"
          step={0.01}
          min={0}
          placeholder="e.g. 85 (% correct), 12 (frequency)"
        />

        <InputField
          form={form}
          name="trialNumber"
          label="Trial Number"
          type="number"
          min={1}
          placeholder="e.g. 1"
        />

        <InputField
          form={form}
          name="notes"
          label="Notes"
          type="textarea"
          rows={3}
          placeholder="Additional observations or context…"
          className="md:col-span-2"
        />
      </FormSection>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(listPath)}
          disabled={isPending}
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
              {isSubmitting || isPending
                ? "Saving…"
                : formType === "add"
                  ? "Save Data Point"
                  : "Update Data Point"}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </Form>
  );
};

export default DataPointForm;
