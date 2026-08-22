"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateAppointmentStatusType } from "@workspace/contracts/appointment";
import type { ApiException } from "@workspace/sdk";
import * as appointment from "@workspace/sdk/appointment";
import { createCrudHooks } from "@workspace/ui/hooks/use-crud";

export const {
  useEntity: useAppointment,
  useEntities: useAppointments,
  useCreateEntity: useCreateAppointment,
} = createCrudHooks(
  {
    findOne: appointment.getAppointment,
    findAll: appointment.listAppointments,
    create: appointment.createAppointment,
  },
  {
    single: "appointment",
    list: "appointments",
  },
);

export function useUpdateAppointmentStatus(id?: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: UpdateAppointmentStatusType) =>
      appointment.updateAppointmentStatus(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["appointment", id] });
    },
  });

  return {
    updateStatus: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}
