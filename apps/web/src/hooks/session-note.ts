"use client";

import { useQuery } from "@tanstack/react-query";
import { parseDuration } from "@workspace/shared/utils";
import * as sessionNoteSdk from "@workspace/sdk/session-note";
import type { SessionNoteQueryType } from "@workspace/contracts/session-note";

const STALE_TIME = parseDuration("10m");
const queryDefaults = {
  staleTime: STALE_TIME,
  gcTime: STALE_TIME,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  retry: false,
};

export function useSessionNotes(params?: SessionNoteQueryType) {
  const query = useQuery({
    queryKey: ["session-notes", params],
    queryFn: () => sessionNoteSdk.listSessionNotes(params),
    select: (res) => res.data,
    placeholderData: (prev) => prev,
    ...queryDefaults,
  });
  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  };
}

export function useSessionNote(id?: string) {
  const query = useQuery({
    queryKey: ["session-note", id],
    queryFn: () => sessionNoteSdk.getSessionNote(id!),
    select: (res) => res.data,
    enabled: Boolean(id),
    ...queryDefaults,
  });
  return {
    data: query.data,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
  };
}
