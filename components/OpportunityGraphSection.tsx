import { GraphLinkPill } from "@/components/GraphLinkPill";
import { buildScenarioHref } from "@/lib/mock-data";
import type { Locale } from "@/lib/i18n";
import type { Opportunity, Scenario, SkillProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

type OpportunityGraphEntry = {
  opportunity: Opportunity;
  scenarios: Scenario[];
  skills: SkillProfile[];
};

type OpportunityGraphSectionProps = {
  activeOpportunityId?: string;
  entries: OpportunityGraphEntry[];
  eyebrow?: string;
  description: string;
  locale?: Locale;
  scenarioId?: string;
  title: string;
};

export function OpportunityGraphSection({
  activeOpportunityId,
  entries,
  title,
  eyebrow = "Opportunity graph",
  description,
  locale = "en",
  scenarioId,
}: OpportunityGraphSectionProps) {
  const copy = {
    en: {
      openOpportunity: "Open opportunity",
      skills: "Skills",
      scenarios: "Scenarios",
      dossier: "Dossier",
      snapshotOpportunity: "Snapshot opportunity",
    },
    it: {
      openOpportunity: "Apri opportunita'",
      skills: "Skill",
      scenarios: "Scenari",
      dossier: "Dossier",
      snapshotOpportunity: "Snapshot opportunita'",
    },
  }[locale];

  return (
    <section className="card-surface">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 font-heading text-3xl text-alba-ink">{title}</h2>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-alba-ink/72">{description}</p>

      <div className="mt-6 space-y-5">
        {entries.map((entry) => (
          <article
            key={entry.opportunity.id}
            className={cn(
              "rounded-[1.8rem] bg-white/80 p-5",
              entry.opportunity.id === activeOpportunityId &&
                "border border-alba-forest/18 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(223,240,234,0.6))]",
            )}
          >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <h3 className="font-heading text-2xl text-alba-ink">
                  {entry.opportunity.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-alba-ink/72">
                  {entry.opportunity.summary}
                </p>
              </div>

              <GraphLinkPill
                href={buildScenarioHref(
                  "/opportunities",
                  scenarioId,
                  `opportunity-${entry.opportunity.id}`,
                  locale,
                )}
                label={copy.openOpportunity}
              />
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              <div className="rounded-[1.5rem] bg-alba-cream/72 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alba-clay/80">
                  {copy.skills}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {entry.skills.map((skill) => (
                    <GraphLinkPill
                      key={`${entry.opportunity.id}-${skill.id}`}
                      href={buildScenarioHref("/skills", scenarioId, `skill-${skill.id}`, locale)}
                      label={skill.name}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-[1.5rem] bg-alba-cream/72 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alba-clay/80">
                  {copy.scenarios}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {entry.scenarios.map((scenario) => (
                    <GraphLinkPill
                      key={`${entry.opportunity.id}-${scenario.id}`}
                      href={buildScenarioHref(
                        "/opportunities",
                        scenario.id,
                        `scenario-${scenario.id}`,
                        locale,
                      )}
                      label={scenario.title}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-[1.5rem] bg-alba-cream/72 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alba-clay/80">
                  {copy.dossier}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <GraphLinkPill
                    href={buildScenarioHref(
                      "/dossier",
                      scenarioId,
                      `opportunity-${entry.opportunity.id}`,
                      locale,
                    )}
                    label={copy.snapshotOpportunity}
                  />
                  {entry.scenarios.map((scenario) => (
                    <GraphLinkPill
                      key={`${entry.opportunity.id}-dossier-${scenario.id}`}
                      href={buildScenarioHref(
                        "/dossier",
                        scenario.id,
                        `scenario-${scenario.id}`,
                        locale,
                      )}
                      label={scenario.title}
                    />
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
