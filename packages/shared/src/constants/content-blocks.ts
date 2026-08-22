/**
 * Long-form page content model, shared by service detail pages and care-library
 * articles.
 *
 * Each page composes its OWN sequence of blocks. There is deliberately no required
 * "standard" set of sections: an ADHD evaluation and a bipolar maintenance plan have
 * genuinely different things to explain, so they get genuinely different page
 * structures. Adding a block type here is cheaper than flattening a subject's real
 * shape into a template it does not fit.
 *
 * Everything a reader needs is plain text in the markup, including FAQ answers, so
 * crawlers index the substance rather than a shell.
 */

/** Background treatment. Omit to let the renderer alternate automatically. */
export type BlockTone = "plain" | "tint" | "brand";

interface BaseBlock {
  /** Small uppercase label above the heading. */
  eyebrow?: string;
  /** Section heading. */
  heading: string;
  /** Optional lead paragraph under the heading. */
  intro?: string;
  tone?: BlockTone;
}

/** Free paragraphs. For genuine explanatory copy, not filler. */
export interface ProseBlock extends BaseBlock {
  type: "prose";
  paragraphs: string[];
}

/** Card grid of topics, conditions, or focus areas. */
export interface GridBlock extends BaseBlock {
  type: "grid";
  columns?: 2 | 3;
  items: { title: string; description: string }[];
}

/** Numbered walkthrough where the order is clinically or procedurally real. */
export interface ProcessBlock extends BaseBlock {
  type: "process";
  steps: { title: string; description: string; note?: string }[];
}

/** Time-anchored sequence: week 1, week 4, month 3. */
export interface TimelineBlock extends BaseBlock {
  type: "timeline";
  entries: { marker: string; title: string; description: string }[];
}

/** Statements with a check mark, each optionally explained. */
export interface ChecklistBlock extends BaseBlock {
  type: "checklist";
  items: { title: string; description?: string }[];
  footnote?: string;
}

/** Side-by-side comparison where the differences are the point. */
export interface ComparisonBlock extends BaseBlock {
  type: "comparison";
  /** First column is the row label; the rest are the things being compared. */
  columns: string[];
  rows: string[][];
  footnote?: string;
}

/** Programming that differs by age or developmental stage. */
export interface AgeBandsBlock extends BaseBlock {
  type: "age-bands";
  bands: { range: string; label: string; focus: string; examples: string[] }[];
}

/** Urgency-based routing, for when the right first action depends on how acute
 *  the situation already is. */
export interface TriageBlock extends BaseBlock {
  type: "triage";
  options: { situation: string; urgency: string; guidance: string; action: string }[];
}

/** Emphasis panel for a single important message. */
export interface CalloutBlock extends BaseBlock {
  type: "callout";
  body: string;
  variant?: "info" | "urgent";
}

/** Questions and answers. Answers are always present in the HTML. */
export interface FaqBlock extends BaseBlock {
  type: "faq";
  items: { question: string; answer: string }[];
}

export type ContentBlock =
  | ProseBlock
  | GridBlock
  | ProcessBlock
  | TimelineBlock
  | ChecklistBlock
  | ComparisonBlock
  | AgeBandsBlock
  | TriageBlock
  | CalloutBlock
  | FaqBlock;

/** Pull the FAQ items out of a block list, for FAQPage structured data. */
export function blockFaqs(blocks?: readonly ContentBlock[]) {
  const block = blocks?.find((b): b is FaqBlock => b.type === "faq");
  return block?.items ?? [];
}
