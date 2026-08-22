import Link from "next/link";
import { Brain } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { appIconMap } from "@workspace/ui/lib/icons";
import { publicConditions } from "@workspace/shared/constants";
import {
  FadeLeft,
  FadeRight,
  StaggerContainer,
  StaggerItem,
} from "@/components/shared/animations";

// Cycle every 3rd card through forest / accent / plain-neutral, matching Manus's
// alternating badge treatment instead of styling every card identically.
const CARD_TONES = [
  "border-forest/25 bg-mist/50",
  "border-accent/25 bg-accent/5",
  "border-sage/60 bg-background",
] as const;
const ICON_TONES = [
  "bg-forest/10 text-forest group-hover:bg-forest group-hover:text-forest-foreground",
  "bg-accent/10 text-accent group-hover:bg-accent group-hover:text-white",
  "bg-secondary text-foreground group-hover:bg-forest group-hover:text-forest-foreground",
] as const;

export default function ConditionsTreated() {
  return (
    <section className="bg-card py-12 sm:py-20 dark:bg-transparent">
      <div className="section space-y-9">
        <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Left - copy */}
          <FadeLeft className="max-w-md lg:sticky lg:top-28">
            <p className="text-xs font-bold uppercase tracking-[0.17em] text-forest">
              Care for the whole picture
            </p>
            <h2 className="mt-3 font-primary text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
              Support for the patterns that shape daily life.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              We look beyond a single symptom to understand the context,
              strengths, and goals that make your care plan yours.
            </p>
          </FadeLeft>

          {/* Right - condition cards */}
          <FadeRight delay={0.1}>
            <StaggerContainer className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {publicConditions.map(({ label, icon, href }, index) => {
                const Icon = appIconMap[icon as keyof typeof appIconMap];
                const tone = index % 3;
                return (
                  <StaggerItem key={label}>
                    <Link
                      href={href}
                      className={cn(
                        "group flex flex-col items-center gap-3 rounded-3xl border p-5 text-center shadow-(--card-shadow) transition duration-200 hover:-translate-y-0.5 hover:shadow-(--shadow-lift) active:scale-[0.98] dark:border-white/10",
                        CARD_TONES[tone],
                      )}
                    >
                      <div
                        className={cn(
                          "flex size-12 items-center justify-center rounded-2xl transition",
                          ICON_TONES[tone],
                        )}
                      >
                        {Icon && <Icon className="size-6" />}
                      </div>
                      <span className="text-sm font-medium leading-snug text-foreground">
                        {label}
                      </span>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>

            {/* Evidence callout */}
            <div className="mt-5 rounded-2xl border border-sage/50 bg-mist/50 p-5 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-forest/10 text-forest">
                  <Brain className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Evidence-Based Care
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    We use validated clinical tools, PHQ-9, GAD-7, ASRS, and
                    Vanderbilt, to assess and monitor every patient.
                  </p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/services">View All Services</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/contact">Ask About Your Condition</Link>
              </Button>
            </div>
          </FadeRight>
        </div>
      </div>
    </section>
  );
}
