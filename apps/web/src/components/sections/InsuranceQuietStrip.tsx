import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { publicInsurers } from "@workspace/shared/constants";

export default function InsuranceQuietStrip() {
  const activeInsurers = publicInsurers.filter((insurer) => insurer.status !== "pending");

  return (
    <section className="border-b border-border bg-card px-4 py-6 sm:px-6">
      <div className="section-container flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">
          In-network with many plans
        </p>
        <div className="flex flex-wrap items-center gap-x-7 gap-y-3 text-sm font-bold text-brand-ink/80">
          {activeInsurers.slice(0, 8).map((insurer) => (
            <span key={insurer.name}>{insurer.name}</span>
          ))}
          <Link href="/insurance" className="inline-flex items-center gap-1 font-bold text-accent hover:underline">
            See all <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
