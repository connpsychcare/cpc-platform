"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { submitTestimonialSchema } from "@workspace/contracts/testimonial";
import type { SubmitTestimonialType } from "@workspace/contracts/testimonial";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Form, FormSection } from "@workspace/ui/components/form";
import { InputField } from "@workspace/ui/components/input-field";
import SectionCard from "@workspace/ui/shared/SectionCard";
import { cn } from "@workspace/ui/lib/utils";
import { formatDate } from "@workspace/shared/utils";
import { useMyTestimonials, useSubmitTestimonial } from "@/hooks/healthcare";

function RatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="focus:outline-none"
        >
          <Star
            className={cn(
              "size-7 transition-colors",
              star <= (hovered || value)
                ? "fill-warning text-warning"
                : "text-muted-foreground",
            )}
          />
        </button>
      ))}
    </div>
  );
}

function TestimonialCard({
  authorName,
  content,
  rating,
  isPublished,
  createdAt,
}: {
  authorName: string;
  content: string;
  rating: number;
  isPublished: boolean;
  createdAt: string;
}) {
  return (
    <div className="rounded-2xl border bg-card p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="font-medium text-sm">{authorName}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(createdAt, { mode: "date" })}
          </p>
        </div>
        <Badge variant={isPublished ? "default" : "secondary"}>
          {isPublished ? "Published" : "Pending review"}
        </Badge>
      </div>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={cn(
              "size-4",
              s <= rating
                ? "fill-warning text-warning"
                : "text-muted-foreground",
            )}
          />
        ))}
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
    </div>
  );
}

export default function PatientTestimonialsPage() {
  const { data, isLoading } = useMyTestimonials();
  const { submitAsync, isPending } = useSubmitTestimonial();

  const form = useForm({
    defaultValues: {
      content: "",
      rating: 5,
      appointmentId: undefined,
    } as SubmitTestimonialType,
    validators: { onSubmit: submitTestimonialSchema },
    onSubmit: async ({ value }) => {
      try {
        await submitAsync(value);
        form.reset();
        toast.success("Thank you! Your testimonial has been submitted for review.");
      } catch (err: any) {
        toast.error("Could not submit testimonial", {
          description: err?.message,
        });
      }
    },
  });

  const testimonials = data?.testimonials ?? [];

  return (
    <div className="container max-w-3xl space-y-8 py-8">
      <div className="space-y-1">
        <h1 className="font-primary text-3xl font-extrabold tracking-tight text-foreground">Testimonials</h1>
        <p className="text-sm text-muted-foreground">
          Share your experience with Connected Psychiatric Care. Your feedback helps other
          patients and families find the right mental health support.
        </p>
      </div>

      <SectionCard
        title="Share Your Experience"
        description="Your testimonial will be reviewed by our team before it's published publicly."
        contentClassName="space-y-4"
      >
        <Form form={form}>
          <FormSection>
            <form.Field name="rating">
              {(field) => (
                <div className="space-y-2 md:col-span-2">
                  <p className="text-sm font-medium">Rating</p>
                  <RatingInput
                    value={field.state.value ?? 5}
                    onChange={(v) => field.handleChange(v)}
                  />
                </div>
              )}
            </form.Field>

            <InputField
              form={form}
              required
              name="content"
              label="Your experience"
              type="textarea"
              rows={4}
              placeholder="Tell us about your experience with our team and services..."
              className="md:col-span-2"
            />
          </FormSection>

          <div className="flex justify-end pt-2">
            <form.Subscribe selector={(s) => s.canSubmit}>
              {(canSubmit) => (
                <Button type="submit" disabled={!canSubmit || isPending}>
                  {isPending ? "Submitting..." : "Submit Testimonial"}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </Form>
      </SectionCard>

      <SectionCard
        title="Your Submissions"
        description="Testimonials pending review are visible only to you until published."
        contentClassName="space-y-3"
      >
        {isLoading ? (
          <>
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </>
        ) : testimonials.length ? (
          testimonials.map((t) => (
            <TestimonialCard
              key={t.id}
              authorName={t.authorName}
              content={t.content}
              rating={t.rating}
              isPublished={t.isPublished}
              createdAt={t.createdAt as unknown as string}
            />
          ))
        ) : (
          <p className="py-6 text-center text-sm text-muted-foreground">
            You haven&apos;t submitted any testimonials yet.
          </p>
        )}
      </SectionCard>
    </div>
  );
}
