import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  publicResourceArticles,
  publicResourceFaqs,
  publicResourcesPageContent,
} from "@workspace/shared/constants";
import SectionHeader from "@/components/shared/SectionHeader";
import FAQList from "@/components/shared/FAQList";
import SafetyNote from "@/components/shared/SafetyNote";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/animations";
import { Button } from "@workspace/ui/components/button";
import CTASection from "@/components/sections/CTASection";
import PageHeader from "@/components/shared/PageHeader";
import { faqJsonLd, JsonLd, publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata.resources;

export default function ResourcesPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(publicResourceFaqs)} />
      <PageHeader
        subtitle={publicResourcesPageContent.pageEyebrow}
        title={publicResourcesPageContent.pageTitle}
        titleAccent={publicResourcesPageContent.pageTitleAccent}
        description={publicResourcesPageContent.pageDescription}
        image="/images/marketing/cpc-family-telehealth.jpg"
        imageAlt="A parent and teen reading together at home"
        actions={
          <Button href="#faq">
            Browse FAQs <ArrowRight className="size-4" />
          </Button>
        }
      />

      {/* Articles */}
      <section id="blog" className="px-4 py-14 sm:px-6 lg:py-20">
        <div className="section-container">
          <FadeUp className="mb-9">
            <SectionHeader
              eyebrow={publicResourcesPageContent.articlesEyebrow}
              title={publicResourcesPageContent.articlesTitle}
              description={publicResourcesPageContent.articlesDescription}
            />
          </FadeUp>

          <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {publicResourceArticles.map((article) => (
              <StaggerItem key={article.slug}>
                <Link
                  href={`/resources/${article.slug}`}
                  className="group block h-full rounded-4xl border border-border bg-card p-5 shadow-(--soft-shadow) transition hover:-translate-y-1 hover:shadow-(--shadow-lift)"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="eyebrow text-accent">{article.category}</span>
                    <span className="text-xs text-muted-foreground">{article.readTime}</span>
                  </div>
                  <h2 className="mt-5 font-primary text-xl font-extrabold leading-tight tracking-tight text-foreground">
                    {article.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {article.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.12em] text-brand-ink">
                    Read article
                    <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* FAQ - lives here rather than on its own page so every "questions" entry point lands together */}
      <section id="faq" className="scroll-mt-20 bg-secondary/55 px-4 py-14 sm:px-6 lg:py-20">
        <div className="section-container max-w-4xl space-y-8">
          <FadeUp className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeader
              eyebrow={publicResourcesPageContent.faqEyebrow}
              title={publicResourcesPageContent.faqTitle}
              description={publicResourcesPageContent.askTeamPrompt}
            />
            <Button className="shrink-0" asChild>
              <Link href="/contact">{publicResourcesPageContent.askTeamLabel}</Link>
            </Button>
          </FadeUp>

          <FAQList items={publicResourceFaqs} />

          <SafetyNote />
        </div>
      </section>

      <CTASection
        subtitle="Your care, your pace"
        title={publicResourcesPageContent.ctaTitle}
        description={publicResourcesPageContent.ctaDescription}
      />
    </>
  );
}
