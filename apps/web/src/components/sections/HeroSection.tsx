import { ArrowRight, HeartHandshake, LockKeyhole, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { publicHeroContent } from "@workspace/shared/constants";
import { Button } from "@workspace/ui/components/button";
import { FadeLeft, FadeRight, FadeUp } from "@/components/shared/animations";

const HERO_PHOTO_SRC = "/images/marketing/cpc-hero-telehealth.jpg";

const TRUST_ROW = [
  { icon: LockKeyhole, label: "Secure video visits" },
  { icon: MapPin, label: "Licensed in California" },
] as const;

export default function HeroSection() {
  return (
    <section className="overflow-hidden bg-secondary/55 px-4 pb-10 pt-10 sm:px-6 sm:pb-16 sm:pt-16">
      <div className="section-container grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">

        {/* Left - copy + CTAs */}
        <div className="relative z-10">
          <FadeUp>
            <p className="eyebrow">
              <span className="mr-2 inline-block size-1.5 rounded-full bg-accent align-middle" />
              {publicHeroContent.badge}
            </p>
          </FadeUp>

          <FadeUp delay={0.08}>
            <h1 className="mt-5 max-w-2xl font-primary text-5xl font-extrabold leading-[0.98] tracking-tighter text-foreground sm:text-6xl lg:text-[4.7rem]">
              {publicHeroContent.title}{" "}
              <span className="text-brand-ink">{publicHeroContent.titleAccent}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
              {publicHeroContent.description}
            </p>
          </FadeUp>

          <FadeUp delay={0.16} className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/booking#book">
                {publicHeroContent.primaryLabel} <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/services">{publicHeroContent.secondaryLabel}</Link>
            </Button>
          </FadeUp>

          <FadeUp
            delay={0.24}
            className="mt-8 flex flex-wrap items-center gap-5 text-xs font-semibold text-muted-foreground"
          >
            {TRUST_ROW.map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-2">
                <Icon className="size-4 text-brand-ink" />
                {label}
              </span>
            ))}
          </FadeUp>
        </div>

        {/* Right - framed photo */}
        <FadeRight delay={0.12} className="relative lg:pl-8">
          <div className="absolute -right-12 -top-8 size-28 rounded-full border-[18px] border-accent/20" />

          <div className="relative overflow-hidden rounded-4xl border-8 border-card bg-card shadow-(--shadow-lift)">
            <div className="relative aspect-4/3 w-full">
              <Image
                src={HERO_PHOTO_SRC}
                alt="Patient in a calm home workspace during a secure video psychiatry visit"
                fill
                priority
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            </div>
          </div>

          <FadeLeft
            delay={0.3}
            className="absolute -bottom-4 left-2 flex max-w-60 items-start gap-3 rounded-2xl bg-card p-4 shadow-(--shadow-lift)"
          >
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-brand-ink">
              <HeartHandshake className="size-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                {publicHeroContent.floatingCardTitle}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {publicHeroContent.floatingCardBody}
              </p>
            </div>
          </FadeLeft>
        </FadeRight>
      </div>
    </section>
  );
}
