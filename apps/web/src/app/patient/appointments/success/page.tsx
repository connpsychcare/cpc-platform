import { noIndexMetadata } from "@/lib/seo";
import AppointmentSuccessClient from "./page-client";

export const metadata = noIndexMetadata("Appointment Requested", "/patient/appointments/success");

export default function Page() {
  return <AppointmentSuccessClient />;
}
