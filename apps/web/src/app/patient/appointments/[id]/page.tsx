import { noIndexMetadata } from "@/lib/seo";
import AppointmentDetailClient from "./page-client";

export const metadata = noIndexMetadata(
  "Appointment Details",
  "/patient/appointments",
);

export default async function Page({
  params,
}: PageProps<"/patient/appointments/[id]">) {
  const { id } = await params;
  return <AppointmentDetailClient id={id} />;
}
