/**
 * Readable descriptions of submitted clinical forms.
 *
 * `ClinicalFormResponse.responses` is raw JSON whose keys vary by form type
 * ("q1", "ia0", "chiefComplaint", ...). Rendering it as JSON puts the reader in
 * front of the storage format instead of the answers, so this module maps each
 * form type back to its questions and answer labels. It is framework-agnostic
 * so web, dashboard, and mobile can all present the same thing.
 */

export type ClinicalFormTypeKey =
  | "phq9"
  | "gad7"
  | "asrsAdult"
  | "vanderbiltParent"
  | "vanderbiltTeacher"
  | "adultPsychiatricIntake"
  | "adolescentPsychiatricIntake";

export const clinicalFormLabels: Record<ClinicalFormTypeKey, string> = {
  phq9: "PHQ-9 Depression Screening",
  gad7: "GAD-7 Anxiety Screening",
  asrsAdult: "ASRS-v1.1 Adult ADHD Screening",
  vanderbiltParent: "Vanderbilt Parent Assessment",
  vanderbiltTeacher: "Vanderbilt Teacher Assessment",
  adultPsychiatricIntake: "Adult Psychiatric Intake",
  adolescentPsychiatricIntake: "Adolescent Psychiatric Intake",
};

export const clinicalFormShortLabels: Record<ClinicalFormTypeKey, string> = {
  phq9: "PHQ-9",
  gad7: "GAD-7",
  asrsAdult: "ASRS-v1.1",
  vanderbiltParent: "Vanderbilt (Parent)",
  vanderbiltTeacher: "Vanderbilt (Teacher)",
  adultPsychiatricIntake: "Adult Intake",
  adolescentPsychiatricIntake: "Adolescent Intake",
};

/** Scored instruments, shown on the screening-results surface. */
export const screeningFormTypes: ClinicalFormTypeKey[] = [
  "phq9",
  "gad7",
  "asrsAdult",
  "vanderbiltParent",
];

/** Long-form narrative questionnaires, shown on the intake surface. */
export const intakeFormTypes: ClinicalFormTypeKey[] = [
  "adultPsychiatricIntake",
  "adolescentPsychiatricIntake",
];

// ── Answer scales ───────────────────────────────────────────────────────────
// Exported so the onboarding wizard's screening forms can render the same
// scales instead of keeping a second hardcoded copy that can drift.

export const FREQUENCY_0_3 = [
  "Not at all",
  "Several days",
  "More than half the days",
  "Nearly every day",
];

export const FREQUENCY_0_4 = [
  "Never",
  "Rarely",
  "Sometimes",
  "Often",
  "Very Often",
];

export const VANDERBILT_FREQUENCY = [
  "Never",
  "Occasionally",
  "Often",
  "Very Often",
];

export const VANDERBILT_PERFORMANCE = [
  "Excellent",
  "Above Average",
  "Average",
  "Somewhat of a Problem",
  "Problematic",
];

// ── Question banks ──────────────────────────────────────────────────────────
// Exported for the same reason as the answer scales above.

export const PHQ9_QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself, or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed, or being so fidgety or restless that you have been moving around more than usual",
  "Thoughts that you would be better off dead, or of hurting yourself in some way",
];

export const GAD7_QUESTIONS = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it is hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid, as if something awful might happen",
];

export const ASRS_QUESTIONS = [
  "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?",
  "How often do you have difficulty getting things in order when you have to do a task that requires organization?",
  "How often do you have problems remembering appointments or obligations?",
  "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?",
  "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?",
  "How often do you feel overly active and compelled to do things, like you were driven by a motor?",
];

export const VANDERBILT_INATTENTION = [
  "Fails to give close attention to details or makes careless mistakes in schoolwork or tasks",
  "Has difficulty sustaining attention in tasks or play activities",
  "Does not seem to listen when spoken to directly",
  "Does not follow through on instructions and fails to finish schoolwork or chores",
  "Has difficulty organizing tasks and activities",
  "Avoids, dislikes, or is reluctant to engage in tasks that require sustained mental effort",
  "Loses things necessary for tasks or activities",
  "Is easily distracted by extraneous stimuli",
  "Is forgetful in daily activities",
];

export const VANDERBILT_HYPERACTIVITY = [
  "Fidgets with hands or feet or squirms in seat",
  "Leaves seat in classroom or in other situations in which remaining seated is expected",
  "Runs about or climbs excessively in situations in which it is inappropriate",
  "Has difficulty playing or engaging in leisure activities quietly",
  "Is 'on the go' or often acts as if 'driven by a motor'",
  "Talks excessively",
  "Blurts out answers before questions have been completed",
  "Has difficulty awaiting turn",
  "Interrupts or intrudes on others",
];

export const VANDERBILT_PERFORMANCE_ITEMS = [
  "Reading",
  "Mathematics",
  "Written expression",
  "Relationships with parents",
  "Relationships with siblings",
  "Relationships with peers",
  "Participation in organized activities",
];

/** The teacher form asks nine performance items rather than the parent's seven. */
const VANDERBILT_TEACHER_PERFORMANCE = [
  "Reading",
  "Mathematics",
  "Written expression",
  "Relationship with peers",
  "Following directions",
  "Disrupting class",
  "Assignment completion",
  "Organizational skills",
  "Overall school performance",
];

export const ADULT_INTAKE_FIELDS: Array<[string, string]> = [
  ["chiefComplaint", "What brings you in today? (Chief Complaint)"],
  ["symptomOnset", "When did these concerns begin?"],
  ["symptomDescription", "Describe your current symptoms in more detail"],
  ["priorDiagnoses", "Previous psychiatric diagnoses"],
  [
    "priorHospitalizations",
    "Prior psychiatric hospitalizations or intensive programs",
  ],
  ["priorMedications", "Previous psychiatric medications"],
  ["currentTherapist", "Current or recent therapist / counselor"],
  [
    "substanceUse",
    "Current or past use of alcohol, tobacco, cannabis, or other substances",
  ],
  ["familyPsychHistory", "Family history of psychiatric conditions"],
  ["livingArrangement", "Current living arrangement"],
  ["employment", "Employment / occupation"],
  ["education", "Highest level of education"],
  ["relationshipStatus", "Relationship status"],
  ["supportSystem", "Support system"],
  ["legalHistory", "Legal history"],
  ["safetyCurrentThoughts", "Current thoughts of harming yourself or others"],
  ["safetyPastHistory", "Past history of self-harm or suicide attempts"],
  ["safetyPlan", "What helps you stay safe during difficult times?"],
];

export const ADOLESCENT_INTAKE_FIELDS: Array<[string, string]> = [
  [
    "presentingConcerns",
    "What concerns bring your child to psychiatric care today?",
  ],
  ["symptomOnset", "When did these concerns begin?"],
  ["schoolGrade", "Current grade / school year"],
  ["academicPerformance", "Academic performance"],
  ["socialFunctioning", "Social functioning with peers"],
  ["behaviorAtHome", "Behavior at home"],
  ["behaviorAtSchool", "Behavior at school"],
  ["developmentalHistory", "Developmental history"],
  ["priorDiagnoses", "Prior psychiatric diagnoses or evaluations"],
  ["priorMedications", "Prior or current psychiatric medications"],
  ["familyPsychHistory", "Family history of psychiatric conditions"],
  ["livingArrangement", "Current living arrangement"],
  ["substanceUse", "Any known substance use"],
  [
    "safetyParentObservations",
    "Safety concerns observed (self-harm, aggression, running away)",
  ],
  ["selfReportMood", "How have you been feeling lately? (mood, emotions)"],
  ["selfReportWorries", "Is there anything you worry about a lot?"],
  ["selfReportSchool", "How are things going at school?"],
  ["selfReportFriends", "How are things going with your friends?"],
  ["selfReportHome", "How are things at home with your family?"],
  ["selfReportSafety", "Anything about your safety your provider should know?"],
  ["selfReportHelp", "What do you most want help with from your provider?"],
];

// ── Describing a submission ─────────────────────────────────────────────────

export interface ClinicalFormRow {
  question: string;
  /** The answer label, or "Not answered" when the payload has no value. */
  answer: string;
  /** Present for scored items, so a reader can see the contributing value. */
  score?: number;
}

export interface ClinicalFormSection {
  title?: string;
  /** Sum of this section's item scores, for the sectioned Vanderbilt forms. */
  subtotal?: number;
  rows: ClinicalFormRow[];
}

const NOT_ANSWERED = "Not answered";

const scaled = (
  question: string,
  raw: unknown,
  scale: string[],
): ClinicalFormRow => {
  if (typeof raw !== "number") return { question, answer: NOT_ANSWERED };
  return { question, answer: scale[raw] ?? String(raw), score: raw };
};

const sumRows = (rows: ClinicalFormRow[]) =>
  rows.reduce((total, row) => total + (row.score ?? 0), 0);

const fromQuestionKeys = (
  questions: string[],
  responses: Record<string, unknown>,
  scale: string[],
) =>
  questions.map((question, i) =>
    scaled(question, responses[`q${i + 1}`], scale),
  );

const fromArray = (
  questions: string[],
  values: unknown,
  scale: string[],
): ClinicalFormRow[] => {
  const list = Array.isArray(values) ? values : [];
  return questions.map((question, i) => scaled(question, list[i], scale));
};

/**
 * Turns one stored submission into labelled sections.
 *
 * Returns an empty section list for an unrecognised form type or payload, so a
 * caller can fall back rather than crash on data written before a shape change.
 */
export function describeClinicalForm(
  formType: string,
  responses: unknown,
): ClinicalFormSection[] {
  const data = (
    responses && typeof responses === "object" ? responses : {}
  ) as Record<string, unknown>;

  switch (formType) {
    case "phq9":
      return [{ rows: fromQuestionKeys(PHQ9_QUESTIONS, data, FREQUENCY_0_3) }];

    case "gad7":
      return [{ rows: fromQuestionKeys(GAD7_QUESTIONS, data, FREQUENCY_0_3) }];

    case "asrsAdult":
      return [
        {
          title: "Part A",
          rows: fromQuestionKeys(ASRS_QUESTIONS, data, FREQUENCY_0_4),
        },
      ];

    case "vanderbiltParent": {
      const inattention = VANDERBILT_INATTENTION.map((question, i) =>
        scaled(question, data[`ia${i}`], VANDERBILT_FREQUENCY),
      );
      const hyperactivity = VANDERBILT_HYPERACTIVITY.map((question, i) =>
        scaled(question, data[`hy${i}`], VANDERBILT_FREQUENCY),
      );
      const performance = VANDERBILT_PERFORMANCE_ITEMS.map((question, i) =>
        scaled(question, data[`pf${i}`], VANDERBILT_PERFORMANCE),
      );

      return [
        {
          title: "Inattention",
          subtotal: sumRows(inattention),
          rows: inattention,
        },
        {
          title: "Hyperactivity / Impulsivity",
          subtotal: sumRows(hyperactivity),
          rows: hyperactivity,
        },
        { title: "Performance", rows: performance },
      ];
    }

    case "vanderbiltTeacher": {
      const inattention = fromArray(
        VANDERBILT_INATTENTION,
        data.inattentionItems,
        VANDERBILT_FREQUENCY,
      );
      const hyperactivity = fromArray(
        VANDERBILT_HYPERACTIVITY,
        data.hyperactivityItems,
        VANDERBILT_FREQUENCY,
      );
      const performance = fromArray(
        VANDERBILT_TEACHER_PERFORMANCE,
        data.performanceItems,
        VANDERBILT_PERFORMANCE,
      );

      return [
        {
          title: "Inattention",
          subtotal: sumRows(inattention),
          rows: inattention,
        },
        {
          title: "Hyperactivity / Impulsivity",
          subtotal: sumRows(hyperactivity),
          rows: hyperactivity,
        },
        { title: "Academic and Behavioral Performance", rows: performance },
      ];
    }

    case "adultPsychiatricIntake":
    case "adolescentPsychiatricIntake": {
      const fields =
        formType === "adultPsychiatricIntake"
          ? ADULT_INTAKE_FIELDS
          : ADOLESCENT_INTAKE_FIELDS;

      return [
        {
          rows: fields.map(([key, question]) => {
            const value = data[key];
            const text = typeof value === "string" ? value.trim() : "";
            return { question, answer: text || NOT_ANSWERED };
          }),
        },
      ];
    }

    default:
      return [];
  }
}

// ── Severity ────────────────────────────────────────────────────────────────

export type ClinicalSeverity = "none" | "mild" | "moderate" | "severe";

/**
 * ASRS Part A is scored by item threshold, not by the sum. Items 1-3 count when
 * answered "Sometimes" or higher, items 4-6 at "Often" or higher, and four of
 * six positive items is a positive screen.
 */
export const ASRS_THRESHOLDS = [2, 2, 2, 3, 3, 3];

export function asrsPositiveItems(responses: unknown): number | undefined {
  if (!responses || typeof responses !== "object") return undefined;
  const data = responses as Record<string, unknown>;

  let positive = 0;
  for (let i = 0; i < ASRS_THRESHOLDS.length; i++) {
    const value = data[`q${i + 1}`];
    if (typeof value !== "number") return undefined;
    if (value >= ASRS_THRESHOLDS[i]!) positive += 1;
  }
  return positive;
}

/**
 * Severity band for a scored instrument, used to colour result badges.
 *
 * Pass `responses` where you have them: ASRS cannot be banded from its total
 * alone, because the instrument screens on how many items clear their own
 * threshold rather than on the sum. Unscored forms return "none" so callers do
 * not have to special-case intake submissions.
 */
export function clinicalFormSeverity(
  formType: string,
  totalScore?: number | null,
  responses?: unknown,
): ClinicalSeverity {
  if (formType === "asrsAdult") {
    const positive = asrsPositiveItems(responses);
    if (positive === undefined) return "none";
    return positive >= 4 ? "severe" : "none";
  }

  if (typeof totalScore !== "number") return "none";

  switch (formType) {
    case "phq9":
      if (totalScore <= 4) return "none";
      if (totalScore <= 9) return "mild";
      if (totalScore <= 14) return "moderate";
      return "severe";

    case "gad7":
      if (totalScore <= 4) return "none";
      if (totalScore <= 9) return "mild";
      if (totalScore <= 14) return "moderate";
      return "severe";

    case "vanderbiltParent":
    case "vanderbiltTeacher":
      if (totalScore < 12) return "none";
      if (totalScore < 24) return "mild";
      if (totalScore < 36) return "moderate";
      return "severe";

    default:
      return "none";
  }
}

/** Highest score the instrument can produce, for "12 / 27" style display. */
export function clinicalFormMaxScore(formType: string): number | undefined {
  switch (formType) {
    case "phq9":
      return 27;
    case "gad7":
      return 21;
    case "asrsAdult":
      // Six Part A items on a 0-4 scale. The screen result comes from item
      // thresholds, so this is only the range of the stored total.
      return 24;
    case "vanderbiltParent":
    case "vanderbiltTeacher":
      return 54;
    default:
      return undefined;
  }
}
