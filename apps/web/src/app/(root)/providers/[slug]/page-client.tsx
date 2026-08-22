"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { usePublicProvider, usePublicProviders } from "@/hooks/content";
import { publicProvidersPageContent } from "@workspace/shared/constants";
import { Button } from "@workspace/ui/components/button";
import CTASection from "@/components/sections/CTASection";
import SectionHeader from "@/components/shared/SectionHeader";
import ProviderCard from "@/components/shared/ProviderCard";
import CheckList from "@/components/shared/CheckList";
import { FadeLeft, FadeRight, FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/animations";

export default function ProviderDetailClient({ slug }: { slug: string }) {
  const { data: provider, isLoading, isError } = usePublicProvider(slug);
  const { data: allProviders } = usePublicProviders();

  const related = (allProviders ?? []).filter((d) => d.slug !== slug).slice(0, 4);

  if (isLoading) {
    return (
      <section className="px-4 py-20 sm:px-6">
        <div className="section-container grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
          <div className="aspect-4/3 animate-pulse rounded-4xl bg-secondary" />
          <div className="space-y-4">
            <div className="h-4 w-32 animate-pulse rounded bg-secondary" />
            <div className="h-12 w-2/3 animate-pulse rounded bg-secondary" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-secondary" />
          </div>
        </div>
      </section>
    );
  }

  if (!provider || isError) {
    return (
      <>
        <section className="bg-secondary/55 px-4 py-20 sm:px-6">
          <div className="section-container max-w-2xl">
            <Link
              href="/providers"
              className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:underline"
            >
              <ArrowLeft className="size-4" /> {publicProvidersPageContent.viewFullTeamLabel}
            </Link>
            <h1 className="mt-8 font-primary text-4xl font-extrabold tracking-tighter text-foreground">
              {publicProvidersPageContent.notFoundTitle}
            </h1>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              {publicProvidersPageContent.notFoundDescription}
            </p>
            <Button className="mt-7" asChild>
              <Link href="/providers">{publicProvidersPageContent.notFoundPrimaryLabel}</Link>
            </Button>
          </div>
        </section>
        <CTASection
          subtitle="Your care, your pace"
          title={publicProvidersPageContent.notFoundCtaTitle}
          description={publicProvidersPageContent.notFoundCtaDescription}
        />
      </>
    );
  }

  const name = provider.user?.displayName ?? "Psychiatric Provider";
  const firstName = name.split(" ")[0];
  const photo = provider.user?.avatar?.url;
  const specialties = provider.specialties ?? [];
  const credentials = provider.credentials ?? [];

  return (
    <>
      {/* Header */}
      <section className="bg-secondary/55 px-4 py-12 sm:px-6 sm:py-16">
        <div className="section-container">
          <Link
            href="/providers"
            className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:underline"
          >
            <ArrowLeft className="size-4" /> Meet the full team
          </Link>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <FadeLeft className="overflow-hidden rounded-4xl border-8 border-card bg-card shadow-(--shadow-lift)">
              <div className="relative aspect-4/3 w-full">
                {photo ? (
                  <Image src={photo} alt={`${name}, ${provider.title ?? ""}`} fill className="object-cover object-top" />
                ) : (
                  <div className="grid size-full place-items-center bg-secondary">
                    <span className="grid size-24 place-items-center rounded-full border border-primary/15 bg-card font-primary text-3xl font-extrabold text-brand-ink">
                      {name
                        .split(" ")
                        .map((p) => p[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </FadeLeft>

            <FadeRight delay={0.1}>
              <p className="eyebrow">Licensed California provider</p>
              <h1 className="mt-4 font-primary text-4xl font-extrabold tracking-tighter text-foreground sm:text-6xl">
                {name}
              </h1>
              {provider.title && (
                <p className="mt-3 text-lg text-muted-foreground">{provider.title}</p>
              )}
              {specialties.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {specialties.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-card px-3 py-1.5 text-xs font-bold text-brand-ink"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <Button className="mt-8" asChild>
                <Link href="/booking#book">
                  {publicProvidersPageContent.bookWithPrefix} {firstName}{" "}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </FadeRight>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="px-4 py-14 sm:px-6 lg:py-20">
        <div className="section-container grid gap-12 lg:grid-cols-[1fr_0.8fr]">
          <FadeLeft>
            <SectionHeader
              eyebrow="About this provider"
              title="Care that makes room for the full picture."
            />
            {provider.bio && (
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
                {provider.bio}
              </p>
            )}
            <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
              In visits, {firstName} focuses on understanding the person behind the symptoms,
              sharing options clearly, and building a plan that feels doable between
              appointments.
            </p>

            {(credentials.length > 0 || provider.education) && (
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {credentials.length > 0 && (
                  <div>
                    <p className="eyebrow text-accent">Credentials</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {credentials.map((item) => (
                        <span
                          key={item}
                          className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold text-brand-ink"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {provider.education && (
                  <div>
                    <p className="eyebrow text-accent">Education</p>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">
                      {provider.education}
                    </p>
                  </div>
                )}
              </div>
            )}
          </FadeLeft>

          <FadeRight delay={0.1} className="rounded-4xl bg-sage/40 p-7">
            <p className="eyebrow text-accent">{publicProvidersPageContent.whatToExpectTitle}</p>
            <div className="mt-6">
              <CheckList items={publicProvidersPageContent.whatToExpectItems} />
            </div>
          </FadeRight>
        </div>
      </section>

      {/* Related providers */}
      {related.length > 0 && (
        <section className="bg-secondary/55 px-4 py-14 sm:px-6 lg:py-20">
          <div className="section-container">
            <FadeUp className="mb-9">
              <SectionHeader eyebrow="More of the team" title="Other providers you can see." />
            </FadeUp>
            <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item, index) => (
                <StaggerItem key={item.id}>
                  <ProviderCard
                    tone={index}
                    provider={{
                      slug: item.slug,
                      name: item.user?.displayName,
                      title: item.title,
                      specialties: item.specialties,
                      photo: item.user?.avatar?.url,
                    }}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      <CTASection
        subtitle="Your care, your pace"
        title={`Ready to meet ${firstName}?`}
        description="Request an appointment and our team will help you find the right time."
      />
    </>
  );
}
