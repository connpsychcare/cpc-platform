import SectionHeader from "@/components/shared/SectionHeader";
import { FadeUp, StaggerContainer, StaggerItem } from "@/components/shared/animations";
import { publicHomeSteps } from "@workspace/shared/constants";

export default function StepsSection() {
  return (
    <section className="bg-sage/35 px-4 py-14 sm:px-6 lg:py-20">
      <div className="section-container">
        <FadeUp className="mb-10 max-w-2xl">
          <SectionHeader
            eyebrow="A clear beginning"
            title="Three steps toward feeling more supported."
            description="You do not need to have the right words before you reach out. We will help you find the next step."
          />
        </FadeUp>

        <StaggerContainer className="grid gap-5 lg:grid-cols-3">
          {publicHomeSteps.map((step, index) => (
            <StaggerItem key={step.id}>
              <div className="h-full rounded-4xl bg-secondary/70 p-6">
                <span className="font-primary text-4xl font-extrabold tracking-tighter text-accent/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-7 font-primary text-xl font-extrabold tracking-tight text-foreground">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
