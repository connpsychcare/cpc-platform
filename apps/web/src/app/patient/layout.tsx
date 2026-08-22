import PatientLayoutClient from "./layout-client";
import { noIndexMetadata } from "@/lib/seo";

export const metadata = noIndexMetadata("Patient Portal", "/patient");

export default function PatientLayout(props: LayoutProps<"/patient">) {
  return <PatientLayoutClient {...props} />;
}
