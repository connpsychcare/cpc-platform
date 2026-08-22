"use client";

import { ArrowRight } from "lucide-react";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/animations";
import CTASection from "@/components/sections/CTASection";
import SectionHeader from "@/components/shared/SectionHeader";
import PageHeader from "@/components/shared/PageHeader";
import ProviderCard from "@/components/shared/ProviderCard";
import { usePublicProviders } from "@/hooks/content";
import { publicProvidersPageContent } from "@workspace/shared/constants";
import { Button } from "@workspace/ui/components/button";

export default function ProvidersPage() {
  const { data, isLoading } = usePublicProviders();
  const team = data ?? [];

  return (
    <>
      <PageHeader
        subtitle="Our providers"
        title="Skilled clinicians."
        titleAccent="Real human presence."
        description="Our providers are licensed in California and share a commitment to clear, collaborative psychiatric care."
        image="/images/marketing/cpc-provider-card.jpg"
        imageAlt="A Connected Psychiatric Care provider in their home office"
        actions={
          <Button href="/contact">
            Find your provider <ArrowRight className="size-4" />
          </Button>
        }
      />

      <section className="px-4 py-14 sm:px-6 lg:py-20">
        <div className="section-container">
          <FadeUp className="mb-9">
            <SectionHeader
              eyebrow="Meet the team"
              title="Different specialties, one steady approach."
              description="Explore each provider's focus and care philosophy. If you are not sure who is the right fit, our team can help."
            />
          </FadeUp>

          <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-4xl border border-border bg-card"
                  >
                    <div className="aspect-4/3 animate-pulse bg-secondary" />
                    <div className="space-y-2 p-5">
                      <div className="h-4 w-2/3 rounded bg-secondary" />
                      <div className="h-3 w-1/2 rounded bg-secondary" />
                    </div>
                  </div>
                ))
              : team.map((provider, index) => (
                  <StaggerItem key={provider.slug}>
                    <ProviderCard
                      tone={index}
                      provider={{
                        slug: provider.slug,
                        name: provider.user?.displayName,
                        title: provider.title,
                        specialties: provider.specialties,
                        photo: provider.user?.avatar?.url,
                      }}
                    />
                  </StaggerItem>
                ))}
          </StaggerContainer>

          {!isLoading && team.length === 0 && (
            <div className="rounded-4xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
              {publicProvidersPageContent.emptyState}
            </div>
          )}
        </div>
      </section>

      <CTASection
        subtitle="Your care, your pace"
        title="Not sure which provider is right for you?"
        description="Tell us what you are looking for and we will help you find a thoughtful match."
      />
    </>
  );
}
