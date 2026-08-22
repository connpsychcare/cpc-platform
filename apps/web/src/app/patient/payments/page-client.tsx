"use client";

import { CreditCard, DollarSign, RefreshCcw } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";
import SectionCard from "@workspace/ui/shared/SectionCard";
import StatCard from "@workspace/ui/shared/StatCard";
import { cn } from "@workspace/ui/lib/utils";
import { usePayments } from "@/hooks/healthcare";
import { formatDate, formatPricePrecise } from "@workspace/shared/utils";

const paymentStatusConfig: Record<
  string,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "border-warning/30 bg-warning/10 text-warning",
  },
  succeeded: {
    label: "Paid",
    className: "border-success/25 bg-success/10 text-success",
  },
  failed: {
    label: "Failed",
    className: "border-destructive/25 bg-destructive/10 text-destructive",
  },
  refunded: {
    label: "Refunded",
    className: "border-border bg-muted/40 text-muted-foreground",
  },
};

export default function PaymentsPage() {
  const { data, isLoading } = usePayments({});

  const payments = data?.payments ?? [];
  const paid = payments.filter((p) => p.status === "succeeded");
  const pending = payments.filter((p) => p.status === "pending");
  const totalPaid = paid.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="container mx-auto space-y-6 p-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Total Paid"
          value={formatPricePrecise(totalPaid)}
          className="border-primary/20 bg-linear-to-br from-primary/10 to-card"
        />
        <StatCard
          label="Pending Payments"
          value={pending.length}
          className="border-warning/30 bg-linear-to-br from-warning/15 to-card"
        />
        <StatCard
          label="Total Transactions"
          value={payments.length}
          className="border-success/25 bg-linear-to-br from-success/15 to-card"
        />
      </div>

      {/* List */}
      <SectionCard
        title={
          <span className="flex items-center gap-2">
            <CreditCard className="size-5" />
            Payment History
          </span>
        }
        description="A record of all payments made for your appointments."
        contentClassName="space-y-3"
      >
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2 rounded-2xl border p-4">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}

        {!isLoading && !payments.length && (
          <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed text-center">
            <DollarSign className="size-8 text-muted-foreground" />
            <div>
              <p className="font-medium">No payments yet</p>
              <p className="text-sm text-muted-foreground">
                Payments for your appointments will appear here.
              </p>
            </div>
          </div>
        )}

        {payments.map((payment) => {
          const status =
            paymentStatusConfig[payment.status] ?? paymentStatusConfig.pending;

          return (
            <div key={payment.id} className="rounded-2xl border p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                        status.className,
                      )}
                    >
                      {status.label}
                    </span>
                    <Badge variant="info" className="capitalize text-xs">
                      {payment.provider}
                    </Badge>
                    {payment.methodType && (
                      <Badge variant="default" className="capitalize text-xs">
                        {payment.methodType}
                      </Badge>
                    )}
                  </div>
                  <p className="font-primary text-2xl font-extrabold tracking-tight text-foreground">
                    {formatPricePrecise(payment.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate((payment as any).createdAt, { mode: "date" })}
                    {payment.transactionId && (
                      <> · Ref: {payment.transactionId}</>
                    )}
                  </p>
                </div>

                {payment.status === "succeeded" && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <RefreshCcw className="size-3.5" />
                    <span>Contact support for refunds</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </SectionCard>
    </div>
  );
}
