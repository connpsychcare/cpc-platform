import { noIndexMetadata } from "@/lib/seo";
import CaregiverAcceptClient from "./page-client";

export const metadata = noIndexMetadata(
  "Accept Caregiver Invitation",
  "/patient/caregivers/accept",
);

export default async function Page({
  searchParams,
}: PageProps<"/patient/caregivers/accept">) {
  const { token } = await searchParams;
  return <CaregiverAcceptClient token={typeof token === "string" ? token : undefined} />;
}
