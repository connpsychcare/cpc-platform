import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, Phone } from "lucide-react";
import {
  blockFaqs,
  getServiceBlocks,
  publicServices,
} from "@workspace/shared/constants";
import { resolvePublicBusinessProfile } from "@workspace/shared/utils";
import { Button } from "@workspace/ui/components/button";
import CTASection from "@/components/sections/CTASection";
import PageHeader from "@/components/shared/PageHeader";
import SectionHeader from "@/components/shared/SectionHeader";
import ServiceCard from "@/components/shared/ServiceCard";
import ContentBlocks from "@/components/shared/ContentBlocks";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/animations";
import { brandName, faqJsonLd, JsonLd } from "@/lib/seo";
import type { Metadata } from "next";

const SERVICE_PHOTOS: Record<string, string> = {
  "psychiatric-evaluation": "/images/marketing/cpc-hero-telehealth.jpg",
  "medication-management": "/images/marketing/scene-older-adult-medication.jpg",
  "telehealth-psychiatry": "/images/marketing/scene-telehealth-porch.jpg",
  "depression-treatment": "/images/marketing/resource-seek-support.jpg",
  "anxiety-treatment": "/images/marketing/scene-adult-man-anxiety.jpg",
  "adhd-treatment": "/images/marketing/scene-child-parent-adhd.jpg",
  "child-adolescent-psychiatry": "/images/marketing/cpc-family-telehealth.jpg",
  default: "/images/marketing/cpc-hero-telehealth.jpg",
};

type Params = { slug: string };

export async function generateStaticParams() {
  return publicServices.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = publicServices.find((s) => s.slug === slug);
  if (!service) return { title: "Service not found", robots: { index: false, follow: true } };

  return {
    title: service.title,
    description: service.description,
    alternates: { canonical: `/services/${slug}` },
    openGraph: {
      // Social cards have no title template, so the brand is spelled out here.
      title: `${service.title} | ${brandName}`,
      description: service.description,
      url: `/services/${slug}`,
      type: "article",
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = publicServices.find((s) => s.slug === slug);
  if (!service) notFound();

  const business = resolvePublicBusinessProfile();
  const photo = SERVICE_PHOTOS[slug] ?? SERVICE_PHOTOS["default"]!;
  const blocks = getServiceBlocks(slug);
  const faqs = blockFaqs(blocks);
  const related = publicServices.filter((s) => s.slug !== slug).slice(0, 3);
  // Highlight the final word of the service name, matching the hero treatment.
  const titleWords = service.title.split(" ");
  const titleAccent = titleWords.length > 1 ? titleWords.pop() : undefined;
  const titleBase = titleWords.join(" ");

  return (
    <>
      {faqs.length > 0 && <JsonLd data={faqJsonLd(faqs)} />}

      <PageHeader
        subtitle="Our services"
        title={titleBase}
        titleAccent={titleAccent}
        description={service.subtitle}
        image={photo}
        imageAlt={service.title}
        actions={
          <>
            <Button href="/booking#book">
              Book an Appointment <ArrowRight className="size-4" />
            </Button>
            <Button variant="outline" asChild>
              <Link href="/services">All services</Link>
            </Button>
          </>
        }
      />

      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="section py-3">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-brand-ink">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/services" className="transition-colors hover:text-brand-ink">
              Services
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-foreground">{service.title}</span>
          </nav>
        </div>
      </div>

      {/* Overview with a sticky booking card */}
      <section className="px-4 py-14 sm:px-6 lg:py-20">
        <div className="section-container grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <p className="eyebrow">In short</p>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              {service.description}
            </p>

            <h2 className="mt-10 font-primary text-xl font-extrabold tracking-tight text-foreground">
              What this includes
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {service.highlights.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary/10">
                    <Check className="size-3 text-brand-ink" />
                  </span>
                  <span className="text-sm leading-6 text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-4xl border border-border bg-secondary/50 p-6">
              <p className="eyebrow text-accent">Who this is for</p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{service.who}</p>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="sticky top-28 rounded-4xl border border-border bg-card p-6 shadow-(--soft-shadow)">
              <h2 className="font-primary text-lg font-extrabold tracking-tight text-foreground">
                Ready when you are
              </h2>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                Visits happen by secure video anywhere in California. You do not need a
                referral or a diagnosis to book.
              </p>
              <Button href="/booking#book" className="mt-5 w-full">
                Book an Appointment <ArrowRight className="size-4" />
              </Button>
              <Button variant="outline" className="mt-3 w-full" asChild>
                <a href={business.primaryPhone.href}>
                  <Phone className="size-4" />
                  {business.primaryPhone.display}
                </a>
              </Button>
              <Link href="/insurance" className="btn-quiet mt-5">
                Check your insurance <ArrowRight className="size-4" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* Long-form body. Block types and order differ by service. */}
      {blocks && <ContentBlocks blocks={blocks} />}

      {related.length > 0 && (
        <section className="border-t border-border px-4 py-14 sm:px-6 lg:py-20">
          <div className="section-container">
            <FadeUp className="mb-9">
              <SectionHeader eyebrow="You may also explore" title="Related areas of care" />
            </FadeUp>
            <StaggerContainer className="grid gap-4 md:grid-cols-3">
              {related.map((item) => (
                <StaggerItem key={item.slug}>
                  <ServiceCard service={item} compact />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      <CTASection
        subtitle="Your care, your pace"
        title="Ready to take the next step?"
        description="Start with a secure video visit and a provider who will listen closely."
      />
    </>
  );
}
