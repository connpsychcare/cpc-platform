"use client";

import { useState } from "react";
import { CheckCircle, Clock3, Mail, MapPin, Phone, Send } from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

import { FadeLeft, FadeRight } from "@/components/shared/animations";
import {
  publicContactPageContent,
  publicContactSubjects,
} from "@workspace/shared/constants";
import { resolvePublicBusinessProfile } from "@workspace/shared/utils";
import {
  createContactMessageSchema,
  type CreateContactMessageType,
} from "@workspace/contracts/contact";
import { createContactMessage } from "@workspace/sdk/contact";
import { Button } from "@workspace/ui/components/button";
import { Form } from "@workspace/ui/components/form";
import { InputField } from "@workspace/ui/components/input-field";
import { PhoneField } from "@workspace/ui/components/phone-field";
import { SelectField } from "@workspace/ui/components/select-field";
import { usePublicBusinessProfile } from "@/hooks/content";
import PageHeader from "@/components/shared/PageHeader";
import CTASection from "@/components/sections/CTASection";

const SUBJECT_OPTIONS = publicContactSubjects.map((subject) => ({
  label: subject,
  value: subject,
}));

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const { data: businessProfile } = usePublicBusinessProfile();
  const business = resolvePublicBusinessProfile(businessProfile);

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      subject: publicContactSubjects[0],
      message: "",
    } as CreateContactMessageType,
    validators: { onSubmit: createContactMessageSchema },
    onSubmit: async ({ value }) => {
      try {
        await createContactMessage(value);
        setSubmitted(true);
        form.reset();
      } catch (error: any) {
        toast.error("Something went wrong", {
          description: error?.message ?? "Please try again.",
        });
      }
    },
  });

  return (
    <>
      <PageHeader
        subtitle={publicContactPageContent.pageEyebrow}
        title={publicContactPageContent.pageTitle}
        titleAccent={publicContactPageContent.pageTitleAccent}
        description={publicContactPageContent.pageDescription}
        image="/images/marketing/cpc-family-telehealth.jpg"
        imageAlt="A parent and teenager together during a secure video visit"
        actions={
          <Button href={business.primaryPhone.href}>
            Call {business.primaryPhone.short} <Phone className="size-4" />
          </Button>
        }
      />

      <section className="px-4 py-14 sm:px-6 lg:py-20">
        <div className="section-container grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Form */}
          <FadeLeft className="rounded-4xl border border-border bg-card p-6 shadow-(--soft-shadow) sm:p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <div className="grid size-16 place-items-center rounded-full bg-secondary text-brand-ink">
                  <CheckCircle className="size-8" />
                </div>
                <h2 className="font-primary text-2xl font-extrabold tracking-tight text-foreground">
                  {publicContactPageContent.successTitle}
                </h2>
                <p className="max-w-sm text-sm leading-7 text-muted-foreground">
                  {publicContactPageContent.successDescription.replace(
                    "{phone}",
                    business.primaryPhone.short,
                  )}
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)} className="mt-2">
                  {publicContactPageContent.resetLabel}
                </Button>
              </div>
            ) : (
              <Form form={form}>
                <div className="grid gap-5 sm:grid-cols-2">
                  <InputField form={form} required name="firstName" label="First name" placeholder="Jane" />
                  <InputField form={form} name="lastName" label="Last name" placeholder="Smith" />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <InputField
                    form={form}
                    name="email"
                    required
                    type="email"
                    label="Email"
                    placeholder="you@example.com"
                  />
                  <PhoneField form={form} required name="phone" label="Phone" />
                </div>
                <SelectField
                  form={form}
                  name="subject"
                  label="What can we help with?"
                  options={SUBJECT_OPTIONS}
                />
                <InputField
                  form={form}
                  name="message"
                  required
                  type="textarea"
                  rows={5}
                  label="Message"
                  placeholder="Tell us a little about what you are looking for..."
                />

                <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                  {([canSubmit, isSubmitting]) => (
                    <Button type="submit" className="w-fit" disabled={!canSubmit}>
                      {isSubmitting
                        ? publicContactPageContent.submittingLabel
                        : publicContactPageContent.submitLabel}
                      <Send className="size-4" />
                    </Button>
                  )}
                </form.Subscribe>

                <p className="text-xs leading-5 text-muted-foreground">
                  {publicContactPageContent.privacyNote}
                </p>
              </Form>
            )}
          </FadeLeft>

          {/* Sidebar */}
          <FadeRight delay={0.12} className="space-y-5">
            <div className="rounded-4xl bg-brand-surface p-7 text-brand-surface-foreground">
              <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-blue-light">
                {publicContactPageContent.teamCardTitle}
              </p>
              <div className="mt-6 space-y-4 text-sm text-brand-surface-foreground/75">
                <a href={business.primaryPhone.href} className="flex items-center gap-3">
                  <Phone className="size-4 text-blue-light" />
                  {business.primaryPhone.display}
                </a>
                <a href={`mailto:${business.supportEmail}`} className="flex items-center gap-3">
                  <Mail className="size-4 text-blue-light" />
                  {business.supportEmail}
                </a>
                <p className="flex items-start gap-3">
                  <Clock3 className="mt-0.5 size-4 shrink-0 text-blue-light" />
                  <span>
                    {business.officeHours.weekdays}
                    <br />
                    {business.officeHours.weekends}
                  </span>
                </p>
              </div>
            </div>

            <div className="rounded-4xl border border-border bg-secondary/45 p-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-accent">
                {publicContactPageContent.whereCardTitle}
              </p>
              <div className="mt-4 flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                <MapPin className="mt-0.5 size-5 shrink-0 text-brand-ink" />
                {publicContactPageContent.whereCardDescription}
              </div>
              <div className="mt-6 rounded-2xl border border-dashed border-primary/20 bg-card/70 p-5">
                <p className="text-sm font-bold text-brand-ink">
                  {publicContactPageContent.noWaitingRoomTitle}
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {publicContactPageContent.noWaitingRoomDescription}
                </p>
              </div>
            </div>
          </FadeRight>
        </div>
      </section>

      <CTASection
        subtitle="Your care, your pace"
        title={publicContactPageContent.ctaTitle}
        description={publicContactPageContent.ctaDescription}
      />
    </>
  );
}
