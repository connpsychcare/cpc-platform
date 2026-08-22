import {
  AlertTriangle,
  Check,
  ChevronDown,
  Info,
} from "lucide-react";
import type {
  AgeBandsBlock,
  BlockTone,
  CalloutBlock,
  ChecklistBlock,
  ComparisonBlock,
  ContentBlock,
  FaqBlock,
  GridBlock,
  ProcessBlock,
  ProseBlock,
  TimelineBlock,
  TriageBlock,
} from "@workspace/shared/constants";
import { cn } from "@workspace/ui/lib/utils";

/** Backgrounds alternate so adjacent sections stay visually separated. */
const TONE_CLASSES: Record<BlockTone, string> = {
  plain: "bg-background",
  tint: "bg-secondary/45",
  brand: "bg-sage/30",
};

function BlockHeader({
  eyebrow,
  heading,
  intro,
  centered,
}: {
  eyebrow?: string;
  heading: string;
  intro?: string;
  centered?: boolean;
}) {
  return (
    <div className={cn("mb-10 max-w-2xl", centered && "mx-auto text-center")}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-3 font-primary text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl">
        {heading}
      </h2>
      {intro && (
        <p className="mt-4 text-base leading-7 text-muted-foreground">{intro}</p>
      )}
    </div>
  );
}

function Prose({ block }: { block: ProseBlock }) {
  return (
    <div className="section-container max-w-3xl!">
      <BlockHeader eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
      <div className="space-y-5">
        {block.paragraphs.map((paragraph, i) => (
          <p key={i} className="text-base leading-8 text-muted-foreground">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}

function Grid({ block }: { block: GridBlock }) {
  return (
    <div className="section-container">
      <BlockHeader eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
      <div
        className={cn(
          "grid gap-4",
          block.columns === 2 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3",
        )}
      >
        {block.items.map((item) => (
          <div
            key={item.title}
            className="rounded-4xl border border-border bg-card p-6 shadow-(--soft-shadow)"
          >
            <h3 className="font-primary text-lg font-extrabold leading-snug tracking-tight text-foreground">
              {item.title}
            </h3>
            <p className="mt-2.5 text-sm leading-7 text-muted-foreground">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Process({ block }: { block: ProcessBlock }) {
  return (
    <div className="section-container max-w-4xl!">
      <BlockHeader eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
      <ol className="space-y-4">
        {block.steps.map((step, i) => (
          <li
            key={step.title}
            className="flex gap-5 rounded-4xl border border-border bg-card p-6 shadow-(--soft-shadow)"
          >
            <span className="shrink-0 font-primary text-2xl font-extrabold leading-none text-accent/35">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="font-primary text-lg font-extrabold leading-snug tracking-tight text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {step.description}
              </p>
              {step.note && (
                <p className="mt-3 rounded-2xl bg-secondary/70 px-4 py-3 text-xs leading-6 text-brand-ink">
                  {step.note}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Timeline({ block }: { block: TimelineBlock }) {
  return (
    <div className="section-container max-w-3xl!">
      <BlockHeader eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
      <div className="relative">
        <span
          aria-hidden="true"
          className="absolute left-[7px] top-2 bottom-2 w-px bg-primary/25"
        />
        <div className="space-y-8">
          {block.entries.map((entry) => (
            <div key={entry.marker + entry.title} className="relative pl-10">
              <span
                aria-hidden="true"
                className="absolute left-0 top-1.5 size-4 rounded-full border-4 border-background bg-primary"
              />
              <p className="eyebrow">{entry.marker}</p>
              <h3 className="mt-1 font-primary text-lg font-extrabold leading-snug tracking-tight text-foreground">
                {entry.title}
              </h3>
              <p className="mt-1.5 text-sm leading-7 text-muted-foreground">
                {entry.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Checklist({ block }: { block: ChecklistBlock }) {
  return (
    <div className="section-container max-w-3xl!">
      <BlockHeader eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
      <ul className="space-y-3">
        {block.items.map((item) => (
          <li
            key={item.title}
            className="flex items-start gap-4 rounded-4xl border border-border bg-card p-5 shadow-(--soft-shadow)"
          >
            <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary/10">
              <Check className="size-3.5 text-brand-ink" />
            </span>
            <div>
              <p className="font-body-semibold text-sm text-foreground">{item.title}</p>
              {item.description && (
                <p className="mt-1 text-sm leading-7 text-muted-foreground">
                  {item.description}
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
      {block.footnote && (
        <p className="mt-5 text-xs leading-6 text-muted-foreground">{block.footnote}</p>
      )}
    </div>
  );
}

function Comparison({ block }: { block: ComparisonBlock }) {
  return (
    <div className="section-container max-w-4xl!">
      <BlockHeader eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
      {/* Wide tables scroll inside their own container, never the page body. */}
      <div className="overflow-x-auto rounded-4xl border border-border bg-card shadow-(--soft-shadow)">
        <table className="w-full min-w-[36rem] border-collapse text-sm">
          <thead>
            <tr className="bg-secondary/70">
              {block.columns.map((column, i) => (
                <th
                  key={i}
                  scope="col"
                  className={cn(
                    "p-4 text-left align-bottom font-primary font-extrabold tracking-tight text-foreground",
                    i > 0 && "border-l border-border",
                  )}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, i) => (
              <tr key={i} className="border-t border-border align-top">
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={cn(
                      "p-4 leading-7",
                      j === 0
                        ? "font-body-semibold text-foreground"
                        : "border-l border-border text-muted-foreground",
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {block.footnote && (
        <p className="mt-4 text-xs leading-6 text-muted-foreground">{block.footnote}</p>
      )}
    </div>
  );
}

function AgeBands({ block }: { block: AgeBandsBlock }) {
  return (
    <div className="section-container">
      <BlockHeader eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {block.bands.map((band) => (
          <div
            key={band.range}
            className="flex flex-col overflow-hidden rounded-4xl border border-border bg-card shadow-(--soft-shadow)"
          >
            <div className="bg-brand-surface px-5 py-4">
              <p className="font-primary text-xl font-extrabold leading-none text-brand-surface-foreground">
                {band.range}
              </p>
              <p className="mt-1.5 text-xs text-brand-surface-foreground/70">{band.label}</p>
            </div>
            <div className="flex-1 p-5">
              <p className="text-sm leading-7 text-muted-foreground">{band.focus}</p>
              <ul className="mt-4 space-y-2">
                {band.examples.map((example) => (
                  <li
                    key={example}
                    className="flex items-start gap-2.5 text-sm leading-6 text-muted-foreground"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-accent"
                    />
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Triage({ block }: { block: TriageBlock }) {
  return (
    <div className="section-container">
      <BlockHeader eyebrow={block.eyebrow} heading={block.heading} intro={block.intro} />
      <div className="grid gap-4 md:grid-cols-3">
        {block.options.map((option) => (
          <div
            key={option.situation}
            className="flex flex-col rounded-4xl border border-border bg-card p-6 shadow-(--soft-shadow)"
          >
            <span className="self-start rounded-full bg-accent/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.17em] text-accent">
              {option.urgency}
            </span>
            <h3 className="mt-4 font-primary text-lg font-extrabold leading-snug tracking-tight text-foreground">
              {option.situation}
            </h3>
            <p className="mt-2.5 flex-1 text-sm leading-7 text-muted-foreground">
              {option.guidance}
            </p>
            <p className="mt-5 rounded-2xl bg-secondary/70 px-4 py-3 text-sm leading-6 font-body-medium text-brand-ink">
              {option.action}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Callout({ block }: { block: CalloutBlock }) {
  const urgent = block.variant === "urgent";
  const Icon = urgent ? AlertTriangle : Info;

  return (
    <div className="section-container max-w-3xl!">
      <div
        className={cn(
          "flex items-start gap-4 rounded-4xl border p-6 lg:p-8",
          urgent
            ? "border-destructive/25 bg-destructive/5"
            : "border-primary/20 bg-secondary/60",
        )}
      >
        <Icon
          className={cn("mt-0.5 size-6 shrink-0", urgent ? "text-destructive" : "text-brand-ink")}
        />
        <div>
          <h2 className="font-primary text-xl font-extrabold leading-snug tracking-tight text-foreground">
            {block.heading}
          </h2>
          <p className="mt-2.5 text-base leading-7 text-muted-foreground">{block.body}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Native <details> rather than a JS accordion: closed panels of a JS accordion are
 * absent from the server-rendered HTML, which would hide every answer from crawlers.
 * <details> keeps the answer text in the markup either way.
 */
function Faq({ block }: { block: FaqBlock }) {
  return (
    <div className="section-container max-w-3xl!">
      <BlockHeader
        eyebrow={block.eyebrow}
        heading={block.heading}
        intro={block.intro}
        centered
      />
      <div className="space-y-3">
        {block.items.map((item) => (
          <details
            key={item.question}
            className="group rounded-4xl border border-border bg-card px-6 shadow-(--soft-shadow) [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-primary font-extrabold tracking-tight text-foreground transition-colors hover:text-brand-ink">
              {item.question}
              <ChevronDown
                aria-hidden="true"
                className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
              />
            </summary>
            <p className="pb-5 text-sm leading-7 text-muted-foreground">{item.answer}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

function BlockBody({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "prose":
      return <Prose block={block} />;
    case "grid":
      return <Grid block={block} />;
    case "process":
      return <Process block={block} />;
    case "timeline":
      return <Timeline block={block} />;
    case "checklist":
      return <Checklist block={block} />;
    case "comparison":
      return <Comparison block={block} />;
    case "age-bands":
      return <AgeBands block={block} />;
    case "triage":
      return <Triage block={block} />;
    case "callout":
      return <Callout block={block} />;
    case "faq":
      return <Faq block={block} />;
  }
}

const ContentBlocks = ({ blocks }: { blocks: readonly ContentBlock[] }) => (
  <>
    {blocks.map((block, i) => {
      const tone: BlockTone = block.tone ?? (i % 2 === 0 ? "plain" : "tint");
      return (
        <section
          key={`${block.type}-${block.heading}`}
          className={cn("px-4 py-14 sm:px-6 lg:py-20", TONE_CLASSES[tone])}
        >
          <BlockBody block={block} />
        </section>
      );
    })}
  </>
);

export default ContentBlocks;
