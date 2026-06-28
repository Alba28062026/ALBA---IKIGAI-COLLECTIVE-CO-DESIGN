import { ActivationPlanCard } from "@/components/ActivationPlanCard";
import { EmptyStateNotice } from "@/components/EmptyStateNotice";
import { ExperimentCard } from "@/components/ExperimentCard";
import { ScenarioContextBar } from "@/components/ScenarioContextBar";
import { buildAppHref, resolveLocale } from "@/lib/i18n";
import { buildScenarioHref } from "@/lib/mock-data";
import {
  getLocalizedActivationPlanForScenario,
  getLocalizedActivationPlans,
  getLocalizedExperimentForScenario,
  getLocalizedExperiments,
  getLocalizedScenarioForRoute,
  getLocalizedScenarios,
} from "@/lib/localized-data";

type ExperimentsPageProps = {
  searchParams?: Promise<{
    lang?: string | string[];
    scenario?: string | string[];
  }>;
};

export default async function ExperimentsPage({
  searchParams,
}: ExperimentsPageProps) {
  const params = await searchParams;
  const locale = resolveLocale(params?.lang);
  const activeScenario = getLocalizedScenarioForRoute(locale, params?.scenario);
  const plans = getLocalizedActivationPlans(locale);
  const experiments = getLocalizedExperiments(locale);
  const scenarios = getLocalizedScenarios(locale);
  const activePlan = getLocalizedActivationPlanForScenario(locale, activeScenario.id) ?? plans[0];
  const activeExperiment =
    getLocalizedExperimentForScenario(locale, activeScenario.id) ?? experiments[0];
  const copy = {
    en: {
      eyebrow: "Activation",
      title: "Practical levers, routines, and progressive experiments.",
      description:
        "The prototype translates scenarios into cautious activation plans: courses, practice, mentorship, wellbeing routines, nutrition, movement, recovery, context, finance, and portfolio projects are treated as composable levers and now follow the active scenario chosen in the dashboard.",
      barDescription:
        "Activation does not presume a definitive leap: it takes the active hypothesis and translates it into testable moves, guardrails, and a sustainable rhythm.",
      backSimulation: "Back to Simulation",
      openDossier: "Open focused dossier",
      barTitle: "Activation focus for the active scenario.",
      libraryEyebrow: "Activation library",
      libraryTitle: "Other comparable plans and tests",
      libraryDescription:
        "The other hypotheses remain useful for comparison, but the active content is always shown first to avoid dispersion.",
      emptyTitle: "No activation plan yet.",
      emptyDescription:
        "Experiments become useful only after a possible opportunity exists. In this blank state, Activation keeps routines, tests, and progressive moves intentionally empty.",
      emptyCta: "Open opportunities",
    },
    it: {
      eyebrow: "Activation",
      title: "Leve pratiche, routine ed esperimenti progressivi.",
      description:
        "Il prototipo traduce gli scenari in piani di attivazione cauti: corsi, pratica, mentorship, routine di benessere, alimentazione, movimento, recovery, contesto, finanza e portfolio project vengono trattati come leve componibili e seguono lo scenario attivo scelto nel dashboard.",
      barDescription:
        "Activation non presuppone un salto definitivo: prende l'ipotesi attiva e la traduce in mosse testabili, guardrail e ritmo sostenibile.",
      backSimulation: "Torna a Simulation",
      openDossier: "Apri dossier focalizzato",
      barTitle: "Focus Activation per lo scenario attivo.",
      libraryEyebrow: "Libreria activation",
      libraryTitle: "Altri piani e test comparabili",
      libraryDescription:
        "Le altre ipotesi restano utili per il confronto, ma il contenuto attivo viene mostrato sempre per primo per evitare dispersione.",
      emptyTitle: "Ancora nessun piano di activation.",
      emptyDescription:
        "Gli esperimenti diventano utili solo dopo che esiste una possibile opportunita'. In questo stato vuoto, Activation lascia routine, test e mosse progressive intenzionalmente non compilati.",
      emptyCta: "Apri opportunita'",
    },
  }[locale];

  if (!activePlan || !activeExperiment || plans.length === 0 || experiments.length === 0) {
    return (
      <div className="space-y-8">
        <section className="card-surface">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 className="mt-3 font-heading text-4xl text-alba-ink">{copy.title}</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-alba-ink/72">{copy.description}</p>
        </section>

        <EmptyStateNotice
          ctaHref={buildAppHref("/opportunities", { locale })}
          ctaLabel={copy.emptyCta}
          description={copy.emptyDescription}
          locale={locale}
          title={copy.emptyTitle}
        />
      </div>
    );
  }

  const orderedPlans = [activePlan, ...plans.filter((plan) => plan.id !== activePlan.id)];
  const orderedExperiments = [
    activeExperiment,
    ...experiments.filter((experiment) => experiment.id !== activeExperiment.id),
  ];

  return (
    <div className="space-y-8">
      <section className="card-surface">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2 className="mt-3 font-heading text-4xl text-alba-ink">{copy.title}</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-alba-ink/72">{copy.description}</p>
      </section>

      <ScenarioContextBar
        activeScenario={activeScenario}
        basePath="/experiments"
        description={copy.barDescription}
        links={[
          {
            href: buildScenarioHref("/opportunities", activeScenario.id, undefined, locale),
            label: copy.backSimulation,
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

      <section className="grid gap-6 xl:grid-cols-2">
        <ActivationPlanCard active locale={locale} plan={activePlan} />
        <ExperimentCard active experiment={activeExperiment} locale={locale} />
      </section>

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
          {orderedPlans.map((plan) => (
            <ActivationPlanCard
              key={plan.id}
              active={plan.id === activePlan.id}
              locale={locale}
              plan={plan}
            />
          ))}
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {orderedExperiments.map((experiment) => (
            <ExperimentCard
              key={experiment.id}
              active={experiment.id === activeExperiment.id}
              experiment={experiment}
              locale={locale}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
