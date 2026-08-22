import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Alert, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  testimonialSchema,
  type TestimonialType,
} from "@workspace/contracts/testimonial";

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
import { Form, FormSection } from "@/components/ui/form";
import { GradientCard } from "@/components/shared/gradient-card";
import { InputField } from "@/components/ui/input-field";
import { InternalScreen } from "@/components/internal/internal-screen";
import { SectionCard } from "@/components/shared/section-card";
import { SelectField } from "@/components/ui/select-field";
import { Skeleton } from "@/components/ui/skeleton";
import { SwitchField } from "@/components/ui/switch-field";
import {
  useAdminTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
} from "@/hooks/use-healthcare";
import { useToast } from "@/providers/toast";
import { formatDate } from "@workspace/shared/utils";

const RATING_OPTIONS = [
  { label: "★★★★★  5 - Excellent", value: "5" },
  { label: "★★★★☆  4 - Very Good", value: "4" },
  { label: "★★★☆☆  3 - Good", value: "3" },
  { label: "★★☆☆☆  2 - Fair", value: "2" },
  { label: "★☆☆☆☆  1 - Poor", value: "1" },
];

function TestimonialsSkeleton() {
  return (
    <InternalScreen>
      <View className="section-wrapper gap-4 pt-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </View>
    </InternalScreen>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <View className="flex-row gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Text
          key={i}
          className={`text-xs ${i < rating ? "text-warning" : "text-muted-foreground"}`}
        >
          ★
        </Text>
      ))}
    </View>
  );
}

const CREATE_DEFAULTS: TestimonialType = {
  authorName: "",
  authorRole: undefined,
  content: "",
  rating: 5,
  isPublished: false,
};

function CreateTestimonialPanel({ onDone }: { onDone: () => void }) {
  const { createAsync, isPending } = useCreateTestimonial();
  const { error, success } = useToast();

  const form = useForm({
    defaultValues: CREATE_DEFAULTS,
    validators: { onSubmit: testimonialSchema },
    onSubmit: async ({ value }) => {
      try {
        await createAsync(value);
        success("Testimonial created successfully.");
        onDone();
      } catch (cause: any) {
        error("Failed to create testimonial.", { description: cause?.message });
      }
    },
  });

  return (
    <Form form={form} className="gap-4">
      <FormSection title="Author">
        <InputField form={form} name="authorName" label="Author Name" />
        <InputField
          form={form}
          name="authorRole"
          label="Author Role (optional)"
          placeholder="e.g. Parent of Patient"
        />
      </FormSection>
      <FormSection title="Review">
        <InputField
          form={form}
          name="content"
          label="Content"
          type="textarea"
          rows={5}
          placeholder="Write the testimonial content here..."
        />
        <SelectField
          form={form}
          name="rating"
          label="Rating"
          options={RATING_OPTIONS}
        />
        <SwitchField
          form={form}
          name="isPublished"
          label="Publish immediately"
          desc="Publish this testimonial on the public site right away."
        />
      </FormSection>

      <View className="flex-row gap-3">
        <Button variant="outline" className="flex-1" onPress={onDone}>
          Cancel
        </Button>
        <Button
          className="flex-1"
          onPress={() => form.handleSubmit()}
          disabled={isPending}
        >
          {isPending ? "Creating..." : "Create Testimonial"}
        </Button>
      </View>
    </Form>
  );
}

export default function AdminTestimonialsRoute() {
  const { data, isLoading } = useAdminTestimonials({ limit: 50 });
  const { updateAsync: updateTestimonial } = useUpdateTestimonial();
  const { deleteAsync } = useDeleteTestimonial();
  const insets = useSafeAreaInsets();
  const [showCreate, setShowCreate] = useState(false);

  if (isLoading) return <TestimonialsSkeleton />;

  const testimonials = (data as any)?.testimonials ?? [];
  const published = testimonials.filter((t: any) => t.isPublished);
  const pending = testimonials.filter((t: any) => !t.isPublished);

  const handleTogglePublish = (t: any) => {
    updateTestimonial({ ...t, isPublished: !t.isPublished });
  };

  const handleDelete = (t: any) => {
    Alert.alert(
      "Delete Testimonial",
      `Delete "${t.authorName}"'s testimonial?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteAsync(t.id),
        },
      ],
    );
  };

  return (
    <InternalScreen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="section-wrapper gap-6 pt-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="font-primary text-3xl text-foreground">
                Testimonials
              </Text>
              <Text className="font-secondary text-sm text-muted-foreground">
                {published.length} published · {pending.length} pending
              </Text>
            </View>
            <Button size="sm" onPress={() => setShowCreate((v) => !v)}>
              <AppIcon name="PlusIcon" size="sm" variant="accent" />
              New
            </Button>
          </View>

          {showCreate ? (
            <SectionCard
              title="New Testimonial"
              className="shadow-soft"
              contentClassName="gap-4"
            >
              <CreateTestimonialPanel onDone={() => setShowCreate(false)} />
            </SectionCard>
          ) : null}

          {pending.length > 0 ? (
            <SectionCard
              title="Pending Review"
              description="Not yet published on the site."
              className="shadow-soft border-warning/30"
              contentClassName="gap-3"
            >
              {pending.map((t: any) => (
                <GradientCard key={t.id} variant="warning">
                  <View className="gap-3">
                    <View className="flex-row items-start justify-between gap-2">
                      <View className="flex-1">
                        <Text className="font-body-semibold text-sm text-foreground">
                          {t.authorName}
                        </Text>
                        {t.authorRole ? (
                          <Text className="font-secondary text-xs text-muted-foreground">
                            {t.authorRole}
                          </Text>
                        ) : null}
                        <StarRating rating={t.rating ?? 5} />
                      </View>
                      <Badge variant="warning">Pending</Badge>
                    </View>
                    <Text
                      className="font-secondary text-sm leading-5 text-muted-foreground"
                      numberOfLines={3}
                    >
                      {t.content}
                    </Text>
                    <View className="flex-row gap-2">
                      <Button
                        size="sm"
                        onPress={() => handleTogglePublish(t)}
                      >
                        Publish
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onPress={() => handleDelete(t)}
                      >
                        <AppIcon
                          name="Trash2Icon"
                          size="sm"
                          variant="destructive"
                        />
                      </Button>
                    </View>
                  </View>
                </GradientCard>
              ))}
            </SectionCard>
          ) : null}

          <SectionCard
            title="Published"
            description="Visible on the public site."
            className="shadow-soft"
            contentClassName="gap-3"
          >
            {published.length ? (
              published.map((t: any) => (
                <GradientCard key={t.id} variant="success">
                  <View className="gap-2">
                    <View className="flex-row items-start justify-between gap-2">
                      <View className="flex-1">
                        <Text className="font-body-semibold text-sm text-foreground">
                          {t.authorName}
                        </Text>
                        {t.authorRole ? (
                          <Text className="font-secondary text-xs text-muted-foreground">
                            {t.authorRole}
                          </Text>
                        ) : null}
                        <StarRating rating={t.rating ?? 5} />
                      </View>
                      <View className="items-end gap-1">
                        <Badge variant="success">Published</Badge>
                        {t.createdAt ? (
                          <Text className="font-secondary text-xs text-muted-foreground">
                            {formatDate(t.createdAt, { mode: "date" })}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                    <Text
                      className="font-secondary text-sm leading-5 text-muted-foreground"
                      numberOfLines={3}
                    >
                      {t.content}
                    </Text>
                    <View className="flex-row gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onPress={() => handleTogglePublish(t)}
                      >
                        Unpublish
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onPress={() => handleDelete(t)}
                      >
                        <AppIcon
                          name="Trash2Icon"
                          size="sm"
                          variant="destructive"
                        />
                      </Button>
                    </View>
                  </View>
                </GradientCard>
              ))
            ) : (
              <Empty>
                <EmptyMedia variant="icon">
                  <AppIcon name="StarIcon" size="md" variant="primary" />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>No published testimonials</EmptyTitle>
                  <EmptyDescription>
                    Approve pending testimonials to show them on the site.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </SectionCard>
        </View>
      </ScrollView>
    </InternalScreen>
  );
}
