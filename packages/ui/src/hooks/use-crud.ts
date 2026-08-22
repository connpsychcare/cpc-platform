"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiException, ApiSuccess } from "@workspace/sdk";
import { parseDuration } from "@workspace/shared/utils";

/* -------------------------------------------
 * Helpers
 * ------------------------------------------- */

type ApiFn<T = any> = (...args: any[]) => Promise<ApiSuccess<T>>;
type ExtractData<T extends ApiFn> = Awaited<ReturnType<T>>["data"];

const STALE_TIME = parseDuration("1h");

/* -------------------------------------------
 * Conditional Hook Helper
 * ------------------------------------------- */

type OptionalHook<TFn, THook> = TFn extends ApiFn ? THook : undefined;

/* -------------------------------------------
 * Return Types
 * ------------------------------------------- */

export type EntityHookReturn<TData> = {
  data: TData | undefined;
  isLoading: boolean;
  isFetching: boolean;
  fetchError: ApiException | null;
  mutateAsync: (data: any) => Promise<TData>;
  isPending: boolean;
  mutateError: ApiException | null;
};

export type EntitiesHookReturn<TData> = {
  data: TData | undefined;
  isLoading: boolean;
  isFetching: boolean;
  fetchError: ApiException | null;
};

export type CreateHookReturn<TData, TPayload> = {
  createAsync: (data: TPayload) => Promise<TData>;
  isCreating: boolean;
  createError: ApiException | null;
};

export type UpdateHookReturn<TData, TPayload> = {
  updateAsync: (data: TPayload) => Promise<TData>;
  isUpdating: boolean;
  updateError: ApiException | null;
};

export type DeleteHookReturn = {
  deleteAsync: (...args: any[]) => Promise<any>;
  isDeleting: boolean;
  deleteError: ApiException | null;
};

export type RestoreHookReturn = {
  restoreAsync: (...args: any[]) => Promise<any>;
  isRestoring: boolean;
  restoreError: ApiException | null;
};

/* -------------------------------------------
 * CRUD Factory
 * ------------------------------------------- */

export const createCrudHooks = <
  TFindOne extends ApiFn | undefined = undefined,
  TFindAll extends ApiFn | undefined = undefined,
  TCreate extends ApiFn | undefined = undefined,
  TUpdate extends ApiFn | undefined = undefined,
  TDelete extends ApiFn | undefined = undefined,
  TRestore extends ApiFn | undefined = undefined,
>(
  api: {
    findOne?: TFindOne;
    findAll?: TFindAll;
    create?: TCreate;
    update?: TUpdate;
    delete?: TDelete;
    restore?: TRestore;
  },
  keys: { single: string; list: string },
) => {
  type SingleData = TFindOne extends ApiFn ? ExtractData<TFindOne> : never;
  type ListData = TFindAll extends ApiFn ? ExtractData<TFindAll> : never;

  type CreatePayload = TCreate extends ApiFn ? Parameters<TCreate>[0] : never;

  type UpdatePayload = TUpdate extends ApiFn ? Parameters<TUpdate>[1] : never;

  type FindOneParams = TFindOne extends ApiFn ? Parameters<TFindOne> : never;

  type FindAllParams = TFindAll extends ApiFn ? Parameters<TFindAll> : never;

  /* =========================================================
   * SINGLE
   * ======================================================= */

  const useEntity = (...args: FindOneParams): EntityHookReturn<SingleData> => {
    const queryClient = useQueryClient();
    const { findOne, create, update } = api;

    if (!findOne) throw new Error("findOne function missing.");

    const id = args[0];

    const query = useQuery<SingleData, ApiException>({
      queryKey: [keys.single, ...args],
      queryFn: async () => (await findOne(...args)).data,
      enabled: !!id,
      staleTime: STALE_TIME,
      gcTime: STALE_TIME,
    });

    const mutation = useMutation<
      SingleData,
      ApiException,
      CreatePayload | UpdatePayload
    >({
      mutationFn: async (data) => {
        if (id) {
          if (!update) throw new Error("Update function missing.");
          return (await update(id, data as UpdatePayload)).data;
        }
        if (!create) throw new Error("Create function missing.");
        return (await create(data as CreatePayload)).data;
      },
      onSuccess: async () => {
        if (id) {
          await queryClient.invalidateQueries({
            queryKey: [keys.single, id],
          });
        }
        await queryClient.invalidateQueries({
          queryKey: [keys.list],
        });
      },
    });

    return {
      data: query.data,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      fetchError: query.error,

      mutateAsync: mutation.mutateAsync,
      isPending: mutation.isPending,
      mutateError: mutation.error,
    };
  };

  /* =========================================================
   * LIST
   * ======================================================= */

  const useEntities = (
    ...args: FindAllParams
  ): EntitiesHookReturn<ListData> => {
    const { findAll } = api;

    if (!findAll) throw new Error("findAll function missing.");

    const query = useQuery<ListData, ApiException>({
      queryKey: [keys.list, ...args],
      queryFn: async () => (await findAll(...args)).data,
      staleTime: STALE_TIME,
      gcTime: STALE_TIME,
      placeholderData: (prev) => prev,
    });

    return {
      data: query.data,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      fetchError: query.error,
    };
  };

  /* =========================================================
   * CREATE
   * ======================================================= */

  const useCreateEntity = (): CreateHookReturn<SingleData, CreatePayload> => {
    const queryClient = useQueryClient();
    const { create } = api;

    if (!create) throw new Error("Create function missing.");

    const mutation = useMutation<SingleData, ApiException, CreatePayload>({
      mutationFn: async (data) => (await create(data)).data,
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [keys.list],
        });
      },
    });

    return {
      createAsync: mutation.mutateAsync,
      isCreating: mutation.isPending,
      createError: mutation.error,
    };
  };

  /* =========================================================
   * UPDATE
   * ======================================================= */

  const useUpdateEntity = (
    id: string,
  ): UpdateHookReturn<SingleData, UpdatePayload> => {
    const queryClient = useQueryClient();
    const { update } = api;

    if (!update) throw new Error("Update function missing.");

    const mutation = useMutation<SingleData, ApiException, UpdatePayload>({
      mutationFn: async (data) => (await update(id, data)).data,
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [keys.single, id],
        });
        await queryClient.invalidateQueries({
          queryKey: [keys.list],
        });
      },
    });

    return {
      updateAsync: mutation.mutateAsync,
      isUpdating: mutation.isPending,
      updateError: mutation.error,
    };
  };

  /* =========================================================
   * DELETE
   * ======================================================= */

  const useDeleteEntity = (): DeleteHookReturn => {
    const queryClient = useQueryClient();
    const { delete: d } = api;

    if (!d) throw new Error("Delete function missing.");

    const mutation = useMutation<ApiSuccess<null>, ApiException>({
      mutationFn: d,
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [keys.list],
        });
      },
    });

    return {
      deleteAsync: mutation.mutateAsync,
      isDeleting: mutation.isPending,
      deleteError: mutation.error,
    };
  };

  /* =========================================================
   * RESTORE
   * ======================================================= */

  const useRestoreEntity = (): RestoreHookReturn => {
    const queryClient = useQueryClient();
    const { restore } = api;

    if (!restore) throw new Error("Restore function missing.");

    const mutation = useMutation<ApiSuccess<null>, ApiException>({
      mutationFn: restore,
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [keys.list],
        });
      },
    });

    return {
      restoreAsync: mutation.mutateAsync,
      isRestoring: mutation.isPending,
      restoreError: mutation.error,
    };
  };

  /* =========================================================
   * RETURN
   * ======================================================= */

  return {
    useEntity: (api.findOne ? useEntity : undefined) as OptionalHook<
      TFindOne,
      typeof useEntity
    >,

    useEntities: (api.findAll ? useEntities : undefined) as OptionalHook<
      TFindAll,
      typeof useEntities
    >,

    useCreateEntity: (api.create ? useCreateEntity : undefined) as OptionalHook<
      TCreate,
      typeof useCreateEntity
    >,

    useUpdateEntity: (api.update ? useUpdateEntity : undefined) as OptionalHook<
      TUpdate,
      typeof useUpdateEntity
    >,

    useDeleteEntity: (api.delete ? useDeleteEntity : undefined) as OptionalHook<
      TDelete,
      typeof useDeleteEntity
    >,

    useRestoreEntity: (api.restore
      ? useRestoreEntity
      : undefined) as OptionalHook<TRestore, typeof useRestoreEntity>,
  };
};
