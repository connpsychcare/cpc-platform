import StaffForm from "@/components/forms/StaffForm";

const page = async ({ params }: PageProps<"/admin/staff/[id]/edit">) => {
  const { id } = await params;
  return <StaffForm formType="update" entityId={id} />;
};

export default page;
