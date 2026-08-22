"use client";

import React from "react";

import CaregiverAccessForm from "@/components/forms/CaregiverAccessForm";

const NewCaregiverPage = ({ params }: PageProps<"/patients/[id]/caregivers/new">) => {
  const { id } = React.use(params);
  return <CaregiverAccessForm patientId={id} formType="add" />;
};

export default NewCaregiverPage;
