import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { publicServicesPageContent } from "@workspace/shared/constants";
import StepsSection from "@/components/sections/StepsSection";
import ServicesSection from "@/components/sections/ServicesSection";
import { Button } from "@workspace/ui/components/button";
import PageHeader from "@/components/shared/PageHeader";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata.services;

const PROMISES = [
  {
    title: "Private by design",
    body: "Join from a private room at home, school, or work. Wherever care feels most comfortable.",
    tone: "primary",
  },
  {
    title: "Clear, not rushed",
    body: "We make space for context, questions, and a plan you can understand.",
    tone: "sage",
  },
  {
    title: "Connected",
    body: "Your care can evolve as your needs do, with a team that remembers the whole picture.",
    tone: "card",
  },
] as const;

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        subtitle="Services"
        title="Psychiatric care that meets you"
        titleAccent="where you are."
        description="From the first evaluation to ongoing medication support, our services are designed to make expert care feel clear and connected."
        image="/images/marketing/cpc-hero-telehealth.jpg"
        imageAlt="A patient meeting their provider by secure video from home"
        actions={
          <Button href="/contact">
            Find your next step <ArrowRight className="size-4" />
          </Button>
        }
      />

      <ServicesSection
        limit="all"
        eyebrow="Our services"
        title="Support for a wide range of needs."
        description="Every service begins with listening. Explore a focus area below to see who it is for and what visits can include."
      />

      {/* Reassurance split */}
      <section className="bg-card px-4 py-14 sm:px-6 lg:py-16">
        <div className="section-container grid items-center gap-8 lg:grid-cols-[0.65fr_1.35fr]">
          <div>
            <p className="eyebrow text-accent">Care is not one-size-fits-all</p>
            <h2 className="mt-3 max-w-md font-primary text-3xl font-extrabold tracking-tight text-foreground">
              Start with the focus area that sounds closest.
            </h2>
          </div>
          <p className="max-w-2xl text-base leading-8 text-muted-foreground">
            You do not need to arrive with a diagnosis or a finished story. These service areas are
            entry points for a conversation; our team will help you understand what kind of care may
            be useful next.
          </p>
        </div>
      </section>

      {/* Three promises */}
      <section className="bg-secondary/55 px-4 py-14 sm:px-6">
        <div className="section-container grid gap-5 md:grid-cols-3">
          {PROMISES.map((promise) => (
            <div
              key={promise.title}
              className={
                promise.tone === "primary"
                  ? "rounded-4xl bg-brand-surface p-6 text-brand-surface-foreground"
                  : promise.tone === "sage"
                    ? "rounded-4xl border border-border bg-sage/35 p-6 text-brand-ink"
                    : "rounded-4xl border border-border bg-card p-6"
              }
            >
              <p className="font-primary text-xl font-extrabold">{promise.title}</p>
              <p
                className={
                  promise.tone === "primary"
                    ? "mt-3 text-sm leading-6 text-brand-surface-foreground/70"
                    : "mt-3 text-sm leading-6 text-muted-foreground"
                }
              >
                {promise.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <StepsSection />

      {/* Patient portal */}
      <section id="patient-portal" className="scroll-mt-20 px-4 py-14 sm:px-6 lg:py-20">
        <div className="section-container flex flex-col gap-6 rounded-4xl border border-border bg-secondary/50 p-8 md:flex-row md:items-center md:justify-between md:p-12">
          <div className="max-w-xl">
            <p className="eyebrow text-accent">{publicServicesPageContent.portalBadge}</p>
            <h2 className="mt-3 font-primary text-3xl font-extrabold tracking-tight text-foreground">
              {publicServicesPageContent.portalTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              {publicServicesPageContent.portalDescription}
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3">
            <Button asChild size="lg">
              <Link href="/auth/sign-in">{publicServicesPageContent.portalLoginLabel}</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/sign-up">{publicServicesPageContent.portalSignupLabel}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
