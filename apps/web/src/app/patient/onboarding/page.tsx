import { noIndexMetadata } from "@/lib/seo";
import OnboardingClient from "./page-client";

export const metadata = noIndexMetadata("Onboarding Status", "/patient/onboarding");

export default function Page() {
  return <OnboardingClient />;
}
