import "dotenv/config";
import argon2 from "argon2";
import { faker } from "@faker-js/faker";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  AppointmentCancellationSource,
  AppointmentChannel,
  AppointmentStatus,
  BookingSource,
  CampaignAudience,
  CampaignStatus,
  ConversationStatus,
  ConversationType,
  Gender,
  IdentificationType,
  MediaType,
  MediaVisibility,
  NotificationChannel,
  NotificationPurpose,
  NotificationStatus,
  PaymentMethodType,
  PaymentProvider,
  PaymentStatus,
  PrismaClient,
  TreatmentPlanStatus,
  RefundStatus,
  ThemeMode,
  UserRole,
  UserStatus,
  Weekday,
  ProgressReportStatus,
  DataRecordingType,
  DataResponse,
  InsuranceAuthorizationStatus,
  ProgramStatus,
  ProgramType,
} from "../prisma/generated/client";
import { createReference } from "@workspace/shared/utils";

const connectionString = process.env.DB_URI;

if (!connectionString) {
  throw new Error("DB_URI is required to run the Prisma seed.");
}

faker.seed(42);

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const DEFAULT_PASSWORD = "Test@123456";
const DEFAULT_TIMEZONE = "America/Los_Angeles";

const PROVIDER_AVATAR_URLS = [
  "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
];

const ADMIN_AVATAR_URL =
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80";

const STAFF_AVATAR_URLS = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80",
];

const BUSINESS_COVER_URL =
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1600&q=80";

const PROVIDER_SEEDS = [
  {
    firstName: "Angela",
    lastName: "Torres",
    displayName: "Dr. Angela Torres",
    title: "PMHNP-BC, Founder & Clinical Director",
    credentials: ["PMHNP-BC"],
    specialties: ["Early Intervention", "Verbal Behavior", "Staff Training"],
    education: "Ph.D. Applied Behavior Analysis",
    yearsExperience: 15,
    languages: ["English", "Spanish"],
    bio: "Dr. Torres founded Connected Psychiatric Care with a vision of compassionate, data-driven psychiatric care for adults and adolescents in California. She oversees treatment quality, mentors the clinical team, and specializes in early intervention and verbal behavior programming.",
  },
  {
    firstName: "Sarah",
    lastName: "Mitchell",
    displayName: "Dr. Sarah Mitchell",
    title: "PMHNP-BC, Senior Clinician",
    credentials: ["PMHNP-BC"],
    specialties: ["Parent Training", "Social Skills", "School Consultation"],
    education: "M.S. Special Education",
    yearsExperience: 13,
    languages: ["English"],
    bio: "Dr. Mitchell specializes in early childhood intervention and family-centered psychiatric care. She partners closely with caregivers and schools to make sure skills generalize beyond the clinic into home and classroom routines.",
  },
  {
    firstName: "James",
    lastName: "Reeves",
    displayName: "James Reeves",
    title: "PMHNP-BC, Lead Clinician",
    credentials: ["PMHNP-BC"],
    specialties: ["Social Skills Training", "Adaptive Behavior", "Telehealth"],
    education: "M.A. Applied Behavior Analysis",
    yearsExperience: 10,
    languages: ["English"],
    bio: "James leads school-age programming focused on adaptive behavior, peer interaction, and real-world skill building. His sessions blend structure, warmth, and natural environment teaching to help children succeed across settings.",
  },
  {
    firstName: "Kevin",
    lastName: "Park",
    displayName: "Kevin Park",
    title: "PMHNP-BC, Child Psychiatry Specialist",
    credentials: ["PMHNP-BC"],
    specialties: ["Early Intervention", "Play-Based Therapy", "Psychiatric Evaluation"],
    education: "B.S. Psychology",
    yearsExperience: 9,
    languages: ["English", "Korean"],
    bio: "Kevin works with toddlers and preschoolers using play-based, naturalistic teaching strategies. He is especially strong at building communication and daily-living goals into engaging routines that families can carry into home life.",
  },
  {
    firstName: "Marcus",
    lastName: "Chen",
    displayName: "Marcus Chen",
    title: "PMHNP-BC, School-Based Mental Health Specialist",
    credentials: ["PMHNP-BC"],
    specialties: ["School Consultation", "IEP Support", "Behavior Plans"],
    education: "M.Ed. Special Education",
    yearsExperience: 11,
    languages: ["English", "Mandarin"],
    bio: "Marcus bridges the gap between clinic and classroom with behavior support plans, teacher coaching, and IEP-aligned recommendations. He helps children generalize skills consistently across school, home, and community settings.",
  },
  {
    firstName: "Priya",
    lastName: "Sharma",
    displayName: "Priya Sharma",
    title: "LCSW, Family Programs Lead",
    credentials: ["PMHNP-BC"],
    specialties: ["Family Liaison", "Home-Based Services", "Parent Training"],
    education: "M.S. Psychology",
    yearsExperience: 8,
    languages: ["English", "Hindi"],
    bio: "Priya leads family-centered programs that support parents, siblings, and caregivers alongside direct therapy. She focuses on practical routines, home-based goals, and collaborative coaching that feels sustainable for families.",
  },
  {
    firstName: "Olivia",
    lastName: "Bennett",
    displayName: "Olivia Bennett",
    title: "PMHNP-BC, Behavioral Health Specialist",
    credentials: ["PMHNP-BC"],
    specialties: ["Behavior Plans", "Crisis Prevention", "Caregiver Coaching"],
    education: "M.S. Clinical Psychology",
    yearsExperience: 12,
    languages: ["English"],
    bio: "Olivia designs behavior reduction programs for complex cases involving safety, transitions, and regulation. She works closely with families and staff to keep plans supportive, clear, and data-informed.",
  },
  {
    firstName: "Daniel",
    lastName: "Carter",
    displayName: "Daniel Carter",
    title: "LPC, Community Mental Health Specialist",
    credentials: ["PMHNP-BC"],
    specialties: [
      "Adaptive Behavior",
      "Community Integration",
      "Transition Planning",
    ],
    education: "M.Ed. Applied Behavior Analysis",
    yearsExperience: 7,
    languages: ["English"],
    bio: "Daniel supports older children and teens with community, transition, and independence goals. He specializes in functional routines, adaptive skills, and helping families prepare for real-life daily success.",
  },
  {
    firstName: "Sofia",
    lastName: "Ramirez",
    displayName: "Sofia Ramirez",
    title: "PMHNP-BC, Clinical Programs Supervisor",
    credentials: ["PMHNP-BC"],
    specialties: ["Verbal Behavior", "Program Oversight", "Care Coordination"],
    education: "M.A. Special Education",
    yearsExperience: 10,
    languages: ["English", "Spanish"],
    bio: "Sofia supervises program implementation across multiple cases and trains staff on clinical consistency. Her focus areas include communication growth, treatment integrity, and high-quality caregiver collaboration.",
  },
] as const;

const STAFF_SEEDS = [
  {
    firstName: "Nina",
    lastName: "Cole",
    title: "LPC, Family Specialist",
    specialty: "Home-Based Services",
    credentials: ["LPC", "B.A. Psychology"],
    yearsExperience: 3,
  },
  {
    firstName: "Liam",
    lastName: "Brooks",
    title: "LCSW",
    specialty: "Direct Therapy Sessions",
    credentials: ["LCSW"],
    yearsExperience: 2,
  },
  {
    firstName: "Emma",
    lastName: "Diaz",
    title: "LPC",
    specialty: "Parent Training & Supervision",
    credentials: ["LPC", "CPR"],
    yearsExperience: 5,
  },
  {
    firstName: "Harper",
    lastName: "Quinn",
    title: "Program Manager",
    specialty: "Scheduling & Care Coordination",
    credentials: ["Operations Lead"],
    yearsExperience: 6,
  },
] as const;

const TESTIMONIAL_SEEDS = [
  {
    authorName: "Maria Lopez",
    authorRole: "Parent of teenage patient",
    content:
      "The team at Connected Psychiatric Care genuinely cares about our son. His communication has improved so much in just a few months, and every progress update feels clear, honest, and encouraging.",
  },
  {
    authorName: "David Chen",
    authorRole: "Parent of a 7-year-old client",
    content:
      "We tried other programs before, but this team is different. They listen, they adapt, and the progress our daughter has made in social skills and transitions has been incredible.",
  },
  {
    authorName: "Aisha Williams",
    authorRole: "Parent of adolescent patient",
    content:
      "From the very first consultation, we felt at ease. Our provider explained everything clearly, our goals made sense, and our son actually looks forward to his sessions.",
  },
  {
    authorName: "James Nguyen",
    authorRole: "Adult patient",
    content:
      "The parent training sessions have been life-changing for us. We now know how to support our child at home using the same strategies the therapists use during sessions.",
  },
  {
    authorName: "Fatima Hassan",
    authorRole: "Parent of teenage patient",
    content:
      "Booking appointments is easy, the portal is simple to use, and the clinical team is always responsive. Most importantly, our daughter is thriving in ways we never expected.",
  },
  {
    authorName: "Carlos Rivera",
    authorRole: "Parent of adolescent patient",
    content:
      "We were nervous starting psychiatric care, but the team made us feel confident. Their transparency, professionalism, and steady communication gave us real peace of mind.",
  },
] as const;

const JOB_LISTING_SEEDS = [
  {
    title: "Psychiatric Nurse Practitioner (PMHNP-BC)",
    type: "fullTime",
    locationType: "hybrid",
    location: "Los Angeles, CA",
    description:
      "Lead individualized psychiatric treatment plans, oversee clinical staff, support caregiver education, and collaborate with multidisciplinary providers to deliver high-quality client outcomes.",
    requirements:
      "Current PMHNP-BC certification\nActive California APRN license\nExperience with adults and/or adolescents\nStrong documentation and communication skills",
    salary: "$78,000 - $92,000",
  },
  {
    title: "Licensed Clinical Social Worker (LCSW)",
    type: "fullTime",
    locationType: "onSite",
    location: "Los Angeles, CA",
    description:
      "Conduct therapy sessions, complete documentation, support treatment plans, and build meaningful therapeutic relationships with patients and families.",
    requirements:
      "Current LCSW license\nExperience with mental health populations\nStrong communication and documentation skills\nWarm, collaborative, team-oriented mindset",
    salary: "$24 - $30 / hour",
  },
  {
    title: "Child & Adolescent Therapist",
    type: "partTime",
    locationType: "onSite",
    location: "Los Angeles, CA",
    description:
      "Provide evidence-based therapy to children and adolescents, support behavioral health goals, and collaborate with the clinical team.",
    requirements:
      "Background in psychology, social work, or related mental health field\nExperience with child and adolescent populations\nConsistent availability for patient-centered scheduling\nStrong communication and documentation skills",
    salary: "$22 - $28 / hour",
  },
  {
    title: "Intake & Authorization Coordinator",
    type: "fullTime",
    locationType: "onSite",
    location: "Los Angeles, CA",
    description:
      "Coordinate new patient intake, insurance verification, authorizations, scheduling, and onboarding for psychiatric care services across our clinic and telehealth programs.",
    requirements:
      "2+ years of healthcare administration or intake experience\nInsurance authorization familiarity preferred\nExcellent follow-through and family communication\nComfort with scheduling systems and documentation",
    salary: "$48,000 - $58,000",
  },
] as const;

const DEMO_PATIENT_SEEDS = [
  {
    firstName: "Noah",
    lastName: "Thompson",
    caregiverName: "Maya Thompson",
    age: 5,
    gender: Gender.male,
    address: "1000 Wilshire Blvd, Los Angeles, CA 90017",
    emergencyContactNumber: "+13025550200",
    insuranceProvider: "Aetna Better Health",
    allergies: "Peanut allergy noted by caregiver",
    currentMedication: "Melatonin, caregiver-administered as needed",
    familyMedicalHistory: "Autism diagnosis reviewed during intake.",
    pastMedicalHistory:
      "Speech delay and sensory sensitivity documented at intake.",
    focus: "early communication, transitions, and toileting routines",
  },
  {
    firstName: "Ava",
    lastName: "Rivera",
    caregiverName: "Carlos Rivera",
    age: 7,
    gender: Gender.female,
    address: "2400 Wilshire Blvd, Los Angeles, CA 90057",
    emergencyContactNumber: "+13025550201",
    insuranceProvider: "CareFirst BlueCross BlueShield",
    allergies: "None reported",
    currentMedication: "None",
    familyMedicalHistory: "Family history reviewed during assessment.",
    pastMedicalHistory:
      "Difficulty with school transitions and peer play reported.",
    focus: "social skills, classroom readiness, and caregiver coaching",
  },
  {
    firstName: "Liam",
    lastName: "Patel",
    caregiverName: "Anika Patel",
    age: 4,
    gender: Gender.male,
    address: "3000 Sunset Blvd, Los Angeles, CA 90028",
    emergencyContactNumber: "+13025550202",
    insuranceProvider: "UnitedHealthcare",
    allergies: "Seasonal allergies",
    currentMedication: "None",
    familyMedicalHistory: "Developmental history reviewed with caregiver.",
    pastMedicalHistory:
      "Limited functional communication and high prompt dependency.",
    focus: "functional communication and play-based early intervention",
  },
  {
    firstName: "Sophia",
    lastName: "Nguyen",
    caregiverName: "James Nguyen",
    age: 8,
    gender: Gender.female,
    address: "4500 Hollywood Blvd, Los Angeles, CA 90027",
    emergencyContactNumber: "+13025550203",
    insuranceProvider: "AmeriHealth Caritas",
    allergies: "None reported",
    currentMedication: "None",
    familyMedicalHistory: null,
    pastMedicalHistory:
      "Caregiver reports transition refusal and difficulty waiting.",
    focus: "waiting tolerance, adaptive routines, and community outings",
  },
  {
    firstName: "Mason",
    lastName: "Williams",
    caregiverName: "Aisha Williams",
    age: 6,
    gender: Gender.male,
    address: "5600 Wilshire Blvd, Los Angeles, CA 90036",
    emergencyContactNumber: "+13025550204",
    insuranceProvider: "Highmark Blue Cross Blue Shield",
    allergies: "Dairy sensitivity",
    currentMedication: "None prescribed currently",
    familyMedicalHistory: "Family medical history reviewed.",
    pastMedicalHistory: "Occupational therapy history uploaded to chart.",
    focus: "self-regulation, replacement communication, and fine motor tasks",
  },
  {
    firstName: "Mia",
    lastName: "Lopez",
    caregiverName: "Maria Lopez",
    age: 5,
    gender: Gender.female,
    address: "6200 Sunset Blvd, Los Angeles, CA 90028",
    emergencyContactNumber: "+13025550205",
    insuranceProvider: "Medi-Cal",
    allergies: "None reported",
    currentMedication: "None",
    familyMedicalHistory: "Family history reviewed during intake.",
    pastMedicalHistory:
      "Caregiver reports difficulty with bedtime and morning routines.",
    focus: "daily living routines and parent training",
  },
] as const;

const daysFromNow = (days: number, hour = 9, minute = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, minute, 0, 0);
  return date;
};

const hoursAfter = (date: Date, hours: number, minutes = 0) =>
  new Date(date.getTime() + hours * 60 * 60 * 1000 + minutes * 60 * 1000);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

async function clearDatabase() {
  console.log("Clearing existing seed data...");

  await prisma.dataPoint.deleteMany();
  await prisma.sessionNote.deleteMany();
  await prisma.behaviorProgram.deleteMany();
  await prisma.progressReport.deleteMany();
  await prisma.insuranceAuthorization.deleteMany();
  await prisma.treatmentPlan.deleteMany();
  await prisma.staffAssignment.deleteMany();
  await prisma.clinicalFormResponse.deleteMany();
  await prisma.formAssignment.deleteMany();
  await prisma.teacherAssessmentToken.deleteMany();
  await prisma.patientOnboarding.deleteMany();
  await prisma.caregiverInvitation.deleteMany();
  await prisma.caregiverAccess.deleteMany();
  await prisma.jobListing.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.messageAttachment.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.refund.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.providerBlockedTime.deleteMany();
  await prisma.providerAvailability.deleteMany();
  await prisma.campaignRecipient.deleteMany();
  await prisma.notificationCampaign.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.otp.deleteMany();
  await prisma.session.deleteMany();
  await prisma.staffProfile.deleteMany();
  await prisma.providerProfile.deleteMany();
  await prisma.patientProfile.deleteMany();
  await prisma.branchTiming.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.businessProfile.deleteMany();
  await prisma.media.deleteMany();
  await prisma.user.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.trafficSource.deleteMany();
}

async function seedFoundation() {
  console.log("Seeding users...");

  const hashedPassword = await argon2.hash(DEFAULT_PASSWORD);

  const admin = await prisma.user.create({
    data: {
      firstName: "Alex",
      lastName: "Morgan",
      displayName: "Alex Morgan",
      email: "admin@connectedpsychiatriccare.demo",
      phone: "+15550000001",
      password: hashedPassword,
      role: UserRole.admin,
      status: UserStatus.active,
      isEmailVerified: true,
      isPhoneVerified: true,
      preferredTheme: ThemeMode.system,
      pushNotifications: false,
      loginAlerts: true,
    },
  });

  const providers = await Promise.all(
    PROVIDER_SEEDS.map((provider, index) =>
      prisma.user.create({
        data: {
          firstName: provider.firstName,
          lastName: provider.lastName,
          displayName: provider.displayName,
          email: `${provider.firstName.toLowerCase()}.${provider.lastName.toLowerCase()}@connectedpsychiatriccare.demo`,
          phone: `+1555000001${index + 1}`,
          password: hashedPassword,
          role: UserRole.staff,
          status: UserStatus.active,
          isEmailVerified: true,
          isPhoneVerified: true,
          pushNotifications: false,
        },
      }),
    ),
  );

  const staff = await Promise.all(
    STAFF_SEEDS.map((member, index) =>
      prisma.user.create({
        data: {
          firstName: member.firstName,
          lastName: member.lastName,
          displayName: `${member.firstName} ${member.lastName}`,
          email: `staff.${member.lastName.toLowerCase()}@connectedpsychiatriccare.demo`,
          phone: `+1555000003${index + 1}`,
          password: hashedPassword,
          role: UserRole.staff,
          status: UserStatus.active,
          isEmailVerified: true,
          isPhoneVerified: true,
          pushNotifications: false,
        },
      }),
    ),
  );

  const patients = await Promise.all(
    Array.from({ length: 14 }).map((_, index) => {
      const demoPatient = DEMO_PATIENT_SEEDS[index];
      const firstName = demoPatient?.firstName ?? faker.person.firstName();
      const lastName = demoPatient?.lastName ?? faker.person.lastName();
      const email = `patient${index + 1}@connectedpsychiatriccare.demo`;
      const phone = `+1555000002${(index + 1).toString().padStart(2, "0")}`;

      return prisma.user.create({
        data: {
          firstName,
          lastName,
          displayName: `${firstName} ${lastName}`,
          email,
          phone,
          password: hashedPassword,
          role: UserRole.patient,
          status: UserStatus.active,
          isEmailVerified: true,
          isPhoneVerified: true,
          pushNotifications: false,
        },
      });
    }),
  );

  return {
    admin,
    providers,
    patients,
    staff,
    providerSeeds: PROVIDER_SEEDS,
    staffSeeds: STAFF_SEEDS,
  };
}

async function seedMedia(
  foundation: Awaited<ReturnType<typeof seedFoundation>>,
) {
  console.log("Seeding media...");

  const adminAvatar = await prisma.media.create({
    data: {
      uploadedById: foundation.admin.id,
      publicId: "prod-seed/admin-avatar",
      url: `${ADMIN_AVATAR_URL}?v=admin-avatar`,
      mimeType: "image/png",
      resourceType: "image",
      size: 125000,
      hash: "prod-seed-admin-avatar-hash",
      name: "admin-avatar.png",
      type: MediaType.avatar,
      visibility: MediaVisibility.public,
      altText: "Admin avatar",
    },
  });

  const providerAvatars = await Promise.all(
    foundation.providers.map((provider, index) =>
      prisma.media.create({
        data: {
          uploadedById: foundation.admin.id,
          publicId: `prod-seed/provider-${index + 1}-avatar`,
          url: `${PROVIDER_AVATAR_URLS[index]}?v=provider-${index + 1}`,
          mimeType: "image/png",
          resourceType: "image",
          size: 160000,
          hash: `prod-seed-provider-${index + 1}-avatar-hash`,
          name: `provider-${index + 1}-avatar.png`,
          type: MediaType.avatar,
          visibility: MediaVisibility.public,
          altText: `${provider.displayName} avatar`,
        },
      }),
    ),
  );

  const staffAvatars = await Promise.all(
    foundation.staff.map((member, index) =>
      prisma.media.create({
        data: {
          uploadedById: foundation.admin.id,
          publicId: `prod-seed/staff-${index + 1}-avatar`,
          url: `${STAFF_AVATAR_URLS[index % STAFF_AVATAR_URLS.length]}&v=staff-${index + 1}`,
          mimeType: "image/jpeg",
          resourceType: "image",
          size: 145000,
          hash: `prod-seed-staff-${index + 1}-avatar-hash`,
          name: `staff-${index + 1}-avatar.jpg`,
          type: MediaType.avatar,
          visibility: MediaVisibility.public,
          altText: `${member.displayName} avatar`,
        },
      }),
    ),
  );

  const businessLogo = await prisma.media.create({
    data: {
      uploadedById: foundation.admin.id,
      publicId: "prod-seed/business-logo",
      url: `${ADMIN_AVATAR_URL}?v=business-logo`,
      mimeType: "image/png",
      resourceType: "image",
      size: 65000,
      hash: "prod-seed-business-logo-hash",
      name: "business-logo.png",
      type: MediaType.other,
      visibility: MediaVisibility.public,
      altText: "Connected Psychiatric Care logo",
    },
  });

  const businessFavicon = await prisma.media.create({
    data: {
      uploadedById: foundation.admin.id,
      publicId: "prod-seed/business-favicon",
      url: `${ADMIN_AVATAR_URL}?v=business-favicon`,
      mimeType: "image/png",
      resourceType: "image",
      size: 12000,
      hash: "prod-seed-business-favicon-hash",
      name: "business-favicon.png",
      type: MediaType.other,
      visibility: MediaVisibility.public,
      altText: "Connected Psychiatric Care favicon",
    },
  });

  const businessCover = await prisma.media.create({
    data: {
      uploadedById: foundation.admin.id,
      publicId: "prod-seed/business-cover",
      url: `${BUSINESS_COVER_URL}&v=business-cover`,
      mimeType: "image/jpeg",
      resourceType: "image",
      size: 240000,
      hash: "prod-seed-business-cover-hash",
      name: "business-cover.jpg",
      type: MediaType.other,
      visibility: MediaVisibility.public,
      altText: "Connected Psychiatric Care cover image",
    },
  });

  const patientDocuments = await Promise.all(
    foundation.patients.slice(0, 6).map((patient, index) =>
      prisma.media.create({
        data: {
          uploadedById: foundation.admin.id,
          publicId: `demo/patient-${index + 1}-intake-packet`,
          url: `https://res.cloudinary.com/demo/raw/upload/v${index + 1}/connected-psychiatric-care/patient-${index + 1}-intake-packet.pdf`,
          mimeType: "application/pdf",
          resourceType: "raw",
          size: 185000 + index * 7000,
          hash: `demo-patient-${index + 1}-intake-packet-hash`,
          name: `${patient.displayName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-intake-packet.pdf`,
          type: MediaType.document,
          visibility: MediaVisibility.private,
          altText: `${patient.displayName} intake packet`,
          notes:
            index % 2 === 0
              ? "Intake assessment, insurance card, and caregiver consent forms."
              : "School observation notes and prior therapy summary for demo review.",
        },
      }),
    ),
  );

  await prisma.user.update({
    where: { id: foundation.admin.id },
    data: { avatarId: adminAvatar.id },
  });

  await Promise.all(
    foundation.providers.map((provider, index) =>
      prisma.user.update({
        where: { id: provider.id },
        data: { avatarId: providerAvatars[index]?.id },
      }),
    ),
  );

  await Promise.all(
    foundation.staff.map((member, index) =>
      prisma.user.update({
        where: { id: member.id },
        data: { avatarId: staffAvatars[index]?.id },
      }),
    ),
  );

  return {
    adminAvatar,
    providerAvatars,
    staffAvatars,
    businessLogo,
    businessFavicon,
    businessCover,
    patientDocuments,
  };
}

async function seedBusinessAndBranches(
  foundation: Awaited<ReturnType<typeof seedFoundation>>,
  media: Awaited<ReturnType<typeof seedMedia>>,
) {
  console.log("Seeding business profile and branches...");

  const businessProfile = await prisma.businessProfile.create({
    data: {
      name: "Connected Psychiatric Care",
      legalName: "Connected Psychiatric Care Professional Nursing Corporation",
      description:
        "Compassionate, evidence-based psychiatric care for adults and adolescents in California.",
      faviconId: media.businessFavicon.id,
      logoLightId: media.businessLogo.id,
      logoDarkId: media.businessLogo.id,
      coverId: media.businessCover.id,
      email: "hello@connectedpsychiatriccare.demo",
      phone: "+18772258559",
      whatsapp: "+12402578525",
      website: "https://connectedpsychiatriccare.com",
      facebook: "https://www.facebook.com/profile.php?id=61579562833070",
      instagram: null,
      tiktok: "https://www.tiktok.com/t/ZTkRnFUjS/",
      twitter: null,
      linkedin: null,
      metaTitle: "Connected Psychiatric Care | Psychiatric Services for Adults & Adolescents",
      metaDescription:
        "Compassionate psychiatric care for adults and adolescents in California. Book appointments, track progress, and connect with our clinical team.",
    },
  });

  const nycBranch = await prisma.branch.create({
    data: {
      businessProfileId: businessProfile.id,
      name: "CPC Main Clinic",
      slug: "cpc-main-clinic",
      email: "main@connectedpsychiatriccare.demo",
      phone: "+13105550100",
      whatsapp: "+13105550100",
      street: "123 Medical Center Dr",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90001",
      country: "United States",
      latitude: 34.0522,
      longitude: -118.2437,
      timezone: DEFAULT_TIMEZONE,
      isActive: true,
    },
  });

  const austinBranch = await prisma.branch.create({
    data: {
      businessProfileId: businessProfile.id,
      name: "CPC San Diego Clinic",
      slug: "cpc-san-diego",
      email: "sandiego@connectedpsychiatriccare.demo",
      phone: "+16195550200",
      whatsapp: "+16195550200",
      street: "456 Wellness Blvd",
      city: "San Diego",
      state: "CA",
      postalCode: "92101",
      country: "United States",
      timezone: DEFAULT_TIMEZONE,
      isActive: true,
    },
  });

  const santaMonicaBranch = await prisma.branch.create({
    data: {
      businessProfileId: businessProfile.id,
      name: "CPC Riverside Clinic",
      slug: "cpc-riverside",
      email: "riverside@connectedpsychiatriccare.demo",
      phone: "+19515550300",
      whatsapp: "+19515550300",
      street: "789 Health Ave",
      city: "Riverside",
      state: "CA",
      postalCode: "92501",
      country: "United States",
      timezone: DEFAULT_TIMEZONE,
      isActive: true,
    },
  });

  const weekdays = [
    Weekday.monday,
    Weekday.tuesday,
    Weekday.wednesday,
    Weekday.thursday,
    Weekday.friday,
  ];

  for (const branch of [nycBranch, austinBranch, santaMonicaBranch]) {
    for (const weekday of weekdays) {
      await prisma.branchTiming.create({
        data: {
          branchId: branch.id,
          weekday,
          openTime: "09:00",
          closeTime: "18:00",
          isClosed: false,
        },
      });
    }

    await prisma.branchTiming.createMany({
      data: [
        {
          branchId: branch.id,
          weekday: Weekday.saturday,
          openTime: "10:00",
          closeTime: "14:00",
          isClosed: false,
        },
        {
          branchId: branch.id,
          weekday: Weekday.sunday,
          openTime: "00:00",
          closeTime: "00:00",
          isClosed: true,
        },
      ],
    });
  }

  return { businessProfile, nycBranch, austinBranch, santaMonicaBranch };
}

async function seedProfiles(
  foundation: Awaited<ReturnType<typeof seedFoundation>>,
  branches: Awaited<ReturnType<typeof seedBusinessAndBranches>>,
  media: Awaited<ReturnType<typeof seedMedia>>,
) {
  console.log("Seeding patient, provider, and staff profiles...");

  const patients = await Promise.all(
    foundation.patients.map((user, index) => {
      const demoPatient = DEMO_PATIENT_SEEDS[index];
      const birthDate = new Date();
      birthDate.setFullYear(
        birthDate.getFullYear() -
          (demoPatient?.age ?? faker.number.int({ min: 3, max: 14 })),
      );
      birthDate.setMonth(index % 12, 10 + (index % 17));

      return prisma.patientProfile.create({
        data: {
          userId: user.id,
          identificationDocumentId: media.patientDocuments[index]?.id,
          birthDate,
          gender:
            demoPatient?.gender ??
            ([Gender.male, Gender.female, Gender.other] as const)[index % 3],
          address:
            demoPatient?.address ??
            faker.location.streetAddress({ useFullAddress: true }),
          occupation: null,
          emergencyContactName:
            demoPatient?.caregiverName ?? faker.person.fullName(),
          emergencyContactNumber:
            demoPatient?.emergencyContactNumber ??
            `+13025550${(200 + index).toString().padStart(4, "0")}`,
          insuranceProvider:
            demoPatient?.insuranceProvider ??
            [
              "Aetna Better Health",
              "AmeriHealth Caritas",
              "Highmark Blue Cross Blue Shield",
              "UnitedHealthcare",
            ][index % 4],
          insurancePolicyNumber: `US-${faker.string.alphanumeric({
            length: 10,
            casing: "upper",
          })}`,
          allergies:
            demoPatient?.allergies ??
            (index % 4 === 0 ? "Seasonal allergies" : "None reported"),
          currentMedication:
            demoPatient?.currentMedication ??
            (index % 5 === 0 ? "None prescribed currently" : "None"),
          familyMedicalHistory:
            demoPatient?.familyMedicalHistory ??
            (index % 2 === 0 ? "Family history reviewed during intake." : null),
          pastMedicalHistory:
            demoPatient?.pastMedicalHistory ??
            (index % 3 === 0
              ? "Developmental history reviewed on intake."
              : null),
          identificationType:
            index % 2 === 0
              ? IdentificationType.nationalId
              : IdentificationType.passport,
          identificationNumber:
            index % 2 === 0
              ? `ID-${faker.string.alphanumeric({
                  length: 9,
                  casing: "upper",
                })}`
              : `P-${faker.string.alphanumeric({
                  length: 9,
                  casing: "upper",
                })}`,
        },
      });
    }),
  );

  const branchPool = [
    branches.nycBranch,
    branches.austinBranch,
    branches.santaMonicaBranch,
  ];

  const providers = await Promise.all(
    foundation.providers.map((user, index) => {
      const seed = foundation.providerSeeds[index];

      return prisma.providerProfile.create({
        data: {
          userId: user.id,
          branchId: branchPool[index % branchPool.length].id,
          createdById: foundation.admin.id,
          slug: `dr-${slugify(`${seed.firstName} ${seed.lastName}`)}`,
          title: seed.title,
          bio: seed.bio,
          licenseNumber: `PMHNP-${32000 + index}`,
          yearsExperience: seed.yearsExperience,
          education: seed.education,
          credentials: [...seed.credentials],
          specialties: [...seed.specialties],
          languages: [...seed.languages],
          consultationFee: 165 + index * 10,
          commissionPercent: 12.5,
          isAvailable: true,
          isPubliclyListed: true,
        },
      });
    }),
  );

  const staff = await Promise.all(
    foundation.staff.map((user, index) =>
      prisma.staffProfile.create({
        data: {
          userId: user.id,
          branchId: branchPool[index % branchPool.length].id,
          title: foundation.staffSeeds[index]!.title,
          specialty: foundation.staffSeeds[index]!.specialty,
          bio: `${foundation.staffSeeds[index]!.title} supporting therapy operations and patient care.`,
          credentials: [...foundation.staffSeeds[index]!.credentials],
          yearsExperience: foundation.staffSeeds[index]!.yearsExperience,
          isActive: true,
        },
      }),
    ),
  );

  return { patients, providers, staff };
}

async function seedAvailability(
  profiles: Awaited<ReturnType<typeof seedProfiles>>,
) {
  console.log("Seeding provider availability...");

  const weekdays = [
    Weekday.monday,
    Weekday.tuesday,
    Weekday.wednesday,
    Weekday.thursday,
    Weekday.friday,
  ];

  for (const provider of profiles.providers) {
    for (const weekday of weekdays) {
      await prisma.providerAvailability.create({
        data: {
          providerId: provider.id,
          weekday,
          startTime: "09:00",
          endTime: "17:00",
          slotDurationMinute: 30,
          isActive: true,
        },
      });
    }
  }

  if (profiles.providers[0]) {
    await prisma.providerBlockedTime.create({
      data: {
        providerId: profiles.providers[0].id,
        startAt: daysFromNow(3, 10, 0),
        endAt: daysFromNow(3, 12, 0),
        reason: "Conference block (demo)",
      },
    });
  }
}

async function seedAppointments(
  foundation: Awaited<ReturnType<typeof seedFoundation>>,
  profiles: Awaited<ReturnType<typeof seedProfiles>>,
  branches: Awaited<ReturnType<typeof seedBusinessAndBranches>>,
) {
  console.log("Seeding appointments...");

  const branchPool = [
    branches.nycBranch,
    branches.austinBranch,
    branches.santaMonicaBranch,
  ];

  const statusPool = [
    AppointmentStatus.booked,
    AppointmentStatus.confirmed,
    AppointmentStatus.completed,
    AppointmentStatus.cancelled,
  ];

  const appointments = [];

  for (let index = 0; index < 24; index++) {
    const patient = profiles.patients[index % profiles.patients.length];
    const provider = profiles.providers[index % profiles.providers.length];
    const branch = branchPool[index % branchPool.length];
    const status = statusPool[index % statusPool.length];
    const demoPatient = DEMO_PATIENT_SEEDS[index % DEMO_PATIENT_SEEDS.length];
    const start =
      status === AppointmentStatus.completed
        ? daysFromNow(
            -14 + (index % 8),
            9 + (index % 5),
            index % 2 === 0 ? 0 : 30,
          )
        : status === AppointmentStatus.cancelled
          ? daysFromNow(-5 + (index % 4), 10 + (index % 4), 0)
          : daysFromNow(
              1 + (index % 10),
              9 + (index % 6),
              index % 2 === 0 ? 0 : 30,
            );
    const durationMinutes =
      status === AppointmentStatus.completed || index % 3 === 0 ? 120 : 60;

    appointments.push(
      prisma.appointment.create({
        data: {
          appointmentNumber: createReference("appointment"),
          branchId: branch.id,
          patientId: patient.id,
          providerId: provider.id,
          createdById:
            index % 3 === 0 ? foundation.admin.id : foundation.patients[0]?.id,
          status,
          bookingSource:
            index % 3 === 0 ? BookingSource.admin : BookingSource.app,
          channel:
            index % 2 === 0
              ? AppointmentChannel.inPerson
              : AppointmentChannel.virtual,
          paymentStatus:
            status === AppointmentStatus.completed
              ? PaymentStatus.succeeded
              : PaymentStatus.pending,
          scheduledStartAt: start,
          scheduledEndAt: hoursAfter(start, 0, durationMinutes),
          timezone: DEFAULT_TIMEZONE,
          patientNotes:
            status === AppointmentStatus.booked
              ? `Caregiver would like to focus on ${demoPatient.focus}.`
              : `Demo visit note: ${demoPatient.focus}.`,
          providerNotes:
            status === AppointmentStatus.completed
              ? "Reviewed program data, coached caregiver, and updated next-session targets."
              : null,
          adminNotes:
            index % 5 === 0
              ? "Verify authorization hours before the next recurring session."
              : null,
          confirmedAt:
            status === AppointmentStatus.confirmed ||
            status === AppointmentStatus.completed
              ? daysFromNow(-7, 10, 0)
              : null,
          completedAt:
            status === AppointmentStatus.completed
              ? hoursAfter(start, 0, durationMinutes)
              : null,
          cancelledAt:
            status === AppointmentStatus.cancelled
              ? daysFromNow(-3, 12, 0)
              : null,
          cancellationSource:
            status === AppointmentStatus.cancelled
              ? AppointmentCancellationSource.patient
              : null,
          cancellationReason:
            status === AppointmentStatus.cancelled
              ? "Caregiver requested a move because of a school meeting."
              : null,
          paidAt:
            status === AppointmentStatus.completed
              ? hoursAfter(start, 0, durationMinutes)
              : null,
          reminderSentAt:
            status === AppointmentStatus.booked ||
            status === AppointmentStatus.confirmed
              ? daysFromNow(0, 8, 0)
              : null,
        },
      }),
    );
  }

  return Promise.all(appointments);
}

async function seedConversations(
  foundation: Awaited<ReturnType<typeof seedFoundation>>,
  profiles: Awaited<ReturnType<typeof seedProfiles>>,
  appointments: Awaited<ReturnType<typeof seedAppointments>>,
  branches: Awaited<ReturnType<typeof seedBusinessAndBranches>>,
) {
  console.log("Seeding conversations and messages...");

  const messages = [];

  for (const [index, appointment] of appointments.entries()) {
    const providerProfile =
      profiles.providers.find((provider) => provider.id === appointment.providerId) ??
      null;
    const patientProfile =
      profiles.patients.find(
        (patient) => patient.id === appointment.patientId,
      ) ?? null;

    const conversation = await prisma.conversation.create({
      data: {
        appointmentId: appointment.id,
        branchId: appointment.branchId,
        patientId: appointment.patientId,
        assignedToId: providerProfile?.userId ?? foundation.admin.id,
        type: ConversationType.appointment,
        status: ConversationStatus.open,
        subject: `Appointment ${appointment.appointmentNumber}`,
        ...(index < 8 ? { lastMessageAt: new Date() } : {}),
      },
    });

    if (index < 8 && patientProfile && providerProfile) {
      const demoPatient = DEMO_PATIENT_SEEDS[index % DEMO_PATIENT_SEEDS.length];
      messages.push(
        prisma.message.create({
          data: {
            conversationId: conversation.id,
            senderId: patientProfile.userId,
            body:
              appointment.status === AppointmentStatus.completed
                ? `Thank you for today's session. Can we practice the ${demoPatient.focus} targets at home this week?`
                : "Hi, should we bring the visual schedule and token board to the next visit?",
            createdAt: daysFromNow(-2, 15, index),
            readAt: daysFromNow(-2, 16, index),
          },
        }),
        prisma.message.create({
          data: {
            conversationId: conversation.id,
            senderId: providerProfile.userId,
            body:
              appointment.status === AppointmentStatus.completed
                ? "Yes. I added caregiver-practice steps in the session note and we will review the data at the next appointment."
                : "Yes, please bring both. We will use them for transition practice and update the caregiver plan afterward.",
            createdAt: daysFromNow(-2, 16, index + 10),
          },
        }),
      );
    }
  }

  const supportConversation = await prisma.conversation.create({
    data: {
      branchId: branches.nycBranch.id,
      patientId: profiles.patients[0]!.id,
      assignedToId: foundation.admin.id,
      type: ConversationType.support,
      status: ConversationStatus.open,
      subject: "Support: account & booking help",
      lastMessageAt: new Date(),
    },
  });

  await prisma.message.createMany({
    data: [
      {
        conversationId: supportConversation.id,
        senderId: foundation.patients[0]!.id,
        body: "Can you help me reschedule Noah's parent-training appointment to later in the afternoon?",
      },
      {
        conversationId: supportConversation.id,
        senderId: foundation.admin.id,
        body: "Yes, I found two openings for Dr. Torres this week. I will send both options through the portal.",
      },
    ],
  });

  await Promise.all(messages);
}

async function seedPayments(
  foundation: Awaited<ReturnType<typeof seedFoundation>>,
  appointments: Awaited<ReturnType<typeof seedAppointments>>,
) {
  console.log("Seeding payments and refunds...");

  const createdAt = (daysAgo: number, hour = 10, minute = 0) =>
    daysFromNow(-daysAgo, hour, minute);

  const bookedAppointment = appointments.find(
    (appointment) => appointment.status === AppointmentStatus.booked,
  );
  const confirmedAppointment = appointments.find(
    (appointment) => appointment.status === AppointmentStatus.confirmed,
  );
  const completedAppointment = appointments.find(
    (appointment) => appointment.status === AppointmentStatus.completed,
  );
  const cancelledAppointment = appointments.find(
    (appointment) => appointment.status === AppointmentStatus.cancelled,
  );

  if (bookedAppointment) {
    await prisma.payment.create({
      data: {
        appointmentId: bookedAppointment.id,
        provider: PaymentProvider.stripe,
        methodType: PaymentMethodType.card,
        status: PaymentStatus.pending,
        amount: 140,
        createdAt: createdAt(6, 11),
        metadata: { label: "Upcoming appointment payment", demo: true },
      },
    });
  }

  if (confirmedAppointment) {
    await prisma.payment.create({
      data: {
        appointmentId: confirmedAppointment.id,
        provider: PaymentProvider.paypal,
        methodType: PaymentMethodType.wallet,
        status: PaymentStatus.succeeded,
        amount: 160,
        transactionId: createReference("payment"),
        createdAt: createdAt(5, 14),
        paidAt: createdAt(5, 14),
        commissionAmount: 20,
        providerNetAmount: 140,
        metadata: { label: "Confirmed appointment payment", demo: true },
      },
    });
  }

  if (cancelledAppointment) {
    await prisma.payment.create({
      data: {
        appointmentId: cancelledAppointment.id,
        provider: PaymentProvider.stripe,
        methodType: PaymentMethodType.card,
        status: PaymentStatus.failed,
        amount: 150,
        createdAt: createdAt(4, 9),
        failureMessage: "Card authorization failed (demo).",
        metadata: { label: "Failed appointment payment", demo: true },
      },
    });
  }

  if (completedAppointment) {
    const refundedPayment = await prisma.payment.create({
      data: {
        appointmentId: completedAppointment.id,
        provider: PaymentProvider.stripe,
        methodType: PaymentMethodType.card,
        status: PaymentStatus.refunded,
        amount: 150,
        transactionId: createReference("payment"),
        createdAt: createdAt(3, 16),
        paidAt: createdAt(3, 16),
        refundedAt: createdAt(2, 12),
        commissionAmount: 18.75,
        providerNetAmount: 131.25,
        metadata: { label: "Refunded appointment payment", demo: true },
      },
    });

    await prisma.refund.create({
      data: {
        paymentId: refundedPayment.id,
        processedById: foundation.admin.id,
        amount: 150,
        reason: "Demo refund for reporting coverage.",
        status: RefundStatus.processed,
        requestedAt: createdAt(2, 12),
        processedAt: createdAt(2, 12),
        metadata: { demo: true },
      },
    });
  }
}


async function seedPublicContent(
  foundation: Awaited<ReturnType<typeof seedFoundation>>,
  profiles: Awaited<ReturnType<typeof seedProfiles>>,
) {
  console.log("Seeding public testimonials and careers...");

  await prisma.testimonial.createMany({
    data: TESTIMONIAL_SEEDS.map((item, index) => ({
      authorId: index < 3 ? foundation.patients[index]!.id : null,
      patientId: index < 3 ? profiles.patients[index]!.id : null,
      authorName: item.authorName,
      authorRole: item.authorRole,
      content: item.content,
      rating: index === 3 || index === 5 ? 4 : 5,
      isPublished: true,
    })),
  });

  await prisma.jobListing.createMany({
    data: JOB_LISTING_SEEDS.map((job) => ({
      title: job.title,
      type:
        job.type === "partTime"
          ? "partTime"
          : job.type === ("contract" as any)
            ? "contract"
            : job.type === ("internship" as any)
              ? "internship"
              : "fullTime",
      locationType:
        job.locationType === ("remote" as any)
          ? "remote"
          : job.locationType === "hybrid"
            ? "hybrid"
            : "onSite",
      location: job.location,
      department: "Clinical Services",
      description: job.description,
      requirements: job.requirements,
      salary: job.salary,
      isActive: true,
    })),
  });
}

async function seedNotifications(
  foundation: Awaited<ReturnType<typeof seedFoundation>>,
) {
  console.log("Seeding campaigns and notifications...");

  const campaign = await prisma.notificationCampaign.create({
    data: {
      createdById: foundation.admin.id,
      title: "Welcome to Connected Psychiatric Care",
      subject: "Your family portal is ready",
      message:
        "Book your first visit, review upcoming care, message your therapy team, and explore recommended resources from one place.",
      channel: NotificationChannel.email,
      audience: CampaignAudience.patients,
      status: CampaignStatus.sent,
      sentAt: new Date(),
    },
  });

  await prisma.campaignRecipient.createMany({
    data: foundation.patients.slice(0, 10).map((patient) => ({
      campaignId: campaign.id,
      userId: patient.id,
      sentAt: new Date(),
    })),
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: foundation.patients[0]!.id,
        title: "Consultation booked",
        message:
          "Your consultation has been booked successfully. Our team will follow up with the next steps shortly.",
        recipient: foundation.patients[0]!.email!,
        meta: { actionUrl: "/patient/appointments", demo: true },
        purpose: NotificationPurpose.appointmentStatus,
        channels: [NotificationChannel.email],
        status: NotificationStatus.sent,
      },
      {
        userId: foundation.patients[1]!.id,
        title: "Session reminder",
        message: "Reminder: you have a therapy session scheduled for tomorrow.",
        recipient: foundation.patients[1]!.email!,
        meta: { actionUrl: "/patient/appointments", demo: true },
        purpose: NotificationPurpose.appointmentReminder,
        channels: [NotificationChannel.email],
        status: NotificationStatus.sent,
      },
      {
        userId: foundation.providers[0]!.id,
        title: "New caregiver message",
        message:
          "A family has sent a message in one of your appointment conversations.",
        recipient: foundation.providers[0]!.email!,
        meta: { actionUrl: "/messages", demo: true },
        purpose: NotificationPurpose.newChatMessage,
        channels: [NotificationChannel.email],
        status: NotificationStatus.sent,
      },
      {
        userId: foundation.patients[0]!.id,
        title: "Prescription sent to your pharmacy",
        message:
          "Your provider has sent your prescription to your nominated pharmacy.",
        recipient: foundation.patients[0]!.phone!,
        meta: { actionUrl: "/patient/appointments", demo: true },
        purpose: NotificationPurpose.appointmentStatus,
        channels: [NotificationChannel.sms],
        status: NotificationStatus.sent,
      },
      {
        userId: foundation.staff[0]!.id,
        title: "New caseload assignment",
        message:
          "You have been assigned a new patient and caregiver support schedule for this week.",
        recipient: foundation.staff[0]!.email!,
        meta: { actionUrl: "/patients", demo: true },
        purpose: NotificationPurpose.appointmentStatus,
        channels: [NotificationChannel.email],
        status: NotificationStatus.sent,
      },
      {
        userId: foundation.patients[0]!.id,
        title: "How was your session?",
        message:
          "We'd love to hear about your experience with Connected Psychiatric Care. Share a testimonial from your patient portal.",
        recipient: foundation.patients[0]!.email!,
        meta: { actionUrl: "/patient/testimonials", demo: true },
        purpose: NotificationPurpose.testimonialRequest,
        channels: [NotificationChannel.email],
        status: NotificationStatus.sent,
      },
      {
        userId: foundation.patients[0]!.id,
        title: "Treatment plan updated",
        message:
          "Dr. Torres published updated communication and transition goals for Noah's care plan.",
        recipient: foundation.patients[0]!.email!,
        meta: { actionUrl: "/patient/treatment-plans", demo: true },
        purpose: NotificationPurpose.treatmentPlanUpdated,
        channels: [NotificationChannel.email, NotificationChannel.push],
        status: NotificationStatus.sent,
      },
      {
        userId: foundation.admin.id,
        title: "New website inquiry",
        message:
          "Maya Thompson submitted an ABA intake request from the public contact form.",
        recipient: foundation.admin.email!,
        meta: { actionUrl: "/admin/leads/messages", demo: true },
        purpose: NotificationPurpose.contactMessage,
        channels: [NotificationChannel.email],
        status: NotificationStatus.sent,
      },
    ],
  });
}

async function seedTrafficAndLeads() {
  console.log("Seeding traffic sources, contact messages, and newsletter...");

  const traffic = await prisma.trafficSource.create({
    data: {
      utmSource: "google",
      utmMedium: "cpc",
      utmCampaign: "demo_launch",
      landingPage: "/",
      referrer: "https://google.com",
      ip: "203.0.113.10",
      userAgent: "Mozilla/5.0 (Demo Seed)",
    },
  });

  await prisma.contactMessage.createMany({
    data: [
      {
        trafficSourceId: traffic.id,
        firstName: "Maya",
        lastName: "Thompson",
        email: "maya.thompson@example.com",
        phone: "+13025550990",
        subject: "Looking for psychiatric care for my son",
        message:
          "My son was recently diagnosed and we are looking for evaluation, medication management, and support with insurance verification. We would love a callback this week.",
      },
      {
        trafficSourceId: traffic.id,
        firstName: "Elena",
        lastName: "Morales",
        email: "elena.morales@example.com",
        phone: "+13025550991",
        subject: "School consultation and IEP support",
        message:
          "We are interested in school consultation, behavior plan support, and provider coordination for our 8-year-old daughter.",
      },
      {
        trafficSourceId: traffic.id,
        firstName: "Brandon",
        lastName: "Carter",
        email: "brandon.carter@example.com",
        phone: "+13025550992",
        subject: "Do you accept UnitedHealthcare?",
        message:
          "Can your intake team confirm insurance coverage and the next available assessment appointment in Rockville?",
      },
    ],
  });

  await prisma.newsletterSubscriber.create({
    data: {
      trafficSourceId: traffic.id,
      name: "Elena Morales",
      email: "elena.morales@example.com",
      isActive: true,
    },
  });
}

async function seedStaffAssignments(
  foundation: Awaited<ReturnType<typeof seedFoundation>>,
  profiles: Awaited<ReturnType<typeof seedProfiles>>,
) {
  console.log("Seeding staff assignments...");

  await prisma.staffAssignment.createMany({
    data: profiles.patients.slice(0, 6).map((patient, index) => ({
      patientId: patient.id,
      staffId: foundation.staff[index % foundation.staff.length]!.id,
      assignedById: foundation.admin.id,
      isActive: true,
      notes: "Demo caseload assignment.",
    })),
  });
}

async function seedClinicalData(
  foundation: Awaited<ReturnType<typeof seedFoundation>>,
  profiles: Awaited<ReturnType<typeof seedProfiles>>,
  appointments: Awaited<ReturnType<typeof seedAppointments>>,
) {
  console.log("Seeding psychiatric clinical demo data...");

  const activePatients = profiles.patients.slice(0, 6);
  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === AppointmentStatus.completed,
  );

  for (const [index, patient] of activePatients.entries()) {
    const provider = profiles.providers[index % profiles.providers.length]!;
    const therapist = foundation.staff[index % foundation.staff.length]!;
    const caregiver =
      foundation.patients[(index + 6) % foundation.patients.length]!;
    const patientUser = foundation.patients.find(
      (user) => user.id === patient.userId,
    );
    const demoPatient = DEMO_PATIENT_SEEDS[index % DEMO_PATIENT_SEEDS.length];

    const treatmentPlan = await prisma.treatmentPlan.create({
      data: {
        patientId: patient.id,
        createdById: provider.userId,
        providerId: provider.id,
        title: `${patientUser?.displayName ?? `Patient ${index + 1}`} - ABA Treatment Plan`,
        description: `Individualized ABA plan focused on ${demoPatient.focus}, with coordinated clinic, home, and caregiver support goals.`,
        goals:
          "Increase functional communication, improve transition tolerance, strengthen waiting skills, build adaptive routines, and reduce escape-maintained behavior during structured demands.",
        status:
          index % 4 === 0
            ? TreatmentPlanStatus.completed
            : TreatmentPlanStatus.active,
        startDate: daysFromNow(-45 - index * 5, 9, 0),
        endDate:
          index % 4 === 0 ? daysFromNow(30, 9, 0) : daysFromNow(90, 9, 0),
      },
    });

    const programs = await Promise.all([
      prisma.behaviorProgram.create({
        data: {
          treatmentPlanId: treatmentPlan.id,
          name: "Functional Communication Training",
          description:
            "Teach the learner to request help, breaks, and preferred items using appropriate communication.",
          type: ProgramType.skillAcquisition,
          status:
            index % 4 === 0 ? ProgramStatus.mastered : ProgramStatus.active,
          masteryDefinition:
            "80% or higher independent correct responses across 3 consecutive sessions.",
          baselineData:
            "Baseline independence ranged from 20% to 35% with frequent prompts.",
        },
      }),
      prisma.behaviorProgram.create({
        data: {
          treatmentPlanId: treatmentPlan.id,
          name: "Transition Tolerance",
          description:
            "Reduce transition-related refusal and increase tolerance for schedule changes using visual supports.",
          type: ProgramType.behaviorReduction,
          status: ProgramStatus.active,
          masteryDefinition:
            "Fewer than 2 episodes of refusal across 4 consecutive sessions.",
          baselineData:
            "Baseline showed 6 to 8 refusal episodes during non-preferred transitions.",
        },
      }),
      prisma.behaviorProgram.create({
        data: {
          treatmentPlanId: treatmentPlan.id,
          name: "Independent Daily Living Routine",
          description:
            "Build independence with handwashing, packing materials, and end-of-session cleanup routines.",
          type: ProgramType.skillAcquisition,
          status: ProgramStatus.active,
          masteryDefinition:
            "Completes routine analysis with 85% independence for 3 consecutive sessions.",
          baselineData:
            "Baseline completion ranged from 30% to 45% independence.",
        },
      }),
    ]);

    const linkedAppointments = completedAppointments
      .filter((appointment) => appointment.patientId === patient.id)
      .slice(0, 3);

    const sessionDates = linkedAppointments.length
      ? linkedAppointments.map((appointment) => appointment.scheduledStartAt)
      : [
          daysFromNow(-14 - index, 10, 0),
          daysFromNow(-7 - index, 11, 0),
          daysFromNow(-2 - index, 9, 30),
        ];

    const sessionNotes: Array<{ id: string; sessionDate: Date }> = [];

    for (const [sessionIndex, sessionDate] of sessionDates.entries()) {
      const linkedAppointment = linkedAppointments[sessionIndex];
      const note = await prisma.sessionNote.create({
        data: {
          patientId: patient.id,
          therapistId: sessionIndex % 2 === 0 ? therapist.id : provider.userId,
          treatmentPlanId: treatmentPlan.id,
          appointmentId: linkedAppointment?.id,
          sessionDate,
          durationMinutes: 150,
          summary:
            sessionIndex === 0
              ? "Strong rapport and engagement. Patient responded well to visual schedule and token board."
              : sessionIndex === 1
                ? "Improved transitions with fewer prompts. Functional requests increased during table work."
                : "Generalized communication targets into play and snack routines with reduced refusal behavior.",
          clientBehavior:
            sessionIndex === 0
              ? "Mild escape behavior during cleanup; redirected successfully."
              : sessionIndex === 1
                ? "Brief vocal protest at transition, resolved within one minute."
                : "Maintained calm body and accepted redirection during challenging tasks.",
          nextSteps:
            sessionIndex === 2
              ? "Increase independence criteria and continue caregiver coaching for home routines."
              : "Continue current targets and fade prompts where successful.",
        },
      });

      sessionNotes.push(note);

      for (const [programIndex, program] of programs.entries()) {
        const baseValue =
          programIndex === 0
            ? 55 + sessionIndex * 15 + index * 2
            : programIndex === 1
              ? 6 - sessionIndex * 2
              : 45 + sessionIndex * 12;

        if (programIndex === 1) {
          await prisma.dataPoint.create({
            data: {
              sessionNoteId: note.id,
              programId: program.id,
              recordingType: DataRecordingType.frequencyRate,
              value: Math.max(baseValue, 1),
              trialNumber: null,
              notes: "Frequency of refusal behavior during transitions.",
              recordedAt: hoursAfter(sessionDate, 0, 20 + programIndex * 5),
            },
          });
        } else {
          const trials = 10 + sessionIndex * 2;
          const percentCorrect = Math.min(Math.max(baseValue, 5), 95);
          const correctTrials = Math.round((trials * percentCorrect) / 100);

          for (let trial = 1; trial <= trials; trial += 1) {
            await prisma.dataPoint.create({
              data: {
                sessionNoteId: note.id,
                programId: program.id,
                recordingType: DataRecordingType.discreteTrial,
                response:
                  trial <= correctTrials
                    ? DataResponse.correct
                    : DataResponse.prompted,
                trialNumber: trial,
                notes: "Discrete trial performance for mastery tracking.",
                recordedAt: hoursAfter(
                  sessionDate,
                  0,
                  20 + programIndex * 5 + trial,
                ),
              },
            });
          }
        }
      }
    }

    await prisma.insuranceAuthorization.create({
      data: {
        patientId: patient.id,
        treatmentPlanId: treatmentPlan.id,
        insurancePlan: patient.insuranceProvider ?? "Aetna Better Health",
        authorizationNumber: `AUTH-${createReference("aba").slice(-8)}`,
        startDate: daysFromNow(-30, 0, 0),
        endDate: daysFromNow(60, 0, 0),
        approvedHours: 120,
        usedHours: 38 + index * 6,
        status: InsuranceAuthorizationStatus.active,
        notes: "Authorization seeded for demo reporting and hours tracking.",
      },
    });

    await prisma.progressReport.create({
      data: {
        patientId: patient.id,
        treatmentPlanId: treatmentPlan.id,
        generatedById: provider.userId,
        title: "Monthly ABA Progress Report",
        periodStart: daysFromNow(-30, 0, 0),
        periodEnd: daysFromNow(0, 0, 0),
        status:
          index % 2 === 0
            ? ProgressReportStatus.published
            : ProgressReportStatus.draft,
        content: {
          patient: {
            name: patientUser?.displayName ?? `Patient ${index + 1}`,
            dob: patient.birthDate?.toISOString() ?? null,
            diagnosis: null,
          },
          provider: {
            name:
              foundation.providers.find((u) => u.id === provider.userId)
                ?.displayName ?? "Provider",
            credentials: ["PMHNP-BC"],
          },
          treatmentPlan: { title: treatmentPlan.title },
          behaviorPrograms: programs.map((program, programIndex) => ({
            name: program.name,
            type: program.type as string,
            masteryPercent: programIndex === 1 ? 40 : 60 + index,
            sessionsCount: sessionNotes.length,
            lastSessionDate:
              sessionNotes.at(-1)?.sessionDate?.toISOString() ?? null,
            masteryStatus: programIndex === 1 ? "inProgress" : "mastered",
          })),
          sessionStats: {
            total: sessionNotes.length,
            totalMinutes: sessionNotes.length * 150,
            averageDurationMinutes: 150,
            firstSession:
              sessionNotes.at(0)?.sessionDate?.toISOString() ?? null,
            lastSession:
              sessionNotes.at(-1)?.sessionDate?.toISOString() ?? null,
          },
          dataPointSummary: {
            totalTrials: sessionNotes.length * 10,
            programsWithData: programs.length,
          },
          generatedAt: new Date().toISOString(),
        },
      },
    });

    if (index < 3) {
      await prisma.caregiverAccess.create({
        data: {
          caregiverId: caregiver.id,
          patientId: patient.id,
          grantedById: provider.userId,
          isActive: true,
          notes:
            "Linked caregiver demo access for patient portal read-only clinical viewing.",
        },
      });
    }
  }
}

// TODO this is the real provider seed for prod
export async function seedProvidersFromCV(
  foundation: Awaited<ReturnType<typeof seedFoundation>>,
  branches: Awaited<ReturnType<typeof seedBusinessAndBranches>>,
  adminUserId: string,
) {
  const cvProviderData = [
    {
      // Unisa Turay
      firstName: "Unisa",
      lastName: "Turay",
      displayName: "Unisa Turay",
      email: "jrturay3@gmail.com",
      phone: null,
      title: "Psychiatric Provider",
      credentials: [],
      specialties: [
        "Applied Behavior Analysis",
        "Autism Spectrum Disorder",
        "Family-Centered Care",
        "Caregiver Support",
      ],
      education: null,
      yearsExperience: null,
      languages: ["English"],
      bio: "Provider profile details are being finalized. Families can contact Connected Psychiatric Care Therapy for current provider availability and care-team assignments.",
      licenseNumber: null,
      consultationFee: 0,
      commissionPercent: 0,
    },
    {
      // Emmanuel Abimbola
      firstName: "Emmanuel",
      lastName: "Abimbola",
      displayName: "Emmanuel Abimbola",
      email: "divinflex@yahoo.com",
      phone: null,
      title: "Psychiatric Provider",
      credentials: [],
      specialties: [
        "Applied Behavior Analysis",
        "Autism Spectrum Disorder",
        "Family-Centered Care",
        "Caregiver Support",
      ],
      education: null,
      yearsExperience: null,
      languages: ["English"],
      bio: "Provider profile details are being finalized. Families can contact Connected Psychiatric Care Therapy for current provider availability and care-team assignments.",
      licenseNumber: null,
      consultationFee: 0,
      commissionPercent: 0,
    },
    {
      // Daniella Turay
      firstName: "Daniella",
      lastName: "Turay",
      displayName: "Daniella Turay",
      email: "daniellapturay@gmail.com",
      phone: null,
      title: "Psychiatric Provider",
      credentials: [],
      specialties: [
        "Applied Behavior Analysis",
        "Autism Spectrum Disorder",
        "Family-Centered Care",
        "Caregiver Support",
      ],
      education: null,
      yearsExperience: null,
      languages: ["English"],
      bio: "Provider profile details are being finalized. Families can contact Connected Psychiatric Care Therapy for current provider availability and care-team assignments.",
      licenseNumber: null,
      consultationFee: 0,
      commissionPercent: 0,
    },
  ];

  for (const providerData of cvProviderData) {
    // Create the user
    const user = await prisma.user.create({
      data: {
        firstName: providerData.firstName,
        lastName: providerData.lastName,
        displayName: providerData.displayName,
        email: providerData.email,
        phone: providerData.phone,
        password: await argon2.hash(DEFAULT_PASSWORD),
        role: UserRole.staff,
        status: UserStatus.active,
        isEmailVerified: true,
        isPhoneVerified: true,
        pushNotifications: false,
      },
    });

    // Create the provider profile (assign to the first branch)
    await prisma.providerProfile.create({
      data: {
        userId: user.id,
        branchId: branches.nycBranch.id, // or any branch you prefer
        createdById: adminUserId,
        slug: `dr-${providerData.firstName.toLowerCase()}-${providerData.lastName.toLowerCase()}`,
        title: providerData.title,
        bio: providerData.bio,
        licenseNumber: providerData.licenseNumber,
        yearsExperience: providerData.yearsExperience,
        education: providerData.education,
        credentials: providerData.credentials,
        specialties: providerData.specialties,
        languages: providerData.languages,
        consultationFee: providerData.consultationFee,
        commissionPercent: providerData.commissionPercent,
        isAvailable: true,
        isPubliclyListed: true,
      },
    });

    console.log(`Seeded provider: ${providerData.displayName} (${user.email})`);
  }
}

async function main() {
  console.log("Starting Prisma PROD seed...");
  console.log(`Default seed password: ${DEFAULT_PASSWORD}`);

  await clearDatabase();

  const foundation = await seedFoundation();
  const media = await seedMedia(foundation);
  const branches = await seedBusinessAndBranches(foundation, media);
  const profiles = await seedProfiles(foundation, branches, media);
  await seedAvailability(profiles);
  const appointments = await seedAppointments(foundation, profiles, branches);
  await seedClinicalData(foundation, profiles, appointments);
  await seedConversations(foundation, profiles, appointments, branches);
  await seedPayments(foundation, appointments);
  await seedPublicContent(foundation, profiles);
  await seedStaffAssignments(foundation, profiles);
  await seedNotifications(foundation);
  await seedTrafficAndLeads();

  console.log("Seed completed successfully.");
  console.log("Demo logins:");
  console.log(`Admin: admin@connectedpsychiatriccare.demo / ${DEFAULT_PASSWORD}`);
  console.log(
    `Patient: patient1@connectedpsychiatriccare.demo / ${DEFAULT_PASSWORD} (and patient2..patient14)`,
  );
  console.log(
    `Provider: angela.torres@connectedpsychiatriccare.demo / ${DEFAULT_PASSWORD} (and sarah.mitchell, james.reeves, kevin.park, marcus.chen, priya.sharma, olivia.bennett, daniel.carter, sofia.ramirez)`,
  );
  console.log(
    `Staff: staff.cole@connectedpsychiatriccare.demo / ${DEFAULT_PASSWORD} (and staff.brooks, staff.diaz, staff.quinn)`,
  );
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



