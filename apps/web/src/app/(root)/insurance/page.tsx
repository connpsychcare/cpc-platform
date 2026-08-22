import InsurancePageClient from "./page-client";
import { faqJsonLd, JsonLd, publicPageMetadata } from "@/lib/seo";
import { publicInsuranceContent } from "@workspace/shared/constants";

export const metadata = publicPageMetadata.insurance;

export default function InsurancePage() {
  return (
    <>
      <JsonLd data={faqJsonLd(publicInsuranceContent.faqs)} />
      <InsurancePageClient />
    </>
  );
}
