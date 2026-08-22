import "dotenv/config";
import argon2 from "argon2";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  AppointmentChannel,
  AppointmentStatus,
  BookingSource,
  ConversationStatus,
  ConversationType,
  Gender,
  MediaType,
  MediaVisibility,
  NotificationChannel,
  NotificationPurpose,
  NotificationStatus,
  PaymentMethodType,
  PaymentProvider,
  PaymentStatus,
  PermissionModule,
  PrismaClient,
  ProgramStatus,
  ProgramType,
  ThemeMode,
  TreatmentPlanStatus,
  UserRole,
  UserStatus,
} from "../prisma/generated/client";

const connectionString = process.env.DB_MIGRATE_URI ?? process.env.DB_URI;

if (!connectionString) {
  throw new Error("DB_MIGRATE_URI or DB_URI is required to seed demo accounts.");
}

const DEMO_PASSWORD = "CpcDemo2026!";
const DEMO_PHONE_BASE = "+12405559";

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const timezone = "America/New_York";

const addDays = (days: number, hour = 14, minute = 0) => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  date.setUTCHours(hour, minute, 0, 0);
  return date;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

async function getBranch() {
  const branch = await prisma.branch.findFirst({
    where: { deletedAt: null, isActive: true },
    orderBy: { createdAt: "asc" },
  });

  if (!branch) {
    throw new Error("No active branch found. Run the production seed first.");
  }

  return branch;
}

async function upsertDemoAdmin() {
  const password = await argon2.hash(DEMO_PASSWORD);

  const user = await prisma.user.upsert({
    where: { email: "demo-admin@connectedpsychiatriccare.com" },
    update: {
      firstName: "Demo",
      lastName: "Admin",
      displayName: "Demo Admin",
      password,
      role: UserRole.admin,
      status: UserStatus.active,
      isEmailVerified: true,
      isPhoneVerified: true,
      isDemo: true,
      preferredTheme: ThemeMode.system,
      onboardingCompletedAt: new Date(),
      loginAlerts: false,
      deletedAt: null,
    },
    create: {
      firstName: "Demo",
      lastName: "Admin",
      displayName: "Demo Admin",
      email: "demo-admin@connectedpsychiatriccare.com",
      phone: `${DEMO_PHONE_BASE}900`,
      password,
      role: UserRole.admin,
      status: UserStatus.active,
      isEmailVerified: true,
      isPhoneVerified: true,
      isDemo: true,
      preferredTheme: ThemeMode.system,
      onboardingCompletedAt: new Date(),
      loginAlerts: false,
    },
  });

  console.log(`  Demo admin: ${user.email}`);
  return user;
}

async function upsertDemoProvider(branchId: string, createdById: string) {
  const password = await argon2.hash(DEMO_PASSWORD);

  const user = await prisma.user.upsert({
    where: { email: "demo-provider@connectedpsychiatriccare.com" },
    update: {
      firstName: "Demo",
      lastName: "Provider",
      displayName: "Demo Provider, PMHNP-BC",
      password,
      role: UserRole.staff,
      status: UserStatus.active,
      isEmailVerified: true,
      isPhoneVerified: true,
      isDemo: true,
      preferredTheme: ThemeMode.system,
      onboardingCompletedAt: new Date(),
      loginAlerts: false,
      deletedAt: null,
    },
    create: {
      firstName: "Demo",
      lastName: "Provider",
      displayName: "Demo Provider, PMHNP-BC",
      email: "demo-provider@connectedpsychiatriccare.com",
      phone: `${DEMO_PHONE_BASE}901`,
      password,
      role: UserRole.staff,
      status: UserStatus.active,
      isEmailVerified: true,
      isPhoneVerified: true,
      isDemo: true,
      preferredTheme: ThemeMode.system,
      onboardingCompletedAt: new Date(),
      loginAlerts: false,
    },
  });

  const profile = await prisma.providerProfile.upsert({
    where: { userId: user.id },
    update: {
      branchId,
      title: "Psychiatric Nurse Practitioner",
      bio: "Demo provider account for app testing and store review.",
      credentials: ["PMHNP-BC"],
      specialties: ["Adult Psychiatry", "Medication Management", "Psychotherapy"],
      languages: ["English"],
      consultationFee: 0,
      isAvailable: true,
      isPubliclyListed: true,
    },
    create: {
      userId: user.id,
      branchId,
      createdById,
      slug: "demo-provider-pmhnp",
      title: "Psychiatric Nurse Practitioner",
      bio: "Demo provider account for app testing and store review.",
      credentials: ["PMHNP-BC"],
      specialties: ["Adult Psychiatry", "Medication Management", "Psychotherapy"],
      languages: ["English"],
      consultationFee: 0,
      isAvailable: true,
      isPubliclyListed: true,
    },
  });

  console.log(`  Demo provider: ${user.email}`);
  return { user, profile };
}

async function upsertDemoStaff(branchId: string) {
  const password = await argon2.hash(DEMO_PASSWORD);

  const user = await prisma.user.upsert({
    where: { email: "demo-staff@connectedpsychiatriccare.com" },
    update: {
      firstName: "Demo",
      lastName: "Staff",
      displayName: "Demo Staff",
      password,
      role: UserRole.staff,
      status: UserStatus.active,
      isEmailVerified: true,
      isPhoneVerified: true,
      isDemo: true,
      preferredTheme: ThemeMode.system,
      onboardingCompletedAt: new Date(),
      loginAlerts: false,
      deletedAt: null,
    },
    create: {
      firstName: "Demo",
      lastName: "Staff",
      displayName: "Demo Staff",
      email: "demo-staff@connectedpsychiatriccare.com",
      phone: `${DEMO_PHONE_BASE}902`,
      password,
      role: UserRole.staff,
      status: UserStatus.active,
      isEmailVerified: true,
      isPhoneVerified: true,
      isDemo: true,
      preferredTheme: ThemeMode.system,
      onboardingCompletedAt: new Date(),
      loginAlerts: false,
    },
  });

  const profile = await prisma.staffProfile.upsert({
    where: { userId: user.id },
    update: {
      branchId,
      title: "Behavior Technician",
      isActive: true,
    },
    create: {
      userId: user.id,
      branchId,
      title: "Behavior Technician",
      isActive: true,
    },
  });

  // Grant all permission modules
  await prisma.staffPermission.deleteMany({ where: { staffId: profile.id } });
  await prisma.staffPermission.createMany({
    data: Object.values(PermissionModule).map((module) => ({
      staffId: profile.id,
      module,
    })),
  });

  console.log(`  Demo staff: ${user.email}`);
  return { user, profile };
}

async function upsertDemoPatient() {
  const password = await argon2.hash(DEMO_PASSWORD);

  const user = await prisma.user.upsert({
    where: { email: "demo-patient@connectedpsychiatriccare.com" },
    update: {
      firstName: "Demo",
      lastName: "Patient",
      displayName: "Demo Patient",
      password,
      role: UserRole.patient,
      status: UserStatus.active,
      isEmailVerified: true,
      isPhoneVerified: true,
      isDemo: true,
      preferredTheme: ThemeMode.system,
      onboardingCompletedAt: new Date(),
      pushNotifications: true,
      loginAlerts: false,
      deletedAt: null,
    },
    create: {
      firstName: "Demo",
      lastName: "Patient",
      displayName: "Demo Patient",
      email: "demo-patient@connectedpsychiatriccare.com",
      phone: `${DEMO_PHONE_BASE}903`,
      password,
      role: UserRole.patient,
      status: UserStatus.active,
      isEmailVerified: true,
      isPhoneVerified: true,
      isDemo: true,
      preferredTheme: ThemeMode.system,
      onboardingCompletedAt: new Date(),
      pushNotifications: true,
      loginAlerts: false,
    },
  });

  const patient = await prisma.patientProfile.upsert({
    where: { userId: user.id },
    update: {
      birthDate: new Date("2017-06-15T00:00:00.000Z"),
      gender: Gender.male,
      address: "1000 Wilshire Blvd, Los Angeles, CA 90017",
      emergencyContactName: "Demo Caregiver",
      emergencyContactNumber: "+12405550100",
      insuranceProvider: "Demo Health Plan",
      insurancePolicyNumber: "DEMO-CPC-PATIENT",
      allergies: "No known allergies",
      currentMedication: "None",
      familyMedicalHistory: "Demo patient for app testing.",
      pastMedicalHistory: "Mental health treatment history.",
    },
    create: {
      userId: user.id,
      birthDate: new Date("2017-06-15T00:00:00.000Z"),
      gender: Gender.male,
      address: "1000 Wilshire Blvd, Los Angeles, CA 90017",
      emergencyContactName: "Demo Caregiver",
      emergencyContactNumber: "+12405550100",
      insuranceProvider: "Demo Health Plan",
      insurancePolicyNumber: "DEMO-CPC-PATIENT",
      allergies: "No known allergies",
      currentMedication: "None",
      familyMedicalHistory: "Demo patient for app testing.",
      pastMedicalHistory: "Mental health treatment history.",
    },
  });

  console.log(`  Demo patient: ${user.email}`);
  return { user, patient };
}

async function seedAppointments({
  branchId,
  patientId,
  patientUserId,
  providerId,
  providerUserId,
}: {
  branchId: string;
  patientId: string;
  patientUserId: string;
  providerId: string;
  providerUserId: string;
}) {
  const upcoming = await prisma.appointment.upsert({
    where: { appointmentNumber: "DEMO-APT-2001" },
    update: {
      branchId,
      patientId,
      providerId,
      status: AppointmentStatus.confirmed,
      bookingSource: BookingSource.app,
      channel: AppointmentChannel.inPerson,
      paymentStatus: PaymentStatus.succeeded,
      scheduledStartAt: addDays(4, 15, 0),
      scheduledEndAt: addDays(4, 16, 0),
      timezone,
      patientNotes: "Working on morning routine and communication goals.",
      providerNotes: "Focus on caregiver training for home routine.",
      confirmedAt: new Date(),
      paidAt: new Date(),
      cancelledAt: null,
      completedAt: null,
    },
    create: {
      appointmentNumber: "DEMO-APT-2001",
      branchId,
      patientId,
      providerId,
      createdById: patientUserId,
      status: AppointmentStatus.confirmed,
      bookingSource: BookingSource.app,
      channel: AppointmentChannel.inPerson,
      paymentStatus: PaymentStatus.succeeded,
      scheduledStartAt: addDays(4, 15, 0),
      scheduledEndAt: addDays(4, 16, 0),
      timezone,
      patientNotes: "Working on morning routine and communication goals.",
      providerNotes: "Focus on caregiver training for home routine.",
      confirmedAt: new Date(),
      paidAt: new Date(),
    },
  });

  await prisma.appointment.upsert({
    where: { appointmentNumber: "DEMO-APT-2000" },
    update: {
      branchId,
      patientId,
      providerId,
      status: AppointmentStatus.completed,
      bookingSource: BookingSource.app,
      channel: AppointmentChannel.virtual,
      paymentStatus: PaymentStatus.succeeded,
      scheduledStartAt: addDays(-10, 14, 0),
      scheduledEndAt: addDays(-10, 15, 0),
      timezone,
      patientNotes: "Telehealth check-in session.",
      providerNotes: "Good progress with transition routines.",
      confirmedAt: addDays(-11, 10, 0),
      completedAt: addDays(-10, 15, 0),
      paidAt: addDays(-10, 15, 10),
    },
    create: {
      appointmentNumber: "DEMO-APT-2000",
      branchId,
      patientId,
      providerId,
      createdById: patientUserId,
      status: AppointmentStatus.completed,
      bookingSource: BookingSource.app,
      channel: AppointmentChannel.virtual,
      paymentStatus: PaymentStatus.succeeded,
      scheduledStartAt: addDays(-10, 14, 0),
      scheduledEndAt: addDays(-10, 15, 0),
      timezone,
      patientNotes: "Telehealth check-in session.",
      providerNotes: "Good progress with transition routines.",
      confirmedAt: addDays(-11, 10, 0),
      completedAt: addDays(-10, 15, 0),
      paidAt: addDays(-10, 15, 10),
    },
  });

  await prisma.payment.deleteMany({ where: { transactionId: "demo-apt-pay-2001" } });
  await prisma.payment.create({
    data: {
      appointmentId: upcoming.id,
      provider: PaymentProvider.manual,
      methodType: PaymentMethodType.card,
      status: PaymentStatus.succeeded,
      amount: 120,
      transactionId: "demo-apt-pay-2001",
      paidAt: new Date(),
      metadata: { source: "demo-seed", label: "Appointment copay" },
    },
  });

  const conversation = await prisma.conversation.upsert({
    where: { appointmentId: upcoming.id },
    update: {
      branchId,
      patientId,
      assignedToId: providerUserId,
      type: ConversationType.appointment,
      status: ConversationStatus.open,
      subject: "Upcoming psychiatric appointment",
      lastMessageAt: addDays(0, 9, 30),
    },
    create: {
      branchId,
      patientId,
      appointmentId: upcoming.id,
      assignedToId: providerUserId,
      type: ConversationType.appointment,
      status: ConversationStatus.open,
      subject: "Upcoming psychiatric appointment",
      lastMessageAt: addDays(0, 9, 30),
    },
  });

  await prisma.message.deleteMany({ where: { conversationId: conversation.id } });
  await prisma.message.createMany({
    data: [
      {
        conversationId: conversation.id,
        senderId: patientUserId,
        body: "Hi, can we review the new morning routine during our next session?",
        readAt: addDays(0, 9, 5),
        createdAt: addDays(0, 9, 0),
      },
      {
        conversationId: conversation.id,
        senderId: providerUserId,
        body: "Absolutely. I added it to the session plan and will bring visual schedule cards.",
        readAt: null,
        createdAt: addDays(0, 9, 30),
      },
    ],
  });

  return upcoming;
}

async function seedClinical({
  patientId,
  providerId,
  therapistId,
  appointmentId,
}: {
  patientId: string;
  providerId: string;
  therapistId: string;
  appointmentId: string;
}) {
  // Treatment plan
  const existing = await prisma.treatmentPlan.findFirst({
    where: { patientId, title: "Demo Psychiatric Treatment Plan" },
  });

  const plan = existing ?? await prisma.treatmentPlan.create({
    data: {
      patientId,
      createdById: therapistId,
      providerId,
      title: "Demo Psychiatric Treatment Plan",
      description: "Comprehensive psychiatric care plan for mood, anxiety, and behavioral health support.",
      goals: "1. Improve expressive language (3-word phrases by Q2). 2. Complete morning routine independently. 3. Engage in peer play for 5+ minutes.",
      status: TreatmentPlanStatus.active,
      startDate: addDays(-60),
      endDate: addDays(120),
    },
  });

  // Behavior programs
  const existingPrograms = await prisma.behaviorProgram.findMany({
    where: { treatmentPlanId: plan.id },
    select: { id: true, name: true },
  });

  if (existingPrograms.length === 0) {
    await prisma.behaviorProgram.createMany({
      data: [
        {
          treatmentPlanId: plan.id,
          name: "Expressive Language - 3-Word Phrases",
          description: "Building functional 3-word requests using mand training.",
          type: ProgramType.skillAcquisition,
          status: ProgramStatus.active,
          masteryDefinition: "80% independent across 3 consecutive sessions",
          baselineData: "Currently uses 1-2 word approximations",
        },
        {
          treatmentPlanId: plan.id,
          name: "Morning Routine Independence",
          description: "Task analysis for morning self-care routine: wake, dress, brush teeth, eat breakfast.",
          type: ProgramType.skillAcquisition,
          status: ProgramStatus.active,
          masteryDefinition: "4/4 steps independently across 2 consecutive days",
          baselineData: "Requires full physical prompting for all steps",
        },
        {
          treatmentPlanId: plan.id,
          name: "Reducing Elopement Behaviors",
          description: "Function-based intervention to reduce unsafe running away.",
          type: ProgramType.behaviorReduction,
          status: ProgramStatus.active,
          masteryDefinition: "0 incidents across 5 consecutive sessions",
          baselineData: "Averaging 3 incidents per session (escape-motivated)",
        },
      ],
    });
  }

  // Session note
  const existingNote = await prisma.sessionNote.findFirst({
    where: { patientId, appointmentId },
  });

  if (!existingNote) {
    await prisma.sessionNote.create({
      data: {
        patientId,
        therapistId,
        treatmentPlanId: plan.id,
        appointmentId,
        sessionDate: addDays(-10, 14, 30),
        durationMinutes: 60,
        summary: "Patient demonstrated improved compliance with morning routine task analysis. Introduced visual schedule cards for step-by-step sequencing. Caregiver participated in 20-minute training segment on prompt fading.",
        clientBehavior: "Morning routine steps 1-2 now achieved with gestural prompt only. Elopement incidents reduced from 3 to 1 per session this week.",
        nextSteps: "Continue mand training with 3-word phrase targets. Practice morning routine with reduced physical prompting.",
      },
    });
  }

  return plan;
}

async function seedStaffAssignment({
  patientId,
  staffUserId,
  staffProfileId,
  assignedById,
}: {
  patientId: string;
  staffUserId: string;
  staffProfileId: string;
  assignedById: string;
}) {
  await prisma.staffAssignment.upsert({
    where: { patientId_staffId: { patientId, staffId: staffUserId } },
    update: { isActive: true, assignedById },
    create: {
      patientId,
      staffId: staffUserId,
      assignedById,
      isActive: true,
      notes: "Demo staff assignment for app testing.",
    },
  });
}


async function seedNotifications(userId: string) {
  await prisma.notification.deleteMany({
    where: {
      userId,
      purpose: {
        in: [
          NotificationPurpose.appointmentStatus,
          NotificationPurpose.newChatMessage,
          NotificationPurpose.appointmentStatus,
        ],
      },
      meta: { path: ["source"], equals: "demo-seed" },
    },
  });

  await prisma.notification.createMany({
    data: [
      {
        userId,
        title: "Appointment confirmed",
        message: "Your ABA session on Thursday is confirmed.",
        recipient: "demo-patient@connectedpsychiatriccare.com",
        purpose: NotificationPurpose.appointmentStatus,
        channels: [NotificationChannel.push, NotificationChannel.email],
        status: NotificationStatus.sent,
        readAt: null,
        meta: { actionUrl: "/patient/appointments", source: "demo-seed" },
      },
      {
        userId,
        title: "New message from your provider",
        message: "Your provider replied with session preparation notes.",
        recipient: "demo-patient@connectedpsychiatriccare.com",
        purpose: NotificationPurpose.newChatMessage,
        channels: [NotificationChannel.push],
        status: NotificationStatus.sent,
        readAt: null,
        meta: { actionUrl: "/patient/messages", source: "demo-seed" },
      },
      {
        userId,
        title: "Assessment ready to complete",
        message: "Your provider has assigned a short questionnaire before your next visit.",
        recipient: "demo-patient@connectedpsychiatriccare.com",
        purpose: NotificationPurpose.appointmentStatus,
        channels: [NotificationChannel.push, NotificationChannel.email],
        status: NotificationStatus.sent,
        readAt: new Date(),
        meta: { actionUrl: "/patient/care/assessments", source: "demo-seed" },
      },
    ],
  });
}

async function main() {
  console.log("\nSeeding demo accounts...\n");

  const branch = await getBranch();
  const adminUser = await upsertDemoAdmin();
  const { user: providerUser, profile: providerProfile } = await upsertDemoProvider(branch.id, adminUser.id);
  const { user: staffUser, profile: staffProfile } = await upsertDemoStaff(branch.id);
  const { user: patientUser, patient } = await upsertDemoPatient();

  const upcomingAppointment = await seedAppointments({
    branchId: branch.id,
    patientId: patient.id,
    patientUserId: patientUser.id,
    providerId: providerProfile.id,
    providerUserId: providerUser.id,
  });

  await seedClinical({
    patientId: patient.id,
    providerId: providerProfile.id,
    therapistId: providerUser.id,
    appointmentId: upcomingAppointment.id,
  });

  await seedStaffAssignment({
    patientId: patient.id,
    staffUserId: staffUser.id,
    staffProfileId: staffProfile.id,
    assignedById: adminUser.id,
  });

  await seedNotifications(patientUser.id);

  console.log("\nDemo accounts ready:\n");
  console.log(`  demo-admin@connectedpsychiatriccare.com   → admin`);
  console.log(`  demo-provider@connectedpsychiatriccare.com  → staff (with provider profile)`);
  console.log(`  demo-staff@connectedpsychiatriccare.com   → staff`);
  console.log(`  demo-patient@connectedpsychiatriccare.com → patient`);
  console.log(`  Password: ${DEMO_PASSWORD}`);
  console.log(`  isDemo: true (hidden from all admin/dashboard list views)\n`);
}

main()
  .catch((error) => {
    console.error("Demo seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


