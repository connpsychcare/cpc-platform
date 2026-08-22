"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { usePublicProviders } from "@/hooks/content";
import SectionHeader from "@/components/shared/SectionHeader";
import ProviderCard from "@/components/shared/ProviderCard";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/animations";

export default function ProvidersSection() {
  const { data, isLoading } = usePublicProviders();
  const team = (data ?? []).slice(0, 4);

  return (
    <section className="px-4 py-14 sm:px-6 lg:py-20">
      <div className="section-container">
        <FadeUp className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            eyebrow="Meet the care team"
            title="Skilled clinicians, real human presence."
            description="Our licensed providers bring different specialties and a shared commitment to clear, collaborative care."
          />
          <Link href="/providers" className="btn-quiet shrink-0">
            Meet all providers <ArrowRight className="size-4" />
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
            : team.map((provider, index) => (
                <StaggerItem key={provider.id}>
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
          <div className="rounded-4xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Our provider profiles will be available soon.
          </div>
        )}
      </div>
    </section>
  );
}
