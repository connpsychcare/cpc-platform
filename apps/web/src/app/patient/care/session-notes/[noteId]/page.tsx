import { noIndexMetadata } from "@/lib/seo";
import SessionNoteDetailClient from "./page-client";

export const metadata = noIndexMetadata(
  "Session Note",
  "/patient/care/session-notes",
);

export default async function Page({
  params,
}: PageProps<"/patient/care/session-notes/[noteId]">) {
  const { noteId } = await params;
  return <SessionNoteDetailClient noteId={noteId} />;
}
