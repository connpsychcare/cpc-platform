import { ScrollView, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GradientCard } from "@/components/shared/gradient-card";
import { InternalScreen } from "@/components/internal/internal-screen";
import { SectionCard } from "@/components/shared/section-card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { usePayment } from "@/hooks/use-healthcare";
import { formatDate, formatPrice } from "@workspace/shared/utils";

const STATUS_VARIANTS: Record<string, AppUIVariant> = {
  succeeded: "success",
  pending: "warning",
  failed: "destructive",
  refunded: "info",
  cancelled: "secondary",
};

function PaymentDetailSkeleton() {
  return (
    <InternalScreen>
      <View className="section-wrapper gap-6 pt-6">
        <Skeleton className="h-10 w-40 rounded-full" />
        <Skeleton className="h-44 w-full rounded-[28px]" />
        <Skeleton className="h-32 w-full rounded-[28px]" />
      </View>
    </InternalScreen>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <View className="flex-row items-start gap-3 py-1.5">
      <Text className="w-32 font-secondary text-sm text-muted-foreground">{label}</Text>
      <Text className="flex-1 font-secondary text-sm text-foreground">{value}</Text>
    </View>
  );
}

export default function AdminPaymentDetailRoute() {
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const paymentId = Array.isArray(id) ? id[0] : id;
  const { data: p, isLoading } = usePayment(paymentId);
  const insets = useSafeAreaInsets();

  if (isLoading) return <PaymentDetailSkeleton />;
  if (!p) return null;

  const statusVariant = STATUS_VARIANTS[(p as any).status] ?? "secondary";
  const isSucceeded = (p as any).status === "succeeded";
  const isFailed = (p as any).status === "failed";

  return (
    <InternalScreen>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="section-wrapper gap-6 pt-6">
          <Button variant="ghost" onPress={() => router.back()}>
            <AppIcon name="ArrowLeftIcon" size="sm" variant="secondary" />
            <Text className="font-secondary text-sm text-muted-foreground">Payments</Text>
          </Button>

          <GradientCard variant={isSucceeded ? "success" : isFailed ? "destructive" : "info"}>
            <View className="gap-4">
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1 gap-1">
                  <Text className="font-secondary text-xs uppercase tracking-[1.5px] text-muted-foreground">
                    Amount
                  </Text>
                  <Text className="font-primary text-3xl text-foreground">
                    {formatPrice((p as any).amount ?? 0)}
                  </Text>
                </View>
                <Badge variant={statusVariant}>{(p as any).status}</Badge>
              </View>

              <Separator />

              <View className="flex-row items-center gap-3">
                <AppIcon name="IconCreditCard" size="sm" variant="primary" />
                <Text className="font-secondary text-sm text-muted-foreground">
                  {(p as any).provider ?? "Manual"}{" "}
                  {(p as any).method ? `· ${(p as any).method}` : ""}
                </Text>
              </View>
            </View>
          </GradientCard>

          <SectionCard
            title="Payment Details"
            className="shadow-soft"
            contentClassName="gap-0"
          >
            <DetailRow label="Date" value={(p as any).createdAt ? formatDate((p as any).createdAt, { mode: "datetime" }) : null} />
            <DetailRow label="Provider" value={(p as any).provider} />
            <DetailRow label="Method" value={(p as any).method} />
            <DetailRow label="Reference" value={(p as any).externalId ?? (p as any).referenceId} />
            <DetailRow label="Currency" value={(p as any).currency?.toUpperCase()} />
          </SectionCard>

          {(p as any).patient?.user?.displayName || (p as any).order?.id ? (
            <SectionCard
              title="Associated With"
              className="shadow-soft"
              contentClassName="gap-0"
            >
              {(p as any).patient?.user?.displayName ? (
                <DetailRow label="Patient" value={(p as any).patient.user.displayName} />
              ) : null}
              {(p as any).order?.id ? (
                <DetailRow label="Order" value={(p as any).order.orderNumber ?? (p as any).order.id.slice(-8).toUpperCase()} />
              ) : null}
              {(p as any).appointment?.id ? (
                <DetailRow label="Appointment" value={(p as any).appointment.id.slice(-8).toUpperCase()} />
              ) : null}
            </SectionCard>
          ) : null}

          {(p as any).note ? (
            <SectionCard title="Notes" className="shadow-soft">
              <Text className="font-secondary text-sm leading-6 text-muted-foreground">
                {(p as any).note}
              </Text>
            </SectionCard>
          ) : null}
        </View>
      </ScrollView>
    </InternalScreen>
  );
}
