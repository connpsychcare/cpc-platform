"use client";

import { behaviorProgramSchema } from "@workspace/contracts/behavior-program";
import type { BehaviorProgramResponse } from "@workspace/contracts/behavior-program";
import { FormSection } from "@workspace/ui/components/form";
import { InputField } from "@workspace/ui/components/input-field";
import { SelectField } from "@workspace/ui/components/select-field";
import { GenericForm } from "@workspace/ui/shared/GenericForm";

import { useBehaviorProgram } from "@/hooks/treatment-plan";

interface BehaviorProgramFormProps {
  treatmentPlanId: string;
  editing?: BehaviorProgramResponse | null;
  onDone?: () => void;
  onCancel?: () => void;
}

const TYPE_OPTIONS = [
  { label: "Skill Building", value: "skillAcquisition" },
  { label: "Symptom Reduction", value: "behaviorReduction" },
];

const STATUS_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Mastered", value: "mastered" },
  { label: "On Hold", value: "onHold" },
  { label: "Discontinued", value: "discontinued" },
];

const BehaviorProgramForm = ({
  treatmentPlanId,
  editing,
  onDone,
  onCancel,
}: BehaviorProgramFormProps) => (
  <GenericForm
    key={`${editing?.id ?? "new"}:${treatmentPlanId}`}
    entityId={editing?.id}
    formType={editing ? "update" : "add"}
    entityName="Care Program"
    submitLabel={editing ? "Save Changes" : "Add Program"}
    schema={behaviorProgramSchema}
    useQuery={useBehaviorProgram as any}
    onSuccess={onDone}
    onCancel={onCancel}
    defaultValues={{
      treatmentPlanId,
      name: "",
      type: "skillAcquisition",
      status: "active",
    }}
  >
    {(form) => (
      <FormSection className="md:grid-cols-1">
        <InputField
          form={form}
          name="name"
          label="Program Name"
          placeholder="e.g. Anxiety Coping Skills"
        />
        <div className="grid grid-cols-2 gap-4">
          <SelectField
            form={form}
            name="type"
            label="Type"
            options={TYPE_OPTIONS}
          />
          <SelectField
            form={form}
            name="status"
            label="Status"
            options={STATUS_OPTIONS}
          />
        </div>
        <InputField
          form={form}
          name="description"
          label="Description"
          type="textarea"
          rows={2}
        />
        <InputField
          form={form}
          name="masteryDefinition"
          label="Mastery Definition"
          type="textarea"
          rows={2}
          placeholder="e.g. 80% correct across 3 consecutive sessions..."
        />
        <InputField
          form={form}
          name="baselineData"
          label="Baseline Data"
          type="textarea"
          rows={2}
          placeholder="Describe baseline performance before intervention..."
        />
      </FormSection>
    )}
  </GenericForm>
);

export default BehaviorProgramForm;
