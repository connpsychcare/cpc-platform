"use client";

import React from "react";
import { toast } from "sonner";
import { PlusCircle, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { useForm } from "@tanstack/react-form";

import type {
  JobListingResponse,
  JobListingType,
} from "@workspace/contracts/job-listing";
import {
  jobListingSchema,
  JobTypeEnum,
} from "@workspace/contracts/job-listing";
import { Badge } from "@workspace/ui/components/badge";
import { InfoNotice } from "@workspace/ui/shared/InfoNotice";
import { Button } from "@workspace/ui/components/button";
import { ComboboxField } from "@workspace/ui/components/combobox-field";
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
  useJobListings,
  useCreateJobListing,
  useUpdateJobListing,
  useDeleteJobListing,
} from "@/hooks/content";
import { useBranches } from "@/hooks/business";

const JOB_TYPE_OPTIONS = JobTypeEnum.options.map((v) => ({
  label: v,
  value: v,
}));

const CareersPage = () => {
  const { data, isLoading, fetchError } = useJobListings();
  const { createAsync, isCreating } = useCreateJobListing();
  const { deleteAsync } = useDeleteJobListing();

  const form = useForm({
    defaultValues: {
      title: "",
      type: "fullTime",
      locationType: "onSite",
      location: "",
      department: "",
      description: "",
      requirements: "",
      salary: "",
      isActive: true,
    } as JobListingType,
    validators: { onSubmit: jobListingSchema },
    onSubmit: async ({ value }) => {
      try {
        await createAsync(value);
        toast.success("Job listing created.");
        form.reset();
      } catch (err: any) {
        toast.error("Failed to create job listing", {
          description: err?.message,
        });
      }
    },
  });

  return (
    <div className="space-y-6">
      <PageIntro
        title="Careers"
        description="Manage job listings displayed on the public careers page."
      />

      {/* Create form */}
      <Form form={form}>
        <FormSection
          title={
            <span className="flex items-center gap-2">
              <PlusCircle className="size-4" />
              Add Job Listing
            </span>
          }
          className="md:grid-cols-2"
          footer={
            <div className="flex justify-end w-full">
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Saving..." : "Add Job Listing"}
              </Button>
            </div>
          }
        >
          <InputField
            form={form}
            name="title"
            label="Job Title"
            placeholder="Psychiatric Nurse Practitioner (PMHNP-BC)"
          />
          <SelectField
            form={form}
            name="type"
            label="Type"
            options={JOB_TYPE_OPTIONS}
          />
          <ComboboxField
            form={form}
            name="location"
            label="Location"
            placeholder="Select a branch location"
            dataKey="branches"
            useQuery={useBranches}
            queryArgs={{
              page: 1,
              limit: 100,
              sortBy: "name",
              sortOrder: "asc",
              searchBy: "name",
              isActive: true,
            }}
            getOption={(branch) => {
              const address = `${branch.street}, ${branch.city}, ${branch.state} ${branch.postalCode}`;
              return {
                key: `${branch.name} ${address}`,
                value: address,
                label: branch.name,
                content: (
                  <div className="flex flex-col">
                    <span className="font-medium">{branch.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {address}
                    </span>
                  </div>
                ),
              };
            }}
          />
          <InputField
            form={form}
            name="salary"
            label="Salary Range (optional)"
            placeholder="$65,000 – $85,000 / year"
          />
          <InputField
            form={form}
            name="description"
            type="textarea"
            label="Job Description"
            rows={4}
            className="md:col-span-2"
          />
          <InputField
            form={form}
            name="requirements"
            type="textarea"
            label="Requirements (optional)"
            rows={3}
            className="md:col-span-2"
          />
        </FormSection>
      </Form>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle>All Job Listings</CardTitle>
          <CardDescription>
            {data?.jobListings?.length ?? 0} listing(s) total
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

          {!isLoading && !fetchError && !data?.jobListings?.length && (
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              No job listings yet. Add one above.
            </div>
          )}

          {data?.jobListings?.map((item) => (
            <JobListingRow
              key={item.id}
              item={item}
              onDelete={() =>
                deleteAsync(item.id)
                  .then(() => toast.success("Job listing deleted."))
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

const JobListingRow = ({
  item,
  onDelete,
}: {
  item: JobListingResponse;
  onDelete: () => void;
}) => {
  const { updateAsync, isUpdating } = useUpdateJobListing(item.id);

  const toggleActive = async () => {
    try {
      await updateAsync({ isActive: !item.isActive });
      toast.success(item.isActive ? "Deactivated." : "Activated.");
    } catch (err: any) {
      toast.error("Failed to update", { description: err?.message });
    }
  };

  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">{item.title}</p>
            <Badge variant="outline">{item.type}</Badge>
            <Badge variant="outline" className="text-xs">
              {item.location}
            </Badge>
            <Badge variant={item.isActive ? "default" : "secondary"}>
              {item.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          {item.salary && (
            <p className="text-xs text-muted-foreground">{item.salary}</p>
          )}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.description}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            variant="ghost"
            disabled={isUpdating}
            onClick={toggleActive}
          >
            {item.isActive ? (
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

export default CareersPage;
