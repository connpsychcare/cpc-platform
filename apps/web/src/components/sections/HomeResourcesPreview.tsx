import { ArrowRight } from "lucide-react";
import Link from "next/link";

import SectionHeaderRow from "@/components/shared/SectionHeaderRow";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/animations";
import { publicResourceArticles } from "@workspace/shared/constants";

export default function HomeResourcesPreview() {
  const articles = publicResourceArticles.slice(0, 3);

  return (
    <section className="py-12 sm:py-20 section">
      <FadeUp>
        <SectionHeaderRow
          eyebrow="From the care library"
          title="Helpful context, whenever you need it."
          description="Plain-spoken guides to make mental health care easier to understand and talk about."
          linkHref="/resources"
          linkLabel="Browse resources"
        />
      </FadeUp>

      <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <StaggerItem key={article.slug}>
            <Link
              href={`/resources/${article.slug}`}
              className="group block h-full rounded-3xl border border-sage/60 bg-card p-5 shadow-(--card-shadow) transition duration-200 hover:-translate-y-1 hover:shadow-(--shadow-lift) dark:border-white/10"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-bold uppercase tracking-[0.17em] text-accent">
                  {article.category}
                </span>
                <span className="text-xs text-muted-foreground">{article.readTime}</span>
              </div>
              <h3 className="mt-5 font-primary text-xl font-extrabold leading-tight tracking-tight text-foreground">
                {article.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {article.description}
              </p>
              <span className="mt-6 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.12em] text-forest">
                Read article
                <ArrowRight className="size-3.5 transition group-hover:translate-x-1" />
              </span>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
