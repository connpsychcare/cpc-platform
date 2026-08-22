import ContactPageClient from "./page-client";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata.contact;

export default function ContactPage() {
  return <ContactPageClient />;
}
