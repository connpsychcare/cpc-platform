import { Image } from "expo-image";
import { Text, View } from "react-native";
import {
  publicAboutContent,
  publicAboutPageContent,
} from "@workspace/shared/constants";

import { PublicCtaSection } from "@/components/shared/public-cta-section";
import { PublicPageHeader } from "@/components/shared/public-page-header";
import { PublicPageLayout } from "@/components/shared/public-page-layout";
import { SectionHeader } from "@/components/shared/section-header";
import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePublicProviders } from "@/hooks/use-public-content";

const PHOTOS = {
  banner: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=1200&q=80",
  missionA: "https://images.unsplash.com/photo-1596542519315-6db93bdf7548?w=800&q=80",
  missionB: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&q=80",
  clinical: "https://images.unsplash.com/photo-1776886099265-6366478b341b?w=900&q=80",
};

function ProviderPhotoPlaceholder({ name }: { name?: string }) {
  const initials = (name ?? "CPC")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View className="size-full items-center justify-center gap-3 bg-primary/5 p-6">
      <View className="size-20 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
        <Text className="font-primary text-3xl text-primary">{initials}</Text>
      </View>
      <Text className="max-w-36 text-center font-body-semibold text-xs uppercase tracking-widest text-muted-foreground">
        Profile photo coming soon
      </Text>
    </View>
  );
}

export default function AboutRoute() {
  const { data, isLoading } = usePublicProviders();
  const featuredTeam = (data ?? []).slice(0, 5);

  return (
    <PublicPageLayout>
      <PublicPageHeader
        eyebrow="About Us"
        title={publicAboutPageContent.pageTitle}
        description={publicAboutPageContent.pageDescription}
        align="center"
        actions={
          <>
            <Button href="/contact" fullWidth>
              Book a Consultation
            </Button>
            <Button href="/services" variant="outline" fullWidth>
              Our Services
            </Button>
          </>
        }
      />

      {/* ── Mission / intro ──────────────────────────────── */}
      <View className="section-wrapper mt-12 gap-6">
        <View className="self-start">
          <Badge variant="secondary" appearance="soft">
            {publicAboutPageContent.missionBadge}
          </Badge>
        </View>

        <Text className="font-primary text-3xl leading-tight tracking-tight text-foreground">
          {publicAboutContent.missionTitle}
        </Text>
        <Text className="font-secondary text-base leading-7 text-muted-foreground">
          {publicAboutContent.intro}
        </Text>
        <Text className="font-secondary text-base leading-7 text-muted-foreground">
          {publicAboutContent.body}
        </Text>

        {/* Mission (dark) + Vision (light) cards */}
        <Card className="border-primary/40 bg-primary shadow-soft">
          <CardContent className="gap-2 py-1">
            <Text className="font-body-semibold text-xs uppercase tracking-widest text-white/60">
              Mission
            </Text>
            <Text className="font-secondary text-sm leading-7 text-white/85">
              {publicAboutContent.mission}
            </Text>
          </CardContent>
        </Card>
        <Card className="border-primary/10 bg-primary/5 shadow-soft">
          <CardContent className="gap-2 py-1">
            <Text className="font-body-semibold text-xs uppercase tracking-widest text-primary">
              Vision
            </Text>
            <Text className="font-secondary text-sm leading-7 text-muted-foreground">
              {publicAboutContent.vision}
            </Text>
          </CardContent>
        </Card>

        {/* Highlights checklist */}
        <View className="gap-3">
          {publicAboutContent.highlights.map((item) => (
            <View key={item} className="flex-row items-start gap-3">
              <AppIcon name="CheckIcon" size="sm" variant="primary" />
              <Text className="flex-1 font-secondary text-sm leading-6 text-muted-foreground">
                {item}
              </Text>
            </View>
          ))}
        </View>

        {/* Two stacked mission photos */}
        <View className="gap-4">
          <View className="overflow-hidden rounded-3xl bg-secondary" style={{ aspectRatio: 1.1 }}>
            <Image
              source={{ uri: PHOTOS.missionA }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
            />
          </View>
          <View className="overflow-hidden rounded-3xl bg-secondary" style={{ aspectRatio: 1.1 }}>
            <Image
              source={{ uri: PHOTOS.missionB }}
              style={{ width: "100%", height: "100%" }}
              contentFit="cover"
              contentPosition="top center"
            />
          </View>
        </View>
      </View>

      {/* ── Business story ───────────────────────────────── */}
      <View className="mt-12 bg-secondary py-12">
        <View className="section-wrapper gap-6">
          <SectionHeader
            title={publicAboutContent.businessTitle}
            description={publicAboutPageContent.businessSectionDescription}
          />

          <View className="gap-4">
            {publicAboutContent.businessStory.map((paragraph) => (
              <Text
                key={paragraph}
                className="font-secondary text-sm leading-7 text-muted-foreground"
              >
                {paragraph}
              </Text>
            ))}
          </View>

          <Card className="bg-card shadow-soft">
            <CardContent className="gap-4 py-1">
              <Text className="font-body-semibold text-xs uppercase tracking-widest text-primary">
                Who We Partner With
              </Text>
              <View className="gap-3">
                {publicAboutContent.referralPartners.map((item) => (
                  <View key={item} className="flex-row items-start gap-3">
                    <AppIcon name="CheckIcon" size="sm" variant="primary" />
                    <Text className="flex-1 font-secondary text-sm leading-6 text-muted-foreground">
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-soft">
            <CardContent className="gap-4 py-1">
              <Text className="font-body-semibold text-xs uppercase tracking-widest text-primary">
                What Patients Can Expect
              </Text>
              <View className="gap-4">
                {publicAboutContent.careProcess.map((item) => (
                  <View key={item.key} className="flex-row items-start gap-3">
                    <AppIcon name={item.icon} mode="wrap" size="sm" variant="primary" />
                    <View className="flex-1 gap-1">
                      <Text className="font-body-semibold text-sm text-foreground">
                        {item.title}
                      </Text>
                      <Text className="font-secondary text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>
        </View>
      </View>

      {/* ── Values ───────────────────────────────────────── */}
      <View className="mt-12 bg-secondary py-12">
        <View className="section-wrapper gap-6">
          <SectionHeader
            title={publicAboutPageContent.valuesTitle}
            description={publicAboutPageContent.valuesDescription}
            centered
          />

          <View className="gap-4">
            {publicAboutContent.values.map((value, i) => {
              const isActive = i === 0;
              return (
                <Card
                  key={value.title}
                  className={
                    isActive
                      ? "border-primary/40 bg-primary shadow-soft"
                      : "bg-card shadow-soft"
                  }
                >
                  <CardContent className="gap-4 py-1">
                    <AppIcon
                      name={value.icon}
                      mode="wrap"
                      size="md"
                      variant="primary"
                      appearance={isActive ? "solid" : "soft"}
                    />
                    <Text
                      className={
                        isActive
                          ? "font-primary text-2xl text-white"
                          : "font-primary text-2xl text-foreground"
                      }
                    >
                      {value.title}
                    </Text>
                    <Text
                      className={
                        isActive
                          ? "font-secondary text-sm leading-7 text-white/75"
                          : "font-secondary text-sm leading-7 text-muted-foreground"
                      }
                    >
                      {value.description}
                    </Text>
                  </CardContent>
                </Card>
              );
            })}
          </View>
        </View>
      </View>

      {/* ── Clinical leadership / owner section ──────────── */}
      <View className="section-wrapper mt-12 gap-6">
        <View className="self-start">
          <Badge variant="secondary" appearance="soft">
            {publicAboutPageContent.ownerBadge}
          </Badge>
        </View>

        {/* Stock clinical photo - no hardcoded personal photo */}
        <View className="overflow-hidden rounded-4xl border border-border bg-card">
          <Image
            source={{ uri: PHOTOS.clinical }}
            style={{ width: "100%", height: 300 }}
            contentFit="cover"
            contentPosition="center"
          />
        </View>

        <Text className="font-primary text-3xl leading-tight text-foreground">
          {publicAboutContent.owner.name}
        </Text>
        <Text className="font-body-medium text-base text-primary">
          {publicAboutContent.owner.title} · {publicAboutContent.owner.credentials}
        </Text>
        <Text className="font-secondary text-sm leading-7 text-muted-foreground">
          {publicAboutContent.owner.summary}
        </Text>
        <Text className="font-secondary text-sm leading-7 text-muted-foreground">
          {publicAboutContent.owner.story}
        </Text>
        <Text className="font-secondary text-sm leading-7 text-muted-foreground">
          {publicAboutContent.owner.philosophy}
        </Text>

        <Card className="border-primary/10 bg-primary/5 shadow-soft">
          <CardContent className="gap-4 py-1">
            <Text className="font-body-semibold text-xs uppercase tracking-widest text-primary">
              {publicAboutPageContent.expertiseTitle}
            </Text>
            <View className="gap-3">
              {publicAboutContent.owner.expertise.map((item) => (
                <View key={item} className="flex-row items-start gap-3">
                  <AppIcon name="CheckIcon" size="sm" variant="primary" />
                  <Text className="flex-1 font-secondary text-sm leading-6 text-muted-foreground">
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </CardContent>
        </Card>
      </View>

      {/* ── Team grid ────────────────────────────────────── */}
      <View className="section-wrapper mt-12 gap-6">
        <SectionHeader
          title={publicAboutPageContent.teamTitle}
          description={publicAboutPageContent.teamDescription}
        />

        {/* 2-column grid matching web style */}
        <View className="gap-4">
          {(() => {
            const source = isLoading
              ? Array.from({ length: 4 }, (_, i) => ({
                  id: String(i),
                  name: undefined as string | undefined,
                  role: undefined as string | undefined,
                  photo: undefined as string | undefined,
                }))
              : featuredTeam.map((member) => ({
                  id: member.id,
                  name: member.user?.displayName,
                  role: [member.title, ...(member.specialties ?? []).slice(0, 1)]
                    .filter(Boolean)
                    .join(", "),
                  photo: member.user?.avatar?.url,
                }));

            const rows: (typeof source)[] = [];
            for (let i = 0; i < source.length; i += 2) {
              rows.push(source.slice(i, i + 2));
            }

            return rows.map((row, rowIndex) => (
              <View key={rowIndex} className="flex-row gap-4">
                {row.map((member) => (
                  <View key={member.id} className="flex-1">
                    <Card className="overflow-hidden bg-card p-0 shadow-soft">
                      <View className="h-52 bg-muted">
                        {isLoading ? (
                          <View className="size-full animate-pulse bg-secondary/70" />
                        ) : member.photo ? (
                          <Image
                            source={{ uri: member.photo }}
                            style={{ width: "100%", height: "100%" }}
                            contentFit="cover"
                            contentPosition="top center"
                          />
                        ) : (
                          <ProviderPhotoPlaceholder name={member.name} />
                        )}
                      </View>
                      <CardContent className="gap-1 py-3">
                        {isLoading ? (
                          <>
                            <View className="h-4 w-3/4 rounded bg-secondary" />
                            <View className="mt-1 h-3 w-1/2 rounded bg-secondary" />
                          </>
                        ) : (
                          <>
                            <Text
                              numberOfLines={1}
                              className="font-primary text-base text-foreground"
                            >
                              {member.name ?? "Psychiatric Provider"}
                            </Text>
                            <Text
                              numberOfLines={2}
                              className="font-secondary text-xs leading-4 text-muted-foreground"
                            >
                              {member.role || "Board-Certified Provider"}
                            </Text>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </View>
                ))}
              </View>
            ));
          })()}
        </View>

        {!isLoading && featuredTeam.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <Text className="text-center font-secondary text-sm leading-7 text-muted-foreground">
                {publicAboutPageContent.teamEmptyState}
              </Text>
            </CardContent>
          </Card>
        ) : null}

        <Button href="/providers" variant="outline" fullWidth>
          View Full Team
        </Button>
      </View>

      <PublicCtaSection
        eyebrow="Join Us"
        title={publicAboutPageContent.ctaTitle}
        description={publicAboutPageContent.ctaDescription}
        primaryLabel={publicAboutPageContent.ctaPrimaryLabel}
        primaryHref="/contact"
        secondaryLabel={publicAboutPageContent.ctaSecondaryLabel}
        secondaryHref="/services"
      />
    </PublicPageLayout>
  );
}
