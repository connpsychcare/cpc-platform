"use client";

import ListPage from "@workspace/ui/shared/ListPage";
import type { ColumnConfig } from "@workspace/ui/shared/GenericTable";
import type { PostQueryType, PostResponse } from "@workspace/contracts/post";
import { Badge } from "@workspace/ui/components/badge";
import { formatDate } from "@workspace/shared/utils";
import { getStatusVariant } from "@workspace/ui/lib/utils";
import { usePosts } from "@/hooks/content-cms";

const columns: ColumnConfig<PostResponse, PostQueryType>[] = [
  {
    header: "Title",
    accessor: (post) => (
      <div className="min-w-60">
        <p className="font-semibold">{post.title ?? "Untitled draft"}</p>
        {post.slug && (
          <p className="text-xs text-muted-foreground">/{post.slug}</p>
        )}
      </div>
    ),
    sortKey: "title",
  },
  {
    header: "Category",
    accessor: (post) => post.category?.name ?? "Uncategorised",
  },
  {
    header: "Author",
    accessor: (post) => post.author?.displayName ?? "Unknown",
  },
  {
    header: "Status",
    accessor: (post) => (
      <Badge variant={getStatusVariant(post.status)} className="capitalize">
        {post.status}
      </Badge>
    ),
  },
  {
    header: "Views",
    accessor: (post) => post.viewsCount,
    sortKey: "viewsCount",
  },
  {
    header: "Published",
    accessor: (post) =>
      post.publishedAt ? formatDate(post.publishedAt, { mode: "date" }) : "-",
    sortKey: "publishedAt",
  },
];

const PostsPage = () => (
  <ListPage
    dataKey="posts"
    canAdd
    canEdit
    columns={columns}
    defaultSortBy="createdAt"
    defaultSearchBy="title"
    searchByOptions={[
      { label: "Title", value: "title" },
      { label: "Slug", value: "slug" },
      { label: "Category", value: "category" },
    ]}
    useListHook={usePosts}
    filterConfig={[
      { key: "status", label: "Status", options: ["draft", "published"] },
    ]}
  />
);

export default PostsPage;
