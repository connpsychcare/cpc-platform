"use client";

import React from "react";

import PatientOverviewContent from "@/components/dashboard/patients/PatientOverviewContent";

const Page = ({ params }: PageProps<"/patients/[id]">) => {
  const { id } = React.use(params);

  return <PatientOverviewContent patientId={id} />;
};

export default Page;
