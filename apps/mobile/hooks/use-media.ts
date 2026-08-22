import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { MediaQueryType, MediaUpdateType } from "@workspace/contracts/media";
import { deleteMedia, findAllMedia, findMedia, updateMedia } from "@workspace/sdk/media";
import type { ApiException } from "@workspace/sdk";
import { parseDuration } from "@workspace/shared/utils";

const STALE_TIME = parseDuration("10m");

const queryDefaults = {
  staleTime: STALE_TIME,
  gcTime: STALE_TIME,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  retry: false,
};

export function useMedias(params?: MediaQueryType) {
  const query = useQuery({
    queryKey: ["mediaList", params],
    queryFn: () => findAllMedia(params),
    select: (res) => res.data,
    placeholderData: (prev) => prev,
    ...queryDefaults,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
    refetch: query.refetch,
  };
}

export function useMedia(id?: string) {
  const query = useQuery({
    queryKey: ["media", id],
    queryFn: () => findMedia(id!),
    select: (res) => res.data,
    enabled: Boolean(id),
    ...queryDefaults,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

export function useUpdateMedia(id: string) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: MediaUpdateType) => updateMedia(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mediaList"] });
      queryClient.invalidateQueries({ queryKey: ["media", id] });
    },
  });

  return {
    updateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (id: string) => deleteMedia(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mediaList"] });
    },
  });

  return {
    deleteAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}
