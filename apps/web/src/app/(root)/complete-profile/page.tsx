import { noIndexMetadata } from "@/lib/seo";
import CompleteProfileClient from "./page-client";

export const metadata = noIndexMetadata("Complete Your Profile", "/complete-profile");

export default function Page() {
  return <CompleteProfileClient />;
}
