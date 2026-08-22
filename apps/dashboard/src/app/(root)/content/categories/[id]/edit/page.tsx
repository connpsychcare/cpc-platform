import CategoryForm from "@/components/forms/CategoryForm";

export default async function EditCategoryPage({
  params,
}: PageProps<"/content/categories/[id]/edit">) {
  const { id } = await params;
  return <CategoryForm formType="update" entityId={id} />;
}
