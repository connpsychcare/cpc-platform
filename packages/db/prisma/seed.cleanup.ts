/**
 * Production DB cleanup script.
 * Run this once to remove old demo/reviewer accounts and all linked data.
 *
 * Usage: pnpm --filter @workspace/db prisma:seed:cleanup
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../prisma/generated/client";

const connectionString = process.env.DB_MIGRATE_URI ?? process.env.DB_URI;

if (!connectionString) {
  throw new Error("DB_MIGRATE_URI or DB_URI is required to run cleanup.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const STALE_EMAILS = [
  "google-reviewer@connectedpsychiatriccare.com",
  "demo@connectedpsychiatriccare.com",
  "demo.provider@connectedpsychiatriccare.com",
  "demo.caregiver@connectedpsychiatriccare.com",
];

async function hardDeleteUser(userId: string, email: string | null) {
  console.log(`  Deleting: ${email ?? userId}`);

  // ── Step 1: Patient-profile Restrict relations ──────────────────────────────
  // PatientProfile cascades from User, but these models have onDelete: Restrict
  // on patientId → PatientProfile, so they must be removed first.
  const patientProfile = await prisma.patientProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (patientProfile) {
    const pid = patientProfile.id;
    // Appointments block PatientProfile deletion (Restrict); deleting them
    // cascade-deletes Conversation → Message and Payment automatically.
    await prisma.appointment.deleteMany({ where: { patientId: pid } });
    await prisma.progressReport.deleteMany({ where: { patientId: pid } });
    await prisma.sessionNote.deleteMany({ where: { patientId: pid } });
    await prisma.insuranceAuthorization.deleteMany({ where: { patientId: pid } });
    // TreatmentPlan cascades → BehaviorProgram → DataPoint
    await prisma.treatmentPlan.deleteMany({ where: { patientId: pid } });
  }

  // ── Step 2: Provider-profile Restrict relations ───────────────────────────────
  const providerProfile = await prisma.providerProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (providerProfile) {
    // Appointments block ProviderProfile deletion (Restrict)
    await prisma.appointment.deleteMany({ where: { providerId: providerProfile.id } });
  }

  // ── Step 3: Direct User Restrict relations ──────────────────────────────────
  // These models hold a userId FK with onDelete: Restrict.
  await prisma.caregiverInvitation.deleteMany({ where: { invitedById: userId } });
  await prisma.caregiverAccess.deleteMany({ where: { grantedById: userId } });
  await prisma.staffAssignment.deleteMany({ where: { assignedById: userId } });
  await prisma.notificationCampaign.deleteMany({ where: { createdById: userId } });
  await prisma.treatmentPlan.deleteMany({ where: { createdById: userId } });
  await prisma.sessionNote.deleteMany({ where: { therapistId: userId } });
  await prisma.progressReport.deleteMany({ where: { generatedById: userId } });
  await prisma.media.deleteMany({ where: { uploadedById: userId } });

  // ── Step 4: Hard-delete the user ────────────────────────────────────────────
  // Prisma cascade handles: PatientProfile, ProviderProfile, StaffProfile,
  // Session, Notification, CaregiverAccess (caregiverId), StaffAssignment (staffId),
  // StaffPermission, CaregiverInvitation (patientId), etc.
  await prisma.user.delete({ where: { id: userId } });

  console.log(`    Done.`);
}

async function deleteStaleUsers() {
  const users = await prisma.user.findMany({
    where: { email: { in: STALE_EMAILS } },
    select: { id: true, email: true },
  });

  if (users.length === 0) {
    console.log("  No stale demo users found - nothing to remove.");
    return;
  }

  for (const user of users) {
    await hardDeleteUser(user.id, user.email);
  }

  console.log(`\n  Removed ${users.length} stale user(s).`);
}

async function main() {
  console.log("\nRunning production DB cleanup...\n");

  await deleteStaleUsers();

  console.log("\nCleanup complete.");
  console.log("Next: run `pnpm --filter @workspace/db prisma:seed:demo` to create fresh demo accounts.\n");
}

main()
  .catch((error) => {
    console.error("Cleanup seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
