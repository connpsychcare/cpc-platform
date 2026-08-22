import { noIndexMetadata } from "@/lib/seo";
import CaregiversClient from "./page-client";

export const metadata = noIndexMetadata("Caregiver Access", "/patient/caregivers");

export default function Page() {
  return <CaregiversClient />;
}
