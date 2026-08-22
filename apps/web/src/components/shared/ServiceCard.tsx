import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";
import { appIconMap } from "@workspace/ui/lib/icons";
import type { publicServices } from "@workspace/shared/constants";

type Service = (typeof publicServices)[number];

export default function ServiceCard({
  service,
  compact = false,
}: {
  service: Service;
  compact?: boolean;
}) {
  const Icon = appIconMap[service.icon as keyof typeof appIconMap];

  return (
    <Link
      href={`/services/${service.slug}`}
      className="group block h-full rounded-4xl border border-border bg-card p-5 shadow-(--soft-shadow) ring-1 ring-primary/5 transition duration-200 hover:-translate-y-1 hover:shadow-(--shadow-lift)"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-secondary text-brand-ink">
          {Icon && <Icon className="size-5" />}
        </div>
        <ArrowRight className="size-4 text-muted-foreground/40 transition group-hover:translate-x-1 group-hover:text-accent" />
      </div>
      <h3 className="mt-5 font-primary text-lg font-extrabold tracking-tight text-foreground">
        {service.title}
      </h3>
      <p className={cn("mt-2 text-sm leading-6 text-muted-foreground", compact && "line-clamp-2")}>
        {service.subtitle}
      </p>
      <span className="mt-4 inline-block text-xs font-bold uppercase tracking-[0.12em] text-accent">
        Learn more
      </span>
    </Link>
  );
}
