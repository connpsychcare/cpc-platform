import { noIndexMetadata } from "@/lib/seo";
import AssessmentsClient from "./page-client";

export const metadata = noIndexMetadata("Assessments & Forms", "/patient/care/assessments");

export default function Page() {
  return <AssessmentsClient />;
}
