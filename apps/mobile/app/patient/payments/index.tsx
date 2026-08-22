import { Text, View } from "react-native";

import { AppIcon } from "@/components/ui/app-icon";
import { Badge } from "@/components/ui/badge";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { PatientScreen } from "@/components/shared/patient-screen";
import { GradientCard } from "@/components/shared/gradient-card";
import { SectionCard } from "@/components/shared/section-card";
import { StatCard } from "@/components/shared/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePayments } from "@/hooks/use-healthcare";
import { formatDate, formatPricePrecise } from "@workspace/shared/utils";
import { formatStatusLabel, getPaymentStatusMeta } from "@/lib/patient-status";

function PaymentListSkeleton() {
  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pt-6">
        <View className="gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-24 w-full rounded-[28px]" />
          ))}
        </View>
        <Skeleton className="h-96 w-full rounded-[28px]" />
      </View>
    </PatientScreen>
  );
}

export default function PatientPaymentsRoute() {
  const { data, isLoading } = usePayments({});

  if (isLoading) {
    return <PaymentListSkeleton />;
  }

  const payments = data?.payments ?? [];
  const paidPayments = payments.filter((item) => item.status === "succeeded");
  const pendingPayments = payments.filter((item) => item.status === "pending");
  const totalPaid = paidPayments.reduce((sum, item) => sum + item.amount, 0);

  return (
    <PatientScreen>
      <View className="section-wrapper gap-6 pt-6">
        <View className="gap-2">
          <Text className="font-primary text-3xl text-foreground">
            Payment History
          </Text>
          <Text className="font-secondary text-sm leading-7 text-muted-foreground">
            Review your completed, pending, and refunded transactions.
          </Text>
        </View>

        <View className="gap-4">
          <StatCard
            label="Total Paid"
            value={formatPricePrecise(totalPaid)}
            iconVariant="info"
            className="shadow-soft"
          />
          <StatCard
            label="Pending Payments"
            value={pendingPayments.length}
            iconVariant="warning"
            className="shadow-soft"
          />
          <StatCard
            label="Total Transactions"
            value={payments.length}
            iconVariant="primary"
            className="shadow-soft"
          />
        </View>

        <SectionCard
          title="Payments"
          description="A record of payments related to your appointments and care."
          className="shadow-soft"
          contentClassName="gap-3"
        >
          {payments.length ? (
            payments.map((payment) => {
              const status = getPaymentStatusMeta(payment.status);

              return (
                <GradientCard
                  key={payment.id}
                  variant={status.variant}
                >
                  <View className="gap-3">
                    <View className="flex-row items-center justify-between gap-3">
                      <View className="flex-row flex-wrap items-center gap-2">
                        <Badge variant={status.variant}>{status.label}</Badge>
                        <Badge variant="info">
                          {formatStatusLabel(payment.provider)}
                        </Badge>
                        {payment.methodType ? (
                          <Badge variant="muted">
                            {formatStatusLabel(payment.methodType)}
                          </Badge>
                        ) : null}
                      </View>
                    </View>

                    <View>
                      <Text className="font-primary text-2xl text-foreground">
                        {formatPricePrecise(payment.amount)}
                      </Text>
                      <Text className="mt-1 font-secondary text-sm text-muted-foreground">
                        {formatDate(payment.createdAt as string, {
                          mode: "date",
                        })}
                      </Text>
                      {payment.transactionId ? (
                        <Text className="mt-1 font-secondary text-sm text-muted-foreground">
                          Ref: {payment.transactionId}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </GradientCard>
              );
            })
          ) : (
            <Empty>
              <EmptyMedia variant="icon">
                <AppIcon name="IconCreditCard" size="md" variant="primary" />
              </EmptyMedia>
              <EmptyHeader>
                <EmptyTitle>No payments yet</EmptyTitle>
                <EmptyDescription>
                  Payments for your appointments will appear here.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </SectionCard>
      </View>
    </PatientScreen>
  );
}
