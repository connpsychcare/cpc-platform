"use client";

import React from "react";

import InsuranceAuthorizationForm from "@/components/forms/InsuranceAuthorizationForm";

const EditAuthorizationPage = ({ params }: PageProps<"/patients/[id]/authorizations/[authId]/edit">) => {
  const { id, authId } = React.use(params);
  return (
    <InsuranceAuthorizationForm
      patientId={id}
      authId={authId}
      formType="update"
    />
  );
};

export default EditAuthorizationPage;
