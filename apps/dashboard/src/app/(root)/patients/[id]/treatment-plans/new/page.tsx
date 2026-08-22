
import TreatmentPlanForm from "@/components/forms/TreatmentPlanForm";

const NewTreatmentPlanPage = async ({ params }: PageProps<"/patients/[id]/treatment-plans/new">) => {
  const { id } = await params;
  return <TreatmentPlanForm formType="add" patientId={id} />;
};

export default NewTreatmentPlanPage;
