import { noIndexMetadata } from "@/lib/seo";
import PaymentsClient from "./page-client";

export const metadata = noIndexMetadata("Payments", "/patient/payments");

export default function Page() {
  return <PaymentsClient />;
}
