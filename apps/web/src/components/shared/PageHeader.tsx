import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { FadeRight, FadeUp } from "@/components/shared/animations";

interface PageHeaderProps {
  subtitle: string;
  title: string;
  /**
   * Trailing part of the heading, highlighted in brand blue. Mirrors the homepage
   * hero, so inner pages read as part of the same family rather than flat text.
   */
  titleAccent?: string;
  description: string;
  actions?: ReactNode;
  image?: string;
  imageAlt?: string;
  className?: string;
}

/**
 * The single inner-page hero used by every public page: a full-bleed mist band with
 * eyebrow / title / body / actions on the left, and an optional framed photo on the
 * right carrying a small floating "care across California" plate.
 */
export default function PageHeader({
  subtitle,
  title,
  titleAccent,
  description,
  actions,
  image,
  imageAlt,
  className,
}: PageHeaderProps) {
  return (
    <section
      className={cn(
        "border-b border-border bg-secondary/55 px-4 pb-12 pt-14 sm:px-6 sm:pb-16 sm:pt-20",
        className,
      )}
    >
      <div className="section-container">
        <div className={cn("grid items-center gap-10", image ? "lg:grid-cols-[0.9fr_1.1fr]" : "max-w-3xl")}>
          <div>
            <FadeUp>
              <p className="eyebrow">{subtitle}</p>
              <h1 className="mt-4 max-w-3xl font-primary text-4xl font-extrabold leading-[1.02] tracking-tighter text-foreground sm:text-6xl">
                {title}
                {titleAccent && (
                  <>
                    {" "}
                    <span className="text-brand-ink">{titleAccent}</span>
                  </>
                )}
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
                {description}
              </p>
            </FadeUp>
            {actions && (
              <FadeUp delay={0.1} className="mt-7 flex flex-wrap gap-3">
                {actions}
              </FadeUp>
            )}
          </div>

          {image && (
            <FadeRight delay={0.12} className="relative">
              <div className="overflow-hidden rounded-4xl border-8 border-card bg-card shadow-(--shadow-lift)">
                <div className="relative aspect-4/3 w-full">
                  <Image src={image} alt={imageAlt ?? title} fill priority className="object-cover" />
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 rounded-2xl bg-card px-4 py-3 shadow-(--soft-shadow)">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-ink">
                  Care across California
                </p>
                <p className="mt-1 text-xs text-muted-foreground">100% secure video visits</p>
              </div>
            </FadeRight>
          )}
        </div>
      </div>
    </section>
  );
}
