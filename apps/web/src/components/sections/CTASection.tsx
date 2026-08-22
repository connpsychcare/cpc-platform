import { ArrowRight } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { FadeUp } from "@/components/shared/animations";

interface CTASectionProps {
  subtitle?: string;
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export default function CTASection({
  subtitle = "Your care, your pace",
  title = "A thoughtful next step is closer than you think.",
  description = "Start with a secure video visit and a care team that listens before it recommends.",
  primaryLabel = "Book an Appointment",
  primaryHref = "/contact",
  secondaryLabel,
  secondaryHref,
}: CTASectionProps) {
  return (
    <section className="pb-12 sm:pb-20">
      <div className="section">
        <div className="relative overflow-hidden rounded-4xl bg-dark-section px-6 py-10 text-dark-section-foreground shadow-(--shadow-lift) sm:px-10 sm:py-12 lg:px-16">
          <div className="absolute -right-16 -top-20 size-60 rounded-full border-30 border-blue-light/30" />
          <div className="absolute bottom-0 right-28 size-24 rounded-full bg-white/5" />
          <FadeUp className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.17em] text-blue-light">
                {subtitle}
              </p>
              <h2 className="font-primary text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {title}
              </h2>
              {description ? (
                <p className="mt-4 max-w-xl text-base leading-7 text-white/70">
                  {description}
                </p>
              ) : null}
            </div>
            <div className="flex flex-wrap items-center gap-4 self-start lg:self-end">
              {secondaryLabel && secondaryHref && (
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                  <Link href={secondaryHref}>{secondaryLabel}</Link>
                </Button>
              )}
              <Button variant="secondary" asChild>
                <Link href={primaryHref}>
                  {primaryLabel} <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
