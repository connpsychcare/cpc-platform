import "dotenv/config";
import argon2 from "argon2";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  JobEmploymentType,
  JobLocationType,
  MediaType,
  MediaVisibility,
  PrismaClient,
  ThemeMode,
  UserRole,
  UserStatus,
  Weekday,
} from "../prisma/generated/client";

const connectionString = process.env.DB_MIGRATE_URI ?? process.env.DB_URI;

if (!connectionString) {
  throw new Error(
    "DB_MIGRATE_URI or DB_URI is required to run the production seed.",
  );
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const SITE_URL = "https://connectedpsychiatriccare.com";
const DEFAULT_TIMEZONE = "America/Los_Angeles";
const TEMP_ADMIN_PASSWORD = "CPCAdmin@2026!";
const TEMP_PROVIDER_PASSWORD = "CPCProvider@2026!";

const seedAssets = {
  logoLight: {
    publicId: "production/connected-psychiatric-care-logo-light",
    cloudinaryUrl:
      "https://res.cloudinary.com/djeljp9ea/image/upload/v1777744789/logo-light_l6y6op.png",
    name: "Connected Psychiatric Care logo",
    altText: "Connected Psychiatric Care logo",
  },
  logoDark: {
    publicId: "production/connected-psychiatric-care-logo-dark",
    cloudinaryUrl:
      "https://res.cloudinary.com/djeljp9ea/image/upload/v1777744789/logo-dark_ltwbf0.png",
    name: "Connected Psychiatric Care dark logo",
    altText: "Connected Psychiatric Care logo",
  },
  favicon: {
    publicId: "production/connected-psychiatric-care-icon",
    cloudinaryUrl:
      "https://res.cloudinary.com/djeljp9ea/image/upload/v1777744790/icon_xhxwi4.png",
    name: "Connected Psychiatric Care icon",
    altText: "Connected Psychiatric Care icon",
  },
} as const;

const business = {
  name: "Connected Psychiatric Care",
  legalName: "Connected Psychiatric Care Professional Nursing Corporation",
  description:
    "Compassionate, evidence-based psychiatric care for adults and adolescents in California. Specializing in medication management, therapy, ADHD, depression, anxiety, and behavioral health.",
  email: "REPLACE_WITH_ROBERTS_EMAIL",
  phone: "REPLACE_WITH_OFFICE_PHONE",
  whatsapp: "REPLACE_WITH_WHATSAPP",
  website: SITE_URL,
  facebook: "REPLACE_WITH_FACEBOOK_URL",
  instagram: "REPLACE_WITH_INSTAGRAM_URL",
  tiktok: "REPLACE_WITH_TIKTOK_URL",
  twitter: "REPLACE_WITH_TWITTER_URL",
  linkedin: "REPLACE_WITH_LINKEDIN_URL",
  metaTitle: "Connected Psychiatric Care | Psychiatric Services for Adults & Adolescents",
  metaDescription:
    "Compassionate psychiatric care for adults and adolescents in California. Book appointments, track progress, and connect with the Connected Psychiatric Care clinical team.",
} as const;

const adminUser = {
  firstName: "REPLACE_WITH_ADMIN_FIRST_NAME",
  lastName: "REPLACE_WITH_ADMIN_LAST_NAME",
  displayName: "REPLACE_WITH_ADMIN_DISPLAY_NAME",
  email: "REPLACE_WITH_ADMIN_EMAIL",
  phone: "REPLACE_WITH_ADMIN_PHONE",
} as const;

const branches = [
  {
    name: "CPC Main Clinic",
    slug: "cpc-main-clinic",
    email: business.email,
    phone: "REPLACE_WITH_CLINIC_PHONE",
    whatsapp: "REPLACE_WITH_CLINIC_WHATSAPP",
    street: "REPLACE_WITH_CLINIC_STREET",
    city: "REPLACE_WITH_CLINIC_CITY",
    state: "CA",
    postalCode: "REPLACE_WITH_POSTAL_CODE",
    country: "United States",
    latitude: 34.0522,
    longitude: -118.2437,
    timezone: DEFAULT_TIMEZONE,
    isActive: true,
  },
] as const;

const providers = [
  {
    firstName: "REPLACE_WITH_OWNER_FIRST_NAME",
    lastName: "REPLACE_WITH_OWNER_LAST_NAME",
    displayName: "REPLACE_WITH_OWNER_DISPLAY_NAME",
    email: "REPLACE_WITH_OWNER_EMAIL",
    phone: "REPLACE_WITH_OWNER_PHONE",
    title: "Owner, Psychiatric Nurse Practitioner",
    credentials: ["PMHNP-BC", "APRN"],
    specialties: [
      "Adult Psychiatry",
      "Child & Adolescent Psychiatry",
      "Medication Management",
      "Depression Treatment",
      "Anxiety Treatment",
    ],
    education: "MSN, Psychiatric Mental Health Nurse Practitioner",
    yearsExperience: 10,
    languages: ["English"],
    bio: "REPLACE_WITH_OWNER_BIO",
    licenseNumber: undefined,
    consultationFee: 0,
  },
  {
    firstName: "REPLACE_WITH_PROVIDER2_FIRST",
    lastName: "REPLACE_WITH_PROVIDER2_LAST",
    displayName: "REPLACE_WITH_PROVIDER2_DISPLAY",
    email: "REPLACE_WITH_PROVIDER2_EMAIL",
    phone: undefined,
    title: "Psychiatric Provider",
    credentials: [],
    specialties: [
      "Adult Psychiatry",
      "ADHD Treatment",
      "Psychotherapy",
      "Caregiver Support",
    ],
    education: undefined,
    yearsExperience: undefined,
    languages: ["English"],
    bio: "Provider profile details are being finalized. Patients can contact Connected Psychiatric Care for current provider availability and care-team assignments.",
    licenseNumber: undefined,
    consultationFee: 0,
  },
  {
    firstName: "REPLACE_WITH_PROVIDER3_FIRST",
    lastName: "REPLACE_WITH_PROVIDER3_LAST",
    displayName: "REPLACE_WITH_PROVIDER3_DISPLAY",
    email: "REPLACE_WITH_PROVIDER3_EMAIL",
    phone: undefined,
    title: "Psychiatric Provider",
    credentials: [],
    specialties: [
      "Adult Psychiatry",
      "Trauma & PTSD",
      "Family Therapy",
      "Caregiver Support",
    ],
    education: undefined,
    yearsExperience: undefined,
    languages: ["English"],
    bio: "Provider profile details are being finalized. Patients can contact Connected Psychiatric Care for current provider availability and care-team assignments.",
    licenseNumber: undefined,
    consultationFee: 0,
  },
  {
    firstName: "REPLACE_WITH_PROVIDER4_FIRST",
    lastName: "REPLACE_WITH_PROVIDER4_LAST",
    displayName: "REPLACE_WITH_PROVIDER4_DISPLAY",
    email: "REPLACE_WITH_PROVIDER4_EMAIL",
    phone: undefined,
    title: "Psychiatric Provider",
    credentials: [],
    specialties: [
      "Child & Adolescent Psychiatry",
      "ADHD Treatment",
      "Behavioral Health",
      "Caregiver Support",
    ],
    education: undefined,
    yearsExperience: undefined,
    languages: ["English"],
    bio: "Provider profile details are being finalized. Families can contact Connected Psychiatric Care Therapy for current provider availability and care-team assignments.",
    licenseNumber: undefined,
    consultationFee: 0,
  },
] as const;

const defaultProviderAvailability = [
  Weekday.monday,
  Weekday.tuesday,
  Weekday.wednesday,
  Weekday.thursday,
  Weekday.friday,
].map((weekday) => ({
  weekday,
  startTime: "09:00",
  endTime: "17:00",
  slotDurationMinute: 60,
  isActive: true,
}));

// Add active job listings only after the client confirms hiring roles.
const jobListings: Array<{
  title: string;
  type: JobEmploymentType;
  locationType: JobLocationType;
  location: string;
  department?: string | null;
  description: string;
  requirements?: string | null;
  salary?: string | null;
}> = [];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

async function upsertMedia(
  uploadedById: string,
  asset: (typeof seedAssets)[keyof typeof seedAssets],
) {
  // Upload the final media files to Cloudinary, then paste the resulting URL
  // into cloudinaryUrl before running this seed in production.
  if (asset.cloudinaryUrl.startsWith("TODO_REPLACE_WITH_CLOUDINARY_")) {
    throw new Error(`Cloudinary URL is required for ${asset.name}.`);
  }

  return prisma.media.upsert({
    where: { publicId: asset.publicId },
    update: {
      url: asset.cloudinaryUrl,
      name: asset.name,
      altText: asset.altText,
      notes: "Production Cloudinary asset seeded by seed.prod.ts.",
      visibility: MediaVisibility.public,
      deletedAt: null,
    },
    create: {
      uploadedById,
      publicId: asset.publicId,
      url: asset.cloudinaryUrl,
      mimeType: "image/png",
      resourceType: "image",
      size: 1,
      hash: asset.publicId,
      name: asset.name,
      altText: asset.altText,
      type: MediaType.other,
      visibility: MediaVisibility.public,
      notes: "Production Cloudinary asset seeded by seed.prod.ts.",
    },
  });
}

async function seedAdmin() {
  const password = await argon2.hash(TEMP_ADMIN_PASSWORD);

  return prisma.user.upsert({
    where: { email: adminUser.email },
    update: {
      firstName: adminUser.firstName,
      lastName: adminUser.lastName,
      displayName: adminUser.displayName,
      phone: adminUser.phone,
      password,
      role: UserRole.admin,
      status: UserStatus.active,
      isEmailVerified: true,
      isPhoneVerified: false,
      preferredTheme: ThemeMode.system,
      loginAlerts: true,
    },
    create: {
      firstName: adminUser.firstName,
      lastName: adminUser.lastName,
      displayName: adminUser.displayName,
      email: adminUser.email,
      phone: adminUser.phone,
      password,
      role: UserRole.admin,
      status: UserStatus.active,
      isEmailVerified: true,
      isPhoneVerified: false,
      preferredTheme: ThemeMode.system,
      loginAlerts: true,
    },
  });
}

async function seedBusiness(adminUserId: string) {
  const logoLight = await upsertMedia(adminUserId, seedAssets.logoLight);
  const logoDark = await upsertMedia(adminUserId, seedAssets.logoDark);
  const favicon = await upsertMedia(adminUserId, seedAssets.favicon);

  const existing = await prisma.businessProfile.findFirst({
    where: { legalName: business.legalName },
    select: { id: true },
  });

  const data = {
    ...business,
    logoLightId: logoLight.id,
    logoDarkId: logoDark.id,
    faviconId: favicon.id,
  };

  return existing
    ? prisma.businessProfile.update({ where: { id: existing.id }, data })
    : prisma.businessProfile.create({ data });
}

async function seedBranches(businessProfileId: string) {
  const seededBranches = [];

  for (const branchSeed of branches) {
    const branch = await prisma.branch.upsert({
      where: { slug: branchSeed.slug },
      update: { ...branchSeed, businessProfileId, deletedAt: null },
      create: { ...branchSeed, businessProfileId },
    });

    await prisma.branchTiming.deleteMany({ where: { branchId: branch.id } });
    await prisma.branchTiming.createMany({
      data: [
        Weekday.monday,
        Weekday.tuesday,
        Weekday.wednesday,
        Weekday.thursday,
        Weekday.friday,
      ].map((weekday) => ({
        branchId: branch.id,
        weekday,
        openTime: "09:00",
        closeTime: "18:00",
        isClosed: false,
      })),
    });
    await prisma.branchTiming.createMany({
      data: [
        {
          branchId: branch.id,
          weekday: Weekday.saturday,
          openTime: "09:00",
          closeTime: "17:00",
          isClosed: false,
        },
        {
          branchId: branch.id,
          weekday: Weekday.sunday,
          openTime: "09:00",
          closeTime: "17:00",
          isClosed: false,
        },
      ],
    });

    seededBranches.push(branch);
  }

  return seededBranches;
}

async function seedProviders(adminUserId: string, branchId: string) {
  const password = await argon2.hash(TEMP_PROVIDER_PASSWORD);
  const seededProviders = [];

  for (const provider of providers) {
    const user = await prisma.user.upsert({
      where: { email: provider.email },
      update: {
        firstName: provider.firstName,
        lastName: provider.lastName,
        displayName: provider.displayName,
        phone: provider.phone,
        role: UserRole.staff,
        status: UserStatus.active,
        isEmailVerified: true,
        isPhoneVerified: true,
      },
      create: {
        firstName: provider.firstName,
        lastName: provider.lastName,
        displayName: provider.displayName,
        email: provider.email,
        phone: provider.phone,
        password,
        role: UserRole.staff,
        status: UserStatus.active,
        isEmailVerified: true,
        isPhoneVerified: true,
      },
    });

    const providerProfile = await prisma.providerProfile.upsert({
      where: { userId: user.id },
      update: {
        branchId,
        title: provider.title,
        bio: provider.bio,
        licenseNumber: provider.licenseNumber,
        yearsExperience: provider.yearsExperience,
        education: provider.education,
        credentials: provider.credentials as any,
        specialties: provider.specialties as any,
        languages: provider.languages as any,
        consultationFee: provider.consultationFee,
        isAvailable: true,
        isPubliclyListed: true,
      },
      create: {
        userId: user.id,
        branchId,
        createdById: adminUserId,
        slug: slugify(provider.displayName.replace(/,\s*(PMHNP|APRN|BCBA|MD|DO).*$/i, "")),
        title: provider.title,
        bio: provider.bio,
        licenseNumber: provider.licenseNumber,
        yearsExperience: provider.yearsExperience,
        education: provider.education,
        credentials: provider.credentials as any,
        specialties: provider.specialties as any,
        languages: provider.languages as any,
        consultationFee: provider.consultationFee,
        isAvailable: true,
        isPubliclyListed: true,
      },
    });

    seededProviders.push({
      id: providerProfile.id,
      name: provider.displayName,
      email: user.email,
      phone: user.phone,
      title: provider.title,
    });
  }

  return seededProviders;
}

async function seedProviderAvailability(providerIds: string[]) {
  for (const providerId of providerIds) {
    const existingRules = await prisma.providerAvailability.count({
      where: { providerId },
    });

    if (existingRules > 0) {
      continue;
    }

    await prisma.providerAvailability.createMany({
      data: defaultProviderAvailability.map((rule) => ({
        providerId,
        ...rule,
      })),
    });
  }
}


async function seedJobs() {
  for (const job of jobListings) {
    const existing = await prisma.jobListing.findFirst({
      where: { title: job.title, location: job.location },
      select: { id: true },
    });

    const data = { ...job, isActive: true };

    if (existing) {
      await prisma.jobListing.update({ where: { id: existing.id }, data });
    } else {
      await prisma.jobListing.create({ data });
    }
  }
}

function logAdminHandoff({
  adminEmail,
  businessName,
  branchName,
  providerAccounts,
}: {
  adminEmail: string | null;
  businessName: string;
  branchName: string;
  providerAccounts: Array<{
    name: string;
    email: string | null;
    phone: string | null;
    title: string;
  }>;
}) {
  console.log("");
  console.log("========================================");
  console.log("Admin handoff details");
  console.log("========================================");
  console.log(`Dashboard URL: ${process.env.DASHBOARD_ENDPOINT ?? ""}`);
  console.log(`Public website: ${SITE_URL}`);
  console.log(`Business profile: ${businessName}`);
  console.log(`Primary branch: ${branchName}`);
  console.log("");
  console.log("Admin account");
  console.log(`Name: ${adminUser.displayName}`);
  console.log(`Email: ${adminEmail ?? adminUser.email}`);
  console.log(`Phone: ${adminUser.phone}`);
  console.log(`Temporary password: ${TEMP_ADMIN_PASSWORD}`);
  console.log("");
  console.log("Provider accounts");

  if (providerAccounts.length === 0) {
    console.log("No provider accounts were seeded.");
  } else {
    for (const provider of providerAccounts) {
      console.log(`- ${provider.name}`);
      console.log(`  Email: ${provider.email ?? ""}`);
      console.log(`  Phone: ${provider.phone ?? ""}`);
      console.log(`  Title: ${provider.title}`);
      console.log(`  Temporary password: ${TEMP_PROVIDER_PASSWORD}`);
    }
  }

  console.log("");
  console.log("Share with admin");
  console.log("- Admin dashboard URL, admin email, and temporary admin password.");
  console.log("- Provider emails and the temporary provider password if providers should log in.");
  console.log("- Ask every seeded user to change the temporary password after first login.");
  console.log("");
  console.log("Not seeded");
  console.log(
    "Patients, clinical records, appointments, payments, messages, notifications, testimonials, and active jobs.",
  );
  console.log("========================================");
}

/**
 * Every REPLACE_WITH_ value has to be filled in with the practice's real details
 * before this seed can run. Without this check the run dies partway through on
 * an opaque Postgres "value too long for the column's type", because
 * REPLACE_WITH_ADMIN_PHONE is 24 characters and User.phone is VarChar(20).
 */
function assertPlaceholdersReplaced() {
  const unreplaced: string[] = [];

  const scan = (label: string, value: unknown) => {
    if (typeof value === "string" && value.startsWith("REPLACE_WITH_")) {
      unreplaced.push(`${label} = ${value}`);
    }
  };

  for (const [key, value] of Object.entries(business)) scan(`business.${key}`, value);
  for (const [key, value] of Object.entries(adminUser)) scan(`adminUser.${key}`, value);
  branches.forEach((b, i) => {
    for (const [key, value] of Object.entries(b)) scan(`branches[${i}].${key}`, value);
  });
  providers.forEach((provider, i) => {
    for (const [key, value] of Object.entries(provider)) {
      scan(`providers[${i}].${key}`, value);
    }
  });

  if (unreplaced.length > 0) {
    throw new Error(
      "This seed still contains placeholder values. Fill these in with the " +
        "practice's real details before running it:\n  " +
        unreplaced.join("\n  "),
    );
  }
}

async function main() {
  console.log("Starting Prisma production seed...");
  console.log("This seed is idempotent and does not clear transactional data.");

  assertPlaceholdersReplaced();

  const admin = await seedAdmin();
  const businessProfile = await seedBusiness(admin.id);
  const [primaryBranch] = await seedBranches(businessProfile.id);

  if (!primaryBranch) {
    throw new Error("At least one production branch is required.");
  }

  const providerAccounts = await seedProviders(admin.id, primaryBranch.id);
  await seedProviderAvailability(
    providerAccounts.map((provider) => provider.id),
  );
  await seedJobs();

  console.log("Production seed completed.");
  logAdminHandoff({
    adminEmail: admin.email,
    businessName: businessProfile.name,
    branchName: primaryBranch.name,
    providerAccounts,
  });
}

main()
  .catch((error) => {
    console.error("Production seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
