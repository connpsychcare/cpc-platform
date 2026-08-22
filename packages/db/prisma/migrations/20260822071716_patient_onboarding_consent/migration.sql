-- AlterTable
ALTER TABLE "PatientOnboarding" ADD COLUMN     "consentToTreat" BOOLEAN,
ADD COLUMN     "hipaaAcknowledged" BOOLEAN,
ADD COLUMN     "signatureName" TEXT,
ADD COLUMN     "signedAt" TIMESTAMP(3),
ADD COLUMN     "telehealthConsent" BOOLEAN;
