"use client";

import {
  Briefcase,
  GraduationCap,
  Heart,
  Clock,
  ArrowRight,
} from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { FadeLeft, FadeRight, StaggerContainer, StaggerItem } from "@/components/shared/animations";
import { publicCareersContent } from "@workspace/shared/constants";
import { resolvePublicBusinessProfile } from "@workspace/shared/utils";
import Link from "next/link";
import SectionHeader from "@/components/shared/SectionHeader";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import PageHeader from "@/components/shared/PageHeader";
import { usePublicBusinessProfile, usePublicCareers } from "@/hooks/content";
import type { JobListingResponse } from "@workspace/contracts/job-listing";

function formatJobType(type: JobListingResponse["type"]) {
  switch (type) {
    case "fullTime":
      return "Full-Time";
    case "partTime":
      return "Part-Time";
    case "contract":
      return "Contract";
    case "internship":
      return "Internship";
    default:
      return type;
  }
}

const perks = [
  { icon: GraduationCap, label: publicCareersContent.perks[0], tone: "mist" },
  { icon: Heart, label: publicCareersContent.perks[1], tone: "forest" },
  { icon: Briefcase, label: publicCareersContent.perks[2], tone: "forest" },
  { icon: Clock, label: publicCareersContent.perks[3], tone: "mist" },
] as const;

export default function CareersPage() {
  const { data, isLoading } = usePublicCareers();
  const { data: businessProfile } = usePublicBusinessProfile();
  const business = resolvePublicBusinessProfile(businessProfile);
  const openings = data ?? [];

  return (
    <>
      <PageHeader
        subtitle="Careers"
        title={publicCareersContent.title}
        titleAccent={publicCareersContent.titleAccent}
        description={publicCareersContent.description}
        actions={
          <Button href="#openings">
            See open roles <ArrowRight className="size-4" />
          </Button>
        }
      />

      {/* Why join */}
      <section className="py-12 sm:py-20 section">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <FadeLeft>
            <SectionHeader
              eyebrow="Why Connected"
              title="A team that takes care seriously, and takes care of each other."
              description="We work remotely across California, share context generously, and make room for clinical judgment. Our goal is to make the system feel more thoughtful, not just faster."
            />
          </FadeLeft>
          <FadeRight delay={0.1} className="grid gap-4 sm:grid-cols-2">
            {perks.map((perk) => (
              <div
                key={perk.label}
                className={cn(
                  "rounded-3xl p-6",
                  perk.tone === "forest" ? "bg-forest text-forest-foreground" : "bg-mist/70 dark:bg-mist/20",
                )}
              >
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-2xl",
                    perk.tone === "forest" ? "bg-white/15" : "bg-forest/10 text-forest",
                  )}
                >
                  <perk.icon className="size-5" />
                </div>
                <p className={cn("mt-4 text-sm leading-6", perk.tone === "forest" ? "text-forest-foreground/85" : "text-muted-foreground")}>
                  {perk.label}
                </p>
              </div>
            ))}
          </FadeRight>
        </div>
      </section>

      {/* Open Positions */}
      <section id="openings" className="scroll-mt-20 bg-mist/45 py-12 sm:py-20">
        <div className="section">
          <SectionHeader
            eyebrow="Open positions"
            title={publicCareersContent.openingsTitle}
            description={
              <>
                {publicCareersContent.openingsDescription.split("{email}")[0]}
                <a href={`mailto:${business.supportEmail}`} className="font-bold text-accent underline">
                  {business.supportEmail}
                </a>
                {publicCareersContent.openingsDescription.split("{email}")[1]}
              </>
            }
          />

          <StaggerContainer className="mt-8 space-y-4">
            {isLoading
              ? Array.from({ length: 3 }).map((_, index) => (
                  <StaggerItem key={index}><Card className="overflow-hidden">
                    <CardContent className="animate-pulse space-y-4 p-6">
                      <div className="h-6 w-64 rounded bg-secondary" />
                      <div className="h-4 w-48 rounded bg-secondary" />
                      <div className="h-20 rounded bg-secondary" />
                    </CardContent>
                  </Card></StaggerItem>
                ))
              : openings.map((job) => (
                  <StaggerItem key={job.id}>
                    <div className="flex flex-col gap-5 rounded-4xl border border-sage/60 bg-card p-6 shadow-(--card-shadow) sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
                      <div>
                        <h3 className="font-primary text-xl font-extrabold text-foreground">
                          {job.title}
                        </h3>
                        <p className="mt-2 text-xs font-bold uppercase tracking-[0.11em] text-accent">
                          {formatJobType(job.type)} · {job.location}
                          {job.salary ? ` · ${job.salary}` : ""}
                        </p>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                          {job.description}
                        </p>
                      </div>
                      <Button className="shrink-0" asChild>
                        <Link href="/contact">
                          {publicCareersContent.applyLabel} <ArrowRight className="size-4" />
                        </Link>
                      </Button>
                    </div>
                  </StaggerItem>
                ))}
            {!isLoading && openings.length === 0 ? (
              <Card className="overflow-hidden border-dashed">
                <CardContent className="p-8 text-center text-sm text-muted-foreground">
                  {publicCareersContent.emptyState}
                </CardContent>
              </Card>
            ) : null}
          </StaggerContainer>
        </div>
      </section>
    </>
  );
}
