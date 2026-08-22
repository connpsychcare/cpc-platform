
import DataPointForm from "@/components/forms/DataPointForm";

const EditDataPointPage = async ({
  params,
}: PageProps<"/patients/[id]/session-notes/[noteId]/data-points/[dataPointId]/edit">) => {
  const { id, noteId, dataPointId } = await params;
  return (
    <DataPointForm
      formType="update"
      patientId={id}
      sessionNoteId={noteId}
      dataPointId={dataPointId}
    />
  );
};

export default EditDataPointPage;
