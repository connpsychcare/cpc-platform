import AboutPageClient from "./page-client";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata.about;

export default function AboutPage() {
  return <AboutPageClient />;
}
