import ProviderDetailClient from "./page-client";
import { publicPageMetadata } from "@/lib/seo";

export const metadata = publicPageMetadata.providers;

export default async function ProviderDetailPage({
  params,
}: PageProps<"/providers/[slug]">) {
  const { slug } = await params;
  return <ProviderDetailClient slug={slug} />;
}
