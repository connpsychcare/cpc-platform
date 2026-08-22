import PostForm from "@/components/forms/PostForm";

export default async function EditPostPage({
  params,
}: PageProps<"/content/posts/[id]/edit">) {
  const { id } = await params;
  return <PostForm formType="update" entityId={id} />;
}
