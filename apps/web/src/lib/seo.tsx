import type { Metadata } from "next";
import {
  publicPractice,
  publicServices,
  publicSocialLinks,
} from "@workspace/shared/constants";

export const siteUrl = "https://connectedpsychiatriccare.com";
export const brandName = publicPractice.brandName;
export const legalName = publicPractice.legalName;
export const siteImage = "/images/icon.png";

export const seoKeywords = [
  "Connected Psychiatric Care",
  "psychiatric care California",
  "psychiatrist California",
  "telehealth psychiatry",
  "online psychiatrist",
  "mental health care California",
  "psychiatric evaluation",
  "medication management psychiatry",
  "depression treatment California",
  "anxiety treatment California",
  "ADHD psychiatrist California",
  "bipolar disorder treatment",
  "PTSD psychiatrist",
  "child psychiatry California",
  "adolescent psychiatrist",
  "psychiatric nurse practitioner California",
  "telepsychiatry California",
  "Connected Psychiatric Care patient portal",
];

const absoluteUrl = (path = "/") => new URL(path, siteUrl).toString();

export function createMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  image = siteImage,
  noIndex = false,
  absoluteTitle = false,
}: {
  /** Page name only. The root layout appends the brand via its title template, so
   *  including the brand here would print it twice. */
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
  /** Opt out of the root title template, for pages that lead with the brand themselves. */
  absoluteTitle?: boolean;
}): Metadata {
  const canonical = absoluteUrl(path);
  const imageUrl = image.startsWith("http") ? image : absoluteUrl(image);
  // Social cards have no title template, so they carry the brand explicitly.
  const socialTitle = absoluteTitle ? title : `${title} | ${brandName}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: [...seoKeywords, ...keywords],
    alternates: {
      canonical,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: canonical,
      siteName: brandName,
      title: socialTitle,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${brandName} - Psychiatric Care in California`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [imageUrl],
    },
  };
}

export const publicPageMetadata = {
  home: createMetadata({
    title: `${brandName} | Psychiatric Care for Adults & Adolescents`,
    absoluteTitle: true,
    description:
      "Connected Psychiatric Care provides compassionate, evidence-based psychiatric services for adults and adolescents in California - entirely via secure telehealth.",
    path: "/",
    keywords: ["psychiatrist near me", "telehealth psychiatry California"],
  }),
  about: createMetadata({
    title: "About Our Practice & Providers",
    description:
      "Learn about Connected Psychiatric Care, our licensed psychiatric providers, and our commitment to whole-person, evidence-based mental health care in California.",
    path: "/about",
    keywords: ["about Connected Psychiatric Care", "psychiatric clinic California"],
  }),
  services: createMetadata({
    title: "Psychiatric Services",
    description:
      "Explore Connected Psychiatric Care services including psychiatric evaluation, medication management, telehealth psychiatry, depression and anxiety treatment, ADHD, and child and adolescent psychiatry.",
    path: "/services",
    keywords: publicServices.map((service) => service.title),
  }),
  providers: createMetadata({
    title: "Our Providers",
    description:
      "Meet the licensed psychiatric nurse practitioners and psychiatrists at Connected Psychiatric Care, dedicated to compassionate evidence-based mental health care.",
    path: "/providers",
    keywords: ["psychiatric providers California", "psychiatrist profiles"],
  }),
  resources: createMetadata({
    title: "Mental Health Resources",
    description:
      "Read patient-friendly guides about psychiatric care, telehealth, ADHD, anxiety, depression, insurance, and what to expect when starting mental health treatment.",
    path: "/resources",
    keywords: ["mental health resources", "psychiatric care guide"],
  }),
  contact: createMetadata({
    title: "Contact Us & Request an Appointment",
    description:
      "Contact Connected Psychiatric Care to ask about psychiatric services, telehealth, insurance, or to request your first appointment in California.",
    path: "/contact",
    keywords: ["contact psychiatrist California", "book psychiatric appointment"],
  }),
  insurance: createMetadata({
    title: "Insurance for Psychiatric Care",
    description:
      "Review accepted insurance plans, authorization steps, self-pay options, and benefit verification support for psychiatric services in California.",
    path: "/insurance",
    keywords: ["psychiatric insurance California", "telehealth psychiatry insurance", "mental health prior authorization"],
  }),
  careers: createMetadata({
    title: "Careers & Open Positions",
    description:
      "Explore career opportunities at Connected Psychiatric Care. We are hiring licensed psychiatric providers, nurse practitioners, and support staff in California.",
    path: "/careers",
    keywords: ["psychiatric jobs California", "PMHNP jobs", "mental health careers"],
  }),
};

export const noIndexMetadata = (title: string, path: string) =>
  createMetadata({
    title,
    description:
      "Secure account, patient portal, or care workflow for Connected Psychiatric Care.",
    path,
    noIndex: true,
  });

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "LocalBusiness"],
    "@id": `${siteUrl}/#organization`,
    name: brandName,
    alternateName: [legalName],
    legalName,
    url: siteUrl,
    logo: absoluteUrl("/icon.png"),
    image: absoluteUrl(siteImage),
    description:
      "Connected Psychiatric Care provides compassionate, evidence-based psychiatric evaluation, medication management, and telehealth mental health services for adults and adolescents in California.",
    email: publicPractice.supportEmail,
    telephone: publicPractice.primaryPhone.display,
    address: {
      "@type": "PostalAddress",
      addressLocality: "California",
      addressRegion: "CA",
      addressCountry: "US",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday"],
        opens: "09:00",
        closes: "14:00",
      },
    ],
    sameAs: publicSocialLinks.map((link) => link.href),
    areaServed: ["California", "United States"],
    medicalSpecialty: [
      "Psychiatry",
      "Child and Adolescent Psychiatry",
      "Telehealth Psychiatry",
      "Medication Management",
    ],
    availableChannel: {
      "@type": "ServiceChannel",
      serviceType: "Online",
      availableLanguage: "English",
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: brandName,
    url: siteUrl,
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/resources?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function serviceJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${brandName} psychiatric services`,
    itemListElement: publicServices.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/services#${service.slug}`),
      item: {
        "@type": "MedicalTherapy",
        name: service.title,
        description: service.description,
        provider: {
          "@id": `${siteUrl}/#organization`,
        },
      },
    })),
  };
}

export function faqJsonLd(
  faqs: readonly { question?: string; q?: string; answer?: string; a?: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question ?? faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer ?? faq.a,
      },
    })),
  };
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
