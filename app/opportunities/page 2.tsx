import { FitScoreCard } from "@/components/FitScoreCard";
import { JobAdImportStudio } from "@/components/JobAdImportStudio";
import { LiveOpportunityPipelineCard } from "@/components/LiveOpportunityPipelineCard";
import { OpportunityGraphSection } from "@/components/OpportunityGraphSection";
import { OpportunityCard } from "@/components/OpportunityCard";
import { ScenarioCard } from "@/components/ScenarioCard";
import { ScenarioContextBar } from "@/components/ScenarioContextBar";
import { resolveLocale } from "@/lib/i18n";
import { buildScenarioHref } from "@/lib/mock-data";
import { getLiveOpportunityPipeline } from "@/lib/opportunity-live";
import {
  getLocalizedOpportunityGraphEntries,
  getLocalizedOpportunities,
  getLocalizedPrimaryOpportunityForScenario,
  getLocalizedScenarioForRoute,
  getLocalizedScenarios,
  getLocalizedScenariosForOpportunity,
  getLocalizedSkillsForOpportunity,
} from "@/lib/localized-data";

type OpportunitiesPageProps = {
  searchParams?: Promise<{
    lang?: string | string[];
    scenario?: string | string[];
  }>;
};

export const dynamic = "force-dynamic";

export default async function OpportunitiesPage({
  searchParams,
}: OpportunitiesPageProps) {
  const params = await searchParams;
  const locale = resolveLocale(params?.lang);
  const activeScenario = getLocalizedScenarioForRoute(locale, params?.scenario);
  const opportunities = getLocalizedOpportunities(locale);
  const scenarios = getLocalizedScenarios(locale);
  const resolveLinkedOpportunities = (opportunityIds: string[]) =>
    opportunityIds
      .map((opportunityId) =>
        opportunities.find((opportunity) => opportunity.id === opportunityId),
      )
      .filter(
        (opportunity): opportunity is (typeof opportunities)[number] => Boolean(opportunity),
      );
  const activeOpportunity =
    getLocalizedPrimaryOpportunityForScenario(locale, activeScenario.id) ?? opportunities[0];
  const livePipeline = await getLiveOpportunityPipeline({
    locale,
    opportunity: activeOpportunity,
    query: activeOpportunity.escoHint ?? activeOpportunity.title,
  });
  const activeOnetRoles = activeOpportunity.onetMatches.map((role) => ({
    opportunityTitle: activeOpportunity.title,
    role,
  }));
  const graphEntries = getLocalizedOpportunityGraphEntries(locale).sort((left, right) => {
    if (left.opportunity.id === activeOpportunity.id) {
      return -1;
    }

    if (right.opportunity.id === activeOpportunity.id) {
      return 1;
    }

    return left.opportunity.title.localeCompare(right.opportunity.title);
  });
  const orderedScenarios = [
    activeScenario,
    ...scenarios.filter((scenario) => scenario.id !== activeScenario.id),
  ];
  const orderedOpportunities = [
    activeOpportunity,
    ...opportunities.filter((opportunity) => opportunity.id !== activeOpportunity.id),
  ];
  const copy = {
    en: {
      eyebrow: "Simulation",
      title: "Opportunity graph and multidimensional fit scores.",
      description:
        "Skill fit, purpose fit, values fit, energy fit, work-context fit, and wellbeing fit remain mock hypotheses. The page now follows the active scenario, so the Portfolio -> O*NET -> Opportunity Graph bridge stays readable even while you compare multiple paths.",
      barDescription:
        "Simulation does not assign a definitive role: it uses the active scenario to focus the most credible bridge toward opportunities and O*NET language.",
      openActivation: "Open linked Activation",
      openDossier: "Open focused dossier",
      barTitle: "Scenario focus for opportunity reading.",
      onetEyebrow: "O*NET bridge",
      onetTitle: "O*NET roles in focus for the active scenario.",
      onetDescription:
        "Alba does not do definitive job matching: it uses O*NET as a reference taxonomy to anchor the active hypothesis to public and verifiable role families.",
      openOnet: "Open O*NET OnLine",
      graphTitle: "Simulation graph across portfolio, scenarios, and professional outlets",
      graphDescription:
        "This map makes the mock Portfolio -> O*NET -> Opportunity Graph bridge explicit. The active entry is highlighted, while the rest of the graph stays visible for comparison.",
      libraryEyebrow: "Scenario library",
      libraryTitle: "Scenario comparison",
      libraryDescription:
        "The active scenario appears first, while the other hypotheses remain available as a benchmark for meaning, context, and risk.",
      fitTitle: "Fit score focus",
      fitTitleShort: "Fit score",
    },
    it: {
      eyebrow: "Simulation",
      title: "Opportunity graph e fit score multidimensionali.",
      description:
        "Skill fit, purpose fit, values fit, energy fit, work-context fit e wellbeing fit restano ipotesi mock. La pagina segue lo scenario attivo, cosi' il ponte Portfolio -> O*NET -> Opportunity Graph resta leggibile mentre confronti piu' percorsi.",
      barDescription:
        "Simulation non assegna un ruolo definitivo: usa lo scenario attivo per mettere a fuoco il ponte piu' credibile verso opportunita' e linguaggio O*NET.",
      openActivation: "Apri Activation collegata",
      openDossier: "Apri dossier focalizzato",
      barTitle: "Focus scenario per la lettura delle opportunita'.",
      onetEyebrow: "Ponte O*NET",
      onetTitle: "Ruoli O*NET in focus per lo scenario attivo.",
      onetDescription:
        "Alba non fa job matching definitivo: usa O*NET come tassonomia di riferimento per ancorare l'ipotesi attiva a famiglie di ruolo pubbliche e verificabili.",
      openOnet: "Apri O*NET OnLine",
      graphTitle: "Grafo di Simulation tra portfolio, scenari e sbocchi professionali",
      graphDescription:
        "Questa mappa rende esplicito il ponte mock Portfolio -> O*NET -> Opportunity Graph. L'entry attiva e' evidenziata, mentre il resto del grafo resta visibile per il confronto.",
      libraryEyebrow: "Libreria scenari",
      libraryTitle: "Confronto scenari",
      libraryDescription:
        "Lo scenario attivo appare per primo, mentre le altre ipotesi restano disponibili come benchmark per significato, contesto e rischio.",
      fitTitle: "Focus fit score",
      fitTitleShort: "Fit score",
    },
  }[locale];

  return (
    <div className="space-y-8">
      <section className="card-surface">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2 className="mt-3 font-heading text-4xl text-alba-ink">{copy.title}</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-alba-ink/72">{copy.description}</p>
      </section>

      <JobAdImportStudio
        activeScenarioId={activeScenario.id}
        locale={locale}
        opportunities={opportunities}
        scenarios={scenarios}
      />

      <LiveOpportunityPipelineCard locale={locale} pipeline={livePipeline} />

      <ScenarioContextBar
        activeScenario={activeScenario}
        basePath="/opportunities"
        description={copy.barDescription}
        links={[
          {
            href: buildScenarioHref("/experiments", activeScenario.id, undefined, locale),
            label: copy.openActivation,
          },
          {
            href: buildScenarioHref("/dossier", activeScenario.id, undefined, locale),
            label: copy.openDossier,
          },
        ]}
        locale={locale}
        scenarios={scenarios}
        title={copy.barTitle}
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        <ScenarioCard
          active
          anchorId={`scenario-${activeScenario.id}`}
            linkedOpportunities={resolveLinkedOpportunities(activeScenario.opportunityIds)}
            locale={locale}
            scenario={activeScenario}
          />

        <div className="space-y-5">
          <OpportunityCard
            active
            anchorId={`opportunity-${activeOpportunity.id}`}
            linkedScenarios={getLocalizedScenariosForOpportunity(locale, activeOpportunity.id)}
            linkedSkills={getLocalizedSkillsForOpportunity(locale, activeOpportunity.id)}
            locale={locale}
            opportunity={activeOpportunity}
            scenarioId={activeScenario.id}
          />
          <FitScoreCard
            locale={locale}
            title={`${copy.fitTitle} - ${activeOpportunity.title}`}
            scores={activeOpportunity.fit}
            note={activeOpportunity.note}
          />
        </div>
      </section>

      <section className="card-surface">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow">{copy.onetEyebrow}</p>
            <h3 className="mt-3 font-heading text-3xl text-alba-ink">{copy.onetTitle}</h3>
            <p className="mt-4 text-sm leading-7 text-alba-ink/72">{copy.onetDescription}</p>
          </div>

          <a
            href="https://www.onetonline.org/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-alba-forest/15 bg-white/80 px-5 py-3 text-sm font-semibold text-alba-forest transition hover:bg-white"
          >
            {copy.openOnet}
          </a>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {activeOnetRoles.map(({ opportunityTitle, role }) => (
            <div key={`${opportunityTitle}-${role.code}`} className="rounded-[1.5rem] bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alba-forest/72">
                {role.code}
              </p>
              <h4 className="mt-2 font-heading text-xl text-alba-ink">{role.title}</h4>
              <p className="mt-3 text-sm leading-7 text-alba-ink/70">{opportunityTitle}</p>
            </div>
          ))}
        </div>
      </section>

      <OpportunityGraphSection
        activeOpportunityId={activeOpportunity.id}
        entries={graphEntries}
        locale={locale}
        scenarioId={activeScenario.id}
        title={copy.graphTitle}
        description={copy.graphDescription}
      />

      <section className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">{copy.libraryEyebrow}</p>
            <h3 className="mt-3 font-heading text-3xl text-alba-ink">{copy.libraryTitle}</h3>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-alba-ink/68">
            {copy.libraryDescription}
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          {orderedScenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              active={scenario.id === activeScenario.id}
              anchorId={`scenario-${scenario.id}`}
              linkedOpportunities={resolveLinkedOpportunities(scenario.opportunityIds)}
              locale={locale}
              scenario={scenario}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(340px,0.9fr)]">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-1">
          {orderedOpportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              active={opportunity.id === activeOpportunity.id}
              anchorId={`opportunity-${opportunity.id}`}
              linkedScenarios={getLocalizedScenariosForOpportunity(locale, opportunity.id)}
              linkedSkills={getLocalizedSkillsForOpportunity(locale, opportunity.id)}
              locale={locale}
              opportunity={opportunity}
              scenarioId={activeScenario.id}
            />
          ))}
        </div>

        <div className="space-y-5">
          {orderedOpportunities.map((opportunity) => (
            <FitScoreCard
              key={`${opportunity.id}-fit`}
              locale={locale}
              title={`${copy.fitTitleShort} - ${opportunity.title}`}
              scores={opportunity.fit}
              note={opportunity.note}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
