import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { publicHomeTeamContent } from "@workspace/shared/constants";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePublicProviders } from "@/hooks/use-public-content";

const getInitials = (name?: string) =>
  (name ?? "CPC")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function ProviderPhotoPlaceholder({ name }: { name?: string }) {
  return (
    <LinearGradient
      colors={["rgba(0,201,167,0.15)", "rgba(21,44,68,0.12)"]}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View className="size-full flex-col items-center justify-center gap-3 px-4">
        <View className="size-16 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
          <Text className="font-primary text-2xl text-primary">
            {getInitials(name)}
          </Text>
        </View>
        <Text className="max-w-28 text-center font-body-semibold text-[10px] uppercase tracking-widest text-muted-foreground">
          Photo coming soon
        </Text>
      </View>
    </LinearGradient>
  );
}

function TeamSection() {
  const { data, isLoading } = usePublicProviders();
  const router = useRouter();
  const members =
    data?.slice(0, 6).map((provider) => ({
      id: provider.id,
      name: provider.user?.displayName,
      role: [provider.title, ...(provider.specialties ?? []).slice(0, 1)]
        .filter(Boolean)
        .join(", "),
      image: provider.user?.avatar?.url,
      slug: provider.slug,
    })) ?? [];

  if (!isLoading && !members.length) {
    return null;
  }

  const source = isLoading
    ? Array.from({ length: 3 }, (_, i) => ({
        id: String(i),
        name: undefined,
        role: undefined,
        image: undefined,
        slug: undefined,
      }))
    : members;

  return (
    <View className="mt-12 bg-secondary py-12">
      <View className="section-wrapper">
        <View className="gap-4">
          <SectionHeader
            title={publicHomeTeamContent.title}
            description={publicHomeTeamContent.description}
          />
          <Button href="/providers" variant="outline">
            {publicHomeTeamContent.viewAllLabel}
          </Button>
        </View>

        <View className="mt-6 gap-4">
          {source.map((member) => (
            <Pressable
              key={member.id}
              onPress={() => {
                if (member.slug) router.push(`/providers/${member.slug}` as any);
              }}
              disabled={!member.slug || isLoading}
            >
            <Card className="overflow-hidden pt-0 shadow-soft">
              <View className="relative h-52 overflow-hidden bg-muted">
                {isLoading ? (
                  <View className="size-full animate-pulse bg-secondary/70" />
                ) : member.image ? (
                  <Image
                    source={{ uri: member.image }}
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
            </Pressable>
          ))}
        </View>

        {!isLoading && members.length === 0 && (
          <Card className="mt-4 border-dashed">
            <CardContent className="py-8">
              <Text className="text-center font-secondary text-sm text-muted-foreground">
                Our provider profiles will be available soon.
              </Text>
            </CardContent>
          </Card>
        )}
      </View>
    </View>
  );
}

export default TeamSection;
