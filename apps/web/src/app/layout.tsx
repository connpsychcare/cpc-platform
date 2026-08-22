import "@workspace/ui/globals.css";
import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { DM_Sans, Manrope } from "next/font/google";
import ProviderWrapper from "@workspace/ui/provider-wrapper";

import {
  brandName,
  JsonLd,
  organizationJsonLd,
  publicPageMetadata,
  siteUrl,
  websiteJsonLd,
} from "@/lib/seo";

const primaryFont = Manrope({
  variable: "--font-primary",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const secondaryFont = DM_Sans({
  variable: "--font-secondary",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  ...publicPageMetadata.home,
  metadataBase: new URL(siteUrl),
  applicationName: brandName,
  appleWebApp: {
    capable: true,
    title: brandName,
    statusBarStyle: "default",
  },
  title: {
    default: `${brandName} | Psychiatric Care for Adults, Children & Adolescents`,
    template: `%s | ${brandName}`,
  },
  category: "healthcare",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FDFAF4" },
    { media: "(prefers-color-scheme: dark)", color: "#02060F" },
  ],
};

const RootLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Search Console Verification */}
        <meta
          name="google-site-verification"
          content="cfev3fPW7p8jqXuHflScVKvDfWTGWRI9rVCvY0DGvJ8"
        />
      </head>
      <body
        className={`${primaryFont.variable} ${secondaryFont.variable} font-sans antialiased`}
      >
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <ProviderWrapper>{children}</ProviderWrapper>
      </body>
      <GoogleAnalytics gaId="G-SW2SHCBG4D" />
    </html>
  );
};

export default RootLayout;
