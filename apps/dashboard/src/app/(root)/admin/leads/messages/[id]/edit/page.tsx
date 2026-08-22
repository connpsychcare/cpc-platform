import ContactMessageForm from "@/components/forms/ContactMessageForm";

const EditContactMessagePage = async ({ params }: PageProps<"/admin/leads/messages/[id]/edit">) => {
  const { id } = await params;
  return <ContactMessageForm entityId={id} formType="update" />;
};

export default EditContactMessagePage;
