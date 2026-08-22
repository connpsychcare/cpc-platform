"use client";

import * as progressReportSdk from "@workspace/sdk/progress-report";
import { createCrudHooks } from "@workspace/ui/hooks/use-crud";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateProgressReportType } from "@workspace/contracts/progress-report";
import type { ApiException } from "@workspace/sdk";

export const {
  useEntity: useProgressReport,
  useEntities: useProgressReports,
  useCreateEntity: useCreateProgressReport,
  useDeleteEntity: useDeleteProgressReport,
} = createCrudHooks(
  {
    findOne: progressReportSdk.getProgressReport,
    findAll: progressReportSdk.listProgressReports,
    create: progressReportSdk.createProgressReport,
    delete: progressReportSdk.deleteProgressReport,
  },
  {
    single: "progress-report",
    list: "progress-reports",
  },
);

export function useUpdateProgressReport(id?: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: UpdateProgressReportType) =>
      progressReportSdk.updateProgressReport(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progress-reports"] });
      queryClient.invalidateQueries({ queryKey: ["progress-report", id] });
    },
  });
  return {
    updateAsync: mutation.mutateAsync,
    isUpdating: mutation.isPending,
    updateError: mutation.error as ApiException | null,
  };
}

export function useDownloadProgressReportPdf() {
  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const blob = await progressReportSdk.downloadProgressReportPdf(id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `progress-report-${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    },
  });
  return {
    downloadAsync: mutation.mutateAsync,
    isDownloading: mutation.isPending,
    downloadError: mutation.error as ApiException | null,
  };
}
