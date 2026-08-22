"use client";

import React from "react";

import InsuranceAuthorizationForm from "@/components/forms/InsuranceAuthorizationForm";

const NewAuthorizationPage = ({ params }: PageProps<"/patients/[id]/authorizations/new">) => {
  const { id } = React.use(params);
  return <InsuranceAuthorizationForm patientId={id} formType="add" />;
};

export default NewAuthorizationPage;
