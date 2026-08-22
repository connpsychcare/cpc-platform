"use client";

import * as dataPointSdk from "@workspace/sdk/data-point";
import { createCrudHooks } from "@workspace/ui/hooks/use-crud";

export const {
  useEntity: useDataPoint,
  useEntities: useDataPoints,
  useCreateEntity: useCreateDataPoint,
  useUpdateEntity: useUpdateDataPoint,
  useDeleteEntity: useDeleteDataPoint,
} = createCrudHooks(
  {
    findOne: dataPointSdk.getDataPoint,
    findAll: dataPointSdk.listDataPoints,
    create: dataPointSdk.createDataPoint,
    update: dataPointSdk.updateDataPoint,
    delete: dataPointSdk.deleteDataPoint,
  },
  {
    single: "data-point",
    list: "data-points",
  },
);
