import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";

/** Cycled so a run of providers without photos does not render as identical tiles. */
const PLACEHOLDER_TONES = ["bg-secondary", "bg-accent/10", "bg-sage/60"] as const;

export type ProviderCardData = {
  slug?: string;
  name?: string;
  title?: string;
  specialties?: readonly string[];
  photo?: string;
};

export default function ProviderCard({
  provider,
  tone = 0,
}: {
  provider: ProviderCardData;
  tone?: number;
}) {
  const name = provider.name ?? "Psychiatric Provider";
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link
      href={`/providers/${provider.slug}`}
      className="group block h-full overflow-hidden rounded-4xl border border-border bg-card shadow-(--soft-shadow) ring-1 ring-primary/5 transition hover:-translate-y-1 hover:shadow-(--shadow-lift)"
    >
      <div
        className={cn(
          "relative overflow-hidden",
          !provider.photo && PLACEHOLDER_TONES[tone % PLACEHOLDER_TONES.length],
        )}
      >
        {provider.photo ? (
          <div className="relative aspect-4/3 w-full">
            <Image
              src={provider.photo}
              alt={`${name}${provider.title ? `, ${provider.title}` : ""}`}
              fill
              className="object-cover object-top transition duration-500 group-hover:scale-[1.02]"
            />
          </div>
        ) : (
          <div className="grid aspect-4/3 place-items-center">
            <div className="grid size-24 place-items-center rounded-full border border-primary/15 bg-card/55 font-primary text-3xl font-extrabold tracking-tighter text-brand-ink">
              {initials}
            </div>
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-card/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-brand-ink">
          Licensed in CA
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-primary text-lg font-extrabold tracking-tight text-foreground">
          {name}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {provider.title || "Board-Certified Psychiatric Provider"}
        </p>
        {provider.specialties && provider.specialties.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {provider.specialties.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold text-brand-ink"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <span className="mt-5 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.12em] text-accent">
          View profile
          <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
