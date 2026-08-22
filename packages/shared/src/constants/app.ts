import type { AppIconName } from "@workspace/shared/constants/icons";

export type AppNavChildItem = {
  label: string;
  href: string;
  icon?: AppIconName;
  badge?: number;
};

export type AppNavItem = {
  label: string;
  href?: string;
  icon?: AppIconName;
  children?: AppNavChildItem[];
  badge?: number;
};

export interface AppNavGroup {
  groupLabel?: string;
  items: AppNavItem[];
}

export type HeaderNavChild = {
  title: string;
  description: string;
  href: string;
  icon?: AppIconName;
  image?: string;
};

export type HeaderNavItem = {
  title: string;
  href?: string;
  icon?: AppIconName;
  children?: HeaderNavChild[];
  featured?: HeaderNavChild;
};

export const appName = {
  short: "CPC",
  default: "Connected Psychiatric Care",
} as const;

export const publicPractice = {
  brandName: "Connected Psychiatric Care",
  legalName: "Connected Psychiatric Care, Professional Nursing Corporation",
  supportEmail: "info@connectedpsychiatriccare.com",
  primaryPhone: {
    display: "+1 (800) 000-0000",
    href: "tel:+18000000000",
    short: "(800) 000-0000",
  },
  secondaryPhone: {
    display: "+1 (800) 000-0001",
    href: "tel:+18000000001",
    short: "(800) 000-0001",
  },
  address: {
    line1: "Connected Psychiatric Care",
    line2: "California, United States",
    cityStateZip: "California, CA",
    full: "California, United States",
    href: "https://maps.google.com",
  },
  officeHours: {
    weekdays: "Monday through Friday: 8:00 AM - 6:00 PM",
    weekends: "Saturday: 9:00 AM - 2:00 PM",
    short: "Mon-Fri 8am-6pm, Sat 9am-2pm",
  },
} as const;

export const publicHomeSteps = [
  {
    id: "1",
    title: "Request an Appointment",
    description:
      "Complete our brief intake form online or call our care team. We respond within one business day to schedule your first visit.",
    icon: "CalendarDaysIcon",
  },
  {
    id: "2",
    title: "Complete Your Assessment",
    description:
      "Your provider reviews your history, conducts a comprehensive psychiatric evaluation, and partners with you to build a personalized care plan.",
    icon: "ClipboardListIcon",
  },
  {
    id: "3",
    title: "Begin Ongoing Care",
    description:
      "Receive consistent, compassionate psychiatric support via secure telehealth - with progress tracked every step of the way.",
    icon: "HeartPulseIcon",
  },
] as const;

export const publicHomeStats = [
  { value: "1,000+", label: "Patients Served", icon: "SmileIcon" },
  { value: "10+", label: "Licensed Providers", icon: "AwardIcon" },
  { value: "5+", label: "Years of Care", icon: "Clock3Icon" },
  { value: "95%", label: "Patient Satisfaction", icon: "UsersIcon" },
] as const;

export const publicSocialLinks = [
  {
    label: "Facebook",
    icon: "IconBrandFacebook",
    href: "https://www.facebook.com/",
  },
  {
    label: "Instagram",
    icon: "IconBrandInstagram",
    href: "https://www.instagram.com/",
  },
  {
    label: "LinkedIn",
    icon: "IconBrandLinkedin",
    href: "https://www.linkedin.com/",
  },
] as const;

export const publicServices = [
  {
    id: "001",
    isFeatured: true,
    slug: "psychiatric-evaluation",
    title: "Psychiatric Evaluation",
    icon: "BrainIcon",
    subtitle: "Comprehensive mental health assessment and diagnosis",
    description:
      "Our licensed psychiatric providers conduct thorough evaluations to understand your mental health history, current symptoms, and goals. We use validated screening tools and clinical judgment to form an accurate diagnosis and create a personalized treatment plan.",
    highlights: [
      "In-depth review of psychiatric, medical, and family history",
      "Validated screening tools: PHQ-9, GAD-7, ASRS, and more",
      "Clear diagnosis and treatment recommendations",
      "Collaborative goal-setting for your care plan",
    ],
    who: "Adults and adolescents seeking a first psychiatric opinion or a second opinion on an existing diagnosis.",
  },
  {
    id: "002",
    isFeatured: true,
    slug: "medication-management",
    title: "Medication Management",
    icon: "IconPill",
    subtitle: "Evidence-based psychiatric medication support",
    description:
      "Our providers prescribe and monitor psychiatric medications with close attention to efficacy, side effects, and long-term wellbeing. We take time to explain your options and adjust your treatment as your needs evolve.",
    highlights: [
      "Initial prescription based on diagnosis and history",
      "Ongoing monitoring appointments to track response",
      "Medication education and shared decision-making",
      "Safe prescribing in alignment with current clinical guidelines",
    ],
    who: "Patients who need psychiatric medication initiation, optimization, or ongoing monitoring.",
  },
  {
    id: "003",
    isFeatured: true,
    slug: "telehealth-psychiatry",
    title: "Telehealth Psychiatry",
    icon: "IconVideo",
    subtitle: "Whole person care, wherever you are",
    description:
      "Access professional psychiatric care from the comfort and privacy of your home. Our secure telehealth platform makes it easy to meet with your provider, complete assessments, message your care team, and manage prescriptions online.",
    highlights: [
      "HIPAA-secure video visits with your psychiatric provider",
      "Available across California",
      "Convenient scheduling with flexible appointment times",
      "Full access to your patient portal from any device",
    ],
    who: "Patients who prefer remote care, live outside major urban areas, or have scheduling constraints.",
  },
  {
    id: "004",
    isFeatured: true,
    slug: "depression-treatment",
    title: "Depression Treatment",
    icon: "HeartPulseIcon",
    subtitle: "Compassionate care for persistent low mood",
    description:
      "We provide evidence-based assessment and treatment for major depressive disorder, persistent depressive disorder, postpartum depression, and related conditions. Our approach combines medication management, supportive counseling, and regular progress monitoring.",
    highlights: [
      "PHQ-9 screening and ongoing mood tracking",
      "Antidepressant prescribing and titration support",
      "Coordination with your therapist or counselor when applicable",
      "Crisis safety planning when clinically indicated",
    ],
    who: "Adults and adolescents experiencing depressive symptoms that impact daily life.",
  },
  {
    id: "005",
    isFeatured: true,
    slug: "anxiety-treatment",
    title: "Anxiety Treatment",
    icon: "IconHeartbeat",
    subtitle: "Support for anxiety, worry, and panic",
    description:
      "We treat generalized anxiety disorder, social anxiety, panic disorder, OCD, and PTSD using a combination of medication management and evidence-informed strategies tailored to each patient.",
    highlights: [
      "GAD-7 screening and symptom tracking over time",
      "Medication options including SSRIs, SNRIs, and non-habit-forming agents",
      "Coordinated care with your therapist when appropriate",
      "Practical strategies for managing anxiety between visits",
    ],
    who: "Individuals whose anxiety, fear, or worry is interfering with daily functioning and quality of life.",
  },
  {
    id: "006",
    isFeatured: true,
    slug: "adhd-treatment",
    title: "ADHD Treatment",
    icon: "IconBolt",
    subtitle: "Assessment and management for adults and children",
    description:
      "We evaluate and treat ADHD across the lifespan using comprehensive screening tools, clinical interview, and evidence-based medication management. Our providers work closely with patients and families to build structured, effective care plans.",
    highlights: [
      "ASRS (adult) and Vanderbilt (child/adolescent) assessments",
      "Stimulant and non-stimulant medication management",
      "Parent and caregiver collaboration for pediatric patients",
      "School accommodation letter support",
    ],
    who: "Children, adolescents, and adults who suspect or have been diagnosed with ADHD.",
  },
  {
    id: "007",
    isFeatured: false,
    slug: "child-adolescent-psychiatry",
    title: "Child & Adolescent Psychiatry",
    icon: "IconUsersGroup",
    subtitle: "Specialized mental health care for younger patients",
    description:
      "Our providers have specialized training in child and adolescent psychiatric conditions, including ADHD, anxiety, depression, ODD, and trauma. We involve parents and guardians as key partners in every care plan.",
    highlights: [
      "Vanderbilt parent and teacher assessments",
      "Adolescent self-report and guardian intake forms",
      "CA minor consent law compliance (ages 12+ can self-consent)",
      "School coordination and accommodation letters",
    ],
    who: "Children and adolescents ages 5 to 17 experiencing behavioral, emotional, or developmental challenges.",
  },
  {
    id: "008",
    isFeatured: false,
    slug: "bipolar-disorder-treatment",
    title: "Bipolar Disorder Treatment",
    icon: "IconActivityHeartbeat",
    subtitle: "Mood stabilization and long-term wellness",
    description:
      "We provide evidence-based evaluation and ongoing management for bipolar I and II disorder, cyclothymia, and related mood conditions, including mood stabilizers and careful monitoring for safety.",
    highlights: [
      "Comprehensive mood disorder evaluation",
      "Mood stabilizer and atypical antipsychotic management",
      "Regular follow-up to monitor mood cycles and medication safety",
      "Crisis and safety planning integrated into care",
    ],
    who: "Adults and adolescents with significant mood swings, hypomanic, manic, or depressive episodes.",
  },
  {
    id: "009",
    isFeatured: false,
    slug: "trauma-ptsd-treatment",
    title: "Trauma & PTSD",
    icon: "IconShieldHeart",
    subtitle: "Compassionate support for trauma survivors",
    description:
      "We provide trauma-informed psychiatric evaluation and medication management for PTSD, acute stress disorder, and trauma-related conditions, working collaboratively with your therapist for comprehensive care.",
    highlights: [
      "Trauma-informed clinical approach across all visits",
      "Medication options for PTSD including SSRIs and prazosin",
      "Coordination with trauma-specialized therapists",
      "Patient-paced treatment planning with full consent and autonomy",
    ],
    who: "Individuals who have experienced trauma and are seeking psychiatric support alongside or separate from therapy.",
  },
] as const;

export const serviceDetails = Object.fromEntries(
  publicServices.map((service) => [
    service.id,
    {
      highlights: [...service.highlights],
      who: service.who,
    },
  ]),
) as Record<string, { highlights: string[]; who: string }>;

export const publicJourneySteps = [
  {
    id: "1",
    icon: "CalendarDaysIcon",
    title: "Request an Appointment",
    description:
      "Fill out our intake form or call us. Our care coordinators will reach out within one business day to schedule your visit.",
  },
  {
    id: "2",
    icon: "ClipboardListIcon",
    title: "Complete Your Evaluation",
    description:
      "Your provider reviews your intake forms, screening results, and history before your appointment so your time is focused on care.",
  },
  {
    id: "3",
    icon: "HeartPulseIcon",
    title: "Start Your Treatment Plan",
    description:
      "Receive ongoing psychiatric support with regular check-ins, medication management, and continuous progress monitoring.",
  },
] as const;

export const publicAboutContent = {
  missionTitle: "Whole Person Care - Wherever You Are",
  intro:
    "Connected Psychiatric Care exists to make high-quality, compassionate psychiatric services accessible to every patient in California via secure telehealth.",
  body: "Our team of licensed psychiatric providers combines clinical expertise, advanced technology, and genuine human connection to deliver care that is thorough, personalized, and always patient-centered.",
  mission:
    "To provide accessible, compassionate, and evidence-based psychiatric care that empowers patients to live healthier, more fulfilling lives.",
  vision:
    "To be California's most trusted telehealth psychiatric provider - known for clinical excellence, patient-first care, and seamless digital access.",
  businessTitle: "A modern psychiatric practice built for real patient needs",
  businessStory: [
    "Connected Psychiatric Care was founded on the belief that quality mental health support should be easy to access, free of unnecessary barriers, and deeply personal. We built our practice to serve patients across California - whether they live in a major city or a rural area - with the same level of clinical excellence.",
    "Our platform makes it possible for patients to complete intake, screening assessments, and follow-up entirely online while still receiving the kind of attentive, individualized care that defines great psychiatry. Every provider on our team brings specialized training, cultural competency, and a commitment to listening.",
    "We serve adults and adolescents across a wide range of psychiatric conditions - from depression and anxiety to ADHD, bipolar disorder, trauma, and more. Our care model is built around continuous support, not one-time visits.",
  ],
  referralPartners: [
    "Primary care physicians and internists",
    "Pediatricians and family medicine providers",
    "Psychologists and licensed therapists",
    "School counselors and education teams",
    "Social workers and case managers",
    "Patients and families seeking support directly",
  ],
  careProcess: [
    {
      key: "intake",
      icon: "ClipboardListIcon",
      title: "Online intake and screening",
      description:
        "Patients complete digital intake forms and validated screening tools before their first appointment so care can begin immediately.",
    },
    {
      key: "evaluation",
      icon: "BrainIcon",
      title: "Comprehensive psychiatric evaluation",
      description:
        "Your provider reviews your history and screening results and conducts a thorough evaluation to form a diagnosis and care plan.",
    },
    {
      key: "treatment",
      icon: "HeartPulseIcon",
      title: "Personalized treatment planning",
      description:
        "We build an individualized treatment plan around your goals, which may include medication management, referrals, and follow-up scheduling.",
    },
    {
      key: "monitoring",
      icon: "IconChartBar",
      title: "Ongoing monitoring and adjustment",
      description:
        "Progress is tracked through validated assessments at each follow-up visit, with treatment adjusted based on your response and feedback.",
    },
    {
      key: "coordination",
      icon: "UsersIcon",
      title: "Care coordination",
      description:
        "We coordinate with your therapist, primary care provider, school, or other members of your care team when appropriate.",
    },
  ],
  owner: {
    name: "Robert - Clinic Director",
    title: "Founder / Clinical Director",
    credentials: "Professional Nursing Corporation, California",
    summary:
      "The founder of Connected Psychiatric Care established this practice with a single goal: to make professional psychiatric care more accessible, compassionate, and connected to the people who need it most.",
    story:
      "Connected Psychiatric Care was built to serve the growing need for thoughtful, evidence-based mental health support in California. Our team of licensed psychiatric providers brings decades of combined clinical experience alongside a genuine commitment to whole-person care.",
    philosophy:
      "Our practice is grounded in the values shown on our logo - Remote, Compassionate, Connected, and Professional. We believe access to good psychiatric care should not depend on where you live or whether you can take time off work. That is why we built a platform that brings care to you.",
    expertise: [
      "Licensed psychiatric providers across California",
      "100% telehealth - no in-person visits required",
      "Adult and child/adolescent psychiatric specialization",
      "Evidence-based treatment protocols for depression, anxiety, ADHD, bipolar, and trauma",
      "HIPAA-compliant digital platform with full patient portal access",
    ],
  },
  highlights: [
    "100% telehealth psychiatric care across California",
    "Comprehensive digital intake with validated screening tools",
    "Providers who specialize in adult and child/adolescent psychiatry",
    "Medication management with regular follow-up monitoring",
    "HIPAA-secure patient portal for records, messages, and appointments",
    "Culturally competent, trauma-informed care for every patient",
  ],
  values: [
    {
      key: "compassion",
      icon: "HeartHandshakeIcon",
      title: "Compassion First",
      description:
        "We approach every patient with empathy, patience, and respect - regardless of their background or diagnosis.",
    },
    {
      key: "evidence",
      icon: "ClipboardListIcon",
      title: "Evidence-Based Practice",
      description:
        "Our clinical decisions are grounded in current psychiatric research, validated tools, and best-practice guidelines.",
    },
    {
      key: "accessible",
      icon: "IconVideo",
      title: "Accessible Care",
      description:
        "Telehealth ensures that geography, transportation, and schedule are never barriers to getting help.",
    },
    {
      key: "connected",
      icon: "UsersIcon",
      title: "Connected Support",
      description:
        "We coordinate with your full care team - therapists, PCPs, schools - to ensure nothing falls through the cracks.",
    },
    {
      key: "professional",
      icon: "AwardIcon",
      title: "Clinical Excellence",
      description:
        "Our licensed providers are dedicated to the highest standards of psychiatric care, ethics, and ongoing professional development.",
    },
    {
      key: "privacy",
      icon: "ShieldCheckIcon",
      title: "Privacy & Safety",
      description:
        "We take HIPAA compliance, patient confidentiality, and safety planning seriously in every interaction.",
    },
  ],
} as const;

export const publicAboutPageContent = {
  pageTitle: "Whole Person Care - Wherever You Are",
  pageDescription:
    "Connected Psychiatric Care provides compassionate, evidence-based psychiatric services for adults and adolescents in California - entirely via secure telehealth.",
  missionBadge: "Our Mission",
  businessSectionDescription:
    "Patients deserve clear, accessible psychiatric care delivered by providers who take time to listen, understand, and partner with them on their mental health journey.",
  valuesTitle: "The Values Behind Everything We Do",
  valuesDescription:
    "Our care model is shaped by compassion, clinical excellence, and a commitment to making psychiatric care more accessible.",
  ownerBadge: "Our Practice",
  expertiseTitle: "Clinical Expertise",
  teamTitle: "Meet Our Providers",
  teamDescription:
    "Our team of licensed psychiatric providers brings specialized training and a shared passion for whole-person mental health care.",
  teamEmptyState: "Provider profiles will be available soon.",
  ctaTitle: "Ready to Get Started?",
  ctaDescription:
    "Request an appointment online and our care team will reach out within one business day.",
  ctaPrimaryLabel: "Request an Appointment",
  ctaSecondaryLabel: "View Our Services",
} as const;

export const publicResourceFaqs = [
  {
    question: "What conditions do you treat?",
    answer:
      "We treat a wide range of psychiatric conditions including depression, anxiety, ADHD, bipolar disorder, PTSD, OCD, and more in adults and adolescents.",
  },
  {
    question: "Do you offer telehealth appointments?",
    answer:
      "Yes. We offer secure HIPAA-compliant telehealth appointments across California. Many patients complete their entire care plan remotely.",
  },
  {
    question: "Can you prescribe medication?",
    answer:
      "Yes. Our licensed psychiatric nurse practitioners and psychiatrists can prescribe and manage psychiatric medications.",
  },
  {
    question: "Do you see children and adolescents?",
    answer:
      "Yes. We have providers who specialize in child and adolescent psychiatry. In California, patients ages 12 and older can consent to mental health treatment independently.",
  },
  {
    question: "Do you accept insurance?",
    answer:
      "We accept several major insurance plans and offer self-pay options. Contact our team to verify your coverage before your first appointment.",
  },
  {
    question: "How do I prepare for my first appointment?",
    answer:
      "Complete your online intake forms and screening questionnaires before your visit. Your provider reviews these in advance so your appointment time is focused on care.",
  },
  {
    question: "Can you work alongside my therapist?",
    answer:
      "Yes. We frequently collaborate with therapists, psychologists, and other providers to ensure coordinated, comprehensive care.",
  },
] as const;

export const publicResourcesPageContent = {
  pageEyebrow: "Resources",
  pageTitle: "Helpful context for the questions",
  pageTitleAccent: "you are already carrying.",
  pageDescription:
    "Short, plain-spoken guides about psychiatric care, symptoms, medication, and supporting the people you love.",
  articlesEyebrow: "From the care library",
  articlesTitle: "Guides worth a few quiet minutes.",
  articlesDescription:
    "Educational content written by our clinical team to help patients and families understand psychiatric care and mental health conditions.",
  faqEyebrow: "Common questions",
  faqTitle: "Answers that make care feel less unknown.",
  faqDescription:
    "If you do not see your question here, our team is happy to help by phone or email.",
  askTeamLabel: "Ask our team",
  askTeamPrompt:
    "If you do not see your question here, our team is happy to help by phone or email.",
  ctaTitle: "Prefer to talk with someone?",
  ctaDescription:
    "Resources are a starting point. Our team can help you take the next step when you are ready.",
  ctaPrimaryLabel: "Request an Appointment",
  ctaSecondaryLabel: "Explore Our Services",
} as const;

export const publicReferralContent = {
  description:
    "Healthcare providers, educators, case managers, and family members can refer patients to our care team for compassionate, evidence-based psychiatric support.",
  intro:
    "Connected Psychiatric Care is dedicated to delivering thorough, patient-centered psychiatric evaluation and ongoing management. We make the referral process simple and keep referring providers informed.",
  followUp:
    "After we receive your referral, our care coordinator will reach out to the patient or guardian within one to two business days to guide them through intake and scheduling.",
  reasons: [
    "100% telehealth psychiatric care across California",
    "Comprehensive intake with validated screening assessments",
    "Collaborative approach - we keep referring providers in the loop",
  ],
  process: [
    "Submit the referral form with the patient's key details",
    "Our care coordinator contacts the patient within 1-2 business days",
    "We guide the patient through intake, scheduling, and insurance verification",
  ],
} as const;

export const publicReferralPageContent = {
  pageTitle: "Refer a Patient to Connected Psychiatric Care",
  whyReferTitle: "Why Refer to Us?",
  successTitle: "Referral Received",
  successDescription:
    "Thank you for your referral. Our care team will contact the patient within one to two business days to begin the intake process.",
  submitAnotherLabel: "Submit Another Referral",
  formSections: {
    referrer: "Your Information",
    patient: "Patient Information",
  },
  submitLabel: "Submit Referral",
  submittingLabel: "Submitting...",
} as const;

export const publicFaqPageContent = {
  title: "Your Questions, Answered",
  description:
    "Common questions about our services, telehealth, insurance, and what to expect from care at Connected Psychiatric Care.",
  sectionTitle: "Frequently Asked Questions",
  sectionDescription:
    "Clear, honest answers to the questions our patients ask most often.",
  ctaLabel: "Still Have Questions? Contact Us",
  ctaTitle: "Talk With Our Care Team",
  ctaPrimaryLabel: "Request an Appointment",
  ctaSecondaryLabel: "View Services",
} as const;

// ── Insurance providers (InsuranceTrustBar) ─────────────────────────────────

export type PublicInsurer = {
  name: string;
  note: string;
  domain: string;
  abbr: string;
  color: string;
  /** "pending" insurers are being transitioned onto the new panel and are not yet fully active. */
  status?: "active" | "pending";
};

export const publicInsurers: PublicInsurer[] = [
  {
    name: "Aetna",
    note: "Commercial & HMO",
    domain: "aetna.com",
    abbr: "AET",
    color: "#7C3AED",
  },
  {
    name: "Cigna",
    note: "Cigna Behavioral Health",
    domain: "cigna.com",
    abbr: "CIG",
    color: "#0369A1",
  },
  {
    name: "UHC/Optum",
    note: "UnitedHealthcare & Optum",
    domain: "uhc.com",
    abbr: "UHC",
    color: "#1D4ED8",
  },
  {
    name: "Anthem BCBS",
    note: "Anthem Blue Cross",
    domain: "anthem.com",
    abbr: "ABC",
    color: "#3730A3",
  },
  {
    name: "Carelon",
    note: "Behavioral health network",
    domain: "carelon.com",
    abbr: "CAR",
    color: "#0891B2",
  },
  {
    name: "Saga",
    note: "Saga Health",
    domain: "sagabh.com",
    abbr: "SGA",
    color: "#DB2777",
  },
  {
    name: "Tricare",
    note: "Military & veterans",
    domain: "tricare.mil",
    abbr: "TRI",
    color: "#B91C1C",
  },
  {
    name: "Sutter Health",
    note: "Sutter Health plans",
    domain: "sutterhealth.org",
    abbr: "SH",
    color: "#0D9488",
  },
  {
    name: "Blue Shield of California",
    note: "Blue Shield of California",
    domain: "blueshieldca.com",
    abbr: "BS",
    color: "#1E40AF",
  },
  {
    name: "MultiPlan",
    note: "MultiPlan network",
    domain: "multiplan.com",
    abbr: "MP",
    color: "#9333EA",
  },
  // Previously-accepted plans, kept visible as "pending" while existing patients transition to the new panel above.
  {
    name: "Medi-Cal",
    note: "California Medicaid",
    domain: "dhcs.ca.gov",
    abbr: "MC",
    color: "#1D4ED8",
    status: "pending",
  },
  {
    name: "Health Net",
    note: "CA managed care",
    domain: "healthnet.com",
    abbr: "HN",
    color: "#0F766E",
    status: "pending",
  },
  {
    name: "Covered California",
    note: "Marketplace plans",
    domain: "coveredca.gov",
    abbr: "CCA",
    color: "#059669",
    status: "pending",
  },
];

// ── Mental health conditions (ConditionsTreated) ─────────────────────────────

export type PublicCondition = {
  label: string;
  icon: AppIconName;
  href: string;
};

export const publicConditions: PublicCondition[] = [
  {
    label: "Depression",
    icon: "IconCloud",
    href: "/services#psychiatric-evaluation",
  },
  {
    label: "Anxiety",
    icon: "IconHeartbeat",
    href: "/services#psychiatric-evaluation",
  },
  {
    label: "ADHD - Adults",
    icon: "BrainIcon",
    href: "/services#adhd-treatment",
  },
  {
    label: "ADHD - Adolescents",
    icon: "GraduationCapIcon",
    href: "/services#adhd-treatment",
  },
  {
    label: "Bipolar Disorder",
    icon: "IconActivityHeartbeat",
    href: "/services#psychiatric-evaluation",
  },
  {
    label: "PTSD & Trauma",
    icon: "ShieldAlertIcon",
    href: "/services#psychiatric-evaluation",
  },
  {
    label: "OCD",
    icon: "SparklesIcon",
    href: "/services#psychiatric-evaluation",
  },
  {
    label: "Panic Disorder",
    icon: "HeartPulseIcon",
    href: "/services#psychiatric-evaluation",
  },
  {
    label: "Mood Disorders",
    icon: "SmileIcon",
    href: "/services#psychiatric-evaluation",
  },
  {
    label: "Insomnia",
    icon: "MoonStarIcon",
    href: "/services#psychiatric-evaluation",
  },
  {
    label: "PTSD - Youth",
    icon: "IconShieldHeart",
    href: "/services#adolescent-psychiatry",
  },
  {
    label: "Telehealth",
    icon: "IconVideo",
    href: "/services#telehealth-psychiatry",
  },
];

// ── About section stats (HomeAboutPreview dark card) ─────────────────────────

export const publicHomeAboutStats = [
  { value: "500+", label: "Patients Served" },
  { value: "10+", label: "Years in Practice" },
  { value: "95%", label: "Patient Satisfaction" },
] as const;

export const publicInsuranceContent = {
  title: "Insurance & Coverage",
  description:
    "Our team verifies your benefits, handles prior authorizations, and walks you through your coverage options at no extra cost.",
  acceptedTitle: "Accepted Insurance Plans",
  acceptedDescription:
    "We are in-network with several major insurance providers in California. If you do not see your plan listed, contact us - we may still be able to work with your insurer.",
  acceptedNote:
    "Insurance acceptance is subject to change. Contact us to confirm your specific plan and coverage before scheduling.",
  acceptedInsurers: [
    "Aetna",
    "Cigna",
    "UHC/Optum",
    "Anthem BCBS",
    "Carelon",
    "Saga",
    "Tricare",
    "Sutter Health",
    "Blue Shield of California",
    "MultiPlan",
  ],
  coverageCardTitle: "Have Questions About Your Coverage?",
  coverageCardDescription:
    "Call our care team at {phone} or email {email}. We will verify your benefits at no cost before your first appointment.",
  outOfPocketTitle: "Out-of-Pocket Costs",
  outOfPocketDescription:
    "Depending on your plan, you may be responsible for co-pays, deductibles, or co-insurance amounts. We will provide a clear cost estimate before services begin and offer flexible payment arrangements when needed.",
  selfPayTitle: "Self-Pay Options",
  selfPayDescription:
    "We offer competitive self-pay rates for patients without insurance coverage or whose plan does not cover psychiatric services. Contact us for current pricing.",
  authTitle: "How the Prior Authorization Process Works",
  authDescription:
    "Our team handles the full authorization process so you can focus on your care.",
  authSteps: [
    {
      step: "01",
      title: "Psychiatric Evaluation",
      description:
        "Your provider conducts a comprehensive evaluation to establish a diagnosis and determine the appropriate level of care.",
    },
    {
      step: "02",
      title: "Insurance Verification",
      description:
        "Our team contacts your insurer to verify mental health benefits, eligibility, and prior authorization requirements.",
    },
    {
      step: "03",
      title: "Authorization Request",
      description:
        "We submit the clinical documentation and authorization request to your insurance plan on your behalf.",
    },
    {
      step: "04",
      title: "Approval & Scheduling",
      description:
        "Once approved, we coordinate your ongoing care schedule based on the authorized services and your availability.",
    },
    {
      step: "05",
      title: "Ongoing Renewals",
      description:
        "We track authorization periods and proactively submit renewals before they expire so your care is never interrupted.",
    },
  ],
  faqs: [
    {
      q: "Is psychiatric care covered by insurance in California?",
      a: "Under the Mental Health Parity and Addiction Equity Act, most insurance plans must cover mental health and psychiatric services at the same level as medical services. Our team will verify your specific coverage before your first appointment.",
    },
    {
      q: "What if my insurance is not listed?",
      a: "We periodically add new payer contracts. Contact us with your insurance information and we will verify whether we can accept it or help you explore self-pay options.",
    },
    {
      q: "What is prior authorization for psychiatric care?",
      a: "Prior authorization means your insurance plan must approve certain psychiatric services before they begin. We handle this entire process for you, including clinical documentation and follow-up with your insurer.",
    },
    {
      q: "How long does authorization take?",
      a: "Standard authorization requests typically take 3 to 10 business days depending on the insurer. We will keep you updated and will not start services until coverage is confirmed.",
    },
  ],
  ctaTitle: "Ready to Verify Your Coverage?",
  ctaPrimaryLabel: "Contact Us",
  ctaSecondaryLabel: "Refer a Patient",
} as const;

export const publicContactPageContent = {
  pageEyebrow: "Contact",
  pageTitle: "Questions are",
  pageTitleAccent: "welcome here.",
  pageDescription:
    "Reach out to ask about services, insurance, scheduling, or finding the right starting point. We will respond during business hours.",
  successTitle: "Message sent",
  successDescription:
    "Thanks for reaching out. Our team will be in touch soon. If your needs are urgent, you can also call {phone} during office hours.",
  submitLabel: "Send message",
  submittingLabel: "Sending...",
  resetLabel: "Send another message",
  privacyNote:
    "Please do not include urgent or highly sensitive information in this form.",
  teamCardTitle: "Talk with our team",
  whereCardTitle: "Where we care",
  whereCardDescription:
    "Licensed providers serving patients across California through secure video visits.",
  noWaitingRoomTitle: "No physical waiting room",
  noWaitingRoomDescription:
    "Your care can begin wherever you have privacy and a reliable connection.",
  ctaTitle: "Prefer to call?",
  ctaDescription:
    "Leave a message during business hours and our team will help you find a starting point.",
} as const;

/**
 * Options for the "What can we help with?" field on the public contact form. This is the
 * single intake path for every public enquiry, including provider referrals, so there is
 * no separate referral page or endpoint - the selected value is sent as the message
 * subject on the existing contact-message record.
 */
export const publicContactSubjects = [
  "General question",
  "Insurance & payment",
  "Scheduling",
  "Services",
  "Referring a patient",
] as const;

export const publicServicesPageContent = {
  pageEyebrow: "Our Services",
  pageTitle: "Comprehensive Psychiatric Care Programs",
  pageDescription:
    "From initial evaluation to ongoing medication management and telehealth support, we offer a full range of evidence-based psychiatric services designed for adults and adolescents.",
  pagePrimaryLabel: "Request an Appointment",
  pageSecondaryLabel: "Meet Our Providers",
  servicesTitle: "What We Offer",
  servicesDescription:
    "Every service is grounded in compassionate care, evidence-based practice, and a commitment to measurable progress.",
  previewTitle: "Psychiatric Services Designed for Real People",
  previewDescription:
    "Comprehensive, evidence-based psychiatric programs tailored to help adults and adolescents manage mental health conditions and live fuller lives.",
  previewSeeAllLabel: "See All Services",
  stepsTitle: "How We Get Started With Your Care",
  stepsDescription:
    "A supportive process that connects you with the right psychiatric provider.",
  inquireLabel: "Inquire About This Service",
  portalBadge: "Patient Portal",
  portalTitle: "Manage Your Care Online",
  portalDescription:
    "Patients can log in to view their treatment plans, session notes, screening results, prescriptions, and appointment history all in one place. Caregivers can be granted secure access to a linked patient's records.",
  portalLoginLabel: "Log in to Patient Portal",
  portalSignupLabel: "Create an Account",
  ctaTitle: "Not Sure Which Service Is Right for You?",
  ctaDescription:
    "Reach out to our care team for guidance, or explore our provider profiles to find the right fit.",
  ctaPrimaryLabel: "Talk to Our Team",
  ctaSecondaryLabel: "View Our Providers",
  ctaEyebrow: "Services",
} as const;

export const publicProvidersPageContent = {
  pageTitle: "Licensed Providers Who Care",
  pageDescription:
    "Every member of our clinical team is licensed, experienced, and deeply committed to providing compassionate, evidence-based psychiatric care.",
  sectionTitle: "Meet Our Providers",
  sectionDescription:
    "Psychiatric nurse practitioners and psychiatrists dedicated to whole-person mental health care.",
  emptyState: "Provider profiles will be published soon.",
  bookDescription:
    "Share a few details and our care team will help you schedule the right appointment.",
  viewProfileLabel: "View Profile",
  bookSessionLabel: "Book Appointment",
  backToTeamLabel: "Back to Team",
  credentialsLabel: "Credentials",
  specialtiesLabel: "Specialties",
  whatToExpectTitle: "What to expect",
  whatToExpectItems: [
    "Thorough psychiatric evaluation at your first visit",
    "Validated screening assessments reviewed before every appointment",
    "Evidence-based treatment planning built around your goals",
    "Regular follow-up to monitor progress and adjust care",
  ],
  bookWithPrefix: "Book an Appointment with",
  viewFullTeamLabel: "View All Providers",
  notFoundTitle: "Provider not found",
  notFoundDescription: "This profile is not available.",
  notFoundCtaTitle: "Meet the Rest of Our Team",
  notFoundCtaDescription:
    "Browse all our licensed providers and find the right psychiatric specialist for your care.",
  notFoundPrimaryLabel: "View All Providers",
  detailCtaEyebrow: "Ready to Start?",
  detailCtaTitle: "Begin Your Psychiatric Care Journey",
  detailCtaDescription:
    "Our team is here to help every step of the way - from your first evaluation to ongoing care.",
  detailCtaPrimaryLabel: "Request an Appointment",
  detailCtaSecondaryLabel: "Learn About Our Services",
  ctaTitle: "Ready to Meet Your Psychiatric Provider?",
  ctaDescription:
    "Explore the services our team delivers, then request an appointment when you are ready.",
  ctaPrimaryLabel: "Request an Appointment",
  ctaSecondaryLabel: "Learn About Our Services",
} as const;

export const publicHeroContent = {
  badge: "Telehealth psychiatry across California",
  /** Split so the closing phrase can be tinted without hardcoding markup in the section. */
  title: "Expert care, from wherever",
  titleAccent: "life happens.",
  description:
    "Compassionate psychiatric evaluation, medication management, and ongoing support for adults, adolescents, and children, without the waiting room.",
  primaryLabel: "Book an Appointment",
  secondaryLabel: "See how it works",
  floatingCardTitle: "A little more ease",
  floatingCardBody: "Care designed around your real life.",
  bookingDescription:
    "Share a few details and our care team will help you schedule the right visit.",
  teamCallout: "Licensed psychiatric providers dedicated to your wellbeing",
  phoneLabel: "Call us today",
  workLabel: "How We Work",
  sessionStatus: "Telehealth session in progress...",
} as const;

export const publicTestimonialsContent = {
  eyebrow: "Patient Stories",
  title: "Patients Trust Connected Psychiatric Care",
  description: "Real feedback from our patients and their families.",
  emptyState: "Patient testimonials will appear here once they are available.",
} as const;

export const publicHomeTeamContent = {
  eyebrow: "Our Team",
  title: "Licensed Psychiatric Providers",
  description:
    "Meet our dedicated team of psychiatric nurse practitioners and psychiatrists, committed to whole-person mental health care.",
  viewProfileLabel: "View Profile",
  viewAllLabel: "Meet the Full Team",
} as const;

export const publicHomeStepsContent = {
  eyebrow: "How It Works",
  title: "How We Get You Started",
  description:
    "A clear, supportive three-step process to connect you with the right psychiatric care.",
  learnMoreLabel: "Learn More",
  ctaLabel: "Request an Appointment",
} as const;

export const publicHomeCtaContent = {
  eyebrow: "Get Started",
  title: "Ready to Take the First Step?",
  primaryLabel: "Learn About Our Services",
  secondaryLabel: "Request an Appointment",
} as const;

export const patientPortalHighlights = [
  "View your psychiatric treatment plans and care notes",
  "Access your screening results (PHQ-9, GAD-7, ASRS) over time",
  "Review prescriptions and medication history",
  "Book appointments and message your provider directly",
  "Grant secure caregiver access for linked adolescent accounts",
] as const;

export const featuredPublicServices = publicServices.filter(
  (service) => service.isFeatured,
);

const serviceChildren = featuredPublicServices.map((service) => {
  return {
    title: service.title,
    description: service.subtitle,
    href: `/services/${service.slug}`,
    icon: service.icon,
  };
});

export const headerNavigation = [
  {
    title: "Home",
    href: "/",
    icon: "IconHome",
  },
  {
    title: "Resources",
    href: "/resources",
    children: [
      {
        title: "Our Practice",
        description: "Learn about Connected Psychiatric Care and our approach.",
        href: "/about",
        icon: "IconUserHeart",
      },
      {
        title: "Patient Resources",
        description:
          "Guides, articles, and answers to help you and your family.",
        href: "/resources",
        icon: "IconBooks",
      },
      {
        title: "Insurance Info",
        description: "Review accepted insurance plans and coverage guidance.",
        href: "/insurance",
        icon: "IconLicense",
      },
      {
        title: "Careers",
        description:
          "Join our team of compassionate psychiatric care providers.",
        href: "/careers",
        icon: "IconBriefcase",
      },
    ],
    featured: {
      title:
        "Compassionate psychiatric care from first visit to ongoing support",
      description:
        "See how our team supports patients through evaluation, medication management, and ongoing care.",
      href: "/about",
      image:
        "https://img.freepik.com/free-photo/doctor-taking-notes-during-medical-consultation_23-2148962981.jpg",
    },
  },
  {
    title: "Services",
    href: "/services",
    children: serviceChildren,
    featured: {
      title: "Psychiatric services for adults and adolescents",
      description:
        "From telehealth evaluations to medication management, services are tailored to each patient.",
      href: "/services",
      image:
        "https://img.freepik.com/free-photo/doctor-patient-telehealth-consultation_23-2149056714.jpg",
    },
  },
  {
    title: "Providers",
    href: "/providers",
    icon: "IconStethoscope",
  },
  {
    title: "Contact",
    href: "/contact",
    icon: "IconHome",
  },
] as HeaderNavItem[];

export const patientDropdownMenu = [
  {
    items: [
      {
        href: "/patient",
        label: "Overview",
        icon: "IconHome",
      },
    ],
  },
  {
    items: [
      {
        href: "/patient/appointments",
        label: "Appointments",
        icon: "IconCalendarTime",
      },
      {
        href: "/patient/messages",
        label: "Messages",
        icon: "IconMessageCircle",
      },
      {
        href: "/patient/notifications",
        label: "Notifications",
        icon: "BellIcon",
      },
    ],
  },
  {
    items: [
      {
        href: "/patient/care/treatment-plans",
        label: "Treatment Plans",
        icon: "IconClipboardList",
      },
      {
        href: "/patient/care/assessments",
        label: "My Assessments",
        icon: "IconFileText",
      },
    ],
  },
  {
    items: [
      {
        href: "/patient/profile",
        label: "Profile",
        icon: "IconUserCircle",
      },
      {
        href: "/patient/payments",
        label: "Payments",
        icon: "IconCreditCard",
      },
      {
        href: "/patient/account",
        label: "Account & Settings",
        icon: "IconSettings",
      },
    ],
  },
] as const;

export const patientSidebarMenu: AppNavGroup[] = [
  {
    groupLabel: "MY CARE",
    items: [
      {
        href: "/patient/care/treatment-plans",
        label: "Treatment Plans",
        icon: "IconClipboardList",
      },
      {
        href: "/patient/care/session-notes",
        label: "Session Notes",
        icon: "IconNotes",
      },
      {
        href: "/patient/care/progress-reports",
        label: "Progress Reports",
        icon: "IconChartBar",
      },
      {
        href: "/patient/care/assessments",
        label: "Assessments & Forms",
        icon: "IconFileText",
      },
      {
        href: "/patient/onboarding",
        label: "My Intake",
        icon: "IconClipboardHeart",
      },
      {
        href: "/patient/caregivers",
        label: "Caregivers / Guardians",
        icon: "IconUsers",
      },
    ],
  },
  {
    groupLabel: "APPOINTMENTS",
    items: [
      {
        href: "/patient/appointments",
        label: "Appointments",
        icon: "IconCalendarEvent",
      },
      {
        href: "/patient/messages",
        label: "Messages",
        icon: "IconMessageCircle",
      },
      { href: "/patient/payments", label: "Payments", icon: "IconCreditCard" },
    ],
  },
  {
    items: [
      { href: "/patient/profile", label: "Profile", icon: "IconUserCircle" },
    ],
  },
] as const;

export const footerMenu = {
  "About Us": [
    { href: "/about", label: "Who We Are" },
    { href: "/providers", label: "Our Providers" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact Us" },
  ],
  services: [
    {
      href: "/services/psychiatric-evaluation",
      label: "Psychiatric Evaluation",
    },
    { href: "/services/medication-management", label: "Medication Management" },
    { href: "/services/telehealth-psychiatry", label: "Telehealth Psychiatry" },
    { href: "/services/adhd-treatment", label: "ADHD Treatment" },
    {
      href: "/services/adolescent-psychiatry",
      label: "Child & Adolescent Psychiatry",
    },
  ],
  resources: [
    { href: "/resources", label: "Patient Resources" },
    { href: "/resources#faq", label: "FAQ" },
    { href: "/insurance", label: "Insurance Info" },
  ],
} as const;

export const publicCareersContent = {
  title: "Join our",
  titleAccent: "psychiatric care team.",
  description:
    "We are growing a team of compassionate, evidence-based clinicians committed to transforming psychiatric care in California. If you are passionate about mental health, we would love to hear from you.",
  openingsTitle: "Current Openings",
  openingsDescription:
    "Don't see a role that fits? Send your resume and a brief introduction to {email} - we review all qualified candidates.",
  applyLabel: "Apply Now",
  emptyState:
    "No open positions at this time. Check back soon or email us your resume.",
  perks: [
    "Competitive compensation & benefits",
    "Flexible telehealth & hybrid schedules",
    "Collaborative, mission-driven culture",
    "Continuing education & license support",
  ],
} as const;

export const footerMeta = {
  description:
    "Compassionate, evidence-based psychiatric care for adults and adolescents in California - entirely via secure telehealth.",
  brandName: "Connected Psychiatric Care",
  builder: "ZHX Labs",
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/cookies", label: "Cookie Settings" },
    { href: "/account-deletion", label: "Account Deletion" },
  ],
} as const;

/**
 * Display labels for CaregiverRelationship. Shared because both the caregivers
 * page and the linked-patients card need them.
 */
export const caregiverRelationshipLabels: Record<string, string> = {
  parent: "Parent",
  guardian: "Legal Guardian",
  spouse: "Spouse / Partner",
  familyMember: "Family Member",
  authorizedCaregiver: "Authorized Caregiver",
  other: "Other",
};

/**
 * A dependant created from the portal has no real address; the server generates
 * a placeholder on a .nologin domain for an account that can never sign in.
 * Never show those to a reader.
 */
export const isPlaceholderEmail = (email?: string | null) =>
  !email || email.endsWith("@system.nologin");
