"use client";

import React from "react";
import { toast } from "sonner";
import {
  PlusCircle,
  Star,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { useForm } from "@tanstack/react-form";

import type {
  TestimonialResponse,
  TestimonialType,
} from "@workspace/contracts/testimonial";
import { testimonialSchema } from "@workspace/contracts/testimonial";
import { Badge } from "@workspace/ui/components/badge";
import { InfoNotice } from "@workspace/ui/shared/InfoNotice";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Form, FormSection } from "@workspace/ui/components/form";
import { InputField } from "@workspace/ui/components/input-field";
import { SelectField } from "@workspace/ui/components/select-field";
import { Skeleton } from "@workspace/ui/components/skeleton";
import PageIntro from "@workspace/ui/shared/PageIntro";

import {
  useTestimonials,
  useCreateTestimonial,
  useUpdateTestimonial,
  useDeleteTestimonial,
} from "@/hooks/content";

const RATING_OPTIONS = ["1", "2", "3", "4", "5"].map((v) => ({
  label: `${v} star${v !== "1" ? "s" : ""}`,
  value: v,
}));

const TestimonialsPage = () => {
  const { data, isLoading, fetchError } = useTestimonials();
  const { createAsync, isCreating } = useCreateTestimonial();
  const { deleteAsync } = useDeleteTestimonial();

  const form = useForm({
    defaultValues: {
      authorName: "",
      authorRole: "",
      content: "",
      rating: 5,
      isPublished: false,
    } as TestimonialType,
    validators: { onSubmit: testimonialSchema },
    onSubmit: async ({ value }) => {
      try {
        await createAsync(value);
        toast.success("Testimonial created.");
        form.reset();
      } catch (err: any) {
        toast.error("Failed to create testimonial", {
          description: err?.message,
        });
      }
    },
  });

  return (
    <div className="space-y-6">
      <PageIntro
        title="Testimonials"
        description="Manage published testimonials displayed on the public website."
      />

      {/* Create form */}
      <Form form={form}>
        <FormSection
          title={
            <span className="flex items-center gap-2">
              <PlusCircle className="size-4" />
              Add Testimonial
            </span>
          }
          className="md:grid-cols-2"
          footer={
            <div className="flex justify-end w-full">
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Saving..." : "Add Testimonial"}
              </Button>
            </div>
          }
        >
          <InputField
            form={form}
            name="authorName"
            label="Author Name"
            placeholder="Maria Lopez"
          />
          <InputField
            form={form}
            name="authorRole"
            label="Author Role (optional)"
            placeholder="Parent of a 5-year-old client"
          />
          <SelectField
            form={form}
            name="rating"
            label="Rating"
            options={RATING_OPTIONS}
          />
          <SelectField
            form={form}
            name="isPublished"
            label="Status"
            options={[
              { label: "Published", value: "true" },
              { label: "Draft", value: "false" },
            ]}
          />
          <InputField
            form={form}
            name="content"
            type="textarea"
            label="Testimonial Text"
            rows={4}
            className="md:col-span-2"
            placeholder="The team at Connected Psychiatric Care genuinely cares..."
          />
        </FormSection>
      </Form>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle>All Testimonials</CardTitle>
          <CardDescription>
            {data?.testimonials?.length ?? 0} testimonial(s) total
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {fetchError && (
            <InfoNotice
              variant="error"
              message={
                fetchError.message ??
                "Could not load these records. Please refresh and try again."
              }
            />
          )}
          {isLoading &&
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}

          {!isLoading && !fetchError && !data?.testimonials?.length && (
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              No testimonials yet. Add one above.
            </div>
          )}

          {data?.testimonials?.map((item) => (
            <TestimonialRow
              key={item.id}
              item={item}
              onDelete={() =>
                deleteAsync(item.id)
                  .then(() => toast.success("Testimonial deleted."))
                  .catch((err: any) =>
                    toast.error("Failed to delete", {
                      description: err?.message,
                    }),
                  )
              }
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const TestimonialRow = ({
  item,
  onDelete,
}: {
  item: TestimonialResponse;
  onDelete: () => void;
}) => {
  const { updateAsync, isUpdating } = useUpdateTestimonial(item.id);

  const togglePublished = async () => {
    try {
      await updateAsync({ isPublished: !item.isPublished });
      toast.success(item.isPublished ? "Unpublished." : "Published.");
    } catch (err: any) {
      toast.error("Failed to update", { description: err?.message });
    }
  };

  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">{item.authorName}</p>
            {item.authorRole && (
              <span className="text-xs text-muted-foreground">
                · {item.authorRole}
              </span>
            )}
            <Badge variant={item.isPublished ? "default" : "secondary"}>
              {item.isPublished ? "Published" : "Draft"}
            </Badge>
            <div className="flex items-center gap-0.5 text-warning">
              {Array.from({ length: item.rating }).map((_, i) => (
                <Star key={i} className="size-3 fill-current" />
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.content}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="ghost"
            disabled={isUpdating}
            onClick={togglePublished}
          >
            {item.isPublished ? (
              <ToggleRight className="size-4 text-primary" />
            ) : (
              <ToggleLeft className="size-4" />
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsPage;
