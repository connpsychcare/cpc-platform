import { noIndexMetadata } from "@/lib/seo";
import AppointmentsClient from "./page-client";

export const metadata = noIndexMetadata("My Appointments", "/patient/appointments");

export default function Page() {
  return <AppointmentsClient />;
}
