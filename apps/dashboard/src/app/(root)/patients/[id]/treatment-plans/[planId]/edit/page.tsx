
import TreatmentPlanForm from "@/components/forms/TreatmentPlanForm";

const EditTreatmentPlanPage = async ({
  params,
}: PageProps<"/patients/[id]/treatment-plans/[planId]/edit">) => {
  const { id, planId } = await params;

  return (
    <TreatmentPlanForm
      formType="update"
      patientId={id}
      treatmentPlanId={planId}
    />
  );
};

export default EditTreatmentPlanPage;
