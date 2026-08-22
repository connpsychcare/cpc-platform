"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

// ── Vanderbilt Teacher Rating Scale (NICHQ) ────────────────────
const INATTENTION_ITEMS = [
  "Fails to give close attention to details or makes careless mistakes in schoolwork.",
  "Has difficulty sustaining attention in tasks or play activities.",
  "Does not seem to listen when spoken to directly.",
  "Does not follow through on instructions and fails to finish schoolwork (not due to opposition).",
  "Has difficulty organizing tasks and activities.",
  "Avoids, dislikes, or reluctantly engages in tasks requiring sustained mental effort.",
  "Loses things necessary for tasks or activities.",
  "Is easily distracted by extraneous stimuli.",
  "Is forgetful in daily activities.",
];

const HYPERACTIVITY_ITEMS = [
  "Fidgets with hands or feet or squirms in seat.",
  "Leaves seat in classroom or in other situations in which remaining seated is expected.",
  "Runs about or climbs excessively in situations in which it is inappropriate.",
  "Has difficulty playing or engaging in leisure activities quietly.",
  "Is 'on the go' or often acts as if 'driven by a motor'.",
  "Talks excessively.",
  "Blurts out answers before questions have been completed.",
  "Has difficulty awaiting turn.",
  "Interrupts or intrudes on others.",
];

const PERFORMANCE_ITEMS = [
  "Reading",
  "Mathematics",
  "Written Expression",
  "Classroom Behavior",
  "Relationship with Peers",
  "Following Directions",
  "Disrupting Class",
  "Assignment Completion",
  "Organizational Skills",
];

const FREQ_OPTIONS = ["Never", "Occasionally", "Often", "Very Often"] as const;
const PERF_OPTIONS = [
  "Excellent",
  "Above Average",
  "Average",
  "Somewhat Problematic",
  "Problematic",
] as const;

type FormState = {
  teacherName: string;
  schoolName: string;
  gradeLevel: string;
  yearsKnownStudent: string;
  inattention: number[];
  hyperactivity: number[];
  performance: number[];
  additionalComments: string;
};

// ── Rating button ─────────────────────────────────────────────

function RatingButton({
  selected,
  label,
  onClick,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md border px-2 py-1.5 text-xs font-medium transition-colors cursor-pointer",
        selected
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-foreground hover:border-primary/40",
      )}
    >
      {label}
    </button>
  );
}

// ── Rating row ────────────────────────────────────────────────

function RatingRow({
  number,
  text,
  options,
  value,
  onSelect,
}: {
  number: number;
  text: string;
  options: readonly string[];
  value: number;
  onSelect: (v: number) => void;
}) {
  return (
    <div className="grid gap-2 rounded-lg border border-border bg-card p-3">
      <p className="text-sm text-foreground leading-relaxed">
        <span className="mr-1.5 text-xs font-semibold text-muted-foreground">
          {number}.
        </span>
        {text}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt, i) => (
          <RatingButton
            key={i}
            label={opt}
            selected={value === i}
            onClick={() => onSelect(i)}
          />
        ))}
      </div>
    </div>
  );
}

// ── Token validation/submission API calls ─────────────────────

type ValidateTokenResult =
  | { valid: true; studentFirstName: string; teacherName: string | null; schoolName: string | null; expiresAt: string }
  | { valid: false; reason: "not_found" | "already_submitted" | "expired" };

async function validateToken(token: string): Promise<ValidateTokenResult> {
  const res = await fetch(`/api/teacher-token/${token}/validate`);
  if (!res.ok) return { valid: false, reason: "not_found" };
  return res.json();
}

async function submitTeacherForm(payload: {
  token: string;
  formData: FormState;
}): Promise<void> {
  const res = await fetch(`/api/teacher-token/${payload.token}/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      inattentionItems: payload.formData.inattention,
      hyperactivityItems: payload.formData.hyperactivity,
      performanceItems: payload.formData.performance,
      teacherName: payload.formData.teacherName || undefined,
      schoolName: payload.formData.schoolName || undefined,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? "Submission failed.");
  }
}

// ── Main component ────────────────────────────────────────────

export default function TeacherAssessmentClient({ token }: { token: string }) {
  const [section, setSection] = useState<
    "intro" | "teacher-info" | "inattention" | "hyperactivity" | "performance" | "done"
  >("intro");

  const [form, setForm] = useState<FormState>({
    teacherName: "",
    schoolName: "",
    gradeLevel: "",
    yearsKnownStudent: "",
    inattention: Array(INATTENTION_ITEMS.length).fill(-1),
    hyperactivity: Array(HYPERACTIVITY_ITEMS.length).fill(-1),
    performance: Array(PERFORMANCE_ITEMS.length).fill(-1),
    additionalComments: "",
  });

  // Validate token on mount
  const { data: tokenInfo, isLoading: isValidating, error: tokenError } = useQuery({
    queryKey: ["teacher-token", token],
    queryFn: () => validateToken(token),
    retry: false,
  });

  const submitMutation = useMutation({
    mutationFn: () => submitTeacherForm({ token, formData: form }),
    onSuccess: () => setSection("done"),
    onError: (err: any) =>
      toast.error("Submission failed", { description: err?.message }),
  });

  function setInattention(i: number, v: number) {
    setForm((f) => {
      const next = [...f.inattention];
      next[i] = v;
      return { ...f, inattention: next };
    });
  }

  function setHyperactivity(i: number, v: number) {
    setForm((f) => {
      const next = [...f.hyperactivity];
      next[i] = v;
      return { ...f, hyperactivity: next };
    });
  }

  function setPerformance(i: number, v: number) {
    setForm((f) => {
      const next = [...f.performance];
      next[i] = v;
      return { ...f, performance: next };
    });
  }

  if (isValidating) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (tokenError || !tokenInfo) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive text-2xl">
          ✕
        </div>
        <h1 className="font-primary text-2xl text-foreground">Link Not Found</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          This assessment link could not be found. Please contact the clinic.
        </p>
      </div>
    );
  }

  if (!tokenInfo.valid && tokenInfo.reason === "already_submitted") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary text-2xl">
          ✓
        </div>
        <h1 className="font-primary text-2xl text-foreground">Already Submitted</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Your assessment for this student has already been received. Thank you for your time.
        </p>
      </div>
    );
  }

  if (!tokenInfo.valid) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive text-2xl">
          ✕
        </div>
        <h1 className="font-primary text-2xl text-foreground">Link Expired or Invalid</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          This teacher assessment link has expired or is no longer valid. Please contact the
          clinic for a new link.
        </p>
      </div>
    );
  }

  const studentName = tokenInfo.studentFirstName ?? "the student";

  // ── Validate each section before advancing ─────────────────

  function canAdvanceTeacherInfo() {
    return form.teacherName.trim().length >= 2;
  }

  function canAdvanceInattention() {
    return form.inattention.every((v) => v >= 0);
  }

  function canAdvanceHyperactivity() {
    return form.hyperactivity.every((v) => v >= 0);
  }

  function canSubmit() {
    return form.performance.every((v) => v >= 0);
  }

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header band */}
      <div className="bg-sidebar text-sidebar-foreground px-6 py-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/60">
          Connected Psychiatric Care
        </p>
        <p className="mt-0.5 text-sm font-semibold">
          Vanderbilt ADHD Diagnostic Teacher Rating Scale
        </p>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">

        {/* ── Intro ─────────────────────────────────────────── */}
        {section === "intro" && (
          <div className="rounded-xl border bg-card shadow-sm p-6 space-y-5">
            <div>
              <h1 className="font-primary text-2xl text-foreground">
                Teacher Assessment Request
              </h1>
              <p className="mt-2 text-sm text-muted-foreground leading-7">
                You&apos;ve been invited to complete a Vanderbilt ADHD Diagnostic Teacher Rating Scale
                for <strong>{studentName}</strong>, a student in your class.
              </p>
            </div>
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 space-y-2 text-sm text-foreground">
              <p className="font-semibold text-primary text-xs uppercase tracking-widest">
                About this form
              </p>
              <ul className="space-y-1.5 text-sm text-muted-foreground list-none">
                <li>• Takes approximately 10 to 15 minutes to complete</li>
                <li>• Covers attention, behavior, and academic performance</li>
                <li>• Your responses are confidential and go directly to the clinician</li>
                <li>• You do NOT need a patient account - this link is for you only</li>
              </ul>
            </div>
            <p className="text-xs text-muted-foreground">
              This form is part of a clinical evaluation. Your responses will be used by{" "}
              Connected Psychiatric Care to assist in diagnosing and planning treatment
              for {studentName}.
            </p>
            <Button onClick={() => setSection("teacher-info")} className="w-full">
              Begin Assessment
            </Button>
          </div>
        )}

        {/* ── Teacher Info ───────────────────────────────────── */}
        {section === "teacher-info" && (
          <div className="rounded-xl border bg-card shadow-sm p-6 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Step 1 of 4
              </p>
              <h2 className="mt-1 font-primary text-xl text-foreground">Your Information</h2>
              <p className="text-sm text-muted-foreground mt-1">
                This helps the clinician identify your report.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  Your Full Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  value={form.teacherName}
                  onChange={(e) => setForm((f) => ({ ...f, teacherName: e.target.value }))}
                  placeholder="Ms. Jane Smith"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">
                  School Name
                </label>
                <input
                  type="text"
                  value={form.schoolName}
                  onChange={(e) => setForm((f) => ({ ...f, schoolName: e.target.value }))}
                  placeholder="Lincoln Elementary"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Grade Level
                  </label>
                  <input
                    type="text"
                    value={form.gradeLevel}
                    onChange={(e) => setForm((f) => ({ ...f, gradeLevel: e.target.value }))}
                    placeholder="3rd Grade"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">
                    Years Known This Student
                  </label>
                  <input
                    type="text"
                    value={form.yearsKnownStudent}
                    onChange={(e) => setForm((f) => ({ ...f, yearsKnownStudent: e.target.value }))}
                    placeholder="1 year"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setSection("intro")}>
                Back
              </Button>
              <Button
                onClick={() => setSection("inattention")}
                disabled={!canAdvanceTeacherInfo()}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* ── Inattention (9 items) ─────────────────────────── */}
        {section === "inattention" && (
          <div className="rounded-xl border bg-card shadow-sm p-6 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Step 2 of 4 - Inattention Symptoms
              </p>
              <h2 className="mt-1 font-primary text-xl text-foreground">
                Attention Behaviors
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Rate how often <strong>{studentName}</strong> shows each behavior compared
                to other students of the same age. Rate each item using the frequency scale.
              </p>
            </div>
            <div className="space-y-3">
              {INATTENTION_ITEMS.map((text, i) => (
                <RatingRow
                  key={i}
                  number={i + 1}
                  text={text}
                  options={FREQ_OPTIONS}
                  value={form.inattention[i]!}
                  onSelect={(v) => setInattention(i, v)}
                />
              ))}
            </div>
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setSection("teacher-info")}>
                Back
              </Button>
              <Button
                onClick={() => setSection("hyperactivity")}
                disabled={!canAdvanceInattention()}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* ── Hyperactivity/Impulsivity (9 items) ──────────── */}
        {section === "hyperactivity" && (
          <div className="rounded-xl border bg-card shadow-sm p-6 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Step 3 of 4 - Hyperactivity / Impulsivity
              </p>
              <h2 className="mt-1 font-primary text-xl text-foreground">
                Activity &amp; Impulse Behaviors
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Rate each behavior for <strong>{studentName}</strong> over the past 6 months.
              </p>
            </div>
            <div className="space-y-3">
              {HYPERACTIVITY_ITEMS.map((text, i) => (
                <RatingRow
                  key={i}
                  number={i + 1}
                  text={text}
                  options={FREQ_OPTIONS}
                  value={form.hyperactivity[i]!}
                  onSelect={(v) => setHyperactivity(i, v)}
                />
              ))}
            </div>
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setSection("inattention")}>
                Back
              </Button>
              <Button
                onClick={() => setSection("performance")}
                disabled={!canAdvanceHyperactivity()}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* ── Academic Performance (9 items, 1-5 scale) ─────── */}
        {section === "performance" && (
          <div className="rounded-xl border bg-card shadow-sm p-6 space-y-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Step 4 of 4 - Academic &amp; Classroom Performance
              </p>
              <h2 className="mt-1 font-primary text-xl text-foreground">
                School Performance
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Rate how <strong>{studentName}</strong> is performing in each area compared to
                other students the same age. A score of 4 or 5 indicates a problematic area.
              </p>
            </div>
            <div className="space-y-3">
              {PERFORMANCE_ITEMS.map((text, i) => (
                <RatingRow
                  key={i}
                  number={i + 1}
                  text={text}
                  options={PERF_OPTIONS}
                  value={form.performance[i]!}
                  onSelect={(v) => setPerformance(i, v)}
                />
              ))}
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">
                Additional Comments (Optional)
              </label>
              <textarea
                rows={3}
                value={form.additionalComments}
                onChange={(e) =>
                  setForm((f) => ({ ...f, additionalComments: e.target.value }))
                }
                placeholder="Anything else you'd like the clinician to know about this student..."
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
              />
            </div>
            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={() => setSection("hyperactivity")}>
                Back
              </Button>
              <Button
                onClick={() => submitMutation.mutate()}
                disabled={!canSubmit() || submitMutation.isPending}
              >
                {submitMutation.isPending ? "Submitting..." : "Submit Assessment"}
              </Button>
            </div>
          </div>
        )}

        {/* ── Done ─────────────────────────────────────────── */}
        {section === "done" && (
          <div className="flex flex-col items-center justify-center gap-5 rounded-xl border bg-card p-10 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary text-3xl">
              ✓
            </div>
            <h1 className="font-primary text-2xl text-foreground">
              Assessment Submitted
            </h1>
            <p className="max-w-sm text-sm text-muted-foreground leading-7">
              Thank you for taking the time to complete this assessment. Your responses have
              been sent securely to the care team at Connected Psychiatric Care. Your input
              makes a real difference in {studentName}&apos;s care.
            </p>
            <p className="text-xs text-muted-foreground/70">
              You may close this window. No further action is needed.
            </p>
          </div>
        )}

        {/* Progress indicator */}
        {section !== "intro" && section !== "done" && (
          <div className="flex gap-1.5 justify-center">
            {(["teacher-info", "inattention", "hyperactivity", "performance"] as const).map(
              (s) => (
                <div
                  key={s}
                  className={cn(
                    "h-1.5 flex-1 max-w-12 rounded-full transition-colors",
                    s === section ? "bg-primary" : "bg-muted",
                  )}
                />
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
