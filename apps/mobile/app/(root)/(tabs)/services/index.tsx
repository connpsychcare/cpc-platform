import { Image } from "expo-image";
import { Text, View } from "react-native";

import { PublicCtaSection } from "@/components/shared/public-cta-section";
import { PublicPageHeader } from "@/components/shared/public-page-header";
import { PublicPageLayout } from "@/components/shared/public-page-layout";
import { SectionHeader } from "@/components/shared/section-header";
import StepsSection from "@/components/section/steps-section";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  patientPortalHighlights,
  publicServices,
  publicServicesPageContent,
} from "@workspace/shared/constants";

const SERVICE_PHOTOS: Record<string, string> = {
  "psychiatric-evaluation":     "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&q=80",
  "medication-management":      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
  "telehealth-psychiatry":      "https://images.unsplash.com/photo-1588702547919-26089e690ecc?w=800&q=80",
  "depression-treatment":       "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80",
  "anxiety-treatment":          "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&q=80",
  "adhd-treatment":             "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
  "child-adolescent-psychiatry":"https://images.unsplash.com/photo-1596542519315-6db93bdf7548?w=800&q=80",
  "bipolar-disorder-treatment": "https://images.unsplash.com/photo-1532094349884-543559c6c0a3?w=800&q=80",
  "trauma-ptsd-treatment":      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80",
  default:                      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80",
};

const resolveServicePhoto = (slug: string) =>
  SERVICE_PHOTOS[slug] ?? SERVICE_PHOTOS.default;

export default function ServicesRoute() {
  return (
    <PublicPageLayout>
      <PublicPageHeader
        eyebrow={publicServicesPageContent.pageEyebrow}
        title={publicServicesPageContent.pageTitle}
        description={publicServicesPageContent.pageDescription}
        actions={
          <>
            <Button href="/contact" fullWidth>
              {publicServicesPageContent.pagePrimaryLabel}
            </Button>
            <Button href="/providers" variant="outline" fullWidth>
              {publicServicesPageContent.pageSecondaryLabel}
            </Button>
          </>
        }
      />

      {/* ── Service cards - photo top + content below ─────── */}
      <View className="section-wrapper mt-12 gap-5">
        <SectionHeader
          title={publicServicesPageContent.servicesTitle}
          description={publicServicesPageContent.servicesDescription}
        />

        <View className="gap-5">
          {publicServices.map((service, index) => (
            <Card
              key={service.id}
              id={service.slug}
              className="overflow-hidden bg-card p-0 shadow-soft"
            >
              {/* Photo with index overlay */}
              <View className="relative h-52 bg-muted">
                <Image
                  source={{ uri: resolveServicePhoto(service.slug) }}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                  contentPosition="top center"
                />
                <View className="absolute left-4 top-4 size-9 items-center justify-center rounded-full bg-black/25">
                  <Text className="font-body-semibold text-xs text-white">
                    {String(index + 1).padStart(2, "0")}
                  </Text>
                </View>
              </View>

              <CardContent className="gap-5 py-2">
                {/* Icon + title */}
                <View className="flex-row items-start gap-4">
                  <AppIcon name={service.icon} mode="wrap" size="md" variant="primary" />
                  <View className="flex-1">
                    <Text className="font-primary text-2xl leading-tight text-foreground">
                      {service.title}
                    </Text>
                    <Text className="mt-1 font-body-semibold text-sm text-primary">
                      {service.subtitle}
                    </Text>
                  </View>
                </View>

                <Text className="font-secondary text-sm leading-7 text-muted-foreground">
                  {service.description}
                </Text>

                {/* Highlights */}
                <View className="gap-2">
                  {service.highlights.map((item) => (
                    <View key={item} className="flex-row items-start gap-2">
                      <AppIcon name="CheckIcon" size="sm" variant="primary" />
                      <Text className="flex-1 font-secondary text-sm leading-6 text-muted-foreground">
                        {item}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Best For */}
                <View className="rounded-xl border border-border bg-secondary px-4 py-3">
                  <Text className="font-body-semibold text-xs uppercase tracking-widest text-muted-foreground">
                    Best For
                  </Text>
                  <Text className="mt-1 font-secondary text-sm text-muted-foreground">
                    {service.who}
                  </Text>
                </View>

                {/* CTAs */}
                <View className="flex-row gap-2">
                  <View className="flex-1">
                    <Button href={`/services/${service.slug}`} fullWidth>
                      View Details
                    </Button>
                  </View>
                  <View className="flex-1">
                    <Button href="/contact" variant="outline" fullWidth>
                      {publicServicesPageContent.inquireLabel}
                    </Button>
                  </View>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      </View>

      {/* ── Patient portal callout ────────────────────────── */}
      <View className="section-wrapper mt-12">
        <Card className="border-primary/10 bg-primary/5 shadow-soft">
          <CardContent className="gap-5 py-1">
            <View className="gap-2">
              <Text className="font-body-semibold text-xs uppercase tracking-widest text-primary">
                {publicServicesPageContent.portalBadge}
              </Text>
              <Text className="font-primary text-3xl text-foreground">
                {publicServicesPageContent.portalTitle}
              </Text>
              <Text className="font-secondary text-sm leading-7 text-muted-foreground">
                {publicServicesPageContent.portalDescription}
              </Text>
            </View>

            <View className="gap-3">
              {patientPortalHighlights.map((item) => (
                <View key={item} className="flex-row items-start gap-3">
                  <AppIcon name="CheckIcon" size="sm" variant="primary" />
                  <Text className="flex-1 font-secondary text-sm leading-6 text-muted-foreground">
                    {item}
                  </Text>
                </View>
              ))}
            </View>

            <View className="gap-3">
              <Button href="/auth/[type]?type=sign-in" fullWidth>
                {publicServicesPageContent.portalLoginLabel}
              </Button>
              <Button href="/auth/[type]?type=sign-up" variant="outline" fullWidth>
                {publicServicesPageContent.portalSignupLabel}
              </Button>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* ── Getting started steps ─────────────────────────── */}
      <StepsSection />

      <PublicCtaSection
        eyebrow={publicServicesPageContent.ctaEyebrow}
        title={publicServicesPageContent.ctaTitle}
        description={publicServicesPageContent.ctaDescription}
        primaryLabel={publicServicesPageContent.ctaPrimaryLabel}
        primaryHref="/contact"
        secondaryLabel={publicServicesPageContent.ctaSecondaryLabel}
        secondaryHref="/providers"
      />
    </PublicPageLayout>
  );
}
