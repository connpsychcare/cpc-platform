import { noIndexMetadata } from "@/lib/seo";
import MessagesClient from "./page-client";

export const metadata = noIndexMetadata("Messages", "/patient/messages");

export default function Page() {
  return <MessagesClient />;
}
