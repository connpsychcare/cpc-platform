import { noIndexMetadata } from "@/lib/seo";
import ProgressReportDetailClient from "./page-client";

export const metadata = noIndexMetadata(
  "Progress Report",
  "/patient/care/progress-reports",
);

export default async function Page({
  params,
}: PageProps<"/patient/care/progress-reports/[reportId]">) {
  const { reportId } = await params;
  return <ProgressReportDetailClient reportId={reportId} />;
}
