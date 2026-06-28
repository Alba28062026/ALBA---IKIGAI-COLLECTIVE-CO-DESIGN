import { EmptyStateNotice } from "@/components/EmptyStateNotice";
import { DossierExportPanel } from "@/components/DossierExportPanel";
import { OpportunityGraphSection } from "@/components/OpportunityGraphSection";
import { PortfolioSummary } from "@/components/PortfolioSummary";
import { ScenarioContextBar } from "@/components/ScenarioContextBar";
import { buildAppHref, resolveLocale } from "@/lib/i18n";
import { buildScenarioHref } from "@/lib/mock-data";
import {
  getLocalizedActivationPlanForScenario,
  getLocalizedDossierExport,
  getLocalizedExperimentForScenario,
  getLocalizedOpportunityGraphEntries,
  getLocalizedOpportunities,
  getLocalizedPortfolioSummary,
  getLocalizedPrimaryOpportunityForScenario,
  getLocalizedScenarioForRoute,
  getLocalizedScenarios,
  getLocalizedWellbeingTargets,
} from "@/lib/localized-data";

type DossierPageProps = {
  searchParams?: Promise<{
    lang?: string | string[];
    scenario?: string | string[];
  }>;
};

export default async function DossierPage({ searchParams }: DossierPageProps) {
  const params = await searchParams;
  const locale = resolveLocale(params?.lang);
  const activeScenario = getLocalizedScenarioForRoute(locale, params?.scenario);
  const opportunities = getLocalizedOpportunities(locale);
  const scenarios = getLocalizedScenarios(locale);
  const portfolioSummary = getLocalizedPortfolioSummary(locale);
  const wellbeingTargets = getLocalizedWellbeingTargets(locale);
  const dossierExport = getLocalizedDossierExport(locale);
  const activeOpportunity =
    getLocalizedPrimaryOpportunityForScenario(locale, activeScenario.id) ?? opportunities[0];
  const activePlan = getLocalizedActivationPlanForScenario(locale, activeScenario.id);
  const activeExperiment = getLocalizedExperimentForScenario(locale, activeScenario.id);
  const graphEntries = getLocalizedOpportunityGraphEntries(locale).sort((left, right) => {
    if (!activeOpportunity) {
      return left.opportunity.title.localeCompare(right.opportunity.title);
    }

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
    ...opportunities.filter((opportunity) => opportunity.id !== activeOpportunity?.id),
  ].filter(
    (opportunity): opportunity is NonNullable<typeof activeOpportunity> => Boolean(opportunity),
  );
  const copy = {
    en: {
      descriptionSuffix:
        "The page can now export a scenario-specific focus while keeping the portfolio as a shared base.",
      barDescription:
        "The dossier synthesizes the portfolio and makes the active hypothesis explicit, so export, scenario recap, and opportunity snapshot stay coherent in the same view.",
      openSimulation: "Open Simulation",
      openActivation: "Open Activation",
      barTitle: "Dossier focus by scenario.",
      scenarioRecap: "Scenario recap",
      ikigaiSignal: "Ikigai signal",
      wellbeingShift: "Wellbeing shift",
      opportunitySnapshot: "Opportunity snapshot",
      activationSnapshot: "Activation snapshot",
      activationPlan: "Activation plan",
      leadExperiment: "Lead experiment",
      graphEyebrow: "Portfolio -> Simulation",
      graphTitle: "Mock crosswalk across evidence, scenarios, and opportunity snapshots",
      graphDescription:
        "Inside the dossier, the graph helps show how skills and scenarios flow into different opportunities. The active option stays first without hiding the alternatives.",
      scenarioLibrary: "Scenario library",
      opportunityLibrary: "Opportunity library",
      wellbeingBaseline: "Wellbeing baseline",
      toDefine: "To define",
      emptyTitle: "The dossier is still empty.",
      emptyDescription:
        "ALBA can export a dossier only after Phase 1, Simulation, and Activation have something real to synthesize. For now the export remains intentionally blank and shareable.",
      emptyCta: "Start from Evidence",
    },
    it: {
      descriptionSuffix:
        "La pagina ora puo' esportare un focus specifico per scenario mantenendo il portfolio come base condivisa.",
      barDescription:
        "Il dossier sintetizza il portfolio e rende esplicita l'ipotesi attiva, cosi' export, recap scenario e snapshot opportunita' restano coerenti nella stessa vista.",
      openSimulation: "Apri Simulation",
      openActivation: "Apri Activation",
      barTitle: "Focus dossier per scenario.",
      scenarioRecap: "Recap scenario",
      ikigaiSignal: "Segnale Ikigai",
      wellbeingShift: "Shift di benessere",
      opportunitySnapshot: "Snapshot opportunita'",
      activationSnapshot: "Snapshot activation",
      activationPlan: "Piano di attivazione",
      leadExperiment: "Esperimento guida",
      graphEyebrow: "Portfolio -> Simulation",
      graphTitle: "Crosswalk mock tra evidenze, scenari e snapshot opportunita'",
      graphDescription:
        "Dentro il dossier, il grafo aiuta a mostrare come skill e scenari fluiscono in opportunita' diverse. L'opzione attiva resta per prima senza nascondere le alternative.",
      scenarioLibrary: "Libreria scenari",
      opportunityLibrary: "Libreria opportunita'",
      wellbeingBaseline: "Baseline di benessere",
      toDefine: "Da definire",
      emptyTitle: "Il dossier e' ancora vuoto.",
      emptyDescription:
        "ALBA puo' esportare un dossier solo dopo che fase 1, Simulation e Activation hanno qualcosa di reale da sintetizzare. Per ora l'export resta intenzionalmente vuoto e condivisibile.",
      emptyCta: "Parti da Evidence",
    },
  }[locale];

  if (!activeOpportunity || opportunities.length === 0) {
    return (
      <div className="space-y-8">
        <section className="card-surface">
          <p className="eyebrow">Dossier</p>
          <h2 className="mt-3 font-heading text-4xl text-alba-ink">{dossierExport.title}</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-alba-ink/72">
            {copy.emptyDescription}
          </p>
        </section>

        <EmptyStateNotice
          ctaHref={buildAppHref("/evidence", { locale })}
          ctaLabel={copy.emptyCta}
          description={copy.emptyDescription}
          locale={locale}
          title={copy.emptyTitle}
        />

        <DossierExportPanel locale={locale} scenarioId={activeScenario.id} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="card-surface">
        <p className="eyebrow">Dossier</p>
        <h2 className="mt-3 font-heading text-4xl text-alba-ink">{dossierExport.title}</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-alba-ink/72">
          {dossierExport.summary} {copy.descriptionSuffix}
        </p>
      </section>

      <ScenarioContextBar
        activeScenario={activeScenario}
        basePath="/dossier"
        description={copy.barDescription}
        links={[
          {
            href: buildScenarioHref("/skills", activeScenario.id, undefined, locale),
            label: copy.openSimulation,
          },
          {
            href: buildScenarioHref("/experiments", activeScenario.id, undefined, locale),
            label: copy.openActivation,
          },
        ]}
        locale={locale}
        scenarios={scenarios}
        title={copy.barTitle}
      />

      <DossierExportPanel locale={locale} scenarioId={activeScenario.id} />

      <section className="grid gap-5 xl:grid-cols-4">
        <div className="card-surface xl:col-span-2">
          <p className="eyebrow">{copy.scenarioRecap}</p>
          <h3 className="mt-3 font-heading text-3xl text-alba-ink">{activeScenario.title}</h3>
          <p className="mt-4 text-sm leading-7 text-alba-ink/72">{activeScenario.thesis}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-white/78 p-4 text-sm text-alba-ink/72">
              <p className="font-semibold text-alba-ink">{copy.ikigaiSignal}</p>
              <p className="mt-2">{activeScenario.ikigaiSignal}</p>
            </div>
            <div className="rounded-[1.5rem] bg-white/78 p-4 text-sm text-alba-ink/72">
              <p className="font-semibold text-alba-ink">{copy.wellbeingShift}</p>
              <p className="mt-2">{activeScenario.wellbeingShift}</p>
            </div>
          </div>
        </div>

        <div className="card-surface">
          <p className="eyebrow">{copy.opportunitySnapshot}</p>
          <h3 className="mt-3 font-heading text-2xl text-alba-ink">{activeOpportunity.title}</h3>
          <p className="mt-4 text-sm leading-7 text-alba-ink/72">{activeOpportunity.summary}</p>
          <p className="mt-4 text-sm text-alba-ink/65">{activeOpportunity.note}</p>
        </div>

        <div className="card-surface">
          <p className="eyebrow">{copy.activationSnapshot}</p>
          <div className="space-y-4">
            <div className="rounded-[1.5rem] bg-white/78 p-4 text-sm text-alba-ink/72">
              <p className="font-semibold text-alba-ink">{copy.activationPlan}</p>
              <p className="mt-2">{activePlan?.title ?? copy.toDefine}</p>
            </div>
            <div className="rounded-[1.5rem] bg-alba-cream/72 p-4 text-sm text-alba-ink/72">
              <p className="font-semibold text-alba-ink">{copy.leadExperiment}</p>
              <p className="mt-2">{activeExperiment?.title ?? copy.toDefine}</p>
            </div>
          </div>
        </div>
      </section>

      <PortfolioSummary locale={locale} summary={portfolioSummary} />

      <OpportunityGraphSection
        activeOpportunityId={activeOpportunity.id}
        entries={graphEntries}
        eyebrow={copy.graphEyebrow}
        locale={locale}
        scenarioId={activeScenario.id}
        title={copy.graphTitle}
        description={copy.graphDescription}
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
        <div className="card-surface">
          <p className="eyebrow">{copy.scenarioLibrary}</p>
          <div className="mt-5 space-y-4">
            {orderedScenarios.map((scenario) => (
              <div
                key={scenario.id}
                id={`scenario-${scenario.id}`}
                className={`scroll-mt-24 rounded-[1.5rem] p-4 ${
                  scenario.id === activeScenario.id
                    ? "bg-[linear-gradient(135deg,rgba(255,255,255,0.95),rgba(244,224,216,0.65))]"
                    : "bg-white/78"
                }`}
              >
                <p className="font-semibold text-alba-ink">{scenario.title}</p>
                <p className="mt-2 text-sm leading-7 text-alba-ink/72">{scenario.thesis}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-surface">
            <p className="eyebrow">{copy.opportunityLibrary}</p>
            <div className="mt-5 space-y-4">
              {orderedOpportunities.map((opportunity) => (
                <div
                  key={opportunity.id}
                  id={`opportunity-${opportunity.id}`}
                  className={`scroll-mt-24 rounded-[1.5rem] p-4 ${
                    opportunity.id === activeOpportunity.id
                      ? "bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(223,240,234,0.6))]"
                      : "bg-alba-cream/75"
                  }`}
                >
                  <p className="font-semibold text-alba-ink">{opportunity.title}</p>
                  <p className="mt-2 text-sm text-alba-ink/72">{opportunity.summary}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card-surface">
            <p className="eyebrow">{copy.wellbeingBaseline}</p>
            <div className="mt-5 space-y-3">
              {wellbeingTargets.slice(0, 5).map((target) => (
                <div key={target.id} className="rounded-[1.5rem] bg-white/78 px-4 py-3 text-sm">
                  <p className="font-medium text-alba-ink">{target.domain}</p>
                  <p className="mt-1 text-alba-ink/68">
                    {target.currentLevel}/10 {"->"} {target.desiredLevel}/10
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
