"use client";

import { ArrowRight, Check, Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FadeLeft, FadeRight, FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/animations";
import {
  publicAboutContent,
  publicAboutPageContent,
  publicHomeSteps,
} from "@workspace/shared/constants";
import { appIconMap } from "@workspace/ui/lib/icons";
import CTASection from "@/components/sections/CTASection";
import PageHeader from "@/components/shared/PageHeader";
import SectionHeader from "@/components/shared/SectionHeader";
import ProviderCard from "@/components/shared/ProviderCard";
import { usePublicProviders } from "@/hooks/content";
import { Button } from "@workspace/ui/components/button";

const FOUNDER_PHOTO = "/images/marketing/cpc-about-founder.jpg";

export default function AboutPage() {
  const { data, isLoading } = usePublicProviders();
  const featuredTeam = (data ?? []).slice(0, 4);

  return (
    <>
      <PageHeader
        subtitle="About Connected Psychiatric Care"
        title="Care should feel connected to your life,"
        titleAccent="not separate from it."
        description="We are a California telehealth psychiatry practice built around the belief that expert mental health care can also be warm, understandable, and human."
        image="/images/marketing/cpc-family-telehealth.jpg"
        imageAlt="A family sharing a calm moment at home"
        actions={
          <Button href="/contact">
            Start with a conversation <ArrowRight className="size-4" />
          </Button>
        }
      />

      {/* Why we began */}
      <section className="px-4 py-14 sm:px-6 lg:py-20">
        <div className="section-container grid gap-12 lg:grid-cols-[1fr_0.8fr]">
          <FadeLeft>
            <SectionHeader
              eyebrow="Why we began"
              title="A better first step for people who are already carrying a lot."
              description={publicAboutContent.intro}
            />
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
              {publicAboutContent.body}
            </p>
          </FadeLeft>

          <FadeRight delay={0.1} className="rounded-4xl bg-card p-7 shadow-(--soft-shadow)">
            <Quote className="size-7 text-accent" />
            <p className="mt-5 font-primary text-xl font-extrabold leading-snug tracking-tight text-foreground">
              People deserve psychiatric care that is both clinically careful and easy to
              understand.
            </p>
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Our care philosophy
            </p>
          </FadeRight>
        </div>
      </section>

      {/* Practice leadership */}
      <section className="bg-secondary/55 px-4 py-14 sm:px-6 lg:py-20">
        <div className="section-container">
          <FadeUp className="mb-10 max-w-2xl">
            <SectionHeader
              eyebrow={publicAboutPageContent.ownerBadge}
              title="Built by clinicians who believe clarity is a form of care."
            />
          </FadeUp>

          <div className="grid items-center gap-9 lg:grid-cols-[0.7fr_1.3fr]">
            <FadeLeft className="overflow-hidden rounded-4xl border-8 border-card bg-card shadow-(--shadow-lift)">
              <div className="relative aspect-4/3 w-full">
                <Image
                  src={FOUNDER_PHOTO}
                  alt="Connected Psychiatric Care practice leadership"
                  fill
                  className="object-cover object-top"
                />
              </div>
            </FadeLeft>

            <FadeRight delay={0.1}>
              <p className="text-lg leading-8 text-muted-foreground">
                &ldquo;{publicAboutContent.owner.philosophy}&rdquo;
              </p>
              <p className="mt-6 text-sm leading-7 text-muted-foreground">
                {publicAboutContent.owner.summary}
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {publicAboutContent.owner.expertise.slice(0, 3).map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-brand-ink"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </FadeRight>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-4 py-14 sm:px-6 lg:py-20">
        <div className="section-container">
          <FadeUp>
            <SectionHeader
              eyebrow="What guides us"
              title={publicAboutPageContent.valuesTitle}
              description={publicAboutPageContent.valuesDescription}
              align="center"
            />
          </FadeUp>

          <StaggerContainer className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {publicAboutContent.values.map((value) => {
              const Icon = appIconMap[value.icon] ?? Check;
              return (
                <StaggerItem key={value.key}>
                  <div className="h-full rounded-4xl border border-border bg-card p-6 shadow-(--soft-shadow)">
                    <div className="grid size-10 place-items-center rounded-xl bg-secondary text-brand-ink">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="mt-5 font-primary text-lg font-extrabold text-foreground">
                      {value.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* What to expect */}
      <section className="bg-card px-4 py-14 sm:px-6 lg:py-20">
        <div className="section-container grid gap-9 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader
            eyebrow="What to expect"
            title="A care experience with fewer unknowns."
            description="From the first request to ongoing follow-up, we will tell you what is happening and what comes next."
          />
          <div className="grid gap-5 sm:grid-cols-3">
            {publicHomeSteps.map((step, index) => (
              <div key={step.id} className="rounded-4xl bg-secondary/70 p-6">
                <span className="font-primary text-3xl font-extrabold tracking-tighter text-accent/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-5 font-primary text-base font-extrabold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="px-4 py-14 sm:px-6 lg:py-20">
        <div className="section-container">
          <FadeUp className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              eyebrow="Our providers"
              title={publicAboutPageContent.teamTitle}
              description={publicAboutPageContent.teamDescription}
            />
            <Link href="/providers" className="btn-quiet shrink-0">
              View full team <ArrowRight className="size-4" />
            </Link>
          </FadeUp>

          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-4xl border border-border bg-card">
                    <div className="aspect-4/3 animate-pulse bg-secondary" />
                    <div className="space-y-2 p-5">
                      <div className="h-4 w-2/3 rounded bg-secondary" />
                      <div className="h-3 w-1/2 rounded bg-secondary" />
                    </div>
                  </div>
                ))
              : featuredTeam.map((member, index) => (
                  <StaggerItem key={member.id}>
                    <ProviderCard
                      tone={index}
                      provider={{
                        slug: member.slug,
                        name: member.user?.displayName,
                        title: member.title,
                        specialties: member.specialties,
                        photo: member.user?.avatar?.url,
                      }}
                    />
                  </StaggerItem>
                ))}
          </StaggerContainer>

          {!isLoading && featuredTeam.length === 0 && (
            <div className="rounded-4xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
              {publicAboutPageContent.teamEmptyState}
            </div>
          )}
        </div>
      </section>

      <CTASection
        subtitle="Your care, your pace"
        title="Care can start with one honest conversation."
        description="Tell us what you are looking for. We will help you understand the next step."
      />
    </>
  );
}
