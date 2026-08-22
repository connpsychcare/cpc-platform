import { noIndexMetadata } from "@/lib/seo";
import TestimonialsClient from "./page-client";

export const metadata = noIndexMetadata("Share Your Experience", "/patient/testimonials");

export default function Page() {
  return <TestimonialsClient />;
}
