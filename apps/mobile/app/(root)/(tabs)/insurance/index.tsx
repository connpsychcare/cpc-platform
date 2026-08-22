import { useState } from "react";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import {
  publicInsuranceContent,
  publicInsurers,
  type PublicInsurer,
} from "@workspace/shared/constants";
import { resolvePublicBusinessProfile } from "@workspace/shared/utils";

import { PublicCtaSection } from "@/components/shared/public-cta-section";
import { PublicPageHeader } from "@/components/shared/public-page-header";
import { PublicPageLayout } from "@/components/shared/public-page-layout";
import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePublicBusinessProfile } from "@/hooks/use-public-content";

function InsurerLogo({ domain, abbr, color }: Pick<PublicInsurer, "domain" | "abbr" | "color">) {
  const [failed, setFailed] = useState(false);
  const src = `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;

  if (failed) {
    return (
      <View
        className="size-full items-center justify-center rounded-full"
        style={{ backgroundColor: color }}
      >
        <Text className="font-body-semibold text-[10px] tracking-wide text-white">{abbr}</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: src }}
      style={{ width: "100%", height: "100%" }}
      contentFit="contain"
      onError={() => setFailed(true)}
    />
  );
}

function InsurerCard({ insurer }: { insurer: PublicInsurer }) {
  const isPending = insurer.status === "pending";
  return (
    <View
      className="flex-row items-center gap-3 rounded-2xl border border-border bg-card p-3"
      style={isPending ? { opacity: 0.8 } : undefined}
    >
      <View
        className="size-10 shrink-0 overflow-hidden rounded-full bg-white"
        style={{ borderWidth: 1, borderColor: "rgba(0,0,0,0.08)" }}
      >
        <InsurerLogo domain={insurer.domain} abbr={insurer.abbr} color={insurer.color} />
      </View>
      <View className="min-w-0 flex-1">
        <Text numberOfLines={1} className="font-body-semibold text-sm text-foreground">
          {insurer.name}
        </Text>
        <Text numberOfLines={1} className="mt-0.5 font-secondary text-xs text-muted-foreground">
          {insurer.note}
        </Text>
      </View>
      {isPending ? (
        <Badge variant="warning" appearance="soft">
          Pending
        </Badge>
      ) : null}
    </View>
  );
}

export default function InsuranceRoute() {
  const { data: businessProfile } = usePublicBusinessProfile();
  const business = resolvePublicBusinessProfile(businessProfile);

  const half = Math.ceil(publicInsurers.length / 2);
  const col1 = publicInsurers.slice(0, half);
  const col2 = publicInsurers.slice(half);

  return (
    <PublicPageLayout>
      <PublicPageHeader
        eyebrow="Insurance & Coverage"
        title={publicInsuranceContent.title}
        description={publicInsuranceContent.description}
        align="center"
      />

      <View className="section-wrapper mt-12 gap-6">
        {/* ── Accepted insurers ────────────────────────────── */}
        <View>
          <Text className="font-primary text-3xl text-foreground">
            {publicInsuranceContent.acceptedTitle}
          </Text>
          <Text className="mt-2 font-secondary text-sm leading-7 text-muted-foreground">
            {publicInsuranceContent.acceptedDescription}
          </Text>
        </View>

        {/* 2-column grid */}
        <View className="flex-row gap-3">
          <View className="flex-1 gap-3">
            {col1.map((insurer) => (
              <InsurerCard key={insurer.name} insurer={insurer} />
            ))}
          </View>
          <View className="flex-1 gap-3">
            {col2.map((insurer) => (
              <InsurerCard key={insurer.name} insurer={insurer} />
            ))}
          </View>
        </View>

        <Text className="font-secondary text-xs text-muted-foreground">
          * {publicInsuranceContent.acceptedNote}
        </Text>

        {/* ── Coverage check card ───────────────────────────── */}
        <Card className="border-primary/20 bg-primary/5 shadow-soft">
          <CardContent className="flex-row items-start gap-4 py-1">
            <AppIcon name="PhoneIcon" mode="wrap" size="md" variant="primary" />
            <View className="flex-1">
              <Text className="font-body-semibold text-sm text-foreground">
                {publicInsuranceContent.coverageCardTitle}
              </Text>
              <Text className="mt-1 font-secondary text-sm leading-7 text-muted-foreground">
                {publicInsuranceContent.coverageCardDescription
                  .replace("{phone}", business.primaryPhone.short)
                  .replace("{email}", business.supportEmail)}
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* ── Out of pocket card ────────────────────────────── */}
        <Card className="shadow-soft">
          <CardContent className="flex-row items-start gap-4 py-1">
            <View className="size-10 items-center justify-center rounded-2xl bg-amber-500/10">
              <AppIcon name="ShieldAlertIcon" size="sm" color="#d97706" />
            </View>
            <View className="flex-1">
              <Text className="font-body-semibold text-sm text-foreground">
                {publicInsuranceContent.outOfPocketTitle}
              </Text>
              <Text className="mt-1 font-secondary text-sm leading-7 text-muted-foreground">
                {publicInsuranceContent.outOfPocketDescription}
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* ── Self-pay card ─────────────────────────────────── */}
        <Card className="shadow-soft">
          <CardContent className="flex-row items-start gap-4 py-1">
            <AppIcon name="IconFileText" mode="wrap" size="md" variant="primary" />
            <View className="flex-1">
              <Text className="font-body-semibold text-sm text-foreground">
                {publicInsuranceContent.selfPayTitle}
              </Text>
              <Text className="mt-1 font-secondary text-sm leading-7 text-muted-foreground">
                {publicInsuranceContent.selfPayDescription}
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* ── Prior authorization steps ─────────────────────── */}
        <View className="gap-2">
          <Text className="font-body-semibold text-xs uppercase tracking-widest text-primary">
            How It Works
          </Text>
          <Text className="font-primary text-3xl text-foreground">
            How Prior Authorization Works
          </Text>
          <Text className="font-secondary text-sm leading-7 text-muted-foreground">
            Our team handles the full authorization process so you can focus on your care.
          </Text>
        </View>

        <View className="gap-4">
          {publicInsuranceContent.authSteps.map((step, index) => (
            <View
              key={step.step}
              className="gap-4 rounded-3xl border border-border bg-card p-5"
            >
              <View className="size-10 items-center justify-center rounded-full bg-primary">
                <Text className="font-body-semibold text-xs text-white">
                  {String(index + 1).padStart(2, "0")}
                </Text>
              </View>
              <View>
                <Text className="font-body-semibold text-sm text-foreground">
                  {step.title}
                </Text>
                <Text className="mt-2 font-secondary text-xs leading-6 text-muted-foreground">
                  {step.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Insurance FAQs ────────────────────────────────── */}
        <View>
          <Text className="font-primary text-3xl text-foreground">Common Questions</Text>
          <Text className="mt-2 font-secondary text-sm text-muted-foreground">
            Answers to the most frequent insurance questions we hear from patients.
          </Text>
        </View>

        <View className="gap-4">
          {publicInsuranceContent.faqs.map((faq) => (
            <View
              key={faq.q}
              className="gap-2 rounded-2xl border border-border bg-card p-5"
            >
              <Text className="font-body-semibold text-sm text-foreground">{faq.q}</Text>
              <Text className="font-secondary text-sm leading-7 text-muted-foreground">{faq.a}</Text>
            </View>
          ))}
        </View>

        <Button href="/contact" fullWidth>
          {publicInsuranceContent.ctaPrimaryLabel}
        </Button>
      </View>

      <PublicCtaSection
        eyebrow="Get Started"
        title={publicInsuranceContent.ctaTitle}
        description={publicInsuranceContent.authDescription}
        primaryLabel={publicInsuranceContent.ctaPrimaryLabel}
        primaryHref="/contact"
        secondaryLabel={publicInsuranceContent.ctaSecondaryLabel}
        secondaryHref="/refer"
      />
    </PublicPageLayout>
  );
}
