import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import type { GamificationProfile } from "@/lib/types";

type GamificationCardProps = {
  locale?: Locale;
  profile: GamificationProfile;
};

export function GamificationCard({
  locale = "en",
  profile,
}: GamificationCardProps) {
  const copy = {
    en: {
      eyebrow: "Momentum system",
      title: "Light gamification for steady progress.",
      wins: "Recent wins",
      phases: "Phase quests",
      xpToGo: "XP to next level",
      openEvidence: "Open Evidence",
      openSimulation: "Open Simulation",
      openActivation: "Open Activation",
    },
    it: {
      eyebrow: "Sistema di momentum",
      title: "Gamification leggera per progressi costanti.",
      wins: "Win recenti",
      phases: "Quest delle fasi",
      xpToGo: "XP al prossimo livello",
      openEvidence: "Apri Evidence",
      openSimulation: "Apri Simulation",
      openActivation: "Apri Activation",
    },
  }[locale];

  const routeByPhase = {
    awareness: "/evidence",
    simulation: "/opportunities",
    activation: "/experiments",
  } as const;

  const labelByPhase = {
    awareness: copy.openEvidence,
    simulation: copy.openSimulation,
    activation: copy.openActivation,
  } as const;

  const xpRemaining = Math.max(0, profile.nextLevelXp - profile.xp);

  return (
    <section className="card-surface space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h3 className="mt-3 font-heading text-3xl text-alba-ink">{copy.title}</h3>
          <p className="mt-3 text-sm leading-7 text-alba-ink/72">{profile.momentumLabel}</p>
        </div>

        <div className="rounded-[1.5rem] bg-alba-ink px-5 py-4 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
            {profile.badge}
          </p>
          <p className="mt-2 font-heading text-3xl">
            Lv {profile.level}
          </p>
          <p className="mt-2 text-sm text-white/78">
            {profile.xp}/{profile.nextLevelXp} XP · {copy.xpToGo}: {xpRemaining}
          </p>
        </div>
      </div>

      <div className="rounded-full bg-alba-cream/72 p-1">
        <div
          className="h-3 rounded-full bg-alba-forest transition"
          style={{ width: `${Math.min(100, Math.round((profile.xp / profile.nextLevelXp) * 100))}%` }}
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(320px,1.1fr)]">
        <div className="rounded-[1.5rem] bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alba-forest/72">
            {copy.wins}
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-alba-ink/72">
            {profile.wins.map((win) => (
              <li key={win}>- {win}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-[1.5rem] bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alba-forest/72">
            {copy.phases}
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {profile.phases.map((phase) => (
              <div key={phase.phaseId} className="rounded-2xl border border-alba-forest/8 bg-alba-cream/32 p-4">
                <p className="text-sm font-semibold text-alba-ink">{phase.title}</p>
                <p className="mt-2 text-2xl font-heading text-alba-ink">{phase.progress}%</p>
                <p className="mt-2 text-sm leading-6 text-alba-ink/70">{phase.currentQuest}</p>
                <p className="mt-2 text-xs text-alba-ink/58">
                  {phase.streakDays}d streak · {phase.reward}
                </p>
                <Link
                  href={routeByPhase[phase.phaseId]}
                  className="mt-4 inline-flex min-h-10 items-center rounded-full border border-alba-forest/12 bg-white px-4 py-2 text-sm font-medium text-alba-forest transition hover:bg-alba-cream/72"
                >
                  {labelByPhase[phase.phaseId]}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
