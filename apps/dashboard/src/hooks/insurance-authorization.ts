"use client";

import * as insuranceAuthorizationSdk from "@workspace/sdk/insurance-authorization";
import { createCrudHooks } from "@workspace/ui/hooks/use-crud";

export const {
  useEntity: useInsuranceAuthorization,
  useEntities: useInsuranceAuthorizations,
  useCreateEntity: useCreateInsuranceAuthorization,
  useUpdateEntity: useUpdateInsuranceAuthorization,
  useDeleteEntity: useDeleteInsuranceAuthorization,
} = createCrudHooks(
  {
    findOne: insuranceAuthorizationSdk.getInsuranceAuthorization,
    findAll: insuranceAuthorizationSdk.listInsuranceAuthorizations,
    create: insuranceAuthorizationSdk.createInsuranceAuthorization,
    update: insuranceAuthorizationSdk.updateInsuranceAuthorization,
    delete: insuranceAuthorizationSdk.deleteInsuranceAuthorization,
  },
  {
    single: "insurance-authorization",
    list: "insurance-authorizations",
  },
);
