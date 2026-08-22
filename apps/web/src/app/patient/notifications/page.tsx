import { noIndexMetadata } from "@/lib/seo";
import NotificationsClient from "./page-client";

export const metadata = noIndexMetadata("Notifications", "/patient/notifications");

export default function Page() {
  return <NotificationsClient />;
}
