import { publicPractice } from "./app";

export const publicSiteUrl = "https://connectedpsychiatriccare.com";
export const legalLastUpdated = "April 15, 2026";

export type LegalSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export const privacyPolicySections: LegalSection[] = [
  {
    title: "Information We Collect",
    paragraphs: [
      `${publicPractice.brandName} collects the information needed to operate our public website, patient portal, appointment booking flows, and patient mobile application.`,
    ],
    bullets: [
      "Contact and account details such as name, email address, phone number, mailing address, login credentials, and profile information.",
      "Patient, caregiver, scheduling, and clinical information that patients or staff provide while requesting, coordinating, or delivering psychiatric care services.",
      "Payment and billing details for the psychiatric care services you receive, including insurance information where applicable.",
      "Device, browser, app, session, and usage information used to keep accounts secure, maintain active sessions, troubleshoot errors, and improve performance.",
      "Communications with our team, including contact-form submissions, messages, notifications, and support requests.",
    ],
  },
  {
    title: "How We Use Information",
    paragraphs: [
      "We use information to respond to inquiries, verify identity, manage appointments, deliver psychiatric care, support caregiver access, process payments, send service notifications, secure the platform, and comply with legal or regulatory obligations.",
      "Where allowed, we may also use de-identified or aggregated information to improve operations, reporting, and product quality.",
    ],
  },
  {
    title: "How We Share Information",
    paragraphs: [
      "We share information only when needed to operate the service, provide care, meet legal obligations, or protect the safety and security of our users and systems.",
    ],
    bullets: [
      "With service providers that support payments, messaging, hosting, media storage, notifications, analytics limited to service operations, and other platform functions.",
      "With healthcare, insurance, billing, referral, or caregiving participants when needed to coordinate authorized psychiatric care services.",
      "When required by law, court order, subpoena, public-health obligation, fraud investigation, or to protect rights, safety, and platform integrity.",
      "In connection with a business transfer, restructuring, merger, or asset sale, subject to applicable confidentiality and legal requirements.",
    ],
  },
  {
    title: "Healthcare and Sensitive Data",
    paragraphs: [
      "Some features of the platform involve healthcare-related and other sensitive information, including treatment-plan details, session notes, authorizations, progress tracking, and caregiver-linked records. We use administrative, technical, and operational safeguards designed to protect that information and limit access to authorized users and workforce members.",
      "If you need more information about how a specific patient record request, correction request, or disclosure is handled, contact our team using the details below.",
    ],
  },
  {
    title: "Data Retention and Account Deletion",
    paragraphs: [
      "We retain information for as long as necessary to operate the service, maintain security logs, support clinical and billing obligations, resolve disputes, enforce agreements, and satisfy record-retention duties that apply to healthcare and business operations.",
      "Users can request account deletion from the account settings available in the web portal and mobile app. Deleting an account removes sign-in access and revokes active sessions, but certain records may still be retained where required for clinical, insurance, payment, fraud-prevention, audit, backup, or legal reasons.",
    ],
  },
  {
    title: "Your Choices and Rights",
    paragraphs: [
      "Depending on your relationship with us and where you live, you may be able to request access to your information, ask us to correct inaccurate information, opt out of non-essential communications, or request deletion subject to applicable retention requirements.",
    ],
    bullets: [
      "Update profile and contact information from your account settings when available.",
      "Use in-app or in-portal account deletion to disable access to your account.",
      "Contact our team if you need help with records, billing, caregiver access, or a privacy-related request.",
    ],
  },
  {
    title: "Security",
    paragraphs: [
      "We use safeguards designed to protect our systems and the information stored in them, including encrypted transport, authentication controls, session management, and role-based access patterns. No internet or storage system can be guaranteed to be perfectly secure, so users should also protect their passwords, devices, and access methods.",
    ],
  },
  {
    title: "Children and Caregiver Use",
    paragraphs: [
      "Our services are designed for adults, children, and adolescents receiving psychiatric care, and for their parents and guardians. Parent, guardian, and caregiver accounts may be used to coordinate care, review authorized information, and communicate with the clinic. We expect caregivers to provide accurate information and to use only the records they are authorized to access.",
    ],
  },
];

export const termsOfServiceSections: LegalSection[] = [
  {
    title: "Acceptance of Terms",
    paragraphs: [
      `These Terms of Service govern access to the ${publicPractice.brandName} website, patient portal, mobile application, appointment tools, messaging features, and online store. By using the service, you agree to these terms. If you do not agree, do not use the service.`,
    ],
  },
  {
    title: "No Emergency or Crisis Use",
    paragraphs: [
      "The platform is not an emergency service and should not be used to request urgent medical, psychiatric, or crisis help. If you believe someone is in immediate danger or needs urgent care, call 911 or contact the appropriate emergency provider right away.",
    ],
  },
  {
    title: "Eligibility and Account Responsibilities",
    paragraphs: [
      "You must provide accurate information, keep your login credentials confidential, and use only accounts that belong to you or that you are authorized to manage. Caregivers are responsible for the lawful use of linked caregiver access. You are responsible for activity that occurs under your account unless you promptly report unauthorized access.",
    ],
  },
  {
    title: "Appointments and Clinical Services",
    paragraphs: [
      "Appointment requests, treatment schedules, and clinical workflows remain subject to availability, clinical appropriateness, staffing, payer authorization, and internal review. We may confirm, reschedule, or cancel appointments as needed for operational, clinical, safety, weather, or compliance reasons.",
      "Messaging, treatment-plan views, session-note views, and caregiver-linked records are provided to support care coordination, not to replace direct professional judgment or emergency communication channels.",
    ],
  },
  {
    title: "Payments and Billing",
    paragraphs: [
      "Payments for psychiatric care services are subject to payment authorization, insurance verification, and applicable clinic policy. Payments may be processed by third-party providers such as Stripe or PayPal. Refunds and billing corrections are handled according to clinic policy, applicable law, and the specific facts of the transaction.",
    ],
  },
  {
    title: "Acceptable Use",
    paragraphs: [
      "You may use the service only for lawful, authorized, and intended purposes.",
    ],
    bullets: [
      "Do not attempt to access accounts, records, APIs, or systems that you are not authorized to use.",
      "Do not upload malware, interfere with platform availability, scrape protected data, or reverse engineer restricted parts of the service except where law expressly permits it.",
      "Do not impersonate another person, misrepresent your authority, or misuse patient, caregiver, or staff information.",
      "Do not use the service in a way that violates privacy, healthcare, payment, consumer-protection, or intellectual-property laws.",
    ],
  },
  {
    title: "Intellectual Property",
    paragraphs: [
      `The service, including its branding, design, text, software, workflows, and content made available by ${publicPractice.brandName}, is protected by applicable intellectual-property laws. Except for your limited right to use the service as intended, no license or ownership interest is transferred to you.`,
    ],
  },
  {
    title: "Suspension, Termination, and Account Deletion",
    paragraphs: [
      "We may suspend, restrict, or terminate access when needed for security, policy enforcement, billing, suspected fraud, clinical operations, legal compliance, or other legitimate business or safety reasons.",
      "Users may initiate account deletion from the available account settings. Deletion disables access and signs the user out, but does not necessarily erase records that must be retained for clinical, billing, tax, audit, backup, or legal obligations.",
    ],
  },
  {
    title: "Disclaimers and Limitation of Liability",
    paragraphs: [
      "The service is provided on an as-available basis. To the fullest extent permitted by law, we disclaim warranties not expressly stated and are not liable for indirect, incidental, special, consequential, or punitive damages arising from use of the service. Nothing in these terms limits rights that cannot lawfully be waived or excluded.",
    ],
  },
  {
    title: "Governing Law",
    paragraphs: [
      "These terms are governed by the laws of the State of California, without regard to conflict-of-law principles, except where another law must apply by operation of law.",
    ],
  },
  {
    title: "Changes to These Terms",
    paragraphs: [
      "We may update these terms from time to time. When we do, we will update the last-updated date on this page. Continued use of the service after changes take effect means you accept the updated terms.",
    ],
  },
];

export type CookieEntry = {
  name: string;
  type: "Essential" | "Functional";
  purpose: string;
  duration: string;
};

export const cookiePolicyCookies: CookieEntry[] = [
  {
    name: "accessToken",
    type: "Essential",
    purpose:
      "Keeps authenticated web sessions active and allows secured requests while you use the portal.",
    duration: "Short-lived session cookie",
  },
  {
    name: "refreshToken",
    type: "Essential",
    purpose:
      "Lets the platform refresh sign-in access without making you sign in again on every request.",
    duration: "Up to 30 days on trusted devices",
  },
  {
    name: "deviceId",
    type: "Functional",
    purpose:
      "Helps identify a trusted device so session management and account-security features work correctly.",
    duration: "Up to 1 year",
  },
];

export const cookiePolicySections: LegalSection[] = [
  {
    title: "How Cookies and Device Storage Are Used",
    paragraphs: [
      "Our web platform uses a small set of cookies and storage mechanisms that are necessary for authentication, security, and core product behavior. Our mobile app may also store session data securely on the device rather than using browser cookies.",
      "We do not rely on third-party advertising cookies or social-media tracking pixels as part of the core product experience.",
    ],
  },
  {
    title: "Managing Cookies",
    paragraphs: [
      "Essential sign-in cookies are required for account access, secure sessions, and protected portal functionality. Blocking them may prevent sign-in or disrupt key parts of the platform.",
      "You can clear cookies from your browser settings or sign out to remove active session cookies. On mobile, removing app data or signing out clears the active session stored for the app.",
    ],
  },
  {
    title: "Questions",
    paragraphs: [
      `If you have questions about cookies, session storage, or account privacy, contact ${publicPractice.supportEmail}.`,
    ],
  },
];