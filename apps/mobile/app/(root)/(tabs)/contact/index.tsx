import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Text, View } from "react-native";
import { createContactMessage } from "@workspace/sdk/contact";
import type { CreateContactMessageType } from "@workspace/contracts/contact";
import { publicContactPageContent } from "@workspace/shared/constants";
import { resolvePublicBusinessProfile } from "@workspace/shared/utils";

import { PublicPageHeader } from "@/components/shared/public-page-header";
import { PublicPageLayout } from "@/components/shared/public-page-layout";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePublicBusinessProfile } from "@/hooks/use-public-content";

const initialFormState: CreateContactMessageType = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export default function ContactRoute() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState(initialFormState);
  const { data: businessProfile } = usePublicBusinessProfile();
  const business = resolvePublicBusinessProfile(businessProfile);

  const primaryContactInfo = [
    {
      label: "Call us",
      icon: "PhoneIcon",
      value: business.primaryPhone.display,
      sub: "Mon–Fri, during office hours",
    },
    {
      label: "Email",
      icon: "MailIcon",
      value: business.supportEmail,
      sub: "We respond within one business day",
    },
    {
      label: "Office",
      icon: "MapPinIcon",
      value: business.address.line1,
      sub: `${business.address.line2 ? `${business.address.line2}, ` : ""}${business.address.cityStateZip}`,
    },
  ] as const;

  const contactMutation = useMutation({
    mutationFn: createContactMessage,
    onSuccess: () => {
      setSubmitted(true);
      setForm(initialFormState);
    },
  });

  const updateField = (
    key: keyof CreateContactMessageType,
    value: string | undefined,
  ) => {
    setForm((current) => ({ ...current, [key]: value ?? "" }));
  };

  const handleSubmit = () => {
    void contactMutation.mutateAsync({
      ...form,
      lastName: form.lastName || undefined,
      subject: form.subject || undefined,
    });
  };

  return (
    <PublicPageLayout>
      <PublicPageHeader
        eyebrow="Contact Us"
        title={publicContactPageContent.pageTitle}
        description={publicContactPageContent.pageDescription}
        align="center"
      />

      <View className="section-wrapper mt-12 gap-6">
        {/* Intro + contact info */}
        <View>
          <Text className="font-primary text-2xl text-foreground">
            {publicContactPageContent.teamCardTitle}
          </Text>
          <Text className="mt-2 font-secondary text-sm leading-7 text-muted-foreground">
            {publicContactPageContent.pageDescription}
          </Text>
        </View>

        <View className="gap-3">
          {primaryContactInfo.map((info) => (
            <View
              key={info.label}
              className="flex-row items-start gap-4 rounded-2xl border border-border bg-card p-4"
            >
              <AppIcon name={info.icon} mode="wrap" size="md" />
              <View className="flex-1">
                <Text className="font-body-semibold text-xs uppercase tracking-widest text-muted-foreground">
                  {info.label}
                </Text>
                <Text className="mt-0.5 font-body-semibold text-sm text-foreground">
                  {info.value}
                </Text>
                <Text className="font-secondary text-xs text-muted-foreground">
                  {info.sub}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Contact form */}
        <Card className="bg-card shadow-soft">
          <CardContent className="py-1">
            {submitted ? (
              <View className="items-center gap-4 py-10">
                <AppIcon name="CheckCircleIcon" mode="wrap" size="lg" variant="primary" />
                <Text className="font-primary text-2xl text-foreground">
                  {publicContactPageContent.successTitle}
                </Text>
                <Text className="text-center font-secondary text-sm leading-7 text-muted-foreground">
                  {publicContactPageContent.successDescription.replace(
                    "{phone}",
                    business.primaryPhone.short,
                  )}
                </Text>
                <Button
                  variant="outline"
                  className="mt-2"
                  fullWidth
                  onPress={() => setSubmitted(false)}
                >
                  {publicContactPageContent.resetLabel}
                </Button>
              </View>
            ) : (
              <View className="gap-5">
                <View>
                  <Text className="font-primary text-lg text-foreground">
                    Send Us a Message
                  </Text>
                  <Text className="mt-1 font-secondary text-sm text-muted-foreground">
                    We usually respond within one business day.
                  </Text>
                </View>

                <View className="gap-2">
                  <Label>First Name *</Label>
                  <Input
                    value={form.firstName}
                    onChangeText={(value) => updateField("firstName", value)}
                    placeholder="Jane"
                  />
                </View>
                <View className="gap-2">
                  <Label>Last Name</Label>
                  <Input
                    value={form.lastName}
                    onChangeText={(value) => updateField("lastName", value)}
                    placeholder="Smith"
                  />
                </View>
                <View className="gap-2">
                  <Label>Email Address *</Label>
                  <Input
                    value={form.email}
                    onChangeText={(value) => updateField("email", value)}
                    placeholder="jane@example.com"
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
                <View className="gap-2">
                  <Label>Phone Number *</Label>
                  <Input
                    value={form.phone}
                    onChangeText={(value) => updateField("phone", value)}
                    placeholder="(555) 000-0000"
                    keyboardType="phone-pad"
                  />
                </View>
                <View className="gap-2">
                  <Label>Subject</Label>
                  <Input
                    value={form.subject}
                    onChangeText={(value) => updateField("subject", value)}
                    placeholder="e.g. Scheduling a psychiatric evaluation"
                  />
                </View>
                <View className="gap-2">
                  <Label>Message *</Label>
                  <Textarea
                    value={form.message}
                    onChangeText={(value) => updateField("message", value)}
                    placeholder="Tell us about what you're looking for and how we can help..."
                  />
                </View>

                {contactMutation.error ? (
                  <Text className="font-secondary text-sm text-destructive">
                    We couldn&apos;t send your message right now. Please try again.
                  </Text>
                ) : null}

                <Button
                  fullWidth
                  disabled={
                    contactMutation.isPending ||
                    !form.firstName ||
                    !form.email ||
                    !form.phone ||
                    !form.message
                  }
                  onPress={handleSubmit}
                >
                  {contactMutation.isPending
                    ? publicContactPageContent.submittingLabel
                    : publicContactPageContent.submitLabel}
                </Button>

                <Text className="text-center font-secondary text-xs text-muted-foreground">
                  By submitting, you agree to our{" "}
                  <Text
                    className="underline"
                    onPress={() => {}}
                  >
                    Privacy Policy
                  </Text>
                  .
                </Text>
              </View>
            )}
          </CardContent>
        </Card>

        {/* Service area + office hours - telehealth only, so no address or map link */}
        <View className="rounded-2xl border border-border bg-secondary p-5 gap-4">
          <Text className="font-primary text-2xl text-foreground">
            {publicContactPageContent.whereCardTitle}
          </Text>
          <Text className="font-secondary text-sm leading-7 text-muted-foreground">
            {publicContactPageContent.whereCardDescription}
          </Text>

          {/* Hours */}
          <View className="flex-row items-start gap-4 rounded-2xl border border-border bg-card p-4">
            <AppIcon name="Clock3Icon" mode="wrap" size="md" />
            <View className="flex-1">
              <Text className="font-body-semibold text-xs uppercase tracking-widest text-muted-foreground">
                Office Hours
              </Text>
              <Text className="mt-0.5 font-body-semibold text-sm text-foreground">
                {business.officeHours.weekdays}
              </Text>
              <Text className="font-secondary text-xs text-muted-foreground">
                {business.officeHours.weekends}
              </Text>
            </View>
          </View>

          <View className="rounded-2xl border border-dashed border-primary/20 bg-card p-4">
            <Text className="font-body-semibold text-sm text-primary">
              {publicContactPageContent.noWaitingRoomTitle}
            </Text>
            <Text className="mt-1 font-secondary text-xs leading-5 text-muted-foreground">
              {publicContactPageContent.noWaitingRoomDescription}
            </Text>
          </View>
        </View>
      </View>
    </PublicPageLayout>
  );
}
