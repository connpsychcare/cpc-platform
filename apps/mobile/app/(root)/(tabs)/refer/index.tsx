import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Text, View } from "react-native";
import { createContactMessage } from "@workspace/sdk/contact";
import type { CreateContactMessageType } from "@workspace/contracts/contact";
import {
  publicReferralContent,
  publicReferralPageContent,
} from "@workspace/shared/constants";

import { PublicPageHeader } from "@/components/shared/public-page-header";
import { PublicPageLayout } from "@/components/shared/public-page-layout";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type WhyReferItem = {
  iconName: "HeartHandshakeIcon" | "ClipboardListIcon" | "UsersIcon";
  title: string;
  description: string;
};

const WHY_REFER: WhyReferItem[] = [
  {
    iconName: "HeartHandshakeIcon",
    title: "Family-Centered Care",
    description: publicReferralContent.reasons[0] ?? "",
  },
  {
    iconName: "ClipboardListIcon",
    title: "Evidence-Based Programs",
    description: publicReferralContent.reasons[1] ?? "",
  },
  {
    iconName: "UsersIcon",
    title: "Experienced Clinical Team",
    description: publicReferralContent.reasons[2] ?? "",
  },
];

const initialFormState = {
  referrerFirst: "",
  referrerLast: "",
  email: "",
  phone: "",
  patientName: "",
  dob: "",
  diagnosis: "",
  insurance: "",
  reason: "",
};

export default function ReferRoute() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState(initialFormState);

  const contactMutation = useMutation({
    mutationFn: createContactMessage,
    onSuccess: () => {
      setSubmitted(true);
      setForm(initialFormState);
    },
  });

  const updateField = (key: keyof typeof initialFormState, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = () => {
    const message = [
      `Patient Name: ${form.patientName}`,
      form.dob ? `Date of Birth: ${form.dob}` : null,
      form.diagnosis ? `Diagnosis: ${form.diagnosis}` : null,
      form.insurance ? `Insurance: ${form.insurance}` : null,
      `Reason for Referral:\n${form.reason}`,
    ]
      .filter(Boolean)
      .join("\n");

    const payload: CreateContactMessageType = {
      firstName: form.referrerFirst,
      lastName: form.referrerLast || undefined,
      email: form.email,
      phone: form.phone,
      subject: "Client Referral",
      message,
    };

    void contactMutation.mutateAsync(payload);
  };

  return (
    <PublicPageLayout>
      <PublicPageHeader
        eyebrow="Refer a Client"
        title={publicReferralPageContent.pageTitle}
        description={publicReferralContent.description}
        align="center"
      />

      <View className="section-wrapper mt-12 gap-6">
        {/* ── Why refer ────────────────────────────────────── */}
        <View>
          <Text className="font-primary text-3xl text-foreground">
            {publicReferralPageContent.whyReferTitle}
          </Text>
          <Text className="mt-2 font-secondary text-sm leading-7 text-muted-foreground">
            {publicReferralContent.intro}
          </Text>
        </View>

        <View className="gap-4">
          {WHY_REFER.map((item) => (
            <Card key={item.title} className="shadow-soft">
              <CardContent className="flex-row items-start gap-4 py-1">
                <AppIcon name={item.iconName} mode="wrap" size="md" variant="primary" />
                <View className="flex-1">
                  <Text className="font-body-semibold text-sm text-foreground">{item.title}</Text>
                  <Text className="mt-1 font-secondary text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </Text>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>

        <Text className="font-secondary text-sm text-muted-foreground">
          {publicReferralContent.followUp}
        </Text>

        {/* ── Referral form ─────────────────────────────────── */}
        <Card className="shadow-soft">
          <CardContent className="py-1">
            {submitted ? (
              <View className="items-center gap-4 py-8">
                <AppIcon name="CheckCircleIcon" mode="wrap" size="lg" variant="primary" />
                <Text className="font-primary text-3xl text-foreground">
                  {publicReferralPageContent.successTitle}
                </Text>
                <Text className="text-center font-secondary text-sm leading-7 text-muted-foreground">
                  {publicReferralPageContent.successDescription}
                </Text>
                <Button
                  variant="outline"
                  fullWidth
                  onPress={() => setSubmitted(false)}
                >
                  {publicReferralPageContent.submitAnotherLabel}
                </Button>
              </View>
            ) : (
              <View className="gap-5">
                <Text className="font-body-semibold text-xs uppercase tracking-widest text-muted-foreground">
                  {publicReferralPageContent.formSections.referrer}
                </Text>

                <View className="gap-2">
                  <Label>First Name *</Label>
                  <Input
                    value={form.referrerFirst}
                    onChangeText={(value) => updateField("referrerFirst", value)}
                    placeholder="Dr. Jane"
                  />
                </View>
                <View className="gap-2">
                  <Label>Last Name</Label>
                  <Input
                    value={form.referrerLast}
                    onChangeText={(value) => updateField("referrerLast", value)}
                    placeholder="Smith"
                  />
                </View>
                <View className="gap-2">
                  <Label>Email Address *</Label>
                  <Input
                    value={form.email}
                    onChangeText={(value) => updateField("email", value)}
                    placeholder="dr.smith@clinic.com"
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

                <Text className="font-body-semibold text-xs uppercase tracking-widest text-muted-foreground">
                  {publicReferralPageContent.formSections.patient}
                </Text>

                <View className="gap-2">
                  <Label>Patient Full Name *</Label>
                  <Input
                    value={form.patientName}
                    onChangeText={(value) => updateField("patientName", value)}
                    placeholder="Patient's full name"
                  />
                </View>
                <View className="gap-2">
                  <Label>Date of Birth</Label>
                  <Input
                    value={form.dob}
                    onChangeText={(value) => updateField("dob", value)}
                    placeholder="YYYY-MM-DD"
                  />
                </View>
                <View className="gap-2">
                  <Label>Diagnosis</Label>
                  <Input
                    value={form.diagnosis}
                    onChangeText={(value) => updateField("diagnosis", value)}
                    placeholder="e.g. Anxiety, Depression, ADHD"
                  />
                </View>
                <View className="gap-2">
                  <Label>Insurance Provider</Label>
                  <Input
                    value={form.insurance}
                    onChangeText={(value) => updateField("insurance", value)}
                    placeholder="e.g. Blue Shield of California"
                  />
                </View>
                <View className="gap-2">
                  <Label>Reason for Referral *</Label>
                  <Textarea
                    value={form.reason}
                    onChangeText={(value) => updateField("reason", value)}
                    placeholder="Describe the patient's current challenges, therapy history, or any other relevant information..."
                  />
                </View>

                {contactMutation.error ? (
                  <Text className="font-secondary text-sm text-destructive">
                    We couldn&apos;t submit your referral right now. Please try again.
                  </Text>
                ) : null}

                <Button
                  fullWidth
                  disabled={
                    contactMutation.isPending ||
                    !form.referrerFirst ||
                    !form.email ||
                    !form.phone ||
                    !form.patientName ||
                    !form.reason
                  }
                  onPress={handleSubmit}
                >
                  {contactMutation.isPending
                    ? publicReferralPageContent.submittingLabel
                    : publicReferralPageContent.submitLabel}
                </Button>

                <Text className="text-center font-secondary text-xs text-muted-foreground">
                  By submitting, you agree to our{" "}
                  <Text className="underline" onPress={() => {}}>
                    Privacy Policy
                  </Text>
                  .
                </Text>
              </View>
            )}
          </CardContent>
        </Card>
      </View>
    </PublicPageLayout>
  );
}
