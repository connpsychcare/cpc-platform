import { useEffect, useMemo } from "react";
import { useForm, useStore } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import * as availabilitySdk from "@workspace/sdk/availability";
import {
  createAppointmentSchema,
  type CreateAppointmentType,
} from "@workspace/contracts/appointment";

import { SectionCard } from "@/components/shared/section-card";
import { Button } from "@/components/ui/button";
import { DatePickerField } from "@/components/ui/date-field";
import { Form, FormSection } from "@/components/ui/form";
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select-field";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useCreateAppointment,
  useProviders,
  useProviderSlots,
  useMyPatientProfile,
} from "@/hooks/use-healthcare";
import { useToast } from "@/providers/toast";
import {
  endOfDay,
  formatDate,
  parseDuration,
  startOfDay,
} from "@workspace/shared/utils";
import { AppIcon } from "../ui/app-icon";

// ─── Types ────────────────────────────────────────────────────────────────────

type formValues = CreateAppointmentType & { selectedDate?: string };

interface BookAppointmentFormProps {
  /** Pre-select a provider and lock the field */
  providerId?: string;
  /** Called after a successful booking (e.g. to close an overlay) */
  onSuccess?: () => void;
  /** When true, wrap sections in cards (standalone page mode) */
  cardMode?: boolean;
}

// ─── Form ─────────────────────────────────────────────────────────────────────

export function BookAppointmentForm({
  providerId,
  onSuccess,
  cardMode = false,
}: BookAppointmentFormProps) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { success, error } = useToast();
  const { data: patientProfile } = useMyPatientProfile();
  const { createAppointment, isPending } = useCreateAppointment();

  const { data: providersData, isLoading: providersLoading } = useProviders({
    isAvailable: true,
  });

  const providers = providersData?.providers ?? [];
  const providerOptions = useMemo(
    () =>
      providers.map((d) => ({
        label: (
          <View className="flex-row items-center gap-2">
            <AppIcon name="UserIcon" size="sm" variant="primary" />
            <Text className="font-secondary text-sm text-foreground">
              {d.user?.displayName}
            </Text>
          </View>
        ),
        value: d.id,
      })),
    [providers],
  );

  const defaultValues = useMemo<Partial<formValues>>(
    () => ({
      providerId,
      patientId: patientProfile?.id,
      selectedDate: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      patientNotes: "",
      bookingSource: "app",
      channel: "virtual",
    }),
    [providerId, patientProfile?.id],
  );

  const form = useForm({
    defaultValues: defaultValues as formValues,
    validators: { onSubmit: createAppointmentSchema },
    onSubmit: async ({ value }) => {
      try {
        const appt = await createAppointment(value);
        success("Appointment booked successfully.");
        onSuccess?.();
        router.push(
          `/patient/appointments/success?appointmentId=${appt.data.id}`,
        );
      } catch (err: any) {
        error("Booking failed.", { description: err?.message });
      }
    },
  });

  useEffect(() => {
    if (providerId) {
      form.setFieldValue("providerId", providerId as never);
    }
  }, [providerId, form]);

  useEffect(() => {
    if (patientProfile?.id) {
      form.setFieldValue("patientId", patientProfile.id as never);
    }
  }, [patientProfile?.id, form]);

  const { selectedDate, selectedProviderId, startAt } = useStore(
    form.store,
    (state) => ({
      selectedDate: state.values.selectedDate,
      selectedProviderId: state.values.providerId,
      startAt: state.values.scheduledStartAt,
    }),
  );

  const from = useMemo(
    () => (selectedDate ? startOfDay(selectedDate).toISOString() : undefined),
    [selectedDate],
  );
  const to = useMemo(
    () => (selectedDate ? endOfDay(selectedDate).toISOString() : undefined),
    [selectedDate],
  );

  const { data: slots, isLoading: slotsLoading } = useProviderSlots(
    selectedProviderId,
    from,
    to,
  );

  const slotOptions = useMemo(
    () =>
      slots.map((s) => ({
        label: (
          <View className="flex-row items-center gap-2">
            <AppIcon name="CalendarDaysIcon" size="sm" />
            <View className="flex-1">
              <Text className="font-body-semibold text-sm text-foreground">
                {formatDate(s.startAt, { mode: "date" })}
              </Text>
              <Text className="font-secondary text-xs text-muted-foreground">
                {formatDate(s.startAt, { mode: "time" })}
              </Text>
            </View>
          </View>
        ),
        value: s.startAt,
        endAt: s.endAt,
      })),
    [slots],
  );

  useEffect(() => {
    form.setFieldValue("scheduledStartAt", undefined as never);
    form.setFieldValue("scheduledEndAt", undefined as never);
  }, [form, selectedDate, selectedProviderId]);

  useEffect(() => {
    if (!selectedProviderId || !from || !to) return;

    void queryClient.prefetchQuery({
      queryKey: ["providerSlots", selectedProviderId, from, to],
      queryFn: () =>
        availabilitySdk.getProviderAvailableSlots(selectedProviderId, {
          from,
          to,
        }),
      staleTime: parseDuration("10m"),
    });
  }, [from, queryClient, selectedProviderId, to]);

  const content = (
    <Form form={form} className="gap-6">
      {/* Profile required notice */}
      {!patientProfile && (
        <View className="rounded-2xl border border-warning/30 bg-warning/5 px-4 py-3">
          <Text className="font-body-semibold text-sm text-warning">
            Complete your patient profile before booking.
          </Text>
          <Button
            href="/patient/profile"
            variant="secondary"
            size="sm"
            className="mt-2"
          >
            Complete Profile
          </Button>
        </View>
      )}

      <FormSection
        title="Provider"
        description="Choose the provider you would like to see."
      >
        {providersLoading ? (
          <Skeleton className="h-12 w-full rounded-2xl" />
        ) : (
          <SelectField
            form={form}
            name="providerId"
            label="Select Provider"
            options={providerOptions}
            placeholder="Choose a provider"
            disabled={!!providerId}
          />
        )}
      </FormSection>

      <FormSection
        title="Date & Time"
        description="Pick a date, then choose from that day's available slots."
      >
        <DatePickerField
          form={form}
          name="selectedDate"
          label="Preferred Date"
          minDate={new Date()}
        />

        {/* Time slot - SelectField showing all available slots */}
        {slotsLoading ? (
          <Skeleton className="h-12 w-full rounded-2xl" />
        ) : slotOptions.length > 0 ? (
          <SelectField
            form={form}
            name="scheduledStartAt"
            label="Available Time Slot"
            placeholder="Select a time slot"
            options={slotOptions}
            title="Available Slots"
            handleChange={(value, commit) => {
              const slot = slots.find((s) => s.startAt === value);
              if (slot) {
                form.setFieldValue("scheduledEndAt", slot.endAt);
              }
              commit(value);
            }}
          />
        ) : selectedProviderId ? (
          <View className="rounded-2xl border border-dashed border-border px-4 py-3">
            <Text className="font-secondary text-sm text-muted-foreground">
              No available slots in the selected date window.
            </Text>
          </View>
        ) : null}

        {startAt && (
          <View className="rounded-2xl border border-primary/30 bg-primary/5 px-3 py-2">
            <Text className="font-secondary text-xs text-primary">
              Selected:{" "}
              <Text className="font-body-semibold">
                {formatDate(startAt, { mode: "date" })} at{" "}
                {formatDate(startAt, { mode: "time" })}
              </Text>
            </Text>
          </View>
        )}

      </FormSection>

      <FormSection
        title="Notes"
        description="Share anything the provider should know."
      >
        <InputField
          form={form}
          name="patientNotes"
          type="textarea"
          rows={3}
          label="Notes for the provider (optional)"
          placeholder="Symptoms, reason for visit, or other details…"
        />
      </FormSection>

      <Button
        fullWidth
        disabled={isPending || !startAt || !patientProfile}
        onPress={() => form.handleSubmit()}
      >
        {isPending ? "Booking…" : "Confirm Appointment"}
      </Button>
    </Form>
  );

  if (!cardMode) return content;

  return (
    <SectionCard
      title="Book Appointment"
      description="Select a provider, date, and time slot for your visit."
      className="shadow-soft"
      contentClassName="gap-0"
    >
      {content}
    </SectionCard>
  );
}
