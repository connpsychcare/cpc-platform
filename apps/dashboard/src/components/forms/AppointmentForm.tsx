"use client";

import React, { useMemo } from "react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useStore } from "@tanstack/react-form";

import {
  createAppointmentSchema,
  type CreateAppointmentType,
} from "@workspace/contracts/appointment";
import { Button } from "@workspace/ui/components/button";
import { ComboboxField } from "@workspace/ui/components/combobox-field";
import { DatePickerField } from "@workspace/ui/components/date-field";
import { Form, FormSection } from "@workspace/ui/components/form";
import { InputField } from "@workspace/ui/components/input-field";
import { SelectField } from "@workspace/ui/components/select-field";

import CUFormSkeleton from "@workspace/ui/skeleton/CUFormSkeleton";
import { formatDate, addDays } from "@workspace/shared/utils";
import { useCreateAppointment } from "@/hooks/appointment";
import { useProviderSlots } from "@/hooks/availability";
import { useProvider, useProviders } from "@/hooks/provider";
import { usePatients } from "@/hooks/patient";
import PageIntro from "@workspace/ui/shared/PageIntro";
import { useCurrentUser } from "@workspace/ui/hooks/use-user";

type AppointmentFormValues = CreateAppointmentType & { selectedDate?: string };

const AppointmentForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { currentUser } = useCurrentUser();
  const isProviderWorkspace = currentUser?.role === "staff";
  const appointmentsPath = "/appointments";
  const { data: providerProfile, isLoading: isProviderLoading } = useProvider();
  const { createAsync, isCreating } = useCreateAppointment();

  const form = useForm({
    defaultValues: {
      patientId: searchParams.get("patientId") ?? undefined,
      providerId: providerProfile?.id,
      channel: "virtual",
      patientNotes: "",
      scheduledStartAt: "",
      scheduledEndAt: "",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      selectedDate: new Date().toISOString(),
    } as AppointmentFormValues,
    validators: {
      onSubmit: createAppointmentSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const response = await createAsync(value);
        toast.success("Appointment booked successfully.");
        router.push(`${appointmentsPath}/${response.id}`);
      } catch (error: any) {
        toast.error("Failed to book appointment", {
          description: error?.message,
        });
      }
    },
  });

  const { selectedDate, selectedProviderId, startAt } = useStore(
    form.store,
    (state) => ({
      selectedDate: (state.values as AppointmentFormValues).selectedDate,
      selectedProviderId: state.values.providerId,
      startAt: state.values.scheduledStartAt,
    }),
  );

  const from = useMemo(
    () => addDays(selectedDate!, 0)?.toISOString(),
    [selectedDate],
  );
  const to = useMemo(
    () => addDays(selectedDate!, 6)?.toISOString(),
    [selectedDate],
  );

  const { data: slots, isFetching: isLoadingSlots } = useProviderSlots(
    selectedProviderId,
    from,
    to,
  );

  React.useEffect(() => {
    form.setFieldValue("scheduledStartAt", undefined as never);
    form.setFieldValue("scheduledEndAt", undefined as never);
  }, [selectedDate, selectedProviderId, form]);

  React.useEffect(() => {
    const slot = slots?.find((s) => s.startAt === startAt);
    if (slot) {
      form.setFieldValue("scheduledEndAt", slot.endAt);
    }
  }, [startAt, slots, form]);

  if (isProviderWorkspace && isProviderLoading) {
    return <CUFormSkeleton />;
  }

  if (isProviderWorkspace && !providerProfile) {
    return (
      <div className="rounded-xl border border-dashed p-6 text-sm text-muted-foreground">
        Your provider profile needs a branch assignment before appointments can be
        booked.
      </div>
    );
  }

  const slotOptions =
    slots?.map((slot) => ({
      label: formatDate(slot.startAt, { mode: "datetime" }),
      value: slot.startAt,
    })) ?? [];

  return (
    <Form
      form={form}
      header={
        <PageIntro
          title="Book Appointment"
          description={
            isProviderWorkspace
              ? "Schedule an appointment from your own provider workspace."
              : "Book an appointment on behalf of a patient."
          }
        />
      }
    >
      <FormSection
        title="Linked Records"
        description="Choose the patient and provider for this appointment."
      >
        <ComboboxField
          form={form}
          name="patientId"
          label="Patient"
          placeholder="Choose a patient"
          dataKey="patients"
          useQuery={usePatients}
          queryArgs={{
            page: 1,
            limit: 100,
            sortBy: "displayName",
            sortOrder: "asc",
            searchBy: "displayName",
          }}
          getOption={(patient) => ({
            key: patient.user.displayName,
            value: patient.id,
            label: patient.user.displayName,
            content: (
              <div className="flex flex-col">
                <span className="font-medium">{patient.user.displayName}</span>
                <span className="text-xs text-muted-foreground">
                  {patient.user?.email ?? patient.user?.phone ?? "No contact"}
                </span>
              </div>
            ),
          })}
        />

        <ComboboxField
          form={form}
          name="providerId"
          label="Provider"
          placeholder="Choose a provider"
          disabled={isProviderWorkspace}
          dataKey="providers"
          useQuery={useProviders}
          queryArgs={{
            page: 1,
            limit: 100,
            sortBy: "displayName",
            sortOrder: "asc",
            searchBy: "displayName",
            isAvailable: true,
          }}
          getOption={(provider) => ({
            key: provider.user.displayName,
            value: provider.id,
            label: provider.user.displayName,
            content: (
              <div className="flex flex-col">
                <span className="font-medium">{provider.user.displayName}</span>
                <span className="text-xs text-muted-foreground">
                  {provider.title}
                </span>
              </div>
            ),
          })}
        />
      </FormSection>

      <FormSection
        title="Schedule Details"
        description="Pick a date to see available slots, then choose a time."
      >
        <DatePickerField
          form={form}
          name="selectedDate"
          label="Appointment Date"
          placeholder="Select appointment date"
          minDate={new Date().toISOString()}
        />

        <SelectField
          form={form}
          name="scheduledStartAt"
          label="Available Time Slot"
          placeholder={
            isLoadingSlots
              ? "Loading slots..."
              : !selectedProviderId
                ? "Select a provider first"
                : slotOptions.length === 0
                  ? "No slots available for this date"
                  : "Choose an available slot"
          }
          options={slotOptions}
          disabled={
            !selectedProviderId || isLoadingSlots || slotOptions.length === 0
          }
        />

        <InputField form={form} name="timezone" label="Timezone" />

        <InputField
          form={form}
          name="patientNotes"
          label="Patient Notes"
          type="textarea"
          rows={5}
          className="md:col-span-2"
        />
      </FormSection>

      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push(appointmentsPath)}
          disabled={isCreating}
        >
          Cancel
        </Button>

        <form.Subscribe selector={(state) => state.canSubmit}>
          {(canSubmit) => (
            <Button type="submit" disabled={!canSubmit || isCreating}>
              {isCreating ? "Booking..." : "Book Appointment"}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </Form>
  );
};

export default AppointmentForm;
