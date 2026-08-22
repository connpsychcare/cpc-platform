import { noIndexMetadata } from "@/lib/seo";
import ProgressReportsClient from "./page-client";

export const metadata = noIndexMetadata("Progress Reports", "/patient/care/progress-reports");

export default function Page() {
  return <ProgressReportsClient />;
}
