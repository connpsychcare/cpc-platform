import { noIndexMetadata } from "@/lib/seo";
import LinkedSessionNotesClient from "./page-client";

export const metadata = noIndexMetadata(
  "Linked Patient Session Notes",
  "/patient/care/linked",
);

export default async function Page({
  params,
}: PageProps<"/patient/care/linked/[patientId]/session-notes">) {
  const { patientId } = await params;
  return <LinkedSessionNotesClient patientId={patientId} />;
}
