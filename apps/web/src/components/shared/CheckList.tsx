import { Check } from "lucide-react";

export default function CheckList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
          <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-secondary text-brand-ink">
            <Check className="size-3.5" />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}
