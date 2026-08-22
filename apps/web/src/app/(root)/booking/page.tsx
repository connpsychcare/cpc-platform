import BookingPageClient from "./page-client";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata("Request an Appointment", "/booking");

export default function BookingPage() {
  return <BookingPageClient />;
}
