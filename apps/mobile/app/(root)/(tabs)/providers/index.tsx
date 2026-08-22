import { Image } from "expo-image";
import { Text, View } from "react-native";

import { BookAppointmentForm } from "@/components/shared/book-appointment-form";
import { PublicCtaSection } from "@/components/shared/public-cta-section";
import { PublicPageHeader } from "@/components/shared/public-page-header";
import { PublicPageLayout } from "@/components/shared/public-page-layout";
import { SectionHeader } from "@/components/shared/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePublicProviders } from "@/hooks/use-public-content";
import { useOverlay } from "@/hooks/use-overlay";
import { publicProvidersPageContent } from "@workspace/shared/constants";

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

export default function ProvidersRoute() {
  const { openOverlay, closeOverlay } = useOverlay();
  const { data, isLoading } = usePublicProviders();
  const team = data ?? [];

  return (
    <PublicPageLayout>
      <PublicPageHeader
        eyebrow="Our Team"
        title={publicProvidersPageContent.pageTitle}
        description={publicProvidersPageContent.pageDescription}
        align="center"
      />

      <View className="section-wrapper mt-10 gap-6">
        <SectionHeader
          title={publicProvidersPageContent.sectionTitle}
          description={publicProvidersPageContent.sectionDescription}
        />

        <View className="gap-5">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="overflow-hidden p-0 shadow-soft">
                  <View className="h-60 animate-pulse bg-secondary" />
                  <CardContent className="gap-3 py-5">
                    <View className="h-6 w-2/3 rounded-full bg-secondary" />
                    <View className="h-4 w-1/2 rounded-full bg-secondary" />
                    <View className="h-16 rounded-2xl bg-secondary" />
                    <View className="h-10 rounded-2xl bg-secondary" />
                  </CardContent>
                </Card>
              ))
            : team.length === 0
              ? (
                  <Card>
                    <CardContent className="py-10">
                      <Text className="text-center font-secondary text-sm text-muted-foreground">
                        {publicProvidersPageContent.emptyState}
                      </Text>
                    </CardContent>
                  </Card>
                )
              : team.map((provider) => {
                  const name = provider.user?.displayName;
                  const role = [provider.title, ...(provider.specialties ?? []).slice(0, 1)]
                    .filter(Boolean)
                    .join(", ");
                  const photo = provider.user?.avatar?.url;
                  const credentials = (
                    provider.credentials?.length
                      ? provider.credentials
                      : [provider.title, provider.education].filter(Boolean)
                  ) as string[];
                  const specialties = (provider.specialties?.length
                    ? provider.specialties
                    : [...(provider.languages ?? []).slice(0, 2)].filter(Boolean)) as string[];

                  return (
                    <Card key={provider.slug} className="overflow-hidden bg-card p-0 shadow-soft">
                      <View className="h-60 bg-muted">
                        {photo ? (
                          <Image
                            source={{ uri: photo }}
                            style={{ width: "100%", height: "100%" }}
                            contentFit="cover"
                            contentPosition="top center"
                          />
                        ) : (
                          <ProviderPhotoPlaceholder name={name} />
                        )}
                      </View>

                      <CardContent className="gap-4 py-5">
                        <View>
                          <Text className="font-primary text-2xl text-foreground">
                            {name ?? "Psychiatric Provider"}
                          </Text>
                          <Text className="mt-1 font-body-medium text-sm text-primary">
                            {role || "Board-Certified Psychiatric Provider"}
                          </Text>
                        </View>

                        {provider.bio ? (
                          <Text
                            numberOfLines={3}
                            className="font-secondary text-sm leading-7 text-muted-foreground"
                          >
                            {provider.bio}
                          </Text>
                        ) : null}

                        {credentials.length > 0 && (
                          <View className="gap-2">
                            <Text className="font-body-semibold text-xs uppercase tracking-widest text-muted-foreground">
                              Credentials
                            </Text>
                            <View className="flex-row flex-wrap gap-1.5">
                              {credentials.map((c) => (
                                <Badge key={c} variant="secondary" appearance="soft">
                                  {c}
                                </Badge>
                              ))}
                            </View>
                          </View>
                        )}

                        {specialties.length > 0 && (
                          <View className="gap-2">
                            <Text className="font-body-semibold text-xs uppercase tracking-widest text-muted-foreground">
                              Specialties
                            </Text>
                            <View className="flex-row flex-wrap gap-1.5">
                              {specialties.map((s) => (
                                <Badge key={s} variant="outline">
                                  {s}
                                </Badge>
                              ))}
                            </View>
                          </View>
                        )}

                        <View className="flex-row gap-3">
                          <Button
                            href={`/providers/${provider.slug}`}
                            variant="outline"
                            className="flex-1"
                          >
                            {publicProvidersPageContent.viewProfileLabel}
                          </Button>
                          <Button
                            className="flex-1"
                            onPress={() =>
                              openOverlay({
                                mode: "sheet",
                                header: {
                                  title: `Book with ${name?.split(" ")[0] ?? "Provider"}`,
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
                            {publicProvidersPageContent.bookSessionLabel}
                          </Button>
                        </View>
                      </CardContent>
                    </Card>
                  );
                })}
        </View>
      </View>

      <PublicCtaSection
        eyebrow="Our Team"
        title={publicProvidersPageContent.ctaTitle}
        description={publicProvidersPageContent.ctaDescription}
        primaryLabel={publicProvidersPageContent.ctaPrimaryLabel}
        primaryHref="/contact"
        secondaryLabel={publicProvidersPageContent.ctaSecondaryLabel}
        secondaryHref="/services"
      />
    </PublicPageLayout>
  );
}
