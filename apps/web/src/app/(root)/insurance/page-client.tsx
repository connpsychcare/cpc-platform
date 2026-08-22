"use client";

import { ArrowRight, Check } from "lucide-react";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/animations";
import { INSURERS, InsurerCard } from "@/components/shared/InsurerLogo";
import { publicInsuranceContent } from "@workspace/shared/constants";
import { resolvePublicBusinessProfile } from "@workspace/shared/utils";
import { Button } from "@workspace/ui/components/button";
import CTASection from "@/components/sections/CTASection";
import PageHeader from "@/components/shared/PageHeader";
import SectionHeader from "@/components/shared/SectionHeader";
import FAQList from "@/components/shared/FAQList";
import { usePublicBusinessProfile } from "@/hooks/content";

const VERIFIABLE = [
  "Whether your plan is in network",
  "Copay, deductible, and coinsurance details",
  "Whether prior authorization may be required",
];

export default function InsurancePage() {
  const { data: businessProfile } = usePublicBusinessProfile();
  const business = resolvePublicBusinessProfile(businessProfile);

  return (
    <>
      <PageHeader
        subtitle="Insurance & payment"
        title="Transparent about coverage."
        titleAccent="Focused on your care."
        description="We accept many major insurance plans and can help verify benefits before your first visit. If your plan is not listed, reach out. We may still be able to help."
        image="/images/marketing/cpc-family-telehealth.jpg"
        imageAlt="A family reviewing insurance options together at home"
        actions={
          <Button href="/contact">
            Ask about my coverage <ArrowRight className="size-4" />
          </Button>
        }
      />

      {/* Accepted plans */}
      <section className="px-4 py-14 sm:px-6 lg:py-20">
        <div className="section-container">
          <FadeUp className="mb-9">
            <SectionHeader
              eyebrow="Accepted plans"
              title="Insurance partners we work with."
              description="Plan benefits differ by employer, location, and coverage level. We will help you understand what applies to your care."
            />
          </FadeUp>

          <StaggerContainer className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {INSURERS.map((insurer) => (
              <StaggerItem key={insurer.name}>
                <InsurerCard insurer={insurer} />
              </StaggerItem>
            ))}
          </StaggerContainer>

          <p className="mt-6 text-xs leading-6 text-muted-foreground">
            Plans marked pending are shown for transparency and are not currently available for
            billing through our practice. {publicInsuranceContent.acceptedNote}
          </p>
        </div>
      </section>

      {/* Private pay + what we verify */}
      <section className="bg-secondary/55 px-4 py-14 sm:px-6 lg:py-20">
        <div className="section-container grid gap-8 lg:grid-cols-2">
          <div className="rounded-4xl bg-brand-surface p-8 text-brand-surface-foreground">
            <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-blue-light">
              Private pay
            </p>
            <h2 className="mt-3 font-primary text-3xl font-extrabold tracking-tight text-brand-surface-foreground">
              Prefer to pay directly?
            </h2>
            <p className="mt-4 text-sm leading-7 text-brand-surface-foreground/75">
              {publicInsuranceContent.selfPayDescription}
            </p>
            <Button
              variant="secondary"
              className="mt-6 bg-card text-brand-ink hover:bg-secondary"
              asChild
            >
              <a href={`mailto:${business.supportEmail}`}>
                Ask about private pay <ArrowRight className="size-4" />
              </a>
            </Button>
          </div>

          <div className="rounded-4xl border border-border bg-card p-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-accent">
              What we can verify
            </p>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-muted-foreground">
              {VERIFIABLE.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check className="size-5 shrink-0 text-brand-ink" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-7 text-muted-foreground">
              {publicInsuranceContent.outOfPocketDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Prior authorization */}
      <section className="px-4 py-14 sm:px-6 lg:py-20">
        <div className="section-container">
          <FadeUp className="mb-9">
            <SectionHeader
              eyebrow="How it works"
              title="How prior authorization works."
              description={publicInsuranceContent.authDescription}
            />
          </FadeUp>

          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {publicInsuranceContent.authSteps.map((step, index) => (
              <StaggerItem key={step.step}>
                <div className="flex h-full flex-col gap-4 rounded-4xl bg-secondary/70 p-6">
                  <span className="font-primary text-4xl font-extrabold tracking-tighter text-accent/70">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-primary text-base font-extrabold tracking-tight text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-xs leading-6 text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Insurance FAQ */}
      <section className="bg-secondary/55 px-4 py-14 sm:px-6 lg:py-20">
        <div className="section-container max-w-4xl space-y-8">
          <FadeUp>
            <SectionHeader eyebrow="Insurance questions" title="A few common things people ask." />
          </FadeUp>
          <FAQList
            items={publicInsuranceContent.faqs.map((faq) => ({
              question: faq.q,
              answer: faq.a,
            }))}
          />
        </div>
      </section>

      <CTASection
        subtitle="Your care, your pace"
        title="Have a coverage question?"
        description="Send us your plan name and we will help you understand the next step."
      />
    </>
  );
}
