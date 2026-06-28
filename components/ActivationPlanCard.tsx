import type { ActivationPlan } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type ActivationPlanCardProps = {
  active?: boolean;
  locale?: Locale;
  plan: ActivationPlan;
};

export function ActivationPlanCard({
  active = false,
  locale = "en",
  plan,
}: ActivationPlanCardProps) {
  const copy = {
    en: {
      scenarioFocus: "Scenario focus",
      coreMoves: "Core moves",
      wellbeingLevers: "Wellbeing levers",
      routineBundle: "Routine stack",
      sleep: "Sleep",
      nutrition: "Nutrition",
      movement: "Movement and sport",
      recovery: "Recovery",
    },
    it: {
      scenarioFocus: "Focus scenario",
      coreMoves: "Leve centrali",
      wellbeingLevers: "Leve di benessere",
      routineBundle: "Routine stack",
      sleep: "Sonno",
      nutrition: "Alimentazione",
      movement: "Movimento e sport",
      recovery: "Recovery",
    },
  }[locale];

  return (
    <article
      className={cn(
        "card-surface flex h-full flex-col gap-4",
        active &&
          "border-alba-gold/25 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(239,230,200,0.58))]",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-[#efe6c8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-alba-clay">
          {plan.duration}
        </span>
        <span className="text-sm text-alba-ink/55">
          {active ? copy.scenarioFocus : plan.focus}
        </span>
      </div>

      <h3 className="font-heading text-2xl text-alba-ink">{plan.title}</h3>

      <div className="rounded-[1.6rem] bg-white/78 p-4">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-alba-forest/72">
          {copy.coreMoves}
        </p>
        <ul className="mt-3 space-y-2 text-sm leading-7 text-alba-ink/75">
          {plan.moves.map((move) => (
            <li key={move}>- {move}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-[1.6rem] bg-alba-cream/72 p-4 text-sm text-alba-ink/75">
        <p className="font-semibold uppercase tracking-[0.16em] text-alba-clay/80">
          {copy.wellbeingLevers}
        </p>
        <p className="mt-3 leading-7">{plan.wellbeingLevers.join(" | ")}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {[
          { label: copy.sleep, items: plan.routineBundle.sleep },
          { label: copy.nutrition, items: plan.routineBundle.nutrition },
          { label: copy.movement, items: plan.routineBundle.movement },
          { label: copy.recovery, items: plan.routineBundle.recovery },
        ].map((group) => (
          <div key={group.label} className="rounded-[1.4rem] bg-white/82 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alba-forest/72">
              {group.label}
            </p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-alba-ink/72">
              {group.items.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="text-sm leading-7 text-alba-ink/62">{plan.riskGuardrail}</p>
    </article>
  );
}
