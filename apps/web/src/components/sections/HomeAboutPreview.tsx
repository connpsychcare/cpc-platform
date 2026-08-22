import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FadeUp } from "@/components/shared/animations";

import { publicAboutContent } from "@workspace/shared/constants";
import { Button } from "@workspace/ui/components/button";

const FOUNDER_PHOTO = "/images/marketing/cpc-about-founder.jpg";

export default function HomeAboutPreview() {
  return (
    <section className="px-4 py-14 sm:px-6 lg:py-20">
      <FadeUp className="section-container grid items-center gap-8 rounded-4xl bg-sage/45 p-5 sm:p-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="overflow-hidden rounded-4xl bg-card shadow-(--soft-shadow)">
          <div className="relative aspect-4/3 w-full">
            <Image
              src={FOUNDER_PHOTO}
              alt="Connected Psychiatric Care practice leadership"
              fill
              className="object-cover object-top"
            />
          </div>
        </div>

        <div className="px-1 py-2 sm:px-5">
          <p className="eyebrow text-accent">A practice built for real life</p>
          <h2 className="mt-3 font-primary text-3xl font-extrabold tracking-tight text-foreground">
            Care that feels connected from the first conversation.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            {publicAboutContent.intro}
          </p>
          <Button variant="outline" className="mt-6" asChild>
            <Link href="/about">
              Our story <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </FadeUp>
    </section>
  );
}
