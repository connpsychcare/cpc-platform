import apiClient, { executeApi } from "../lib/api-client";
import type {
  PostListResponse,
  PostQueryType,
  PostResponse,
  PostType,
  TrackPostViewType,
} from "@workspace/contracts/post";

export const listPosts = (params?: PostQueryType) =>
  executeApi<PostListResponse>(() => apiClient.get("/posts", { params }));

export const getPost = (id: string) =>
  executeApi<PostResponse>(() => apiClient.get(`/posts/${id}`));

export const createPost = (data: PostType) =>
  executeApi<PostResponse>(() => apiClient.post("/posts", data));

export const updatePost = (id: string, data: PostType) =>
  executeApi<PostResponse>(() => apiClient.patch(`/posts/${id}`, data));

export const deletePost = (id: string, force = false) =>
  executeApi<null>(() =>
    apiClient.delete(`/posts/${id}`, { params: { force } }),
  );

export const restorePost = (id: string) =>
  executeApi<PostResponse>(() => apiClient.patch(`/posts/${id}/restore`));

// ── Public ──────────────────────────────────────────────────────────────────

export const listPublicPosts = (params?: PostQueryType) =>
  executeApi<PostListResponse>(() =>
    apiClient.get("/posts/public", { params }),
  );

export const getPublicPost = (slug: string) =>
  executeApi<PostResponse>(() => apiClient.get(`/posts/public/${slug}`));

export const trackPostView = (slug: string, data: TrackPostViewType) =>
  executeApi<{ tracked: boolean; viewsCount: number; visitorKey: string }>(() =>
    apiClient.post(`/posts/public/${slug}/view`, data),
  );
