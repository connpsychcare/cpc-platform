import { Text, View } from "react-native";
import { SectionHeader } from "@/components/shared/section-header";
import { AppIcon } from "@/components/ui/app-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  publicHomeSteps,
  publicHomeStepsContent,
} from "@workspace/shared/constants";

function StepsSection() {
  return (
    <View className="mt-12 bg-secondary py-12">
      <View className="section-wrapper gap-6">
        <SectionHeader
          eyebrow={publicHomeStepsContent.eyebrow}
          title={publicHomeStepsContent.title}
          description={publicHomeStepsContent.description}
          centered
        />

        <View className="rounded-[28px] bg-dark-section p-6 shadow-soft">
          <Text className="font-secondary text-sm leading-7 text-white/70">
            From your first call to your first appointment, our care team keeps
            the process organized, clear, and centered around your mental health
            goals - at every stage of life.
          </Text>
          <View className="mt-6 flex-row gap-3">
            <View className="flex-1">
              <Button href="/contact" variant="secondary" fullWidth>
                Get Started
              </Button>
            </View>
            <View className="flex-1">
              <Button href="/insurance" variant="outline" fullWidth>
                Insurance Help
              </Button>
            </View>
          </View>
        </View>

        <View className="gap-4">
          {publicHomeSteps.map((step, index) => {
            const isActive = index === 0;
            return (
              <View
                key={step.id}
                className={cn(
                  "rounded-[28px] border p-5",
                  isActive
                    ? "border-primary bg-primary shadow-soft"
                    : "border-border bg-card shadow-soft",
                )}
              >
                <View className="flex-row items-start gap-4">
                  <View
                    className={cn(
                      "size-12 items-center justify-center rounded-2xl",
                      isActive
                        ? "bg-white/20"
                        : "border border-border bg-background",
                    )}
                  >
                    <AppIcon
                      name={step.icon}
                      color={isActive ? "rgba(255,255,255,0.9)" : undefined}
                      variant={isActive ? undefined : "primary"}
                    />
                  </View>
                  <View className="min-w-0 flex-1">
                    <Text
                      className={cn(
                        "font-body-semibold text-xs uppercase tracking-[2px]",
                        isActive ? "text-white/60" : "text-primary",
                      )}
                    >
                      Step 0{index + 1}
                    </Text>
                    <Text
                      className={cn(
                        "mt-2 font-primary text-2xl leading-tight",
                        isActive ? "text-white" : "text-foreground",
                      )}
                    >
                      {step.title}
                    </Text>
                    <Text
                      className={cn(
                        "mt-3 font-secondary text-sm leading-7",
                        isActive ? "text-white/75" : "text-muted-foreground",
                      )}
                    >
                      {step.description}
                    </Text>
                    <Button
                      href="/contact"
                      variant="link"
                      className={cn(
                        "mt-4 self-start",
                        isActive && "text-white",
                      )}
                    >
                      {publicHomeStepsContent.learnMoreLabel}
                    </Button>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export default StepsSection;
