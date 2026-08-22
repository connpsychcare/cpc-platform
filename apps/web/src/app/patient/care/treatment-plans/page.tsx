import { noIndexMetadata } from "@/lib/seo";
import TreatmentPlansClient from "./page-client";

export const metadata = noIndexMetadata("Treatment Plans", "/patient/care/treatment-plans");

export default function Page() {
  return <TreatmentPlansClient />;
}
