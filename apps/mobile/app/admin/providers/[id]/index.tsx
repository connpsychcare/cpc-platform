import { useLocalSearchParams } from "expo-router";
import { InternalProviderForm } from "@/components/internal/forms/provider-form";

export default function AdminProviderDetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <InternalProviderForm providerId={id} />;
}
