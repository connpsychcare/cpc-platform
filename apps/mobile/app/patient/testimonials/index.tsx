import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";

import { submitTestimonialSchema } from "@workspace/contracts/testimonial";
import type { SubmitTestimonialType } from "@workspace/contracts/testimonial";
import { formatDate } from "@workspace/shared/utils";

import { useAppThemeColors } from "@/lib/theme";
import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { GradientCard } from "@/components/shared/gradient-card";
import { PatientScreen } from "@/components/shared/patient-screen";
import { SectionCard } from "@/components/shared/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useMyTestimonials,
  useSubmitTestimonial,
} from "@/hooks/use-healthcare";
import { cn } from "@/lib/utils";
import { useToast } from "@/providers/toast";

function StarRating({
  value,
  onChange,
  readonly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) {
  return (
    <View className="flex-row gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Pressable
          key={star}
          onPress={() => !readonly && onChange?.(star)}
          disabled={readonly}
        >
          <AppIcon
            name="IconStar"
            size="sm"
            variant={star <= value ? "warning" : "muted"}
          />
        </Pressable>
      ))}
    </View>
  );
}

function TestimonialCardItem({
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
    <GradientCard variant="default">
      <View className="gap-3">
        <View className="flex-row items-start justify-between gap-3">
          <View className="gap-1">
            <Text className="font-body-semibold text-sm text-foreground">
              {authorName}
            </Text>
            <Text className="font-secondary text-xs text-muted-foreground">
              {formatDate(createdAt, { mode: "date" })}
            </Text>
          </View>
          <Badge variant={isPublished ? "primary" : "secondary"}>
            {isPublished ? "Published" : "Pending review"}
          </Badge>
        </View>
        <StarRating value={rating} readonly />
        <Text className="font-secondary text-sm leading-relaxed text-muted-foreground">
          {content}
        </Text>
      </View>
    </GradientCard>
  );
}

function SubmitForm() {
  const colors = useAppThemeColors();
  const { submitAsync, isPending } = useSubmitTestimonial();
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const handleSubmit = async () => {
    const payload: SubmitTestimonialType = { content, rating };
    const parsed = submitTestimonialSchema.safeParse(payload);

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Invalid input.");
      return;
    }

    setError(null);
    try {
      await submitAsync(parsed.data);
      setContent("");
      setRating(5);
      toast.success(
        "Thank you! Your testimonial has been submitted for review.",
      );
    } catch (err: any) {
      toast.error(err?.message ?? "Could not submit testimonial.");
    }
  };

  return (
    <SectionCard
      title="Share Your Experience"
      description="Your feedback helps other families find the right care."
      contentClassName="gap-4"
    >
      <View className="gap-2">
        <Text className="font-body-semibold text-sm text-foreground">
          Rating
        </Text>
        <StarRating value={rating} onChange={setRating} />
      </View>

      <View className="gap-2">
        <Text className="font-body-semibold text-sm text-foreground">
          Your experience
        </Text>
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Tell us about your experience with our team and services..."
          placeholderTextColor={colors.muted.foreground}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          className="min-h-24 rounded-xl border border-border bg-card px-4 py-3 font-secondary text-sm text-foreground"
        />
      </View>

      {error ? (
        <Text className="font-secondary text-sm text-destructive">{error}</Text>
      ) : null}

      <Button
        onPress={() => void handleSubmit()}
        disabled={isPending || !content.trim()}
        fullWidth
      >
        {isPending ? "Submitting..." : "Submit Testimonial"}
      </Button>
    </SectionCard>
  );
}

function TestimonialSkeleton() {
  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pt-6">
        <Skeleton className="h-48 w-full rounded-[28px]" />
        <Skeleton className="h-32 w-full rounded-[28px]" />
      </View>
    </PatientScreen>
  );
}

export default function PatientTestimonialsRoute() {
  const { data, isLoading } = useMyTestimonials();

  if (isLoading) return <TestimonialSkeleton />;

  const list = data?.testimonials ?? [];

  return (
    <PatientScreen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="section-wrapper gap-6 pt-6">
          <View className="gap-2">
            <Text className="font-primary text-3xl text-foreground">
              Testimonials
            </Text>
            <Text className="font-secondary text-sm leading-7 text-muted-foreground">
              Share your experience and help other families find the right care.
            </Text>
          </View>

          <SubmitForm />

          <SectionCard
            title="Your Submissions"
            description="Pending testimonials are visible only to you until published."
            contentClassName="gap-3"
          >
            {list.length ? (
              list.map((t) => (
                <TestimonialCardItem
                  key={t.id}
                  authorName={t.authorName}
                  content={t.content}
                  rating={t.rating}
                  isPublished={t.isPublished}
                  createdAt={t.createdAt as unknown as string}
                />
              ))
            ) : (
              <Empty>
                <EmptyMedia variant="icon">
                  <AppIcon name="IconStar" size="md" variant="primary" />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>No testimonials yet</EmptyTitle>
                  <EmptyDescription>
                    Submit your first testimonial above after a completed
                    appointment.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </SectionCard>
        </View>
      </ScrollView>
    </PatientScreen>
  );
}
