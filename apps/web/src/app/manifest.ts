import type { MetadataRoute } from "next";
import { brandName, siteUrl } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${brandName} - Psychiatric Care`,
    short_name: brandName,
    description:
      "Evidence-based psychiatric care, patient portal, telehealth appointment booking, and mental health resources from Connected Psychiatric Care.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#FDFAF4",
    theme_color: "#1659DB",
    categories: ["health", "medical", "education"],
    icons: [
      {
        src: `${siteUrl}/icon.png`,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
