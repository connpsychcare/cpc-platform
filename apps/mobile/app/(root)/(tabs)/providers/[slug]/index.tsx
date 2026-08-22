import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

import { BookAppointmentForm } from "@/components/shared/book-appointment-form";
import { PublicCtaSection } from "@/components/shared/public-cta-section";
import { PublicPageLayout } from "@/components/shared/public-page-layout";
import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { usePublicProviders } from "@/hooks/use-public-content";
import { useOverlay } from "@/hooks/use-overlay";
import { publicProvidersPageContent } from "@workspace/shared/constants";

export default function ProviderDetailRoute() {
  const { openOverlay, closeOverlay } = useOverlay();
  const { slug } = useLocalSearchParams<{ slug?: string | string[] }>();
  const providerSlug = Array.isArray(slug) ? slug[0] : slug;
  const { data } = usePublicProviders();
  const liveProvider = data?.find((d) => d.slug === providerSlug);
  const provider = liveProvider
    ? {
        slug: liveProvider.slug,
        name: liveProvider.user?.displayName,
        role: [liveProvider.title, ...(liveProvider.specialties ?? []).slice(0, 1)]
          .filter(Boolean)
          .join(", "),
        image: liveProvider.user?.avatar?.url ?? "",
        bio: liveProvider.bio,
        credentials: liveProvider.credentials?.length
          ? liveProvider.credentials
          : [
              liveProvider.title,
              liveProvider.education,
              liveProvider.yearsExperience
                ? `${liveProvider.yearsExperience}+ years experience`
                : undefined,
            ].filter(Boolean),
        specialties: liveProvider.specialties?.length
          ? liveProvider.specialties
          : [
              ...(liveProvider.specialties ?? []).slice(0, 1),
              ...(liveProvider.languages ?? []).slice(0, 3),
            ].filter(Boolean),
        id: liveProvider.id,
      }
    : undefined;

  if (!provider) {
    return (
      <PublicPageLayout>
        <View className="section-wrapper mt-12">
          <Empty>
            <EmptyMedia variant="icon">
              <AppIcon name="UserIcon" size="md" variant="primary" />
            </EmptyMedia>
            <EmptyHeader>
              <EmptyTitle>{publicProvidersPageContent.notFoundTitle}</EmptyTitle>
              <EmptyDescription>
                {publicProvidersPageContent.notFoundDescription}
              </EmptyDescription>
            </EmptyHeader>
            <Button href="/providers" variant="outline" fullWidth>
              {publicProvidersPageContent.backToTeamLabel}
            </Button>
          </Empty>
        </View>
        <PublicCtaSection
          eyebrow="Our Team"
          title={publicProvidersPageContent.notFoundCtaTitle}
          description={publicProvidersPageContent.notFoundCtaDescription}
          primaryLabel={publicProvidersPageContent.notFoundPrimaryLabel}
          primaryHref="/providers"
          secondaryLabel={publicProvidersPageContent.detailCtaPrimaryLabel}
          secondaryHref="/contact"
        />
      </PublicPageLayout>
    );
  }

  const firstName = provider.name.split(" ").at(-1) ?? provider.name;

  return (
    <PublicPageLayout>
      {/* Hero image - edge to edge, no rounding */}
      <View className="relative h-80 overflow-hidden bg-secondary">
        {provider.image ? (
          <Image
            source={{ uri: provider.image }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        ) : (
          <View className="size-full items-center justify-center bg-primary/10">
            <Text className="font-primary text-6xl text-primary">
              {provider.name
                .split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)}
            </Text>
          </View>
        )}
        {/* Gradient overlay at bottom */}
        <View className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-dark-section/60 to-transparent" />
      </View>

      <View className="section-wrapper gap-6 pb-12 pt-6">
        {/* Back link */}
        <Button
          href="/providers"
          variant="ghost"
          size="sm"
          className="-ml-2 self-start"
        >
          <AppIcon name="ArrowLeftIcon" size="sm" variant="muted" />
          <Text className="font-body-medium text-sm text-muted-foreground">
            {publicProvidersPageContent.backToTeamLabel}
          </Text>
        </Button>

        {/* Name + role */}
        <View className="gap-1">
          <Text className="font-primary text-3xl leading-tight text-foreground">
            {provider.name}
          </Text>
          <Text className="font-body-medium text-base text-primary">
            {provider.role}
          </Text>
        </View>

        {provider.bio ? (
          <View className="rounded-2xl border border-border bg-surface-elevated p-5">
            <Text className="font-secondary text-base leading-7 text-muted-foreground">
              {provider.bio}
            </Text>
          </View>
        ) : null}

        {/* Credentials */}
        <View className="gap-3">
          <Text className="font-body-semibold text-xs uppercase tracking-[2px] text-muted-foreground">
            {publicProvidersPageContent.credentialsLabel}
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {provider.credentials.map((item) => (
              <Badge key={item} variant="secondary" appearance="soft">
                {item}
              </Badge>
            ))}
          </View>
        </View>

        {/* Specialties */}
        <View className="gap-3">
          <Text className="font-body-semibold text-xs uppercase tracking-[2px] text-muted-foreground">
            {publicProvidersPageContent.specialtiesLabel}
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {provider.specialties.map((item) => (
              <Badge key={item} variant="outline">
                {item}
              </Badge>
            ))}
          </View>
        </View>

        {/* What to expect section */}
        <View className="rounded-2xl bg-primary/8 p-5">
          <View className="mb-3 flex-row items-center gap-2">
            <AppIcon name="HeartPulseIcon" size="sm" variant="primary" />
            <Text className="font-body-semibold text-base text-foreground">
              {publicProvidersPageContent.whatToExpectTitle}
            </Text>
          </View>
          <View className="gap-2">
            {publicProvidersPageContent.whatToExpectItems.map((item) => (
              <View key={item} className="flex-row items-start gap-2">
                <AppIcon name="CheckIcon" size="sm" variant="success" />
                <Text className="flex-1 font-secondary text-sm leading-6 text-muted-foreground">
                  {item}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* CTA buttons */}
        <View className="gap-3">
          <Button
            fullWidth
            onPress={() =>
              openOverlay({
                mode: "sheet",
                header: {
                  title: "Book Appointment",
                  description: publicProvidersPageContent.bookDescription,
                },
                content: (
                  <BookAppointmentForm
                    providerId={provider.id}
                    onSuccess={closeOverlay}
                  />
                ),
              })
            }
          >
            {publicProvidersPageContent.bookWithPrefix} {firstName}
          </Button>
          <Button href="/providers" variant="outline" fullWidth>
            {publicProvidersPageContent.viewFullTeamLabel}
          </Button>
        </View>
      </View>

      <PublicCtaSection
        eyebrow={publicProvidersPageContent.detailCtaEyebrow}
        title={publicProvidersPageContent.detailCtaTitle}
        description={publicProvidersPageContent.detailCtaDescription}
        primaryLabel={publicProvidersPageContent.detailCtaPrimaryLabel}
        primaryHref="/contact"
        secondaryLabel={publicProvidersPageContent.detailCtaSecondaryLabel}
        secondaryHref="/services"
      />
    </PublicPageLayout>
  );
}
