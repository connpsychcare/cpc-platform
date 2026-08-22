"use client";

import { Star } from "lucide-react";
import SectionHeader from "@/components/shared/SectionHeader";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Carousel,
  CarouselContent,
  CarouselIndicators,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel";
import { usePublicTestimonials } from "@/hooks/content";
import { publicTestimonialsContent } from "@workspace/shared/constants";
import { FadeUp } from "@/components/shared/animations";

function TestimonialCard({
  item,
}: {
  item: {
    id: string;
    authorName: string;
    authorRole?: string | null;
    content: string;
    rating: number;
  };
}) {
  return (
    <Card className="h-full rounded-3xl border-sage/60 shadow-(--card-shadow) dark:border-white/10">
      <CardContent>
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest/10 text-sm font-semibold text-forest">
            {item.authorName
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {item.authorName}
            </h3>
            {item.authorRole ? (
              <p className="text-xs text-muted-foreground">{item.authorRole}</p>
            ) : null}
          </div>
        </div>
        <div className="mt-4 flex gap-1 text-warning">
          {Array.from({ length: item.rating }).map((_, i) => (
            <Star key={i} className="size-4 fill-current" />
          ))}
        </div>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          {item.content}
        </p>
      </CardContent>
    </Card>
  );
}

function TestimonialSkeleton() {
  return (
    <Card className="h-full rounded-3xl">
      <CardContent className="animate-pulse space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-secondary" />
          <div className="space-y-2">
            <div className="h-4 w-28 rounded bg-secondary" />
            <div className="h-3 w-20 rounded bg-secondary" />
          </div>
        </div>
        <div className="h-4 w-20 rounded bg-secondary" />
        <div className="h-20 rounded bg-secondary" />
      </CardContent>
    </Card>
  );
}

export default function TestimonialsSection() {
  const { data, isLoading } = usePublicTestimonials();
  const items = data ?? [];

  return (
    <section className="py-12 sm:py-20">
      <div className="section space-y-8">
        <FadeUp>
          <SectionHeader
            title={publicTestimonialsContent.title}
            eyebrow={publicTestimonialsContent.eyebrow}
            description={publicTestimonialsContent.description}
            align="center"
          />
        </FadeUp>

        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <TestimonialSkeleton key={i} />
            ))}
          </div>
        ) : items.length > 0 ? (
          <Carousel opts={{ align: "start", loop: items.length > 4 }}>
            <CarouselContent>
              {items.map((item) => (
                <CarouselItem
                  key={item.id}
                  className="sm:basis-1/2 lg:basis-1/4"
                >
                  <TestimonialCard item={item} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
            <CarouselIndicators />
          </Carousel>
        ) : (
          <Card className="rounded-3xl border-dashed">
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              {publicTestimonialsContent.emptyState}
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
