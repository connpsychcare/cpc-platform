import type { ContentBlock } from "../content-blocks";

import { psychiatricEvaluationBlocks } from "./psychiatric-evaluation";
import { medicationManagementBlocks } from "./medication-management";
import { telehealthPsychiatryBlocks } from "./telehealth-psychiatry";
import { depressionTreatmentBlocks } from "./depression-treatment";
import { anxietyTreatmentBlocks } from "./anxiety-treatment";
import { adhdTreatmentBlocks } from "./adhd-treatment";
import { childAdolescentPsychiatryBlocks } from "./child-adolescent-psychiatry";
import { bipolarDisorderTreatmentBlocks } from "./bipolar-disorder-treatment";
import { traumaPtsdTreatmentBlocks } from "./trauma-ptsd-treatment";

/**
 * Long-form body for each service detail page, keyed by the slug in `publicServices`.
 * Every service composes its own block sequence, so no two pages have the same shape.
 */
export const serviceContentBlocks: Record<string, ContentBlock[]> = {
  "psychiatric-evaluation": psychiatricEvaluationBlocks,
  "medication-management": medicationManagementBlocks,
  "telehealth-psychiatry": telehealthPsychiatryBlocks,
  "depression-treatment": depressionTreatmentBlocks,
  "anxiety-treatment": anxietyTreatmentBlocks,
  "adhd-treatment": adhdTreatmentBlocks,
  "child-adolescent-psychiatry": childAdolescentPsychiatryBlocks,
  "bipolar-disorder-treatment": bipolarDisorderTreatmentBlocks,
  "trauma-ptsd-treatment": traumaPtsdTreatmentBlocks,
};

export const getServiceBlocks = (slug: string): ContentBlock[] | undefined =>
  serviceContentBlocks[slug];
