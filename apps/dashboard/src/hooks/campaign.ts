"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateCampaignStatusType } from "@workspace/contracts/campaign";
import type { ApiException } from "@workspace/sdk";
import * as campaign from "@workspace/sdk/campaign";
import { createCrudHooks } from "@workspace/ui/hooks/use-crud";

export const {
  useEntity: useCampaign,
  useEntities: useCampaigns,
  useCreateEntity: useCreateCampaign,
} = createCrudHooks(
  {
    findOne: campaign.getCampaign,
    findAll: campaign.listCampaigns,
    create: campaign.createCampaign,
  },
  {
    single: "campaign",
    list: "campaigns",
  },
);

export function useCampaignActions(id?: string) {
  const queryClient = useQueryClient();

  const statusMutation = useMutation({
    mutationFn: (data: UpdateCampaignStatusType) =>
      campaign.updateCampaignStatus(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["campaign", id] });
    },
  });

  const sendMutation = useMutation({
    mutationFn: () => campaign.sendCampaign(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["campaign", id] });
    },
  });

  return {
    updateCampaignStatus: statusMutation.mutateAsync,
    sendCampaign: sendMutation.mutateAsync,
    isPending: statusMutation.isPending || sendMutation.isPending,
    mutateError:
      (statusMutation.error as ApiException | null) ??
      (sendMutation.error as ApiException | null),
  };
}
