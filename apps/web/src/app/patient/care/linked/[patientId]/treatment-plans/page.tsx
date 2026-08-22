import { noIndexMetadata } from "@/lib/seo";
import LinkedTreatmentPlansClient from "./page-client";

export const metadata = noIndexMetadata(
  "Linked Patient Treatment Plans",
  "/patient/care/linked",
);

export default async function Page({
  params,
}: PageProps<"/patient/care/linked/[patientId]/treatment-plans">) {
  const { patientId } = await params;
  return <LinkedTreatmentPlansClient patientId={patientId} />;
}
