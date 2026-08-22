"use client";

import React from "react";

import PageIntro from "@workspace/ui/shared/PageIntro";
import TreatmentPlansList from "@workspace/ui/shared/TreatmentPlansList";
import { useTreatmentPlans } from "@/hooks/treatment-plan";

const PatientTreatmentPlansPage = ({ params }: PageProps<"/patients/[id]/treatment-plans">) => {
  const { id } = React.use(params);
  const { data, isLoading, fetchError } = useTreatmentPlans({ patientId: id });

  return (
    <div className="space-y-6">
      <PageIntro
        title="Treatment Plans"
        description="Manage individualized psychiatric treatment plans for this patient."
      />

      <TreatmentPlansList
        plans={data?.treatmentPlans ?? []}
        isLoading={isLoading}
        error={fetchError}
        basePath={`/patients/${id}/treatment-plans`}
        canEdit
      />
    </div>
  );
};

export default PatientTreatmentPlansPage;
