import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  businessProfileSchema,
  type BusinessProfileType,
} from "@workspace/contracts/business";

import { InternalScreen } from "@/components/internal/internal-screen";
import { Button } from "@/components/ui/button";
import { Form, FormSection } from "@/components/ui/form";
import { InputField } from "@/components/ui/input-field";
import { MediaField } from "@/components/ui/media-field";
import { PhoneField } from "@/components/ui/phone-field";
import { Skeleton } from "@/components/ui/skeleton";
import { useBusinessProfile, useUpsertBusinessProfile } from "@/hooks/use-healthcare";
import { useToast } from "@/providers/toast";

function SettingsSkeleton() {
  return (
    <InternalScreen>
      <View className="section-wrapper gap-4 pt-6">
        <Skeleton className="h-10 w-48 rounded-full" />
        <Skeleton className="h-64 w-full rounded-3xl" />
        <Skeleton className="h-48 w-full rounded-3xl" />
        <Skeleton className="h-40 w-full rounded-3xl" />
        <Skeleton className="h-40 w-full rounded-3xl" />
      </View>
    </InternalScreen>
  );
}

const EMPTY_DEFAULTS = {
  name: "",
  legalName: "",
  description: "",
  email: "",
  phone: "",
  metaTitle: "",
  metaDescription: "",
} as BusinessProfileType;

export default function AdminSettingsRoute() {
  const { data: profile, isLoading } = useBusinessProfile();
  const { upsertAsync, isPending } = useUpsertBusinessProfile();
  const insets = useSafeAreaInsets();
  const { error, success } = useToast();

  const form = useForm({
    defaultValues: EMPTY_DEFAULTS,
    validators: { onSubmit: businessProfileSchema },
    onSubmit: async ({ value }) => {
      try {
        await upsertAsync(value);
        success("Business profile saved successfully.");
      } catch (cause: any) {
        error("Failed to save business profile.", { description: cause?.message });
      }
    },
  });

  useEffect(() => {
    if (!profile) return;
    const p = profile as any;
    form.reset({
      name: p.name ?? "",
      legalName: p.legalName ?? "",
      description: p.description ?? "",
      faviconId: p.faviconId ?? undefined,
      logoLightId: p.logoLightId ?? undefined,
      logoDarkId: p.logoDarkId ?? undefined,
      coverId: p.coverId ?? undefined,
      email: p.email ?? "",
      phone: p.phone ?? "",
      whatsapp: p.whatsapp ?? undefined,
      website: p.website ?? undefined,
      facebook: p.facebook ?? undefined,
      instagram: p.instagram ?? undefined,
      tiktok: p.tiktok ?? undefined,
      twitter: p.twitter ?? undefined,
      linkedin: p.linkedin ?? undefined,
      metaTitle: p.metaTitle ?? "",
      metaDescription: p.metaDescription ?? "",
    });
  }, [profile]);

  if (isLoading) return <SettingsSkeleton />;

  const p = profile as any;

  return (
    <InternalScreen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="section-wrapper gap-6 pt-6">
          <View className="gap-1">
            <Text className="font-primary text-3xl text-foreground">
              Business Profile
            </Text>
            <Text className="font-secondary text-sm leading-7 text-muted-foreground">
              Manage the public business identity used across your dashboard and
              website.
            </Text>
          </View>

          <Form form={form} className="gap-6">
            {/* Core Details */}
            <FormSection
              title="Core Details"
              description="Business name, legal details, and the main profile description."
            >
              <InputField form={form} name="name" label="Business Name" />
              <InputField form={form} name="legalName" label="Legal Name" />
              <InputField
                form={form}
                name="description"
                label="Description"
                type="textarea"
                rows={5}
              />
            </FormSection>

            {/* Brand Media */}
            <FormSection
              title="Brand Media"
              description="Select the favicon, light logo, dark logo, and optional cover image from the media library."
            >
              <MediaField
                form={form}
                name="faviconId"
                label="Favicon"
                defaultMedia={p?.favicon}
              />
              <MediaField
                form={form}
                name="logoLightId"
                label="Light Logo"
                defaultMedia={p?.logoLight}
              />
              <MediaField
                form={form}
                name="logoDarkId"
                label="Dark Logo"
                defaultMedia={p?.logoDark}
              />
              <MediaField
                form={form}
                name="coverId"
                label="Cover Image"
                defaultMedia={p?.cover}
              />
            </FormSection>

            {/* Contact Details */}
            <FormSection
              title="Contact Details"
              description="Primary public contact channels for your business."
            >
              <InputField form={form} name="email" label="Email" type="email" />
              <PhoneField form={form} name="phone" label="Phone" />
              <PhoneField form={form} name="whatsapp" label="WhatsApp" />
              <InputField form={form} name="website" label="Website" type="url" />
            </FormSection>

            {/* Social Links */}
            <FormSection
              title="Social Links"
              description="These links can be reused across the website and templates."
            >
              <InputField form={form} name="facebook" label="Facebook" type="url" />
              <InputField
                form={form}
                name="instagram"
                label="Instagram"
                type="url"
              />
              <InputField form={form} name="tiktok" label="TikTok" type="url" />
              <InputField
                form={form}
                name="twitter"
                label="Twitter / X"
                type="url"
              />
              <InputField
                form={form}
                name="linkedin"
                label="LinkedIn"
                type="url"
              />
            </FormSection>

            {/* SEO */}
            <FormSection
              title="SEO & Meta"
              description="Metadata used across the business profile and public website."
            >
              <InputField form={form} name="metaTitle" label="Meta Title" />
              <InputField
                form={form}
                name="metaDescription"
                label="Meta Description"
                type="textarea"
                rows={4}
              />
            </FormSection>

            <View className="flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onPress={() => form.reset(profile as BusinessProfileType)}
                disabled={isPending}
              >
                Reset
              </Button>
              <Button
                className="flex-1"
                onPress={() => form.handleSubmit()}
                disabled={isPending}
              >
                {isPending ? "Saving..." : "Save Profile"}
              </Button>
            </View>
          </Form>
        </View>
      </ScrollView>
    </InternalScreen>
  );
}
