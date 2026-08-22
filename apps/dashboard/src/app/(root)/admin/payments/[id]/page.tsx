"use client";

import React from "react";
import { toast } from "sonner";
import { ChevronDown, CheckCircle, Clock, XCircle, RotateCcw } from "lucide-react";

import type { PaymentResponse } from "@workspace/contracts/payment";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Input } from "@workspace/ui/components/input";
import {
  type RelatedEntityConfig,
  type SectionConfig,
  GenericDetailsPage,
} from "@workspace/ui/shared/GenericDetailsPage";
import { useConfirm } from "@workspace/ui/hooks/use-confirm";
import { usePayment, useUpdatePayment } from "@/hooks/payment";
import { formatDate, formatPrice } from "@workspace/shared/utils";
import { getStatusVariant } from "@workspace/ui/lib/utils";

const formatCurrency = (value?: number) => formatPrice(value, { fallback: "Not set" });
const formatDateTime = (value?: string) => formatDate(value, { mode: "datetime", fallback: "Not recorded" });
const formatLabel = (value?: string) =>
  value ? value.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()) : "Not set";
const renderBadge = (value?: string) => (
  <Badge variant={getStatusVariant(value ?? "")} className="capitalize">{formatLabel(value)}</Badge>
);

const sections: SectionConfig<PaymentResponse>[] = [
  {
    title: "Payment Overview",
    description: () => "Core transaction data, payment method details, and linked target information.",
    columns: 3,
    fields: [
      { label: "Amount", accessor: "amount", render: (v) => formatCurrency(v) },
      { label: "Status", accessor: "status", render: (v) => renderBadge(v) },
      { label: "Provider", accessor: "provider", render: (v) => renderBadge(v) },
      { label: "Method", accessor: "methodType", render: (v) => renderBadge(v) },
      { label: "Transaction ID", accessor: "transactionId" },
      { label: "Appointment", accessor: (d) => d.appointment?.appointmentNumber ?? "No linked appointment" },
      { label: "Failure Message", accessor: "failureMessage" },
      { label: "Created At", accessor: "createdAt", render: (v) => formatDateTime(v) },
      { label: "Updated At", accessor: "updatedAt", render: (v) => formatDateTime(v) },
    ],
  },
  {
    title: "Settlement and Refund Tracking",
    description: () => "Amounts and timestamps used for payout visibility and refund reconciliation.",
    columns: 3,
    fields: [
      { label: "Paid At", accessor: "paidAt", render: (v) => formatDateTime(v) },
      { label: "Refunded At", accessor: "refundedAt", render: (v) => formatDateTime(v) },
      { label: "Commission Amount", accessor: "commissionAmount", render: (v) => formatCurrency(v) },
      { label: "Provider Net Amount", accessor: "providerNetAmount", render: (v) => formatCurrency(v) },
      { label: "Refund Count", accessor: (d) => `${d.refunds?.length ?? 0} refund request(s)` },
    ],
  },
];

const relatedEntities: RelatedEntityConfig<PaymentResponse>[] = [
  {
    title: "Refund Requests",
    dataKey: "refunds",
    columns: [
      { header: "Amount", accessor: (item) => formatCurrency(item.amount) },
      { header: "Status", accessor: (item) => formatLabel(item.status) },
      { header: "Reason", accessor: (item) => item.reason ?? "No reason provided" },
      { header: "Requested", accessor: (item) => formatDateTime(item.requestedAt) },
      { header: "Processed", accessor: (item) => formatDateTime(item.processedAt) },
    ],
  },
];

const renderHeader = (data: PaymentResponse) => (
  <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {renderBadge(data.status)}
        {renderBadge(data.provider)}
        {renderBadge(data.methodType)}
      </div>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">{formatCurrency(data.amount)}</h2>
        <p className="text-sm text-muted-foreground">
          {data.appointment?.appointmentNumber ?? "Standalone payment record"}
        </p>
      </div>
    </div>
  </div>
);

type PaymentStatus = "pending" | "succeeded" | "failed" | "refunded";

const statusActions: { status: PaymentStatus; label: string; icon: React.ReactNode; destructive?: boolean }[] = [
  { status: "succeeded", label: "Mark Succeeded", icon: <CheckCircle className="size-4" /> },
  { status: "pending", label: "Mark Pending", icon: <Clock className="size-4" /> },
  { status: "failed", label: "Mark Failed", icon: <XCircle className="size-4" /> },
  { status: "refunded", label: "Mark Refunded", icon: <RotateCcw className="size-4" />, destructive: true },
];

const Page = ({ params }: PageProps<"/admin/payments/[id]">) => {
  const { id } = React.use(params);
  const { updatePaymentStatus, createRefund, isPending } = useUpdatePayment(id);
  const { confirm } = useConfirm();
  const [refundAmount, setRefundAmount] = React.useState("");
  const [refundReason, setRefundReason] = React.useState("");

  const handleStatusChange = async (status: PaymentStatus, label: string, destructive?: boolean) => {
    if (destructive) {
      const ok = await confirm({
        title: label,
        description: "This will mark the payment as refunded. This cannot be undone.",
        confirmText: label,
      });
      if (!ok) return;
    }
    try {
      await updatePaymentStatus({ paymentId: id, status });
      toast.success(`Payment marked as ${status}.`);
    } catch (error: any) {
      toast.error("Failed to update payment", { description: error?.message });
    }
  };

  const submitRefund = async () => {
    if (!refundAmount) return;
    try {
      await createRefund({ paymentId: id, amount: Number(refundAmount), reason: refundReason || undefined });
      toast.success("Refund request created.");
      setRefundAmount("");
      setRefundReason("");
    } catch (error: any) {
      toast.error("Failed to create refund", { description: error?.message });
    }
  };

  return (
    <GenericDetailsPage
      entityId={id}
      canEdit={false}
      entityName="Payment"
      description="Track transaction status, review settlement amounts, and create refund requests."
      useQuery={usePayment}
      sections={sections}
      relatedEntities={relatedEntities}
      renderHeader={renderHeader}
      renderActions={() => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" disabled={isPending}>
              Change Status <ChevronDown className="ml-1 size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Update Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {statusActions.map((action) => (
              <DropdownMenuItem
                key={action.status}
                onClick={() => handleStatusChange(action.status, action.label, action.destructive)}
                className={action.destructive ? "text-destructive focus:text-destructive" : ""}
              >
                {action.icon}
                {action.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    >
      {() => (
        <Card className="overflow-hidden border-border/70 shadow-sm">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle>Create Refund Request</CardTitle>
            <CardDescription>
              Log a refund amount and optional reason without leaving the payment details page.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 p-6 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <div className="space-y-2">
              <p className="text-sm font-medium">Refund Amount</p>
              <Input value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)} placeholder="Refund amount" type="number" min={0} />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Refund Reason</p>
              <Input value={refundReason} onChange={(e) => setRefundReason(e.target.value)} placeholder="Reason for refund" />
            </div>
            <Button type="button" variant="outline" onClick={submitRefund} disabled={isPending || !refundAmount}>
              Create Refund
            </Button>
          </CardContent>
        </Card>
      )}
    </GenericDetailsPage>
  );
};

export default Page;
