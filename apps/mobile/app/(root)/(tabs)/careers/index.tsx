import { Text, View } from "react-native";
import type { JobListingResponse } from "@workspace/contracts/job-listing";
import {
  publicCareersContent,
} from "@workspace/shared/constants";
import { resolvePublicBusinessProfile } from "@workspace/shared/utils";

import { PublicPageHeader } from "@/components/shared/public-page-header";
import { PublicPageLayout } from "@/components/shared/public-page-layout";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublicBusinessProfile, usePublicCareers } from "@/hooks/use-public-content";

const PERK_ICONS = [
  "GraduationCapIcon",
  "HeartHandshakeIcon",
  "IconBriefcase",
  "Clock3Icon",
] as const;

function formatJobType(type: JobListingResponse["type"]) {
  switch (type) {
    case "fullTime":
      return "Full-Time";
    case "partTime":
      return "Part-Time";
    case "contract":
      return "Contract";
    case "internship":
      return "Internship";
    default:
      return type;
  }
}

export default function CareersRoute() {
  const { data, isLoading } = usePublicCareers();
  const { data: businessProfile } = usePublicBusinessProfile();
  const business = resolvePublicBusinessProfile(businessProfile);
  const openings = data ?? [];

  return (
    <PublicPageLayout>
      <PublicPageHeader
        eyebrow="Join Our Team"
        title={publicCareersContent.title}
        description={publicCareersContent.description}
        align="center"
      />

      {/* ── Perks ─────────────────────────────────────────── */}
      <View className="mt-10 border-b border-border bg-secondary py-10">
        <View className="section-wrapper gap-4">
          {publicCareersContent.perks.map((perk, index) => (
            <View key={perk} className="flex-row items-center gap-4">
              <AppIcon
                name={PERK_ICONS[index] ?? "CheckCircleIcon"}
                mode="wrap"
                size="md"
                variant="primary"
              />
              <Text className="flex-1 font-body-medium text-sm leading-snug text-foreground">
                {perk}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View className="section-wrapper mt-12 gap-6">
        {/* ── Openings section header ───────────────────────── */}
        <View>
          <Text className="font-primary text-3xl text-foreground">
            {publicCareersContent.openingsTitle}
          </Text>
          <Text className="mt-2 font-secondary text-sm leading-7 text-muted-foreground">
            {publicCareersContent.openingsDescription.split("{email}")[0]}
            <Text className="font-body-semibold text-primary">
              {business.supportEmail}
            </Text>
            {publicCareersContent.openingsDescription.split("{email}")[1] ?? ""}
          </Text>
        </View>

        {/* ── Job cards ─────────────────────────────────────── */}
        {isLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-56 w-full rounded-[28px]" />
          ))
        ) : openings.length ? (
          openings.map((job) => (
            <Card key={job.id} className="shadow-soft">
              <CardContent className="gap-4 py-1">
                <View className="gap-2">
                  <Text className="font-primary text-2xl text-foreground">
                    {job.title}
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    <View className="rounded-full bg-secondary px-3 py-1">
                      <Text className="font-secondary text-xs text-muted-foreground">
                        {formatJobType(job.type)}
                      </Text>
                    </View>
                    <View className="rounded-full border border-border px-3 py-1">
                      <Text className="font-secondary text-xs text-muted-foreground">
                        {job.location}
                      </Text>
                    </View>
                    {job.salary ? (
                      <View className="rounded-full border border-border px-3 py-1">
                        <Text className="font-secondary text-xs text-muted-foreground">
                          {job.salary}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>

                <Text className="font-secondary text-sm leading-7 text-muted-foreground">
                  {job.description}
                </Text>

                {job.requirements ? (
                  <View className="gap-3">
                    <Text className="font-body-semibold text-sm text-foreground">
                      Requirements
                    </Text>
                    {job.requirements
                      .split("\n")
                      .filter(Boolean)
                      .map((req) => (
                        <View key={req} className="flex-row items-start gap-3">
                          <View className="mt-2 size-1.5 rounded-full bg-primary" />
                          <Text className="flex-1 font-secondary text-sm leading-6 text-muted-foreground">
                            {req}
                          </Text>
                        </View>
                      ))}
                  </View>
                ) : null}

                <Button href="/contact" fullWidth>
                  {publicCareersContent.applyLabel}
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="shadow-soft">
            <CardContent className="py-8">
              <Text className="text-center font-secondary text-sm leading-7 text-muted-foreground">
                {publicCareersContent.emptyState}
              </Text>
            </CardContent>
          </Card>
        )}
      </View>
    </PublicPageLayout>
  );
}
