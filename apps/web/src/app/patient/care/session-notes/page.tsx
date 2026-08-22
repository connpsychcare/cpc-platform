import { noIndexMetadata } from "@/lib/seo";
import SessionNotesClient from "./page-client";

export const metadata = noIndexMetadata("Session Notes", "/patient/care/session-notes");

export default function Page() {
  return <SessionNotesClient />;
}
