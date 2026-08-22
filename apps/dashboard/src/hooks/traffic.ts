"use client";
import * as traffic from "@workspace/sdk/traffic";
import { createCrudHooks } from "@workspace/ui/hooks/use-crud";

export const { useEntity: useTrafficSource, useEntities: useTrafficSources } =
  createCrudHooks(
    {
      findOne: traffic.getTrafficSource,
      findAll: traffic.getTrafficSources,
    },
    {
      single: "staff",
      list: "staff",
    },
  );
