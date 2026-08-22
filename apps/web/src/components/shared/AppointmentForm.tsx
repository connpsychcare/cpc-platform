"use client";

import React, { useMemo, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useForm, useStore } from "@tanstack/react-form";

import {
  useCreateAppointment,
  useCreateGuestAppointment,
  useProviderSlots,
  useMyPatientProfile,
} from "@/hooks/healthcare";
import { usePublicProviders } from "@/hooks/content";
import { endOfDay, formatDate, startOfDay } from "@workspace/shared/utils";
import { publicServices } from "@workspace/shared/constants";
import {
  guestAppointmentSchema,
  type GuestAppointmentType,
} from "@workspace/contracts/appointment";

import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import { Form } from "@workspace/ui/components/form";
import { InputField } from "@workspace/ui/components/input-field";
import { PhoneField } from "@workspace/ui/components/phone-field";
import { DatePickerField } from "@workspace/ui/components/date-field";
import { useCurrentUser } from "@workspace/ui/hooks/use-user";
import ProviderAvatar from "./ProviderAvatar";

interface AppointmentFormProps {
  providerId?: string;
  onSuccess?: () => void;
}

type BookingFormValues = GuestAppointmentType & { selectedDate?: string };

const STEPS = [
  { step: 1, label: "Choose a service" },
  { step: 2, label: "Find a time" },
  { step: 3, label: "Confirm" },
] as const;

function Stepper({ current }: { current: number }) {
  return (
    <div className="mb-10 flex items-center justify-between gap-3">
      {STEPS.map(({ step, label }) => (
        <div key={step} className="flex flex-1 items-center gap-2">
          <span
            className={cn(
              "grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold",
              current >= step
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground",
            )}
          >
            {step}
          </span>
          <span
            className={cn(
              "hidden text-xs font-bold uppercase tracking-widest sm:block",
              current >= step ? "text-primary" : "text-muted-foreground/60",
            )}
          >
            {label}
          </span>
          {step < STEPS.length && (
            <span className={cn("h-px flex-1", current > step ? "bg-primary" : "bg-border")} />
          )}
        </div>
      ))}
    </div>
  );
}

function StepIntro({
  step,
  title,
  body,
}: {
  step: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="eyebrow">{step}</p>
      <h2 className="mt-3 font-primary text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {body && <p className="mt-4 text-base leading-7 text-muted-foreground">{body}</p>}
    </div>
  );
}

const AppointmentForm = ({ providerId, onSuccess }: AppointmentFormProps) => {
  const router = useRouter();
  const { currentUser } = useCurrentUser();
  const { data: patientProfile } = useMyPatientProfile();
  const { createAppointment } = useCreateAppointment();
  const { createGuestAppointment } = useCreateGuestAppointment();
  const { data: providers, isLoading: providersLoading } = usePublicProviders();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [service, setService] = useState<string>();
  const dateTimeRef = React.useRef<HTMLDivElement>(null);
  const topRef = React.useRef<HTMLDivElement>(null);

  // Steps two and three are taller than a viewport, so changing step without this leaves
  // the reader part-way down the new step.
  const goToStep = (next: 1 | 2 | 3) => {
    setStep(next);
    requestAnimationFrame(() =>
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
  };

  const form = useForm({
    defaultValues: {
      providerId,
      firstName: currentUser?.firstName,
      lastName: currentUser?.lastName,
      email: currentUser?.email,
      phone: currentUser?.phone,
      channel: "virtual",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      patientNotes: "",
      selectedDate: new Date().toISOString(),
    } as BookingFormValues,
    validators: { onSubmit: guestAppointmentSchema },
    onSubmit: async ({ value }) => {
      const { selectedDate: _ignored, ...booking } = value;
      // The schema has no service field, so the step-one choice rides along on the note.
      const patientNotes = [service && `Requested service: ${service}`, booking.patientNotes]
        .filter(Boolean)
        .join("\n\n");

      try {
        // A signed-in patient books against their own profile; everyone else goes through
        // the public endpoint, which provisions an account or tells them to sign in.
        const appointment = patientProfile
          ? await createAppointment({
              patientId: patientProfile.id,
              providerId: booking.providerId,
              channel: booking.channel ?? "virtual",
              scheduledStartAt: booking.scheduledStartAt,
              scheduledEndAt: booking.scheduledEndAt,
              timezone: booking.timezone,
              patientNotes: patientNotes || undefined,
              bookingSource: "app",
            })
          : await createGuestAppointment({ ...booking, patientNotes: patientNotes || undefined });

        toast.success("Appointment requested.");
        onSuccess?.();
        router.push(`/patient/appointments/success/?appointmentId=${appointment.data.id}`);
      } catch (error: any) {
        toast.error("Booking could not be completed", {
          description: error?.message ?? "Something went wrong. Please try again.",
        });
      }
    },
  });

  const { selectedDate, selectedProviderId, startAt } = useStore(form.store, (state) => ({
    selectedDate: state.values.selectedDate,
    selectedProviderId: state.values.providerId,
    startAt: state.values.scheduledStartAt,
  }));

  const from = useMemo(
    () => (selectedDate ? startOfDay(selectedDate).toISOString() : undefined),
    [selectedDate],
  );
  const to = useMemo(
    () => (selectedDate ? endOfDay(selectedDate).toISOString() : undefined),
    [selectedDate],
  );

  const slotsQuery = useProviderSlots(selectedProviderId || undefined, from, to);
  const slots = useMemo(() => slotsQuery.data ?? [], [slotsQuery.data]);
  const selectedProvider = (providers ?? []).find((d) => d.id === selectedProviderId);

  React.useEffect(() => {
    form.setFieldValue("scheduledStartAt", undefined as never);
    form.setFieldValue("scheduledEndAt", undefined as never);
  }, [selectedDate, selectedProviderId, form]);

  React.useEffect(() => {
    const slot = slots.find((s) => s.startAt === startAt);
    if (slot) form.setFieldValue("scheduledEndAt", slot.endAt as never);
  }, [startAt, slots, form]);

  return (
    <Form form={form}>
      <div ref={topRef} className="scroll-mt-28" />
      <Stepper current={step} />

      {/* Step 1 - service */}
      {step === 1 && (
        <div>
          <StepIntro
            step="Step one"
            title="What kind of support are you looking for?"
            body="You do not need to know the perfect answer. Choose the closest fit and we can talk through the rest."
          />

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {publicServices.slice(0, 6).map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => {
                  setService(item.title);
                  goToStep(2);
                }}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-border p-4 text-left transition hover:border-primary/40 hover:bg-secondary"
              >
                <span>
                  <span className="block font-primary font-extrabold text-foreground">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {item.subtitle}
                  </span>
                </span>
                <ArrowRight className="size-4 shrink-0 text-accent transition group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 - provider then date/time */}
      {step === 2 && (
        <div>
          <StepIntro
            step="Step two"
            title="Choose a provider and time."
            body={
              service
                ? `Providers who can help with ${service.toLowerCase()}.`
                : "Pick the provider you would like to see, then a time that works."
            }
          />

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {providersLoading
              ? Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 animate-pulse rounded-2xl border border-border bg-secondary"
                  />
                ))
              : (providers ?? []).map((provider) => {
                  const isSelected = provider.id === selectedProviderId;
                  return (
                    <button
                      key={provider.id}
                      type="button"
                      onClick={() => {
                        form.setFieldValue("providerId", provider.id as never);
                        // Bring the newly revealed date/time panel into view rather than
                        // leaving it below the fold after the provider list.
                        requestAnimationFrame(() =>
                          dateTimeRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          }),
                        );
                      }}
                      className={cn(
                        "flex items-center gap-4 rounded-2xl border p-4 text-left transition",
                        isSelected
                          ? "border-primary bg-secondary"
                          : "border-border hover:border-primary/40 hover:bg-secondary",
                      )}
                    >
                      <ProviderAvatar
                        name={provider.user?.displayName}
                        photo={provider.user?.avatar?.url}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-primary font-extrabold text-foreground">
                          {provider.user?.displayName}
                        </span>
                        <span className="mt-1 block truncate text-xs text-muted-foreground">
                          {provider.title || "Psychiatric provider"}
                        </span>
                      </span>
                      {isSelected && (
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground">
                          <Check className="size-3.5" />
                        </span>
                      )}
                    </button>
                  );
                })}
          </div>

          {selectedProviderId && (
            <div ref={dateTimeRef} className="mt-8 scroll-mt-24 rounded-2xl bg-secondary/60 p-5">
              <p className="eyebrow text-accent">Pick a date and time</p>
              <div className="mt-4">
                <DatePickerField
                  form={form}
                  name="selectedDate"
                  label="Preferred date"
                  minDate={new Date().toISOString()}
                />
              </div>

              <div className="mt-5">
                <p className="text-sm font-semibold text-foreground/75">
                  Available times
                  {selectedProvider?.user?.displayName
                    ? ` with ${selectedProvider.user.displayName.split(" ")[0]}`
                    : ""}
                </p>

                {slotsQuery.isLoading ? (
                  <p className="mt-3 text-sm text-muted-foreground">Loading times...</p>
                ) : slots.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">
                    No times offered on this date. Try another date or provider.
                  </p>
                ) : (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {slots.map((slot) => {
                      const isSelected = slot.startAt === startAt;
                      return (
                        <button
                          key={slot.startAt}
                          type="button"
                          disabled={slot.isBooked}
                          title={slot.isBooked ? "Already booked" : undefined}
                          onClick={() =>
                            form.setFieldValue("scheduledStartAt", slot.startAt as never)
                          }
                          className={cn(
                            "rounded-full border px-4 py-2 text-sm font-semibold transition",
                            slot.isBooked
                              ? "cursor-not-allowed border-border bg-transparent text-muted-foreground/50 line-through"
                              : isSelected
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-card text-foreground hover:border-primary/40",
                          )}
                        >
                          {formatDate(slot.startAt, { mode: "time" })}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <Button variant="ghost" size="sm" type="button" onClick={() => goToStep(1)}>
              <ArrowLeft className="size-4" /> Back
            </Button>
            <Button type="button" disabled={!startAt} onClick={() => goToStep(3)}>
              Continue <ArrowRight className="size-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3 - your details */}
      {step === 3 && (
        <div>
          <StepIntro
            step="Step three"
            title="You are ready to confirm."
            body={
              currentUser
                ? "Share your contact details and our team will follow up with the appointment information."
                : "Share your contact details and our team will follow up. If you already have an account, use that same email or phone; otherwise we will create one for you."
            }
          />

          <dl className="mt-6 grid gap-4 rounded-2xl border border-border bg-secondary/60 p-4 text-sm sm:grid-cols-3">
            {[
              service && { label: "Service", value: service },
              selectedProvider?.user?.displayName && {
                label: "Provider",
                value: selectedProvider.user.displayName,
              },
              startAt && {
                label: "Time",
                value: formatDate(startAt, { mode: "datetime" }),
              },
            ]
              .filter(Boolean)
              .map((item) => {
                const entry = item as { label: string; value: string };
                return (
                  <div key={entry.label}>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {entry.label}
                    </dt>
                    <dd className="mt-1 font-semibold text-foreground">{entry.value}</dd>
                  </div>
                );
              })}
          </dl>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <InputField form={form} required name="firstName" label="First name" />
            <InputField form={form} name="lastName" label="Last name" />
            <InputField
              form={form}
              required
              name="email"
              type="email"
              label="Email"
              placeholder="you@example.com"
            />
            <PhoneField form={form} required name="phone" label="Phone" />
          </div>

          {!currentUser && (
            <p className="mt-3 text-xs leading-6 text-muted-foreground">
              Have an account already?{" "}
              <Link href="/auth/sign-in" className="font-bold text-accent hover:underline">
                Sign in
              </Link>
              .
            </p>
          )}

          <div className="mt-5">
            <InputField
              form={form}
              name="patientNotes"
              type="textarea"
              rows={4}
              label="Anything your provider should know?"
              placeholder="Symptoms, what you have already tried, or questions you want answered."
            />
          </div>

          <div className="mt-8 flex items-center justify-between">
            <Button variant="ghost" size="sm" type="button" onClick={() => goToStep(2)}>
              <ArrowLeft className="size-4" /> Back
            </Button>
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" disabled={!canSubmit || !startAt}>
                  {isSubmitting ? "Booking..." : "Confirm request"}
                  {!isSubmitting && <ArrowRight className="size-4" />}
                </Button>
              )}
            </form.Subscribe>
          </div>
        </div>
      )}
    </Form>
  );
};

export default AppointmentForm;
