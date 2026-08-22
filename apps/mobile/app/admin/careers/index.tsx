import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Alert, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  jobListingSchema,
  JobTypeEnum,
  JobLocationTypeEnum,
  type JobListingType,
} from "@workspace/contracts/job-listing";

import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ComboboxField } from "@/components/ui/combobox-field";
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
  useJobListings,
  useCreateJobListing,
  useUpdateJobListing,
  useDeleteJobListing,
  useBranches,
} from "@/hooks/use-healthcare";
import { useToast } from "@/providers/toast";

const JOB_TYPE_OPTIONS = JobTypeEnum.options.map((v) => ({
  label: v === "fullTime" ? "Full Time" : v === "partTime" ? "Part Time" : v === "contract" ? "Contract" : "Internship",
  value: v,
}));

const LOCATION_TYPE_OPTIONS = JobLocationTypeEnum.options.map((v) => ({
  label: v === "onSite" ? "On-Site" : v === "remote" ? "Remote" : "Hybrid",
  value: v,
}));

const JOB_TYPE_LABELS: Record<string, string> = {
  fullTime: "Full Time",
  partTime: "Part Time",
  contract: "Contract",
  internship: "Internship",
};

const LOCATION_TYPE_LABELS: Record<string, string> = {
  onSite: "On-Site",
  remote: "Remote",
  hybrid: "Hybrid",
};

const CREATE_DEFAULTS: JobListingType = {
  title: "",
  type: "fullTime",
  locationType: "onSite",
  location: "",
  department: undefined,
  description: "",
  requirements: undefined,
  salary: undefined,
  isActive: true,
};

function CareersSkeleton() {
  return (
    <InternalScreen>
      <View className="section-wrapper gap-4 pt-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </View>
    </InternalScreen>
  );
}

function CreateJobPanel({ onDone }: { onDone: () => void }) {
  const { createAsync, isPending } = useCreateJobListing();
  const { error, success } = useToast();

  const form = useForm({
    defaultValues: CREATE_DEFAULTS,
    validators: { onSubmit: jobListingSchema },
    onSubmit: async ({ value }) => {
      try {
        await createAsync(value);
        success("Job listing created.");
        onDone();
      } catch (cause: any) {
        error("Failed to create job listing.", { description: cause?.message });
      }
    },
  });

  return (
    <Form form={form} className="gap-4">
      <FormSection title="Job Details">
        <InputField
          form={form}
          name="title"
          label="Job Title"
          placeholder="e.g. Psychiatric Nurse Practitioner (PMHNP-BC)"
        />
        <SelectField
          form={form}
          name="type"
          label="Employment Type"
          options={JOB_TYPE_OPTIONS}
        />
        <SelectField
          form={form}
          name="locationType"
          label="Work Type"
          options={LOCATION_TYPE_OPTIONS}
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
          } as any}
          getOption={(branch: any) => {
            const address = [branch.street, branch.city, branch.state, branch.postalCode]
              .filter(Boolean)
              .join(", ");
            return {
              key: `${branch.name} ${address}`,
              value: address || branch.name,
              label: branch.name,
              content: (
                <View>
                  <Text className="font-body-semibold text-sm text-foreground">
                    {branch.name}
                  </Text>
                  {address ? (
                    <Text className="font-secondary text-xs text-muted-foreground">
                      {address}
                    </Text>
                  ) : null}
                </View>
              ),
            };
          }}
        />
        <InputField
          form={form}
          name="department"
          label="Department (optional)"
          placeholder="e.g. Clinical Services"
        />
        <InputField
          form={form}
          name="salary"
          label="Salary Range (optional)"
          placeholder="e.g. $65,000 – $85,000 / year"
        />
      </FormSection>

      <FormSection title="Description">
        <InputField
          form={form}
          name="description"
          label="Job Description"
          type="textarea"
          rows={5}
          placeholder="Describe the role, responsibilities..."
        />
        <InputField
          form={form}
          name="requirements"
          label="Requirements (optional)"
          type="textarea"
          rows={3}
          placeholder="List required qualifications, certifications..."
        />
      </FormSection>

      <FormSection title="Status">
        <SwitchField
          form={form}
          name="isActive"
          label="Active"
          desc="Inactive listings are hidden from the public careers page."
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
          {isPending ? "Creating..." : "Add Job Listing"}
        </Button>
      </View>
    </Form>
  );
}

function JobListingCard({ job: j }: { job: any }) {
  const { updateAsync, isPending: isUpdating } = useUpdateJobListing(j.id);
  const { deleteAsync } = useDeleteJobListing();
  const { error, success } = useToast();

  const handleToggle = async () => {
    try {
      await updateAsync({ isActive: !j.isActive } as any);
      success(j.isActive ? "Listing deactivated." : "Listing activated.");
    } catch (cause: any) {
      error("Failed to update listing.", { description: cause?.message });
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete Listing?", `Delete "${j.title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteAsync(j.id);
            success("Job listing deleted.");
          } catch (cause: any) {
            error("Failed to delete.", { description: cause?.message });
          }
        },
      },
    ]);
  };

  return (
    <GradientCard variant={j.isActive ? "info" : "secondary"}>
      <View className="gap-2">
        <View className="flex-row items-start justify-between gap-2">
          <View className="flex-1">
            <Text className="font-body-semibold text-sm text-foreground">
              {j.title}
            </Text>
            <Text className="font-secondary text-xs text-muted-foreground">
              {JOB_TYPE_LABELS[j.type] ?? j.type} ·{" "}
              {LOCATION_TYPE_LABELS[j.locationType] ?? j.locationType}
            </Text>
            {j.location ? (
              <Text className="font-secondary text-xs text-muted-foreground">
                {j.location}
              </Text>
            ) : null}
            {j.department ? (
              <Text className="font-secondary text-xs text-muted-foreground">
                {j.department}
              </Text>
            ) : null}
            {j.salary ? (
              <Text className="font-secondary text-xs text-muted-foreground">
                {j.salary}
              </Text>
            ) : null}
          </View>
          <Badge variant={j.isActive ? "success" : "secondary"}>
            {j.isActive ? "Active" : "Inactive"}
          </Badge>
        </View>
        <Text
          className="font-secondary text-xs text-muted-foreground"
          numberOfLines={2}
        >
          {j.description}
        </Text>
        <View className="flex-row justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onPress={handleToggle}
            disabled={isUpdating}
          >
            {j.isActive ? "Deactivate" : "Activate"}
          </Button>
          <Button variant="ghost" size="sm" onPress={handleDelete}>
            <AppIcon name="Trash2Icon" size="sm" variant="destructive" />
          </Button>
        </View>
      </View>
    </GradientCard>
  );
}

export default function AdminCareersRoute() {
  const { data, isLoading } = useJobListings({ limit: 50 });
  const insets = useSafeAreaInsets();
  const [showCreate, setShowCreate] = useState(false);

  if (isLoading) return <CareersSkeleton />;

  const jobs = (data as any)?.jobListings ?? [];
  const active = jobs.filter((j: any) => j.isActive);

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
                Job Listings
              </Text>
              <Text className="font-secondary text-sm text-muted-foreground">
                {active.length} active position{active.length !== 1 ? "s" : ""}
              </Text>
            </View>
            <Button size="sm" onPress={() => setShowCreate((v) => !v)}>
              <AppIcon name="PlusIcon" size="sm" variant="accent" />
              New
            </Button>
          </View>

          {showCreate ? (
            <SectionCard
              title="New Job Listing"
              className="shadow-soft"
              contentClassName="gap-4"
            >
              <CreateJobPanel onDone={() => setShowCreate(false)} />
            </SectionCard>
          ) : null}

          <SectionCard
            title="All Positions"
            description="Manage open job listings."
            className="shadow-soft"
            contentClassName="gap-3"
          >
            {jobs.length ? (
              jobs.map((j: any) => <JobListingCard key={j.id} job={j} />)
            ) : (
              <Empty>
                <EmptyMedia variant="icon">
                  <AppIcon name="IconBriefcase" size="md" variant="primary" />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>No job listings</EmptyTitle>
                  <EmptyDescription>
                    Post open positions to attract new hires.
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
