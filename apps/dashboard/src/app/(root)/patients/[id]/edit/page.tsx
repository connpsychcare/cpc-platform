

import PatientForm from "@/components/forms/PatientForm";

const PatientEditPage = async ({ params }: PageProps<"/patients/[id]/edit">) => {
  const { id } = await params;

  return <PatientForm formType="update" entityId={id} />;
};

export default PatientEditPage;
