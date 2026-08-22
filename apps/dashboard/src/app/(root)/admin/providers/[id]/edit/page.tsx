import ProviderForm from "@/components/forms/ProviderForm";

const page = async ({ params }: PageProps<"/admin/providers/[id]/edit">) => {
  const { id } = await params;
  return <ProviderForm formType="update" entityId={id} />;
};

export default page;
