import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { publicServices } from "@workspace/shared/constants";
import SectionHeader from "@/components/shared/SectionHeader";
import ServiceCard from "@/components/shared/ServiceCard";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/animations";

type ServicesSectionProps = {
  limit?: number | "all";
  eyebrow?: string;
  title?: string;
  description?: string;
};

export default function ServicesSection({
  limit = 6,
  eyebrow = "How we can help",
  title = "A care plan that starts with listening.",
  description = "Our services are built to meet you where you are, then stay connected as things change.",
}: ServicesSectionProps) {
  const services = limit === "all" ? publicServices : publicServices.slice(0, limit);
  const showViewAll = limit !== "all" && publicServices.length > services.length;

  return (
    <section className="px-4 py-14 sm:px-6 lg:py-20">
      <div className="section-container">
        <FadeUp className="mb-9 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader eyebrow={eyebrow} title={title} description={description} />
          {showViewAll && (
            <Link href="/services" className="btn-quiet shrink-0">
              View all services <ArrowRight className="size-4" />
            </Link>
          )}
        </FadeUp>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <StaggerItem key={service.id}>
              <ServiceCard service={service} compact={limit !== "all"} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
