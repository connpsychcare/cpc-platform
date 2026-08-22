import { InternalPaymentsList } from "@/components/internal/payments-list";

export default function AdminPaymentsRoute() {
  return <InternalPaymentsList rolePrefix="/admin" />;
}
