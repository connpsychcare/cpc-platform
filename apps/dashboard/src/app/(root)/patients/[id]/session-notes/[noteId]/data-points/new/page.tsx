
import DataPointForm from "@/components/forms/DataPointForm";

const NewDataPointPage = async ({
  params,
}: PageProps<"/patients/[id]/session-notes/[noteId]/data-points/new">) => {
  const { id, noteId } = await params;
  return <DataPointForm formType="add" patientId={id} sessionNoteId={noteId} />;
};

export default NewDataPointPage;
