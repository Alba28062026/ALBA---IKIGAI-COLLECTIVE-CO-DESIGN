import { GraphLinkPill } from "@/components/GraphLinkPill";
import { buildScenarioHref } from "@/lib/mock-data";
import type { Locale } from "@/lib/i18n";
import type { Opportunity, Scenario } from "@/lib/types";
import { cn } from "@/lib/utils";

type ScenarioCardProps = {
  active?: boolean;
  anchorId?: string;
  linkedOpportunities?: Opportunity[];
  locale?: Locale;
  scenario: Scenario;
};

export function ScenarioCard({
  active = false,
  anchorId,
  linkedOpportunities = [],
  locale = "en",
  scenario,
}: ScenarioCardProps) {
  const copy = {
    en: {
      scenarioFocus: "Scenario focus",
      mockScenario: "Mock scenario",
      ikigai: "Ikigai",
      wellbeing: "Wellbeing",
      connectedOpportunities: "Connected opportunities",
      dossierRecap: "Open dossier recap",
      permav: {
        positiveEmotion: "Positive Emotion",
        engagement: "Engagement",
        relationships: "Relationships",
        meaning: "Meaning",
        accomplishment: "Accomplishment",
        vitality: "Vitality",
      },
    },
    it: {
      scenarioFocus: "Focus scenario",
      mockScenario: "Scenario mock",
      ikigai: "Ikigai",
      wellbeing: "Benessere",
      connectedOpportunities: "Opportunita' collegate",
      dossierRecap: "Apri recap dossier",
      permav: {
        positiveEmotion: "Emozione positiva",
        engagement: "Engagement",
        relationships: "Relazioni",
        meaning: "Meaning",
        accomplishment: "Accomplishment",
        vitality: "Vitalita'",
      },
    },
  }[locale];
  const permavEntries = Object.entries(scenario.permav);

  return (
    <article
      id={anchorId}
      className={cn(
        "card-surface flex h-full scroll-mt-24 flex-col gap-4",
        active &&
          "border-alba-clay/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(244,224,216,0.65))]",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-alba-cream px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-alba-clay">
          {scenario.horizon}
        </span>
        <span className="text-sm text-alba-ink/55">
          {active ? copy.scenarioFocus : copy.mockScenario}
        </span>
      </div>

      <div>
        <h3 className="font-heading text-2xl text-alba-ink">{scenario.title}</h3>
        <p className="mt-3 text-sm leading-7 text-alba-ink/72">{scenario.thesis}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {permavEntries.map(([key, value]) => (
          <div key={key} className="rounded-2xl bg-white/78 px-4 py-3 text-sm text-alba-ink/72">
            <p className="font-medium text-alba-ink">
              {copy.permav[key as keyof typeof copy.permav]}
            </p>
            <p className="mt-1">{value}/100</p>
          </div>
        ))}
      </div>

      <div className="rounded-[1.6rem] bg-alba-ink p-4 text-sm leading-7 text-white/80">
        <p>
          {copy.ikigai}: {scenario.ikigaiSignal}
        </p>
        <p className="mt-2">
          {copy.wellbeing}: {scenario.wellbeingShift}
        </p>
      </div>

      {linkedOpportunities.length ? (
        <div className="rounded-[1.6rem] bg-alba-cream/68 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alba-clay/80">
            {copy.connectedOpportunities}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {linkedOpportunities.map((opportunity) => (
              <GraphLinkPill
                key={`${scenario.id}-${opportunity.id}`}
                href={buildScenarioHref(
                  "/opportunities",
                  scenario.id,
                  `opportunity-${opportunity.id}`,
                  locale,
                )}
                label={opportunity.title}
              />
            ))}
            <GraphLinkPill
              href={buildScenarioHref("/dossier", scenario.id, `scenario-${scenario.id}`, locale)}
              label={copy.dossierRecap}
            />
          </div>
        </div>
      ) : null}
    </article>
  );
}
