"use client";

import { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { StepFooter, StepIntro } from "../shared";

export type AdultIntakeData = {
  chiefComplaint: string;
  symptomOnset: string;
  symptomDescription: string;
  priorDiagnoses: string;
  priorHospitalizations: string;
  priorMedications: string;
  currentTherapist: string;
  substanceUse: string;
  familyPsychHistory: string;
  livingArrangement: string;
  employment: string;
  education: string;
  relationshipStatus: string;
  supportSystem: string;
  legalHistory: string;
  safetyCurrentThoughts: string;
  safetyPastHistory: string;
  safetyPlan: string;
};

const EMPTY: AdultIntakeData = {
  chiefComplaint: "",
  symptomOnset: "",
  symptomDescription: "",
  priorDiagnoses: "",
  priorHospitalizations: "",
  priorMedications: "",
  currentTherapist: "",
  substanceUse: "",
  familyPsychHistory: "",
  livingArrangement: "",
  employment: "",
  education: "",
  relationshipStatus: "",
  supportSystem: "",
  legalHistory: "",
  safetyCurrentThoughts: "",
  safetyPastHistory: "",
  safetyPlan: "",
};

interface AdultIntakeFormProps {
  prefill?: Partial<AdultIntakeData>;
  stepLabel: string;
  onComplete: (data: AdultIntakeData) => void;
  onBack: () => void;
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
  required,
  invalid,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  invalid?: boolean;
  rows?: number;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1 text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-accent">*</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          "w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm",
          "placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring resize-y",
          invalid && "border-destructive",
        )}
      />
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm",
          "placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring",
        )}
      />
    </div>
  );
}

export function AdultIntakeForm({ prefill, stepLabel, onComplete, onBack }: AdultIntakeFormProps) {
  const [data, setData] = useState<AdultIntakeData>({ ...EMPTY, ...prefill });
  const [showError, setShowError] = useState(false);

  function set(field: keyof AdultIntakeData) {
    return (value: string) => setData((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit() {
    if (!data.chiefComplaint.trim()) {
      setShowError(true);
      return;
    }
    onComplete(data);
  }

  return (
    <div>
      <StepIntro
        step={stepLabel}
        title="What brings you to Connected Psychiatric Care?"
        body="Only the first question is required - answer in your own words, brief notes are fine. Everything else helps your provider prepare, and can be skipped or filled in later."
      />

      <div className="mt-8 space-y-8">
        <section className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Presenting problem
          </h4>
          <Textarea
            label="What brings you in today? (Chief complaint)"
            value={data.chiefComplaint}
            onChange={set("chiefComplaint")}
            placeholder="Describe your main concern in your own words..."
            required
            invalid={showError && !data.chiefComplaint.trim()}
            rows={3}
          />
          <TextInput
            label="When did these concerns begin?"
            value={data.symptomOnset}
            onChange={set("symptomOnset")}
            placeholder="e.g., About 6 months ago, or since childhood"
          />
          <Textarea
            label="Describe your current symptoms in more detail"
            value={data.symptomDescription}
            onChange={set("symptomDescription")}
            placeholder="What are you experiencing? How has it been affecting your daily life?"
            rows={4}
          />
        </section>

        <section className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Psychiatric history
          </h4>
          <Textarea
            label="Previous psychiatric diagnoses"
            value={data.priorDiagnoses}
            onChange={set("priorDiagnoses")}
            placeholder="List any prior diagnoses (e.g., depression, anxiety, ADHD) or write 'None'"
          />
          <Textarea
            label="Prior psychiatric hospitalizations or intensive programs"
            value={data.priorHospitalizations}
            onChange={set("priorHospitalizations")}
            placeholder="Include dates and reasons, or write 'None'"
          />
          <Textarea
            label="Previous psychiatric medications"
            value={data.priorMedications}
            onChange={set("priorMedications")}
            placeholder="List medications tried, whether they helped, and any side effects. Or write 'None'"
            rows={4}
          />
          <TextInput
            label="Current or recent therapist / counselor (if any)"
            value={data.currentTherapist}
            onChange={set("currentTherapist")}
            placeholder="Name and type of therapy, or 'None'"
          />
        </section>

        <section className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Substance use
          </h4>
          <Textarea
            label="Current or past use of alcohol, tobacco, cannabis, or other substances"
            value={data.substanceUse}
            onChange={set("substanceUse")}
            placeholder="Include frequency, quantity, and any history of treatment. Or write 'None'"
            rows={3}
          />
        </section>

        <section className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Family psychiatric history
          </h4>
          <Textarea
            label="Family history of psychiatric conditions"
            value={data.familyPsychHistory}
            onChange={set("familyPsychHistory")}
            placeholder="List any known mental health conditions in immediate family members. Or write 'None / Unknown'"
            rows={3}
          />
        </section>

        <section className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Social history
          </h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              label="Current living arrangement"
              value={data.livingArrangement}
              onChange={set("livingArrangement")}
              placeholder="e.g., Alone, with partner, with family"
            />
            <TextInput
              label="Employment / occupation"
              value={data.employment}
              onChange={set("employment")}
              placeholder="e.g., Full-time, unemployed, retired"
            />
            <TextInput
              label="Highest level of education"
              value={data.education}
              onChange={set("education")}
              placeholder="e.g., High school, Bachelor's, Graduate"
            />
            <TextInput
              label="Relationship status"
              value={data.relationshipStatus}
              onChange={set("relationshipStatus")}
              placeholder="e.g., Single, married, divorced"
            />
          </div>
          <Textarea
            label="Support system"
            value={data.supportSystem}
            onChange={set("supportSystem")}
            placeholder="Who do you rely on for emotional support? (family, friends, community)"
          />
          <TextInput
            label="Legal history (if any)"
            value={data.legalHistory}
            onChange={set("legalHistory")}
            placeholder="Any current legal issues or probation? Or 'None'"
          />
        </section>

        <section className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Safety assessment
          </h4>
          <div className="panel-warning rounded-xl px-4 py-3 text-sm">
            Your safety is our priority. These questions are standard and help us provide the best
            care. If you are in crisis right now, please call or text{" "}
            <strong className="text-warning">988</strong> (Suicide &amp; Crisis Lifeline).
          </div>
          <Textarea
            label="Current thoughts of harming yourself or others"
            value={data.safetyCurrentThoughts}
            onChange={set("safetyCurrentThoughts")}
            placeholder="Describe any current thoughts, or write 'None'"
            rows={3}
          />
          <Textarea
            label="Past history of self-harm or suicide attempts"
            value={data.safetyPastHistory}
            onChange={set("safetyPastHistory")}
            placeholder="Include approximate dates and circumstances, or write 'None'"
            rows={3}
          />
          <Textarea
            label="What helps you stay safe during difficult times?"
            value={data.safetyPlan}
            onChange={set("safetyPlan")}
            placeholder="e.g., Calling a friend, removing access to means, contacting your provider"
            rows={2}
          />
        </section>

        {showError && (
          <p className="text-sm text-destructive">
            Please tell us what brings you in before continuing.
          </p>
        )}

        <StepFooter onBack={onBack} onContinue={handleSubmit} />
      </div>
    </div>
  );
}
