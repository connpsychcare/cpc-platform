import { noIndexMetadata } from "@/lib/seo";
import TreatmentPlanDetailClient from "./page-client";

export const metadata = noIndexMetadata(
  "Treatment Plan",
  "/patient/care/treatment-plans",
);

export default async function Page({
  params,
}: PageProps<"/patient/care/treatment-plans/[planId]">) {
  const { planId } = await params;
  return <TreatmentPlanDetailClient planId={planId} />;
}
