"use client";

import { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { StepFooter, StepIntro } from "../shared";

export type AdolescentIntakeData = {
  // Parent section
  presentingConcerns: string;
  symptomOnset: string;
  schoolGrade: string;
  academicPerformance: string;
  socialFunctioning: string;
  behaviorAtHome: string;
  behaviorAtSchool: string;
  developmentalHistory: string;
  priorDiagnoses: string;
  priorMedications: string;
  familyPsychHistory: string;
  livingArrangement: string;
  substanceUse: string;
  // Safety (parent)
  safetyParentObservations: string;
  // Adolescent self-report (for patients 12+)
  selfReportMood: string;
  selfReportWorries: string;
  selfReportSchool: string;
  selfReportFriends: string;
  selfReportHome: string;
  selfReportSafety: string;
  selfReportHelp: string;
};

const EMPTY: AdolescentIntakeData = {
  presentingConcerns: "",
  symptomOnset: "",
  schoolGrade: "",
  academicPerformance: "",
  socialFunctioning: "",
  behaviorAtHome: "",
  behaviorAtSchool: "",
  developmentalHistory: "",
  priorDiagnoses: "",
  priorMedications: "",
  familyPsychHistory: "",
  livingArrangement: "",
  substanceUse: "",
  safetyParentObservations: "",
  selfReportMood: "",
  selfReportWorries: "",
  selfReportSchool: "",
  selfReportFriends: "",
  selfReportHome: "",
  selfReportSafety: "",
  selfReportHelp: "",
};

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

interface AdolescentIntakeFormProps {
  isMinorSelfConsenting?: boolean;
  stepLabel: string;
  onComplete: (data: AdolescentIntakeData) => void;
  onBack: () => void;
}

export function AdolescentIntakeForm({
  isMinorSelfConsenting = false,
  stepLabel,
  onComplete,
  onBack,
}: AdolescentIntakeFormProps) {
  const [data, setData] = useState<AdolescentIntakeData>(EMPTY);
  const [showError, setShowError] = useState(false);

  function set(field: keyof AdolescentIntakeData) {
    return (value: string) => setData((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit() {
    if (!data.presentingConcerns.trim()) {
      setShowError(true);
      return;
    }
    onComplete(data);
  }

  return (
    <div>
      <StepIntro
        step={stepLabel}
        title="What brings your child to Connected Psychiatric Care?"
        body="This form has a parent/guardian section and an adolescent self-report section. Only the first question is required - everything else can be skipped or filled in later."
      />

      <div className="mt-8 space-y-8">
        <div className="rounded-2xl bg-secondary/60 p-5 space-y-6">
          <p className="eyebrow text-accent">Section A - Parent / guardian</p>

          <section className="space-y-4">
            <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Presenting concerns
            </h5>
            <Textarea
              label="What concerns bring your child to psychiatric care today?"
              value={data.presentingConcerns}
              onChange={set("presentingConcerns")}
              placeholder="Describe the main concerns in your own words..."
              required
              invalid={showError && !data.presentingConcerns.trim()}
              rows={3}
            />
            <TextInput
              label="When did these concerns begin?"
              value={data.symptomOnset}
              onChange={set("symptomOnset")}
              placeholder="e.g., Past year, since age 8, suddenly last month"
            />
          </section>

          <section className="space-y-4">
            <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              School &amp; social functioning
            </h5>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput
                label="Current grade / school year"
                value={data.schoolGrade}
                onChange={set("schoolGrade")}
                placeholder="e.g., 8th grade, high school junior"
              />
              <TextInput
                label="Academic performance"
                value={data.academicPerformance}
                onChange={set("academicPerformance")}
                placeholder="e.g., Passing, struggling, A/B student"
              />
            </div>
            <Textarea
              label="Social functioning with peers"
              value={data.socialFunctioning}
              onChange={set("socialFunctioning")}
              placeholder="Describe friendships, peer relationships, social skills..."
            />
            <Textarea
              label="Behavior at home"
              value={data.behaviorAtHome}
              onChange={set("behaviorAtHome")}
              placeholder="Describe behavior, mood, family interactions at home..."
            />
            <Textarea
              label="Behavior at school (from teachers / reports, if known)"
              value={data.behaviorAtSchool}
              onChange={set("behaviorAtSchool")}
              placeholder="Any teacher feedback, IEP, 504 plan, disciplinary history..."
            />
          </section>

          <section className="space-y-4">
            <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Developmental &amp; medical history
            </h5>
            <Textarea
              label="Developmental history"
              value={data.developmentalHistory}
              onChange={set("developmentalHistory")}
              placeholder="Any prenatal complications, developmental delays, speech therapy, early concerns..."
            />
            <Textarea
              label="Prior psychiatric diagnoses or evaluations"
              value={data.priorDiagnoses}
              onChange={set("priorDiagnoses")}
              placeholder="List any prior diagnoses, or write 'None'"
            />
            <Textarea
              label="Prior or current psychiatric medications"
              value={data.priorMedications}
              onChange={set("priorMedications")}
              placeholder="List medications, doses, and whether they helped. Or write 'None'"
            />
            <Textarea
              label="Family history of psychiatric conditions"
              value={data.familyPsychHistory}
              onChange={set("familyPsychHistory")}
              placeholder="Any mental health conditions in parents, siblings, or extended family. Or write 'None / Unknown'"
            />
            <TextInput
              label="Current living arrangement"
              value={data.livingArrangement}
              onChange={set("livingArrangement")}
              placeholder="e.g., With both parents, single-parent home, with grandparents"
            />
            <Textarea
              label="Any known substance use (if applicable)"
              value={data.substanceUse}
              onChange={set("substanceUse")}
              placeholder="If you are aware of any use of alcohol, cannabis, or other substances, describe here. Or write 'None'"
            />
          </section>

          <section className="space-y-4">
            <h5 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Safety (parent observations)
            </h5>
            <div className="panel-warning rounded-xl px-4 py-3 text-sm">
              If your child is in immediate danger, please call <strong className="text-warning">911</strong> or
              go to your nearest emergency room. For a crisis line, call or text{" "}
              <strong className="text-warning">988</strong>.
            </div>
            <Textarea
              label="Have you noticed any safety concerns? (self-harm, aggression, running away)"
              value={data.safetyParentObservations}
              onChange={set("safetyParentObservations")}
              placeholder="Describe any concerns, or write 'None'"
              rows={3}
            />
          </section>
        </div>

        <div className="rounded-2xl border border-border p-5 space-y-6">
          <div>
            <p className="eyebrow">
              Section B - For the young person{" "}
              {isMinorSelfConsenting ? "" : "(optional but encouraged)"}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              This section is for the young person to complete in their own words. Your answers are
              shared with your provider to help them understand how you&apos;re feeling.
            </p>
          </div>

          <Textarea
            label="How have you been feeling lately? (mood, emotions)"
            value={data.selfReportMood}
            onChange={set("selfReportMood")}
            placeholder="Describe in your own words how you've been feeling..."
          />
          <Textarea
            label="Is there anything you worry about a lot?"
            value={data.selfReportWorries}
            onChange={set("selfReportWorries")}
            placeholder="What worries or bothers you most?"
          />
          <Textarea
            label="How are things going at school?"
            value={data.selfReportSchool}
            onChange={set("selfReportSchool")}
            placeholder="Grades, attention, teachers, any difficulties..."
          />
          <Textarea
            label="How are things going with your friends?"
            value={data.selfReportFriends}
            onChange={set("selfReportFriends")}
            placeholder="Friendships, social life, fitting in..."
          />
          <Textarea
            label="How are things at home with your family?"
            value={data.selfReportHome}
            onChange={set("selfReportHome")}
            placeholder="Family relationships, home environment..."
          />
          <Textarea
            label="Is there anything about your safety you'd like your provider to know?"
            value={data.selfReportSafety}
            onChange={set("selfReportSafety")}
            placeholder="You can share anything here - it's confidential. Or write 'Nothing to share'"
          />
          <Textarea
            label="What do you most want help with from your provider?"
            value={data.selfReportHelp}
            onChange={set("selfReportHelp")}
            placeholder="What would feel most helpful to you?"
          />
        </div>

        {showError && (
          <p className="text-sm text-destructive">
            Please tell us the presenting concerns before continuing.
          </p>
        )}

        <StepFooter onBack={onBack} onContinue={handleSubmit} />
      </div>
    </div>
  );
}
