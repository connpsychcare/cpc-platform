
import SessionNoteForm from "@/components/forms/SessionNoteForm";

const EditSessionNotePage = async ({
  params,
}: PageProps<"/patients/[id]/session-notes/[noteId]/edit">) => {
  const { id, noteId } = await params;
  return <SessionNoteForm formType="update" patientId={id} noteId={noteId} />;
};

export default EditSessionNotePage;
