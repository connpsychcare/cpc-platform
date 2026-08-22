import CareersPageClient from "./page-client";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata.careers;

export default function CareersPage() {
  return <CareersPageClient />;
}
