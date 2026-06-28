"use client";

import type { Locale } from "@/lib/i18n";
import type { WellbeingTarget } from "@/lib/types";
import { cn, computeActivationNeed, computeGap } from "@/lib/utils";

type WellbeingSliderProps = {
  highlighted?: boolean;
  highlightLabel?: string;
  locale?: Locale;
  target: WellbeingTarget;
  onChange: (target: WellbeingTarget) => void;
};

export function WellbeingSlider({
  highlighted = false,
  highlightLabel = "Scenario focus",
  locale = "en",
  target,
  onChange,
}: WellbeingSliderProps) {
  const copy = {
    en: {
      scenarioFocus: "Scenario focus",
      activationNeedChip: "activationNeed",
      currentLevel: "Current level",
      desiredLevel: "Desired level",
      priority: "Priority",
      gap: "Gap",
      activationNeed: "Activation need",
      focusArea: "Focus area",
      improve: "Improve",
      maintain: "Maintain",
    },
    it: {
      scenarioFocus: "Focus scenario",
      activationNeedChip: "activationNeed",
      currentLevel: "Livello attuale",
      desiredLevel: "Livello desiderato",
      priority: "Priorita'",
      gap: "Gap",
      activationNeed: "Bisogno di attivazione",
      focusArea: "Area di focus",
      improve: "Migliora",
      maintain: "Mantieni",
    },
  }[locale];
  const gap = computeGap(target.currentLevel, target.desiredLevel);
  const activationNeed = computeActivationNeed(
    target.currentLevel,
    target.desiredLevel,
    target.priority,
  );

  return (
    <article
      className={cn(
        "rounded-[1.8rem] border border-white/60 bg-white/82 p-5 shadow-[0_20px_60px_rgba(29,48,41,0.06)]",
        highlighted &&
          "border-alba-clay/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.97),rgba(244,224,216,0.58))]",
      )}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="font-heading text-2xl text-alba-ink">{target.domain}</h3>
        <div className="flex flex-wrap items-center gap-2">
          {highlighted ? (
            <div className="rounded-full bg-alba-ink px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
              {highlightLabel === "Scenario focus" ? copy.scenarioFocus : highlightLabel}
            </div>
          ) : null}
          <div className="rounded-full bg-alba-rose/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-alba-clay">
            {copy.activationNeedChip} {activationNeed}
          </div>
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-alba-ink/65">{target.note}</p>

      <div className="mt-5 grid gap-5 md:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-medium text-alba-ink/75">
            {copy.currentLevel}: {target.currentLevel}
          </span>
          <input
            type="range"
            min={0}
            max={10}
            value={target.currentLevel}
            onChange={(event) =>
              onChange({ ...target, currentLevel: Number(event.target.value) })
            }
            className="w-full accent-alba-forest"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-alba-ink/75">
            {copy.desiredLevel}: {target.desiredLevel}
          </span>
          <input
            type="range"
            min={0}
            max={10}
            value={target.desiredLevel}
            onChange={(event) =>
              onChange({ ...target, desiredLevel: Number(event.target.value) })
            }
            className="w-full accent-alba-clay"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-alba-ink/75">
            {copy.priority}: {target.priority}
          </span>
          <input
            type="range"
            min={0}
            max={5}
            value={target.priority}
            onChange={(event) => onChange({ ...target, priority: Number(event.target.value) })}
            className="w-full accent-alba-gold"
          />
        </label>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-alba-ink/72 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl bg-alba-cream/70 px-4 py-3">
          {copy.gap}: {gap}
        </div>
        <div className="rounded-2xl bg-alba-cream/70 px-4 py-3">
          {copy.activationNeed}: {activationNeed}
        </div>
        <div className="rounded-2xl bg-alba-cream/70 px-4 py-3">
          {copy.focusArea}: {gap > 0 ? copy.improve : copy.maintain}
        </div>
      </div>
    </article>
  );
}
