"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  PostQueryType,
  PostType,
} from "@workspace/contracts/post";
import type {
  CategoryQueryType,
  CategoryType,
} from "@workspace/contracts/category";
import type { ApiException } from "@workspace/sdk";
import * as postSdk from "@workspace/sdk/post";
import * as categorySdk from "@workspace/sdk/category";
import { parseDuration } from "@workspace/shared/utils";

const STALE_TIME = parseDuration("10m");

const queryDefaults = {
  staleTime: STALE_TIME,
  gcTime: STALE_TIME,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  retry: false,
};

// ── Posts ───────────────────────────────────────────────────────────────────

export function usePosts(params?: PostQueryType) {
  const query = useQuery({
    queryKey: ["posts", params],
    queryFn: () => postSdk.listPosts(params),
    select: (res) => res.data,
    placeholderData: (prev) => prev,
    ...queryDefaults,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

export function usePost(id?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["post", id],
    queryFn: () => postSdk.getPost(id!),
    select: (res) => res.data,
    enabled: Boolean(id),
    ...queryDefaults,
  });

  const mutation = useMutation({
    mutationFn: (data: PostType) =>
      id ? postSdk.updatePost(id, data) : postSdk.createPost(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
      void queryClient.invalidateQueries({ queryKey: ["post", id] });
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    mutateError: mutation.error as ApiException | null,
  };
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, force }: { id: string; force?: boolean }) =>
      postSdk.deletePost(id, force),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return {
    deleteAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}

// ── Categories ──────────────────────────────────────────────────────────────

export function useCategories(params?: CategoryQueryType) {
  const query = useQuery({
    queryKey: ["categories", params],
    queryFn: () => categorySdk.listCategories(params),
    select: (res) => res.data,
    placeholderData: (prev) => prev,
    ...queryDefaults,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
  };
}

export function useCategory(id?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["category", id],
    queryFn: () => categorySdk.getCategory(id!),
    select: (res) => res.data,
    enabled: Boolean(id),
    ...queryDefaults,
  });

  const mutation = useMutation({
    mutationFn: (data: CategoryType) =>
      id
        ? categorySdk.updateCategory(id, data)
        : categorySdk.createCategory(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
      void queryClient.invalidateQueries({ queryKey: ["category", id] });
    },
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    fetchError: query.error as ApiException | null,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    mutateError: mutation.error as ApiException | null,
  };
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, force }: { id: string; force?: boolean }) =>
      categorySdk.deleteCategory(id, force),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return {
    deleteAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error as ApiException | null,
  };
}
