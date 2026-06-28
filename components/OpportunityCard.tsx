import { GraphLinkPill } from "@/components/GraphLinkPill";
import { OnetRoleCard } from "@/components/OnetRoleCard";
import { buildScenarioHref } from "@/lib/mock-data";
import type { Locale } from "@/lib/i18n";
import type { Opportunity, Scenario, SkillProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

type OpportunityCardProps = {
  active?: boolean;
  anchorId?: string;
  linkedScenarios?: Scenario[];
  linkedSkills?: SkillProfile[];
  locale?: Locale;
  opportunity: Opportunity;
  scenarioId?: string;
};

export function OpportunityCard({
  active = false,
  anchorId,
  linkedScenarios = [],
  linkedSkills = [],
  locale = "en",
  opportunity,
  scenarioId,
}: OpportunityCardProps) {
  const copy = {
    en: {
      scenarioFocus: "Scenario focus",
      placeholder: "Placeholder",
      onetLinks: "O*NET opportunity links",
      connectedSkills: "Connected skills",
      connectedScenarios: "Connected scenarios",
      dossierSnapshot: "Open dossier snapshot",
      escoHint: "ESCO",
      onetHint: "O*NET",
    },
    it: {
      scenarioFocus: "Focus scenario",
      placeholder: "Placeholder",
      onetLinks: "Collegamenti opportunita' O*NET",
      connectedSkills: "Skill collegate",
      connectedScenarios: "Scenari collegati",
      dossierSnapshot: "Apri snapshot dossier",
      escoHint: "Hint ESCO",
      onetHint: "Hint O*NET",
    },
  }[locale];

  return (
    <article
      id={anchorId}
      className={cn(
        "card-surface flex h-full scroll-mt-24 flex-col gap-4",
        active &&
          "border-alba-forest/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(223,240,234,0.6))]",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-[#dff0ea] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-alba-forest">
          {opportunity.path}
        </span>
        <span className="text-sm text-alba-ink/55">
          {active ? copy.scenarioFocus : opportunity.compensationModel}
        </span>
      </div>

      <div>
        <h3 className="font-heading text-2xl text-alba-ink">{opportunity.title}</h3>
        <p className="mt-3 text-sm leading-7 text-alba-ink/72">{opportunity.summary}</p>
      </div>

      <div className="rounded-[1.6rem] bg-white/80 p-4 text-sm text-alba-ink/72">
        <p>{opportunity.context}</p>
        <p className="mt-3">
          {copy.escoHint}: {opportunity.escoHint || copy.placeholder}
        </p>
        <p>
          {copy.onetHint}: {opportunity.onetHint || copy.placeholder}
        </p>
      </div>

      <div className="rounded-[1.6rem] bg-alba-cream/68 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alba-clay/80">
          {copy.onetLinks}
        </p>
        <div className="mt-4 space-y-4">
          {opportunity.onetMatches.map((role) => (
            <OnetRoleCard key={`${opportunity.id}-${role.code}`} locale={locale} role={role} />
          ))}
        </div>
      </div>

      {(linkedSkills.length || linkedScenarios.length) ? (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-[1.6rem] bg-white/78 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alba-clay/80">
              {copy.connectedSkills}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {linkedSkills.map((skill) => (
                <GraphLinkPill
                  key={`${opportunity.id}-skill-${skill.id}`}
                  href={buildScenarioHref("/skills", scenarioId, `skill-${skill.id}`, locale)}
                  label={skill.name}
                />
              ))}
            </div>
          </div>

          <div className="rounded-[1.6rem] bg-white/78 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alba-clay/80">
              {copy.connectedScenarios}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {linkedScenarios.map((scenario) => (
                <GraphLinkPill
                  key={`${opportunity.id}-scenario-${scenario.id}`}
                  href={buildScenarioHref(
                    "/opportunities",
                    scenario.id,
                    `scenario-${scenario.id}`,
                    locale,
                  )}
                  label={scenario.title}
                />
              ))}
              <GraphLinkPill
                href={buildScenarioHref(
                  "/dossier",
                  scenarioId,
                  `opportunity-${opportunity.id}`,
                  locale,
                )}
                label={copy.dossierSnapshot}
              />
            </div>
          </div>
        </div>
      ) : null}

      <p className="mt-auto text-sm text-alba-ink/62">{opportunity.note}</p>
    </article>
  );
}
