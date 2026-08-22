import { Stethoscope } from "lucide-react";
import { FadeLeft, FadeRight } from "@/components/shared/animations";

const TILES = [
  {
    title: "Clear",
    body: "We explain your options in plain language and make room for every question.",
    tone: "forest",
  },
  {
    title: "Connected",
    body: "Your care stays in conversation with your goals, your history, and your life.",
    tone: "sage",
  },
  {
    title: "Human",
    body: "You are a person first, not a checklist of symptoms or a diagnosis code.",
    tone: "card",
  },
] as const;

export default function SteadierForwardSection() {
  return (
    <section className="py-12 sm:py-20">
      <div className="section grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
        <FadeLeft>
          <p className="text-xs font-bold uppercase tracking-[0.17em] text-brand-ink">
            A steadier way forward
          </p>
          <h2 className="mt-3 max-w-md font-primary text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl">
            You are allowed to ask for support before it feels urgent.
          </h2>
          <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground">
            Starting care can be a meaningful act of self-trust. Our team will meet you with
            expertise, respect, and a plan you can understand.
          </p>
          <div className="mt-7 flex items-center gap-3 text-sm font-semibold text-forest">
            <Stethoscope className="size-5" /> Licensed providers across California
          </div>
        </FadeLeft>

        <FadeRight delay={0.1} className="grid gap-4 sm:grid-cols-3">
          {TILES.map((tile) => (
            <div
              key={tile.title}
              className={
                tile.tone === "forest"
                  ? "rounded-4xl bg-forest p-6 text-forest-foreground"
                  : tile.tone === "sage"
                    ? "rounded-4xl border border-sage/60 bg-sage/35 p-6 text-forest dark:border-white/10 dark:bg-forest/15 dark:text-white"
                    : "rounded-4xl border border-border bg-card p-6 shadow-(--card-shadow)"
              }
            >
              <p className="font-primary text-2xl font-extrabold tracking-tight">{tile.title}</p>
              <p
                className={
                  tile.tone === "forest"
                    ? "mt-3 text-sm leading-6 text-forest-foreground/75"
                    : tile.tone === "sage"
                      ? "mt-3 text-sm leading-6 text-forest/80 dark:text-white/70"
                      : "mt-3 text-sm leading-6 text-muted-foreground"
                }
              >
                {tile.body}
              </p>
            </div>
          ))}
        </FadeRight>
      </div>
    </section>
  );
}
