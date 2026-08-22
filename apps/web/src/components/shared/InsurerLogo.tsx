"use client";

import { useState } from "react";
import { publicInsurers, type PublicInsurer } from "@workspace/shared/constants";
import { Badge } from "@workspace/ui/components/badge";

export { publicInsurers };
export type { PublicInsurer as Insurer };
export const INSURERS = publicInsurers;

function InsurerLogoImage({
  domain,
  name,
  abbr,
  color,
}: {
  domain: string;
  name: string;
  abbr: string;
  color: string;
}) {
  const [failed, setFailed] = useState(false);
  const src = `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;

  if (failed) {
    return (
      <div
        className="flex size-full items-center justify-center rounded-full"
        style={{ backgroundColor: color }}
      >
        <span className="text-[11px] font-bold tracking-wide text-white">
          {abbr}
        </span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      width={40}
      height={40}
      className="size-full object-contain p-1"
      onError={() => setFailed(true)}
    />
  );
}

export function InsurerCard({
  insurer,
  size = "md",
}: {
  insurer: PublicInsurer;
  size?: "sm" | "md" | "lg";
}) {
  const containerSize =
    size === "lg" ? "size-14" : size === "sm" ? "size-8" : "size-10";
  const isPending = insurer.status === "pending";
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition hover:border-primary/30 hover:shadow-sm active:border-primary/30 active:scale-[0.98] ${isPending ? "opacity-80" : ""}`}
    >
      <div
        className={`${containerSize} shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-border`}
      >
        <InsurerLogoImage
          domain={insurer.domain}
          name={insurer.name}
          abbr={insurer.abbr}
          color={insurer.color}
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground leading-snug">
          {insurer.name}
        </p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{insurer.note}</p>
      </div>
      {isPending ? (
        <Badge variant="warning" appearance="soft" className="shrink-0">
          Pending
        </Badge>
      ) : null}
    </div>
  );
}
