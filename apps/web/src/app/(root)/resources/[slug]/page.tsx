import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import {
  blockFaqs,
  getResourceArticle,
  publicResourceArticles,
} from "@workspace/shared/constants";
import { Button } from "@workspace/ui/components/button";
import CTASection from "@/components/sections/CTASection";
import SectionHeader from "@/components/shared/SectionHeader";
import SafetyNote from "@/components/shared/SafetyNote";
import ContentBlocks from "@/components/shared/ContentBlocks";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/animations";
import { brandName, faqJsonLd, JsonLd } from "@/lib/seo";
import { formatDate } from "@workspace/shared/utils";
import type { Metadata } from "next";

type Params = { slug: string };

export async function generateStaticParams() {
  return publicResourceArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getResourceArticle(slug);
  if (!article) return { title: "Article not found", robots: { index: false, follow: true } };

  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `/resources/${slug}` },
    openGraph: {
      // Social cards have no title template, so the brand is spelled out here.
      title: `${article.title} | ${brandName}`,
      description: article.description,
      url: `/resources/${slug}`,
      type: "article",
      modifiedTime: article.reviewed,
    },
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const article = getResourceArticle(slug);
  if (!article) notFound();

  const faqs = blockFaqs(article.blocks);
  const related = publicResourceArticles.filter((a) => a.slug !== slug).slice(0, 3);

  return (
    <article>
      {faqs.length > 0 && <JsonLd data={faqJsonLd(faqs)} />}

      {/* Article header */}
      <section className="border-b border-border bg-secondary/55 px-4 py-14 sm:px-6 sm:py-20">
        <div className="section-container max-w-4xl!">
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:underline"
          >
            <ArrowLeft className="size-4" /> All resources
          </Link>
          <p className="eyebrow mt-10 text-accent">
            {article.category} · {article.readTime}
          </p>
          <h1 className="mt-4 font-primary text-4xl font-extrabold leading-[1.04] tracking-tighter text-foreground sm:text-5xl lg:text-6xl">
            {article.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            {article.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <CalendarDays className="size-4 text-accent" />
              Reviewed {formatDate(article.reviewed, {
                options: { year: "numeric", month: "long", day: "numeric" },
              })}
            </span>
            <span>Connected Psychiatric Care clinical team</span>
          </div>
        </div>
      </section>

      {/* Lead */}
      <section className="px-4 pt-14 sm:px-6 lg:pt-20">
        <div className="section-container max-w-3xl! space-y-5">
          {article.lead.map((paragraph, i) => (
            <p
              key={i}
              className="text-lg leading-8 text-foreground/80 first:font-body-medium"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Long-form body. Block types and order differ by article. */}
      <ContentBlocks blocks={article.blocks} />

      {/* Disclaimer and crisis note */}
      <section className="px-4 pb-14 sm:px-6 lg:pb-20">
        <div className="section-container max-w-3xl!">
          <SafetyNote />
          <p className="mt-8 border-t border-border pt-8 text-xs italic leading-6 text-muted-foreground/70">
            This article is educational and does not constitute medical advice or establish a
            provider relationship. Treatment decisions depend on your individual history, so
            please speak with a licensed psychiatric provider about your own situation.
          </p>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-border bg-secondary/55 px-4 py-14 sm:px-6">
          <div className="section-container">
            <FadeUp className="mb-9">
              <SectionHeader eyebrow="Keep reading" title="More from the care library" />
            </FadeUp>
            <StaggerContainer className="grid gap-4 md:grid-cols-3">
              {related.map((rel) => (
                <StaggerItem key={rel.slug}>
                  <Link
                    href={`/resources/${rel.slug}`}
                    className="group block h-full rounded-4xl border border-border bg-card p-5 shadow-(--soft-shadow) transition hover:-translate-y-1 hover:shadow-(--shadow-lift)"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="eyebrow text-accent">{rel.category}</span>
                      <span className="text-xs text-muted-foreground">{rel.readTime}</span>
                    </div>
                    <p className="mt-5 font-primary text-lg font-extrabold leading-tight tracking-tight text-foreground">
                      {rel.title}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.12em] text-primary">
                      Read article
                      <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
                    </span>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      )}

      <CTASection
        subtitle="Your care, your pace"
        title="Want to talk through your own next step?"
        description="Our team can help you understand which kind of visit may be a good fit."
      />
    </article>
  );
}
