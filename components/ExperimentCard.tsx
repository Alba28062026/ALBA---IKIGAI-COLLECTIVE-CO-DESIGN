import type { Experiment } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type ExperimentCardProps = {
  active?: boolean;
  locale?: Locale;
  experiment: Experiment;
};

export function ExperimentCard({
  active = false,
  locale = "en",
  experiment,
}: ExperimentCardProps) {
  const copy = {
    en: {
      scenarioFocus: "Scenario focus",
      effort: "Effort",
      impact: "Impact",
    },
    it: {
      scenarioFocus: "Focus scenario",
      effort: "Sforzo",
      impact: "Impatto",
    },
  }[locale];

  return (
    <article
      className={cn(
        "card-surface flex h-full flex-col gap-4",
        active &&
          "border-alba-clay/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(244,224,216,0.6))]",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-alba-rose/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-alba-clay">
          {experiment.theme}
        </span>
        <span className="text-sm text-alba-ink/55">
          {active ? copy.scenarioFocus : experiment.horizon}
        </span>
      </div>

      <div>
        <h3 className="font-heading text-2xl text-alba-ink">{experiment.title}</h3>
        <p className="mt-3 text-sm leading-7 text-alba-ink/72">{experiment.hypothesis}</p>
      </div>

      <div className="grid grid-cols-3 gap-3 text-sm text-alba-ink/72">
        <div className="rounded-2xl bg-white/80 px-4 py-3">
          {copy.effort} {experiment.effort}/5
        </div>
        <div className="rounded-2xl bg-white/80 px-4 py-3">
          {copy.impact} {experiment.impact}/5
        </div>
        <div className="rounded-2xl bg-white/80 px-4 py-3">{experiment.status}</div>
      </div>

      <p className="mt-auto text-sm leading-7 text-alba-ink/62">{experiment.note}</p>
    </article>
  );
}
