import { useState } from "react";
import { Image } from "expo-image";
import { Text, View } from "react-native";
import { ShieldCheck } from "lucide-react-native";
import { publicInsurers } from "@workspace/shared/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function InsurerLogo({
  domain,
  name,
  abbr,
  color,
}: {
  domain: string;
  name: string;
  abbr: string;
  color: string;
}) {
  const [failed, setFailed] = useState(false);
  const src = `https://www.google.com/s2/favicons?domain=${domain}&sz=256`;

  if (failed) {
    return (
      <View
        className="size-full items-center justify-center rounded-full"
        style={{ backgroundColor: color }}
      >
        <Text className="font-body-semibold text-[10px] tracking-wide text-white">
          {abbr}
        </Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: src }}
      style={{ width: "100%", height: "100%", padding: 4 }}
      contentFit="contain"
      onError={() => setFailed(true)}
    />
  );
}

function InsurerCard({
  insurer,
}: {
  insurer: (typeof publicInsurers)[number];
}) {
  const isPending = insurer.status === "pending";
  return (
    <View
      className="flex-row items-center gap-3 rounded-2xl border border-border bg-card p-4"
      style={isPending ? { opacity: 0.8 } : undefined}
    >
      <View
        className="size-10 shrink-0 overflow-hidden rounded-full bg-white"
        style={{ borderWidth: 1, borderColor: "rgba(0,0,0,0.08)" }}
      >
        <InsurerLogo
          domain={insurer.domain}
          name={insurer.name}
          abbr={insurer.abbr}
          color={insurer.color}
        />
      </View>
      <View className="min-w-0 flex-1">
        <Text
          numberOfLines={1}
          className="font-body-semibold text-sm text-foreground"
        >
          {insurer.name}
        </Text>
        <Text
          numberOfLines={1}
          className="mt-0.5 font-secondary text-xs text-muted-foreground"
        >
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

export default function InsuranceTrustBar() {
  const half = Math.ceil(publicInsurers.length / 2);
  const col1 = publicInsurers.slice(0, half);
  const col2 = publicInsurers.slice(half);

  return (
    <View className="border-b border-border bg-secondary/20 py-8">
      <View className="section-wrapper gap-6">
        {/* Header row */}
        <View className="flex-row items-center justify-between gap-3">
          <View className="flex-row items-center gap-3">
            <View className="size-10 items-center justify-center rounded-2xl bg-primary/10">
              <ShieldCheck size={20} color="var(--primary)" strokeWidth={1.75} />
            </View>
            <View>
              <Text className="font-body-semibold text-xs uppercase tracking-widest text-muted-foreground">
                Insurance
              </Text>
              <Text className="font-primary text-lg leading-tight text-foreground">
                Accepted Insurance Plans
              </Text>
            </View>
          </View>
          <Button href="/insurance" variant="link" className="shrink-0">
            Check coverage
          </Button>
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
      </View>
    </View>
  );
}
