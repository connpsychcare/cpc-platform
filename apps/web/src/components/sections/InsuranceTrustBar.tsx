"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { INSURERS, InsurerCard } from "@/components/shared/InsurerLogo";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/animations";

export default function InsuranceTrustBar() {
  return (
    <section className="bg-mist/45 py-14 sm:py-20 dark:bg-mist/15">
      <div className="section space-y-7">

        {/* Header */}
        <FadeUp className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-forest/10 text-forest">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-forest">
                Insurance
              </p>
              <p className="font-primary text-2xl text-foreground leading-tight">
                Accepted Insurance Plans
              </p>
            </div>
          </div>
          <Link
            href="/insurance"
            className="flex items-center gap-1.5 self-start text-sm font-semibold text-brand-ink hover:underline active:underline sm:self-auto"
          >
            Check your coverage <ArrowRight className="size-4" />
          </Link>
        </FadeUp>

        {/* Logo cards */}
        <StaggerContainer className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {INSURERS.map((insurer) => (
            <StaggerItem key={insurer.name}>
              <InsurerCard insurer={insurer} />
            </StaggerItem>
          ))}
        </StaggerContainer>

      </div>
    </section>
  );
}
