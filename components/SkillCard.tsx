import { GraphLinkPill } from "@/components/GraphLinkPill";
import { buildScenarioHref } from "@/lib/mock-data";
import type { Locale } from "@/lib/i18n";
import type { Opportunity, SkillProfile } from "@/lib/types";
import { cn, formatBandLabel } from "@/lib/utils";

type SkillCardProps = {
  active?: boolean;
  anchorId?: string;
  linkedOpportunities?: Opportunity[];
  locale?: Locale;
  scenarioId?: string;
  skill: SkillProfile;
};

export function SkillCard({
  active = false,
  anchorId,
  linkedOpportunities = [],
  locale = "en",
  scenarioId,
  skill,
}: SkillCardProps) {
  const copy = {
    en: {
      scenarioFocus: "Scenario focus",
      level: "Level",
      escoHint: "ESCO hint",
      onetHint: "O*NET hint",
      todo: "TODO",
      opportunityGraph: "Opportunity graph",
    },
    it: {
      scenarioFocus: "Focus scenario",
      level: "Livello",
      escoHint: "Hint ESCO",
      onetHint: "Hint O*NET",
      todo: "TODO",
      opportunityGraph: "Opportunity graph",
    },
  }[locale];

  return (
    <article
      id={anchorId}
      className={cn(
        "card-surface flex h-full scroll-mt-24 flex-col gap-4",
        active &&
          "border-alba-forest/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(223,240,234,0.58))]",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-alba-cream px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-alba-forest">
          {formatBandLabel(skill.band, locale)}
        </span>
        <span className="text-sm text-alba-ink/55">
          {active ? copy.scenarioFocus : `${copy.level} ${skill.level}/10`}
        </span>
      </div>

      <div>
        <h3 className="font-heading text-2xl text-alba-ink">{skill.name}</h3>
        <p className="mt-2 text-sm text-alba-ink/58">{skill.category}</p>
      </div>

      <p className="text-sm leading-7 text-alba-ink/72">{skill.evidenceSignal}</p>

      <div className="rounded-[1.6rem] bg-white/75 p-4 text-sm text-alba-ink/72">
        <p>
          {copy.escoHint}: {skill.escoHint || copy.todo}
        </p>
        <p className="mt-2">
          {copy.onetHint}: {skill.onetHint || copy.todo}
        </p>
        {skill.suggestedOnetCodes?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {skill.suggestedOnetCodes.map((code) => (
              <span
                key={`${skill.id}-${code}`}
                className="rounded-full border border-alba-forest/12 bg-alba-cream/72 px-3 py-1 text-xs text-alba-forest"
              >
                O*NET {code}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      {linkedOpportunities.length ? (
        <div className="rounded-[1.6rem] bg-alba-cream/68 p-4 text-sm text-alba-ink/72">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alba-clay/80">
            {copy.opportunityGraph}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {linkedOpportunities.map((opportunity) => (
              <GraphLinkPill
                key={`${skill.id}-${opportunity.id}`}
                href={buildScenarioHref(
                  "/opportunities",
                  scenarioId,
                  `opportunity-${opportunity.id}`,
                  locale,
                )}
                label={opportunity.title}
              />
            ))}
          </div>
        </div>
      ) : null}

      {skill.note ? <p className="text-sm text-alba-ink/62">{skill.note}</p> : null}
    </article>
  );
}
