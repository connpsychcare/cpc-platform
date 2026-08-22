import ProvidersPageClient from "./page-client";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata.providers;

export default function ProvidersPage() {
  return <ProvidersPageClient />;
}
