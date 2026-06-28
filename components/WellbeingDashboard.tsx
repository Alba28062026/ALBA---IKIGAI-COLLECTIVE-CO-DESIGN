"use client";

import { useMemo, useState } from "react";
import { WellbeingSlider } from "@/components/WellbeingSlider";
import type { Locale } from "@/lib/i18n";
import { average, computeActivationNeed, computeGap } from "@/lib/utils";
import type { PermavScores, WellbeingTarget } from "@/lib/types";

type WellbeingDashboardProps = {
  focusLabel?: string;
  focusNote?: string;
  focusPermav?: PermavScores;
  focusTargetIds?: string[];
  locale?: Locale;
  wellbeingLevers?: string[];
  initialTargets: WellbeingTarget[];
};

export function WellbeingDashboard({
  focusLabel = "Active scenario",
  focusNote,
  focusPermav,
  focusTargetIds = [],
  initialTargets,
  locale = "en",
  wellbeingLevers = [],
}: WellbeingDashboardProps) {
  const copy = {
    en: {
      wellbeingFocus: "Wellbeing focus to validate",
      connectedLevers: "Connected levers",
      simulatedPermav: "Simulated PERMAV",
      expectedFlourishingAverage: "Expected flourishing average",
      averageCurrent: "Average current",
      averageDesired: "Average desired",
      totalGap: "Total gap",
      activationNeed: "Activation need",
      highestPrioritySignal: "Highest priority signal",
      none: "None",
      permavLabels: {
        positiveEmotion: "Positive Emotion",
        engagement: "Engagement",
        relationships: "Relationships",
        meaning: "Meaning",
        accomplishment: "Accomplishment",
        vitality: "Vitality",
      },
    },
    it: {
      wellbeingFocus: "Focus benessere da validare",
      connectedLevers: "Leve collegate",
      simulatedPermav: "PERMAV simulato",
      expectedFlourishingAverage: "Media flourishing attesa",
      averageCurrent: "Media attuale",
      averageDesired: "Media desiderata",
      totalGap: "Gap totale",
      activationNeed: "Bisogno di attivazione",
      highestPrioritySignal: "Segnale prioritario",
      none: "Nessuno",
      permavLabels: {
        positiveEmotion: "Emozione positiva",
        engagement: "Engagement",
        relationships: "Relazioni",
        meaning: "Meaning",
        accomplishment: "Accomplishment",
        vitality: "Vitalita'",
      },
    },
  }[locale];
  const permavLabels: Array<{ key: keyof PermavScores; label: string }> = [
    { key: "positiveEmotion", label: copy.permavLabels.positiveEmotion },
    { key: "engagement", label: copy.permavLabels.engagement },
    { key: "relationships", label: copy.permavLabels.relationships },
    { key: "meaning", label: copy.permavLabels.meaning },
    { key: "accomplishment", label: copy.permavLabels.accomplishment },
    { key: "vitality", label: copy.permavLabels.vitality },
  ];
  const [targets, setTargets] = useState(initialTargets);

  const summary = useMemo(() => {
    const activationNeeds = targets.map((target) =>
      computeActivationNeed(target.currentLevel, target.desiredLevel, target.priority),
    );
    const gaps = targets.map((target) => computeGap(target.currentLevel, target.desiredLevel));
    const highestNeed = targets.reduce((highest, target) => {
      const currentNeed = computeActivationNeed(
        target.currentLevel,
        target.desiredLevel,
        target.priority,
      );

      if (!highest) {
        return { domain: target.domain, activationNeed: currentNeed };
      }

      return currentNeed > highest.activationNeed
        ? { domain: target.domain, activationNeed: currentNeed }
        : highest;
    }, null as { domain: string; activationNeed: number } | null);

    return {
      meanCurrent: average(targets.map((target) => target.currentLevel)).toFixed(1),
      meanDesired: average(targets.map((target) => target.desiredLevel)).toFixed(1),
      totalGap: gaps.reduce((sum, gap) => sum + gap, 0),
      totalActivationNeed: activationNeeds.reduce((sum, value) => sum + value, 0),
      highestNeed,
    };
  }, [targets]);

  const orderedTargets = useMemo(() => {
    if (!focusTargetIds.length) {
      return targets;
    }

    const focusSet = new Set(focusTargetIds);

    return [...targets].sort((left, right) => {
      const leftFocused = focusSet.has(left.id);
      const rightFocused = focusSet.has(right.id);

      if (leftFocused === rightFocused) {
        return 0;
      }

      return leftFocused ? -1 : 1;
    });
  }, [focusTargetIds, targets]);

  const scenarioPermavAverage = focusPermav
    ? Math.round(
        average([
          focusPermav.positiveEmotion,
          focusPermav.engagement,
          focusPermav.relationships,
          focusPermav.meaning,
          focusPermav.accomplishment,
          focusPermav.vitality,
        ]),
      )
    : null;

  return (
    <section className="space-y-6">
      {focusNote || focusPermav || wellbeingLevers.length ? (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <div className="card-surface">
            <p className="eyebrow">{focusLabel}</p>
            <h3 className="mt-3 font-heading text-3xl text-alba-ink">
              {copy.wellbeingFocus}
            </h3>
            {focusNote ? (
              <p className="mt-4 text-sm leading-7 text-alba-ink/72">{focusNote}</p>
            ) : null}

            {wellbeingLevers.length ? (
              <div className="mt-5 rounded-[1.6rem] bg-alba-cream/72 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alba-clay/80">
                  {copy.connectedLevers}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {wellbeingLevers.map((lever) => (
                    <span
                      key={lever}
                      className="rounded-full border border-alba-forest/12 bg-white px-3 py-1 text-xs text-alba-forest"
                    >
                      {lever}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {focusPermav ? (
            <div className="card-surface bg-alba-ink text-white">
              <p className="eyebrow text-white/70">{copy.simulatedPermav}</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {permavLabels.map((item) => (
                  <div key={item.key} className="rounded-2xl bg-white/10 px-4 py-3 text-sm">
                    <p className="text-white/72">{item.label}</p>
                    <p className="mt-1 font-semibold text-white">{focusPermav[item.key]}/100</p>
                  </div>
                ))}
              </div>
              {scenarioPermavAverage !== null ? (
                <p className="mt-5 text-sm text-white/78">
                  {copy.expectedFlourishingAverage}: {scenarioPermavAverage}/100
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="card-surface">
          <p className="text-sm text-alba-ink/55">{copy.averageCurrent}</p>
          <p className="mt-3 font-heading text-4xl text-alba-ink">{summary.meanCurrent}</p>
        </div>
        <div className="card-surface">
          <p className="text-sm text-alba-ink/55">{copy.averageDesired}</p>
          <p className="mt-3 font-heading text-4xl text-alba-ink">{summary.meanDesired}</p>
        </div>
        <div className="card-surface">
          <p className="text-sm text-alba-ink/55">{copy.totalGap}</p>
          <p className="mt-3 font-heading text-4xl text-alba-ink">{summary.totalGap}</p>
        </div>
        <div className="card-surface">
          <p className="text-sm text-alba-ink/55">{copy.activationNeed}</p>
          <p className="mt-3 font-heading text-4xl text-alba-ink">
            {summary.totalActivationNeed}
          </p>
        </div>
        <div className="card-surface bg-alba-ink text-white">
          <p className="text-sm text-white/60">{copy.highestPrioritySignal}</p>
          <p className="mt-3 font-heading text-2xl">
            {summary.highestNeed?.domain || copy.none}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {orderedTargets.map((target) => (
            <WellbeingSlider
              key={target.id}
              highlighted={focusTargetIds.includes(target.id)}
              locale={locale}
              target={target}
            onChange={(nextTarget) =>
              setTargets((current) =>
                current.map((candidate) =>
                  candidate.id === nextTarget.id ? nextTarget : candidate,
                ),
              )
            }
          />
        ))}
      </div>
    </section>
  );
}
