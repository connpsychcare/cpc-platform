import { noIndexMetadata } from "@/lib/seo";
import PatientOverviewClient from "./page-client";

export const metadata = noIndexMetadata("Patient Dashboard", "/patient");

export default function Page() {
  return <PatientOverviewClient />;
}
