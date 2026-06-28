import { EmptyStateNotice } from "@/components/EmptyStateNotice";
import { FitScoreCard } from "@/components/FitScoreCard";
import { OpportunityGraphSection } from "@/components/OpportunityGraphSection";
import { OpportunityCard } from "@/components/OpportunityCard";
import { ScenarioCard } from "@/components/ScenarioCard";
import { ScenarioContextBar } from "@/components/ScenarioContextBar";
import { buildAppHref, resolveLocale } from "@/lib/i18n";
import { buildScenarioHref } from "@/lib/mock-data";
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
      eyebrow: "Activation",
      title: "Possible opportunities as one activation lever.",
      description:
        "ALBA does not begin from job ads. First, Simulation translates the Portable Human Portfolio into ESCO and O*NET language, checks the Ikigai direction, and compares wellbeing thresholds. Only then does Activation surface possible opportunities, routines, experiments, and next moves.",
      barDescription:
        "These opportunities are downstream hypotheses, not direct matches. They inherit the taxonomy translation, Ikigai direction, and wellbeing thresholds defined upstream.",
      openExperiments: "Open experiments",
      openDossier: "Open focused dossier",
      openSimulation: "Back to Simulation",
      barTitle: "Activation focus for opportunity reading.",
      taxonomyEyebrow: "Simulation lineage",
      taxonomyTitle: "How this opportunity stays anchored to the translation layer.",
      taxonomyDescription:
        "O*NET and ESCO stay upstream as shared taxonomies. Here they work only as anchors for the active hypothesis, not as the starting point of the journey.",
      openSkills: "Open Skills translation",
      graphTitle: "Activation graph across translated scenarios and opportunity hypotheses",
      graphDescription:
        "This map shows how Simulation outputs can hand off into possible opportunities without pretending that the role is already decided.",
      libraryEyebrow: "Scenario context",
      libraryTitle: "Scenario comparison behind the active opportunity",
      libraryDescription:
        "The active scenario appears first, while the other hypotheses remain visible so you can compare the context that generated this opportunity.",
      fitTitle: "Fit score focus",
      fitTitleShort: "Fit score",
      emptyTitle: "No opportunities yet.",
      emptyDescription:
        "Activation stays empty until Simulation has translated a real Portable Human Portfolio into ESCO / O*NET language and compared it with Ikigai and wellbeing.",
      emptyCta: "Open Simulation",
      leversTitle: "Activation stays broader than opportunities",
      levers: [
        {
          title: "Opportunity hypotheses",
          body: "Possible professional directions appear only after the translation layer becomes credible enough to support them.",
        },
        {
          title: "Routines and wellbeing",
          body: "Sleep, nutrition, movement, recovery, and energy guardrails belong here because they help make a direction livable.",
        },
        {
          title: "Experiments and choices",
          body: "Activation also includes portfolio projects, networking, mentorship, and real-world tests before any definitive move.",
        },
      ],
    },
    it: {
      eyebrow: "Activation",
      title: "Possibili opportunita' come una leva di activation.",
      description:
        "ALBA non parte dagli annunci. Prima la Simulation traduce il Portable Human Portfolio nel linguaggio ESCO e O*NET, controlla la direzione Ikigai e confronta le soglie di wellbeing. Solo dopo Activation fa emergere possibili opportunita', routine, esperimenti e prossime mosse.",
      barDescription:
        "Queste opportunita' sono ipotesi downstream, non match diretti. Ereditano la traduzione tassonomica, la direzione Ikigai e le soglie di wellbeing definite a monte.",
      openExperiments: "Apri esperimenti",
      openDossier: "Apri dossier focalizzato",
      openSimulation: "Torna a Simulation",
      barTitle: "Focus Activation per la lettura delle opportunita'.",
      taxonomyEyebrow: "Derivazione dalla Simulation",
      taxonomyTitle: "Come questa opportunita' resta ancorata al layer di traduzione.",
      taxonomyDescription:
        "O*NET ed ESCO restano a monte come tassonomie condivise. Qui funzionano solo da ancore per l'ipotesi attiva, non da punto di partenza del journey.",
      openSkills: "Apri traduzione Skill",
      graphTitle: "Grafo di Activation tra scenari tradotti e ipotesi di opportunita'",
      graphDescription:
        "Questa mappa mostra come gli output della Simulation possano sfociare in opportunita' possibili senza fingere che il ruolo sia gia' deciso.",
      libraryEyebrow: "Contesto scenario",
      libraryTitle: "Confronto scenari dietro l'opportunita' attiva",
      libraryDescription:
        "Lo scenario attivo appare per primo, mentre le altre ipotesi restano visibili per confrontare il contesto che ha generato questa opportunita'.",
      fitTitle: "Focus fit score",
      fitTitleShort: "Fit score",
      emptyTitle: "Ancora nessuna opportunita'.",
      emptyDescription:
        "Activation resta vuota finche' la Simulation non ha tradotto un Portable Human Portfolio reale in linguaggio ESCO / O*NET e non l'ha confrontato con Ikigai e wellbeing.",
      emptyCta: "Apri Simulation",
      leversTitle: "Activation resta piu' ampia delle sole opportunita'",
      levers: [
        {
          title: "Ipotesi di opportunita'",
          body: "Le possibili direzioni professionali compaiono solo dopo che il layer di traduzione diventa abbastanza credibile da sostenerle.",
        },
        {
          title: "Routine e wellbeing",
          body: "Sonno, alimentazione, movimento, recovery e guardrail energetici stanno qui per rendere vivibile una direzione.",
        },
        {
          title: "Esperimenti e scelte",
          body: "Activation include anche portfolio project, networking, mentorship e test nel mondo reale prima di qualunque mossa definitiva.",
        },
      ],
    },
  }[locale];

  if (!activeOpportunity || opportunities.length === 0) {
    return (
      <div className="space-y-8">
        <section className="card-surface">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 className="mt-3 font-heading text-4xl text-alba-ink">{copy.title}</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-alba-ink/72">{copy.description}</p>
        </section>

        <section className="space-y-4">
          <div>
            <p className="eyebrow">Activation</p>
            <h3 className="mt-3 font-heading text-3xl text-alba-ink">{copy.leversTitle}</h3>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {copy.levers.map((lever) => (
              <article key={lever.title} className="card-surface">
                <h4 className="font-heading text-2xl text-alba-ink">{lever.title}</h4>
                <p className="mt-4 text-sm leading-7 text-alba-ink/72">{lever.body}</p>
              </article>
            ))}
          </div>
        </section>

        <EmptyStateNotice
          ctaHref={buildAppHref("/skills", { locale })}
          ctaLabel={copy.emptyCta}
          description={copy.emptyDescription}
          locale={locale}
          title={copy.emptyTitle}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="card-surface">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2 className="mt-3 font-heading text-4xl text-alba-ink">{copy.title}</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-alba-ink/72">{copy.description}</p>
      </section>

      <ScenarioContextBar
        activeScenario={activeScenario}
        basePath="/opportunities"
        description={copy.barDescription}
        links={[
          {
            href: buildScenarioHref("/experiments", activeScenario.id, undefined, locale),
            label: copy.openExperiments,
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
            <p className="eyebrow">{copy.taxonomyEyebrow}</p>
            <h3 className="mt-3 font-heading text-3xl text-alba-ink">{copy.taxonomyTitle}</h3>
            <p className="mt-4 text-sm leading-7 text-alba-ink/72">{copy.taxonomyDescription}</p>
          </div>

          <a
            href={buildScenarioHref("/skills", activeScenario.id, undefined, locale)}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-alba-forest/15 bg-white/80 px-5 py-3 text-sm font-semibold text-alba-forest transition hover:bg-white"
          >
            {copy.openSkills}
          </a>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {activeOpportunity.onetMatches.map((role) => (
            <div key={`${activeOpportunity.title}-${role.code}`} className="rounded-[1.5rem] bg-white/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alba-forest/72">
                {role.code}
              </p>
              <h4 className="mt-2 font-heading text-xl text-alba-ink">{role.title}</h4>
              <p className="mt-3 text-sm leading-7 text-alba-ink/70">{activeOpportunity.title}</p>
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
