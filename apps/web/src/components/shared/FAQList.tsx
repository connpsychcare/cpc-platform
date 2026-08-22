import { ChevronDown } from "lucide-react";

/**
 * Native <details> accordion - no JS, no client boundary, and open-by-keyboard for free.
 */
export default function FAQList({
  items,
}: {
  items: readonly { question: string; answer: string }[];
}) {
  return (
    <div className="divide-y divide-border rounded-4xl border border-border bg-card">
      {items.map((item) => (
        <details key={item.question} className="group p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-primary text-base font-extrabold tracking-tight text-foreground marker:hidden">
            <span>{item.question}</span>
            <ChevronDown className="size-4 shrink-0 text-accent transition group-open:rotate-180" />
          </summary>
          <p className="max-w-3xl pr-8 pt-3 text-sm leading-7 text-muted-foreground">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
