"use client";

import * as patient from "@workspace/sdk/patient";
import { createCrudHooks } from "@workspace/ui/hooks/use-crud";

export const {
  useEntity: usePatient,
  useEntities: usePatients,
  useCreateEntity: useCreatePatientBase,
  useUpdateEntity: useUpdatePatientBase,
} = createCrudHooks(
  {
    findOne: patient.getPatient,
    findAll: patient.listPatients,
    create: patient.createPatient,
    update: patient.updatePatient,
  },
  {
    single: "patient",
    list: "patients",
  },
);
