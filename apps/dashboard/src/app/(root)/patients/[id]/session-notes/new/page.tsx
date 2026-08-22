

import SessionNoteForm from "@/components/forms/SessionNoteForm";

const PatientSessionNoteCreatePage = async ({
  params,
}: PageProps<"/patients/[id]/session-notes/new">) => {
  const { id } = await params;

  return <SessionNoteForm formType="add" patientId={id} />;
};

export default PatientSessionNoteCreatePage;
