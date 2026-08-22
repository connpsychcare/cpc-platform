import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { InternalScreen } from "@/components/internal/internal-screen";
import { SectionCard } from "@/components/shared/section-card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useMyStaffProfile } from "@/hooks/use-healthcare";
import { getInitials } from "@workspace/shared/utils";

function ProfileSkeleton() {
  return (
    <InternalScreen>
      <View className="section-wrapper gap-6 pt-6">
        <Skeleton className="h-20 w-20 rounded-full" />
        <Skeleton className="h-48 w-full rounded-[28px]" />
      </View>
    </InternalScreen>
  );
}

function LabeledValue({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <View className="flex-row gap-3 py-2">
      <Text className="w-32 font-secondary text-sm text-muted-foreground">{label}</Text>
      <Text className="flex-1 font-secondary text-sm text-foreground">{value}</Text>
    </View>
  );
}

export default function StaffProfileRoute() {
  const { data: profile, isLoading } = useMyStaffProfile();
  const insets = useSafeAreaInsets();

  if (isLoading) return <ProfileSkeleton />;
  if (!profile) return null;

  const name = profile.user?.displayName ?? "Staff";
  const initials = getInitials(name);

  return (
    <InternalScreen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="section-wrapper gap-6 pt-6">
          <Text className="font-primary text-3xl text-foreground">My Profile</Text>

          {/* ── Header ─────────────────────────────────────────── */}
          <View className="flex-row items-center gap-4">
            <View className="flex-center size-20 rounded-full bg-primary/10">
              <Text className="font-primary text-2xl text-primary">{initials}</Text>
            </View>
            <View className="flex-1">
              <Text className="font-primary text-xl text-foreground">{name}</Text>
              <Text className="font-secondary text-sm text-muted-foreground">{profile.title}</Text>
              {profile.user?.email ? (
                <Text className="font-secondary text-xs text-muted-foreground">{profile.user.email}</Text>
              ) : null}
            </View>
          </View>

          {/* ── Details ────────────────────────────────────────── */}
          <SectionCard title="Professional Info" className="shadow-soft">
            <LabeledValue label="Title" value={profile.title} />
            {(profile as any).specialty ? (
              <LabeledValue label="Specialty" value={(profile as any).specialty} />
            ) : null}
            {profile.credentials?.length ? (
              <>
                <Separator className="my-1" />
                <View className="flex-row gap-3 py-2">
                  <Text className="w-32 font-secondary text-sm text-muted-foreground">Credentials</Text>
                  <View className="flex-1 flex-row flex-wrap gap-1">
                    {profile.credentials.map((c: string) => (
                      <Badge key={c} variant="outline">{c}</Badge>
                    ))}
                  </View>
                </View>
              </>
            ) : null}
            {profile.yearsExperience ? (
              <LabeledValue label="Experience" value={`${profile.yearsExperience} years`} />
            ) : null}
          </SectionCard>

          {profile.bio ? (
            <SectionCard title="About">
              <Text className="font-secondary text-sm leading-6 text-muted-foreground">{profile.bio}</Text>
            </SectionCard>
          ) : null}

          {profile.permissions?.length ? (
            <SectionCard title="Permissions">
              <View className="flex-row flex-wrap gap-2">
                {profile.permissions.map((p: any) => (
                  <Badge key={p.module} variant="secondary">
                    {p.module.replace(/_/g, " ")}
                  </Badge>
                ))}
              </View>
            </SectionCard>
          ) : null}

          <SectionCard title="Contact">
            <LabeledValue label="Email" value={profile.user?.email} />
            <LabeledValue label="Phone" value={profile.user?.phone} />
          </SectionCard>
        </View>
      </ScrollView>
    </InternalScreen>
  );
}
