import { Text, View } from "react-native";
import { ArrowRight } from "lucide-react-native";
import { SectionHeader } from "@/components/shared/section-header";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  publicServices,
  publicServicesPageContent,
} from "@workspace/shared/constants";

type ServicesSectionProps = {
  limit?: number | "all";
  title?: string;
  description?: string;
};

const resolveServices = (limit: number | "all" = 6) =>
  limit === "all" ? publicServices : publicServices.slice(0, limit);

function ServiceCard({
  service,
  isActive = false,
}: {
  service: (typeof publicServices)[number];
  isActive?: boolean;
}) {
  return (
    <Button
      href={`/services#${service.slug}`}
      variant="ghost"
      className={cn(
        "min-h-0 items-stretch rounded-3xl border p-7",
        isActive
          ? "border-primary/40 bg-primary"
          : "border-border bg-card",
      )}
      contentClassName="w-full flex-col items-center gap-4"
    >
      {/* Icon */}
      <View
        className={cn(
          "size-16 items-center justify-center rounded-3xl",
          isActive ? "bg-white/15" : "bg-primary/10",
        )}
      >
        <AppIcon
          name={service.icon}
          size="lg"
          color={isActive ? "rgba(255,255,255,0.95)" : undefined}
          variant={isActive ? undefined : "primary"}
        />
      </View>

      {/* Title + subtitle */}
      <View className="gap-1.5">
        <Text
          className={cn(
            "text-center font-primary text-xl leading-snug",
            isActive ? "text-white" : "text-foreground",
          )}
        >
          {service.title}
        </Text>
        <Text
          className={cn(
            "text-center font-secondary text-sm leading-6",
            isActive ? "text-white/75" : "text-muted-foreground",
          )}
        >
          {service.subtitle}
        </Text>
      </View>

      {/* CTA */}
      <View className="mt-auto flex-row items-center gap-1">
        <Text
          className={cn(
            "font-body-semibold text-xs",
            isActive ? "text-white" : "text-primary",
          )}
        >
          Learn more
        </Text>
        <ArrowRight
          size={12}
          color={isActive ? "rgba(255,255,255,0.9)" : undefined}
          strokeWidth={2.5}
        />
      </View>
    </Button>
  );
}

function ServicesSection({
  limit = 6,
  title = publicServicesPageContent.previewTitle,
  description = publicServicesPageContent.previewDescription,
}: ServicesSectionProps) {
  const services = resolveServices(limit);
  const showSeeMore =
    limit !== "all" && publicServices.length > services.length;

  return (
    <View className="section-wrapper mt-12">
      <SectionHeader title={title} description={description} />

      <View className="mt-6 gap-4">
        {services.map((service, index) => (
          <ServiceCard
            key={service.id}
            service={service}
            isActive={index === 0}
          />
        ))}
      </View>

      {showSeeMore ? (
        <View className="mt-6">
          <Button href="/services" variant="outline" fullWidth>
            {publicServicesPageContent.previewSeeAllLabel}
          </Button>
        </View>
      ) : null}
    </View>
  );
}

export default ServicesSection;
