import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
import { GradientCard } from "@/components/shared/gradient-card";
import { InternalScreen } from "@/components/internal/internal-screen";
import { SectionCard } from "@/components/shared/section-card";
import { StatCard } from "@/components/shared/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBranches } from "@/hooks/use-healthcare";

function BranchesSkeleton() {
  return (
    <InternalScreen>
      <View className="section-wrapper gap-4 pt-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl" />
        ))}
      </View>
    </InternalScreen>
  );
}

export default function AdminBranchesRoute() {
  const { data, isLoading } = useBranches({ limit: 50 });
  const insets = useSafeAreaInsets();

  if (isLoading) return <BranchesSkeleton />;

  const branches = (data as any)?.branches ?? [];
  const activeCount = branches.filter((b: any) => b.isActive).length;

  return (
    <InternalScreen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="section-wrapper gap-6 pt-6">
          {/* Header */}
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1 gap-1">
              <Text className="font-primary text-3xl text-foreground">Branches</Text>
              <Text className="font-secondary text-sm leading-7 text-muted-foreground">
                {branches.length} location{branches.length !== 1 ? "s" : ""} · {activeCount} active
              </Text>
            </View>
            <Button href="/admin/branches/new" size="sm">
              <AppIcon name="PlusIcon" size="sm" variant="accent" />
              New
            </Button>
          </View>

          {/* Stats */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <StatCard label="Total" value={branches.length} icon="IconBuildingHospital" iconVariant="primary" />
            </View>
            <View className="flex-1">
              <StatCard label="Active" value={activeCount} icon="CheckCircleIcon" iconVariant="success" />
            </View>
          </View>

          {/* List */}
          <SectionCard
            title="Branch Locations"
            description="All practice locations and their status."
            className="shadow-soft"
            contentClassName="gap-3"
          >
            {branches.length ? (
              branches.map((b: any) => {
                const addressParts = [b.address, b.city, b.state, b.zipCode].filter(Boolean);
                const address = addressParts.join(", ");

                return (
                  <GradientCard key={b.id} variant={b.isActive ? "info" : "secondary"}>
                    <Button
                      href={`/admin/branches/${b.id}` as any}
                      variant="ghost"
                      className="p-0 flex-1"
                    >
                      <View className="flex-row items-start gap-3 flex-1">
                        <View className="size-10 rounded-2xl bg-primary/10 items-center justify-center mt-0.5">
                          <AppIcon
                            name="IconBuildingHospital"
                            size="sm"
                            variant={b.isActive ? "primary" : "secondary"}
                          />
                        </View>

                        <View className="flex-1 gap-1">
                          <View className="flex-row items-start justify-between gap-2">
                            <Text className="flex-1 font-body-semibold text-sm text-foreground">
                              {b.name}
                            </Text>
                            <Badge variant={b.isActive ? "success" : "secondary"}>
                              {b.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </View>

                          {address ? (
                            <Text className="font-secondary text-xs text-muted-foreground" numberOfLines={2}>
                              {address}
                            </Text>
                          ) : null}

                          <View className="flex-row flex-wrap gap-3 mt-0.5">
                            {b.phone ? (
                              <Text className="font-secondary text-xs text-muted-foreground">{b.phone}</Text>
                            ) : null}
                            {b.email ? (
                              <Text className="font-secondary text-xs text-muted-foreground" numberOfLines={1}>
                                {b.email}
                              </Text>
                            ) : null}
                          </View>
                        </View>

                        <AppIcon name="ChevronRightIcon" size="sm" variant="primary" />
                      </View>
                    </Button>
                  </GradientCard>
                );
              })
            ) : (
              <Empty>
                <EmptyMedia variant="icon">
                  <AppIcon name="IconBuildingHospital" size="md" variant="primary" />
                </EmptyMedia>
                <EmptyHeader>
                  <EmptyTitle>No branches</EmptyTitle>
                  <EmptyDescription>Branch locations will appear here once added.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </SectionCard>
        </View>
      </ScrollView>
    </InternalScreen>
  );
}
