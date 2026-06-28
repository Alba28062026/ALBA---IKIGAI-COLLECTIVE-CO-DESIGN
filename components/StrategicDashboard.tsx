"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  ArrowRight,
  BrainCircuit,
  Compass,
  FlaskConical,
  Network,
  Rocket,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import {
  buildScenarioHref,
  defaultScenarioId,
  enrichWellbeingTargets,
} from "@/lib/mock-data";
import type { Locale } from "@/lib/i18n";
import {
  getLocalizedActivationPlanForScenario,
  getLocalizedActivationPlans,
  getLocalizedEvidence,
  getLocalizedExperimentForScenario,
  getLocalizedExperiments,
  getLocalizedOpportunities,
  getLocalizedPatterns,
  getLocalizedPortfolioSummary,
  getLocalizedPrimaryOpportunityForScenario,
  getLocalizedScenarios,
  getLocalizedWellbeingTargets,
  getLocalizedWhy,
} from "@/lib/localized-data";
import { average, cn } from "@/lib/utils";

type DashboardTone = "clay" | "forest" | "ink" | "gold";
type DashboardIcon =
  | "activity"
  | "brain"
  | "compass"
  | "flask"
  | "network"
  | "rocket"
  | "shield"
  | "sparkles";

type DashboardAction = {
  href: string;
  label: string;
  variant?: "primary" | "secondary";
};

type DashboardMetric = {
  detail: string;
  href: string;
  icon: DashboardIcon;
  label: string;
  linkLabel: string;
  tone: DashboardTone;
  value: string;
};

type DashboardPhase = {
  checkpoints: string[];
  ctaLabel: string;
  href: string;
  hypothesis: string;
  icon: DashboardIcon;
  phase: string;
  progress: number;
  signal: string;
  status: string;
  title: string;
  tone: DashboardTone;
};

type DashboardFocusCard = {
  detail: string;
  href: string;
  icon: DashboardIcon;
  label: string;
  linkLabel: string;
  title: string;
  tone: DashboardTone;
};

type CurrentSignal = {
  detail: string;
  href: string;
  label: string;
  linkLabel: string;
  title: string;
};

type DashboardScenario = {
  currentSignal: CurrentSignal;
  focusCards: DashboardFocusCard[];
  horizon: string;
  id: string;
  metrics: DashboardMetric[];
  opportunityHref: string;
  opportunityTitle: string;
  phases: DashboardPhase[];
  scenarioHref: string;
  thesis: string;
  title: string;
};

type StrategicDashboardProps = {
  initialScenarioId?: string;
  locale?: Locale;
};

const iconMap: Record<DashboardIcon, LucideIcon> = {
  activity: Activity,
  brain: BrainCircuit,
  compass: Compass,
  flask: FlaskConical,
  network: Network,
  rocket: Rocket,
  shield: ShieldCheck,
  sparkles: Sparkles,
};

const toneClasses: Record<
  DashboardTone,
  {
    iconShell: string;
    iconText: string;
    phaseBadge: string;
    progressBar: string;
    progressShell: string;
  }
> = {
  clay: {
    iconShell: "bg-alba-rose/75",
    iconText: "text-alba-clay",
    phaseBadge: "bg-alba-rose/75 text-alba-clay",
    progressBar: "from-alba-clay via-alba-gold to-[#d99563]",
    progressShell: "bg-alba-rose/55",
  },
  forest: {
    iconShell: "bg-[#dff0ea]",
    iconText: "text-alba-forest",
    phaseBadge: "bg-[#dff0ea] text-alba-forest",
    progressBar: "from-alba-forest via-[#2e7a68] to-alba-gold",
    progressShell: "bg-[#dff0ea]",
  },
  gold: {
    iconShell: "bg-[#efe6c8]",
    iconText: "text-alba-clay",
    phaseBadge: "bg-[#efe6c8] text-alba-clay",
    progressBar: "from-alba-gold via-[#e0c878] to-alba-clay",
    progressShell: "bg-[#f5edd6]",
  },
  ink: {
    iconShell: "bg-alba-ink/92",
    iconText: "text-white",
    phaseBadge: "bg-alba-ink text-white",
    progressBar: "from-alba-clay via-alba-gold to-alba-forest",
    progressShell: "bg-alba-ink/10",
  },
};

const actionClasses = {
  primary:
    "bg-alba-clay text-white hover:bg-[#b55828]",
  secondary:
    "border border-alba-forest/15 bg-white/84 text-alba-forest hover:bg-white",
};

const focusCardClasses: Record<DashboardTone, string> = {
  clay: "border-alba-clay/10 bg-white/82",
  forest: "border-alba-forest/10 bg-white/82",
  gold: "border-[#d4bc78]/20 bg-white/82",
  ink: "border-alba-ink/10 bg-alba-ink text-white",
};

const focusTextClasses: Record<DashboardTone, string> = {
  clay: "text-alba-ink/72",
  forest: "text-alba-ink/72",
  gold: "text-alba-ink/72",
  ink: "text-white/82",
};

export function StrategicDashboard({
  initialScenarioId,
  locale = "en",
}: StrategicDashboardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const copy = {
    en: {
      headline: "Strategic three-phase dashboard to decide where to invest energy right now.",
      summary:
        "Alba reads evidence, scenario design, and activation plans as operating signals. This view brings together what is already solid, what needs better comparison, and the next useful test to launch.",
      currentReading: "Current reading",
      openSimulation: "Open scenario in Simulation",
      wellbeingFocus: "Wellbeing focus",
      openWellbeing: "Open wellbeing",
      bridgeOpportunity: "Bridge opportunity",
      openOpportunity: "Open opportunity",
      leadExperiment: "Lead experiment",
      openActivationPlan: "Open activation plan",
      strategicGuardrail: "Strategic guardrail",
      protectSustainability: "Protect sustainability and context",
      openDossier: "Open dossier",
      awarenessBase: "Awareness base",
      openEvidence: "Open Evidence",
      scenarioFit: "Scenario fit",
      openFitScore: "Open fit score",
      expectedFlourishing: "Expected flourishing",
      openScenario: "Open scenario",
      activationReadiness: "Activation readiness",
      openExperiments: "Open experiments",
      solidBase: "Solid base",
      baseToStrengthen: "Base to strengthen",
      strongConvergence: "Strong convergence",
      convergenceInProgress: "Convergence in progress",
      readyNow: "Ready to test now",
      testableWithGuardrails: "Testable with guardrails",
      needsProof: "Needs proof of work",
      strategicDashboard: "Strategic dashboard",
      activeScenario: "Active scenario",
      openLinkedOpportunity: "Open linked opportunity",
      openEvidenceAction: "Open Evidence",
      goToSimulation: "Go to Simulation",
      viewDossier: "View dossier",
      readinessSignal: "Readiness signal",
      reviewAwareness: "Review Awareness",
      exploreSimulation: "Explore Simulation",
      openActivation: "Open Activation",
    },
    it: {
      headline: "Cruscotto strategico delle tre fasi per decidere dove investire energia adesso.",
      summary:
        "Alba legge evidenze, design degli scenari e piani di attivazione come segnali operativi. Questa vista riunisce cio' che e' gia' solido, cio' che richiede confronto e il prossimo test utile da lanciare.",
      currentReading: "Lettura corrente",
      openSimulation: "Apri scenario in Simulation",
      wellbeingFocus: "Focus benessere",
      openWellbeing: "Apri wellbeing",
      bridgeOpportunity: "Opportunita' ponte",
      openOpportunity: "Apri opportunita'",
      leadExperiment: "Esperimento guida",
      openActivationPlan: "Apri piano di attivazione",
      strategicGuardrail: "Guardrail strategico",
      protectSustainability: "Proteggi sostenibilita' e contesto",
      openDossier: "Apri dossier",
      awarenessBase: "Base Awareness",
      openEvidence: "Apri evidenze",
      scenarioFit: "Fit scenario",
      openFitScore: "Apri fit score",
      expectedFlourishing: "Flourishing atteso",
      openScenario: "Apri scenario",
      activationReadiness: "Prontezza attivazione",
      openExperiments: "Apri esperimenti",
      solidBase: "Base solida",
      baseToStrengthen: "Base da rafforzare",
      strongConvergence: "Convergenza forte",
      convergenceInProgress: "Convergenza in corso",
      readyNow: "Pronto da testare ora",
      testableWithGuardrails: "Testabile con guardrail",
      needsProof: "Richiede proof of work",
      strategicDashboard: "Cruscotto strategico",
      activeScenario: "Scenario attivo",
      openLinkedOpportunity: "Apri opportunita' collegata",
      openEvidenceAction: "Apri evidenze",
      goToSimulation: "Vai a Simulation",
      viewDossier: "Vedi dossier",
      readinessSignal: "Segnale di readiness",
      reviewAwareness: "Rivedi Awareness",
      exploreSimulation: "Esplora Simulation",
      openActivation: "Apri Activation",
    },
  }[locale];
  const evidence = getLocalizedEvidence(locale);
  const patterns = getLocalizedPatterns(locale);
  const portfolioSummary = getLocalizedPortfolioSummary(locale);
  const scenarios = getLocalizedScenarios(locale);
  const opportunities = getLocalizedOpportunities(locale);
  const wellbeingTargets = getLocalizedWellbeingTargets(locale);
  const activationPlans = getLocalizedActivationPlans(locale);
  const experiments = getLocalizedExperiments(locale);
  const why = getLocalizedWhy(locale);
  const dashboardScenarios = useMemo<DashboardScenario[]>(() => {
    const wellbeingSnapshot = enrichWellbeingTargets(wellbeingTargets)
      .sort((left, right) => right.activationNeed - left.activationNeed)
      .slice(0, 3);
    const totalSkills =
      portfolioSummary.expressedSkills.length +
      portfolioSummary.latentSkills.length +
      portfolioSummary.strategicSkills.length;
    const scenarioProgressMap = {
      "sc-job-crafting": {
        awareness: 81,
        simulation: 70,
        activation: 84,
      },
      "sc-people-innovation": {
        awareness: 76,
        simulation: 83,
        activation: 58,
      },
      "sc-purpose-lab": {
        awareness: 74,
        simulation: 79,
        activation: 71,
      },
    } as const;
    const fitAverage = (opportunity: (typeof opportunities)[number]) =>
      Math.round(
        average([
          opportunity.fit.skillFit,
          opportunity.fit.purposeFit,
          opportunity.fit.valuesFit,
          opportunity.fit.energyFit,
          opportunity.fit.workContextFit,
          opportunity.fit.wellbeingFit,
          opportunity.fit.growthPotential,
        ]),
      );
    const permavAverage = (scenario: (typeof scenarios)[number]) =>
      Math.round(
        average([
          scenario.permav.positiveEmotion,
          scenario.permav.engagement,
          scenario.permav.relationships,
          scenario.permav.meaning,
          scenario.permav.accomplishment,
          scenario.permav.vitality,
        ]),
      );

    return scenarios.map((scenario) => {
      const opportunity =
        getLocalizedPrimaryOpportunityForScenario(locale, scenario.id) ?? opportunities[0];
      const activationPlan =
        getLocalizedActivationPlanForScenario(locale, scenario.id) ?? activationPlans[0];
      const experiment =
        getLocalizedExperimentForScenario(locale, scenario.id) ?? experiments[0];
      const progress = scenarioProgressMap[scenario.id as keyof typeof scenarioProgressMap];
      const scenarioFitAverage = fitAverage(opportunity);
      const scenarioPermavAverage = permavAverage(scenario);

      return {
        currentSignal: {
          detail: `${scenario.ikigaiSignal} ${scenario.wellbeingShift}`,
          href: buildScenarioHref("/opportunities", scenario.id, `scenario-${scenario.id}`, locale),
          label: copy.currentReading,
          linkLabel: copy.openSimulation,
          title:
            locale === "it"
              ? `${scenario.title} come ipotesi attiva.`
              : `${scenario.title} as the active hypothesis.`,
        },
        focusCards: [
          {
            detail:
              locale === "it"
                ? `${scenario.wellbeingShift} Asse da proteggere ora: ${wellbeingSnapshot[0].domain} con activation need ${wellbeingSnapshot[0].activationNeed}.`
                : `${scenario.wellbeingShift} Axis to protect now: ${wellbeingSnapshot[0].domain} with activation need ${wellbeingSnapshot[0].activationNeed}.`,
            href: buildScenarioHref("/wellbeing", scenario.id, undefined, locale),
            icon: "activity" as const,
            label: copy.wellbeingFocus,
            linkLabel: copy.openWellbeing,
            title: wellbeingSnapshot[0].domain,
            tone: "clay" as const,
          },
          {
            detail:
              locale === "it"
                ? `${opportunity.note} Primo ponte O*NET: ${opportunity.onetMatches[0]?.title ?? "Da definire"}.`
                : `${opportunity.note} First O*NET bridge: ${opportunity.onetMatches[0]?.title ?? "To define"}.`,
            href: buildScenarioHref(
              "/opportunities",
              scenario.id,
              `opportunity-${opportunity.id}`,
              locale,
            ),
            icon: "sparkles" as const,
            label: copy.bridgeOpportunity,
            linkLabel: copy.openOpportunity,
            title: opportunity.title,
            tone: "forest" as const,
          },
          {
            detail:
              locale === "it"
                ? `${experiment.hypothesis} Piano collegato: ${activationPlan.title}.`
                : `${experiment.hypothesis} Linked plan: ${activationPlan.title}.`,
            href: buildScenarioHref("/experiments", scenario.id, undefined, locale),
            icon: "flask" as const,
            label: copy.leadExperiment,
            linkLabel: copy.openActivationPlan,
            title: experiment.title,
            tone: "gold" as const,
          },
          {
            detail: activationPlan.riskGuardrail,
            href: buildScenarioHref("/dossier", scenario.id, undefined, locale),
            icon: "shield" as const,
            label: copy.strategicGuardrail,
            linkLabel: copy.openDossier,
            title: copy.protectSustainability,
            tone: "ink" as const,
          },
        ],
        horizon: scenario.horizon,
        id: scenario.id,
        metrics: [
          {
            detail:
              locale === "it"
                ? `${patterns.length} pattern e una confidence WHY di ${why.confidence}/10 sostengono questa ipotesi con una base condivisa.`
                : `${patterns.length} patterns and WHY confidence ${why.confidence}/10 support this hypothesis with a shared base.`,
            href: buildScenarioHref("/evidence", scenario.id, undefined, locale),
            icon: "brain" as const,
            label: copy.awarenessBase,
            linkLabel: copy.openEvidence,
            tone: "clay" as const,
            value:
              locale === "it"
                ? `${evidence.length} evidenze`
                : `${evidence.length} evidence items`,
          },
          {
            detail:
              locale === "it"
                ? `${opportunity.title} resta il contenitore professionale piu' vicino per questo scenario attivo.`
                : `${opportunity.title} remains the closest professional container for this active scenario.`,
            href: buildScenarioHref(
              "/opportunities",
              scenario.id,
              `opportunity-${opportunity.id}`,
              locale,
            ),
            icon: "network" as const,
            label: copy.scenarioFit,
            linkLabel: copy.openFitScore,
            tone: "forest" as const,
            value: `${scenarioFitAverage}/100`,
          },
          {
            detail:
              locale === "it"
                ? `PERMAV medio ${scenarioPermavAverage}/100, con Meaning ${scenario.permav.meaning}/100 e Vitalita' ${scenario.permav.vitality}/100.`
                : `Average PERMAV ${scenarioPermavAverage}/100, with Meaning ${scenario.permav.meaning}/100 and Vitality ${scenario.permav.vitality}/100.`,
            href: buildScenarioHref("/opportunities", scenario.id, `scenario-${scenario.id}`, locale),
            icon: "sparkles" as const,
            label: copy.expectedFlourishing,
            linkLabel: copy.openScenario,
            tone: "gold" as const,
            value: `${scenarioPermavAverage}/100`,
          },
          {
            detail:
              locale === "it"
                ? `${experiment.title} e' il perno pratico piu' utile adesso. Sforzo ${experiment.effort}/5, impatto ${experiment.impact}/5.`
                : `${experiment.title} is the most useful practical hinge right now. Effort ${experiment.effort}/5, impact ${experiment.impact}/5.`,
            href: buildScenarioHref("/experiments", scenario.id, undefined, locale),
            icon: "rocket" as const,
            label: copy.activationReadiness,
            linkLabel: copy.openExperiments,
            tone: "ink" as const,
            value: experiment.status,
          },
        ],
        opportunityHref: buildScenarioHref(
          "/opportunities",
          scenario.id,
          `opportunity-${opportunity.id}`,
          locale,
        ),
        opportunityTitle: opportunity.title,
        phases: [
          {
            checkpoints: [
              locale === "it"
                ? "Valida le evidenze piu' rilevanti per questo scenario"
                : "Validate the most relevant evidence for this scenario",
              locale === "it"
                ? "Rendi visibile il contributo che genera piu' energia"
                : "Make visible the contribution that generates the most energy",
              locale === "it"
                ? "Tieni espliciti i vincoli che non vuoi sacrificare"
                : "Keep explicit the constraints you do not want to sacrifice",
            ],
            ctaLabel: copy.reviewAwareness,
            href: buildScenarioHref("/evidence", scenario.id, undefined, locale),
            hypothesis:
              locale === "it"
                ? `Per ${scenario.title}, la fase Awareness serve soprattutto a verificare se i segnali osservati reggono fuori dalla teoria e dentro un contesto reale.`
                : `For ${scenario.title}, the Awareness phase is mainly about checking whether the observed signals hold up outside theory and inside a real context.`,
            icon: "brain" as const,
            phase: "Phase 1",
            progress: progress.awareness,
            signal:
              locale === "it"
                ? `${evidence.length} evidenze, ${patterns.length} pattern e ${totalSkills} skill mappate forniscono una base credibile per questa ipotesi.`
                : `${evidence.length} evidence items, ${patterns.length} patterns, and ${totalSkills} mapped skills provide a credible base for this hypothesis.`,
            status: progress.awareness >= 80 ? copy.solidBase : copy.baseToStrengthen,
            title: "Awareness",
            tone: "clay" as const,
          },
          {
            checkpoints: [
              locale === "it"
                ? "Confronta il fit con i vincoli attuali"
                : "Compare fit against current constraints",
              locale === "it"
                ? "Leggi O*NET come ponte, non come identita'"
                : "Read O*NET as a bridge, not as an identity",
              locale === "it"
                ? "Stima il costo di contesto della transizione"
                : "Estimate the context cost of the transition",
            ],
            ctaLabel: copy.exploreSimulation,
            href: buildScenarioHref("/opportunities", scenario.id, undefined, locale),
            hypothesis: scenario.thesis,
            icon: "network" as const,
            phase: "Phase 2",
            progress: progress.simulation,
            signal:
              locale === "it"
                ? `${opportunity.onetMatches.length} ruoli O*NET e un fit medio di ${scenarioFitAverage}/100 tengono collegati scenario Alba, opportunity graph e lettura mercato.`
                : `${opportunity.onetMatches.length} O*NET roles and an average fit of ${scenarioFitAverage}/100 keep the Alba scenario, opportunity graph, and readable market view connected.`,
            status:
              progress.simulation >= 80 ? copy.strongConvergence : copy.convergenceInProgress,
            title: "Simulation",
            tone: "forest" as const,
          },
          {
            checkpoints: [
              locale === "it"
                ? "Scegli un test con feedback rapido"
                : "Choose a test with fast feedback",
              locale === "it"
                ? "Proteggi tempo, recovery e finanze"
                : "Protect time, recovery, and finances",
              locale === "it"
                ? "Usa criteri di stop per evitare derive impulsive"
                : "Use stop criteria to avoid impulsive drift",
            ],
            ctaLabel: copy.openActivation,
            href: buildScenarioHref("/experiments", scenario.id, undefined, locale),
            hypothesis: activationPlan.focus,
            icon: "rocket" as const,
            phase: "Phase 3",
            progress: progress.activation,
            signal:
              locale === "it"
                ? `${activationPlan.duration} di activation planning con un esperimento guida ${experiment.status.toLowerCase()} rende questo scenario piu' o meno testabile subito.`
                : `${activationPlan.duration} of activation planning with a ${experiment.status.toLowerCase()} lead experiment makes this scenario more or less immediately testable.`,
            status:
              progress.activation >= 80
                ? copy.readyNow
                : progress.activation >= 70
                  ? copy.testableWithGuardrails
                  : copy.needsProof,
            title: "Activation",
            tone: "gold" as const,
          },
        ],
        scenarioHref: buildScenarioHref("/opportunities", scenario.id, `scenario-${scenario.id}`, locale),
        thesis: scenario.thesis,
        title: scenario.title,
      };
    });
  }, [
    activationPlans,
    copy,
    evidence,
    experiments,
    locale,
    opportunities,
    patterns,
    portfolioSummary,
    scenarios,
    wellbeingTargets,
    why,
  ]);
  const [activeScenarioId, setActiveScenarioId] = useState(initialScenarioId ?? defaultScenarioId);
  useEffect(() => {
    setActiveScenarioId(initialScenarioId ?? defaultScenarioId);
  }, [initialScenarioId]);
  const activeScenario = useMemo(
    () =>
      dashboardScenarios.find((scenario) => scenario.id === activeScenarioId) ??
      dashboardScenarios[0],
    [activeScenarioId, dashboardScenarios],
  );

  if (!activeScenario) {
    return null;
  }

  const actions: DashboardAction[] = [
    {
      href: buildScenarioHref("/evidence", activeScenario.id, undefined, locale),
      label: copy.openEvidenceAction,
      variant: "primary",
    },
    {
      href: buildScenarioHref("/opportunities", activeScenario.id, undefined, locale),
      label: copy.goToSimulation,
    },
    {
      href: buildScenarioHref("/dossier", activeScenario.id, undefined, locale),
      label: copy.viewDossier,
    },
  ];

  function handleScenarioSelect(scenarioId: string) {
    setActiveScenarioId(scenarioId);
    router.replace(buildScenarioHref(pathname, scenarioId, undefined, locale), { scroll: false });
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[minmax(0,1.38fr)_minmax(320px,0.62fr)]">
      <div className="card-surface overflow-hidden bg-[linear-gradient(135deg,rgba(255,255,255,0.93),rgba(247,242,234,0.95))]">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl">
              <p className="eyebrow">{copy.strategicDashboard}</p>
              <h2 className="mt-3 max-w-3xl font-heading text-3xl text-alba-ink sm:text-5xl">
                {copy.headline}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-8 text-alba-ink/72">{copy.summary}</p>

              <div className="mt-6 rounded-[1.8rem] border border-white/70 bg-white/76 p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-2xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-alba-forest/72">
                      {copy.activeScenario}
                    </p>
                    <h3 className="mt-3 font-heading text-2xl text-alba-ink">
                      {activeScenario.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-alba-ink/72">
                      {activeScenario.horizon} · {activeScenario.opportunityTitle}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-alba-ink/72">
                      {activeScenario.thesis}
                    </p>
                  </div>

                  <div className="grid gap-2 sm:flex sm:flex-wrap">
                    {dashboardScenarios.map((scenario) => {
                      const isActive = scenario.id === activeScenario.id;

                      return (
                        <button
                          key={scenario.id}
                          type="button"
                          onClick={() => handleScenarioSelect(scenario.id)}
                          className={cn(
                            "min-h-11 rounded-full px-4 py-2 text-sm font-semibold transition",
                            isActive
                              ? "bg-alba-forest text-white shadow-lg shadow-alba-forest/15"
                              : "border border-alba-forest/15 bg-white text-alba-forest hover:bg-alba-cream/70",
                          )}
                        >
                          {scenario.title}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:flex sm:flex-wrap">
                  <Link
                    href={activeScenario.scenarioHref}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-alba-clay px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#b55828]"
                  >
                    {copy.openScenario}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href={activeScenario.opportunityHref}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-alba-forest/15 bg-white px-4 py-2 text-sm font-semibold text-alba-forest transition hover:bg-alba-cream/70"
                  >
                    {copy.openLinkedOpportunity}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
                {actions.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className={cn(
                      "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition",
                      actionClasses[action.variant ?? "secondary"],
                    )}
                  >
                    {action.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[1.9rem] bg-alba-ink p-5 text-white xl:max-w-sm">
              <p className="eyebrow text-white/70">{activeScenario.currentSignal.label}</p>
              <h3 className="mt-3 font-heading text-3xl">{activeScenario.currentSignal.title}</h3>
              <p className="mt-4 text-sm leading-7 text-white/82">
                {activeScenario.currentSignal.detail}
              </p>
              <Link
                href={activeScenario.currentSignal.href}
                className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-alba-gold transition hover:gap-3"
              >
                {activeScenario.currentSignal.linkLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
            {activeScenario.metrics.map((metric) => {
              const Icon = iconMap[metric.icon];
              const tone = toneClasses[metric.tone];

              return (
                <Link
                  key={metric.label}
                  href={metric.href}
                  className="group rounded-[1.6rem] border border-white/65 bg-white/82 p-4 transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={cn(
                        "inline-flex h-11 w-11 items-center justify-center rounded-2xl",
                        tone.iconShell,
                      )}
                    >
                      <Icon className={cn("h-5 w-5", tone.iconText)} />
                    </span>
                    <span className="text-right text-[11px] font-semibold uppercase tracking-[0.18em] text-alba-ink/42">
                      {metric.label}
                    </span>
                  </div>
                  <p className="mt-5 font-heading text-3xl text-alba-ink">{metric.value}</p>
                  <p className="mt-2 text-sm leading-7 text-alba-ink/68">{metric.detail}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-alba-forest transition group-hover:gap-3">
                    {metric.linkLabel}
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="space-y-4">
            {activeScenario.phases.map((phase) => {
              const Icon = iconMap[phase.icon];
              const tone = toneClasses[phase.tone];

              return (
                <Link
                  key={phase.phase}
                  href={phase.href}
                  className="group block rounded-[1.9rem] border border-white/70 bg-white/84 p-5 shadow-[0_24px_60px_rgba(29,48,41,0.06)] transition hover:-translate-y-0.5 hover:bg-white"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
                            tone.phaseBadge,
                          )}
                        >
                          {phase.phase}
                        </span>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-alba-ink/52">
                          {phase.status}
                        </span>
                      </div>

                      <div className="mt-4 flex items-start gap-4">
                        <span
                          className={cn(
                            "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                            tone.iconShell,
                          )}
                        >
                          <Icon className={cn("h-5 w-5", tone.iconText)} />
                        </span>

                        <div>
                          <h3 className="font-heading text-2xl text-alba-ink">{phase.title}</h3>
                          <p className="mt-2 text-sm leading-7 text-alba-ink/72">
                            {phase.hypothesis}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full rounded-[1.6rem] bg-alba-cream/72 p-4 lg:max-w-sm">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-alba-clay/80">
                        {copy.readinessSignal}
                      </p>
                      <p className="mt-2 text-sm leading-7 text-alba-ink/72">{phase.signal}</p>
                      <div className={cn("mt-4 h-2 overflow-hidden rounded-full", tone.progressShell)}>
                        <div
                          className={cn("h-full rounded-full bg-gradient-to-r", tone.progressBar)}
                          style={{ width: `${phase.progress}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-alba-ink/48">
                        {phase.progress}/100
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {phase.checkpoints.map((checkpoint) => (
                      <span
                        key={checkpoint}
                        className="rounded-full border border-alba-forest/12 bg-white px-3 py-1 text-xs text-alba-ink/68"
                      >
                        {checkpoint}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-alba-forest/15 bg-white/88 px-4 py-3 text-sm font-semibold text-alba-forest transition group-hover:bg-alba-cream/70 group-hover:gap-3">
                    {phase.ctaLabel}
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {activeScenario.focusCards.map((card) => {
          const Icon = iconMap[card.icon];
          const tone = toneClasses[card.tone];

          return (
            <Link
              key={card.label}
              href={card.href}
              className={cn(
                "group block rounded-[1.8rem] border p-5 shadow-[0_18px_45px_rgba(29,48,41,0.05)] transition hover:-translate-y-0.5",
                focusCardClasses[card.tone],
              )}
            >
              <div className="flex items-start gap-4">
                <span
                  className={cn(
                    "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
                    tone.iconShell,
                  )}
                >
                  <Icon className={cn("h-5 w-5", tone.iconText)} />
                </span>
                <div>
                  <p
                    className={cn(
                      "text-xs font-semibold uppercase tracking-[0.18em]",
                      card.tone === "ink" ? "text-white/62" : "text-alba-ink/44",
                    )}
                  >
                    {card.label}
                  </p>
                  <h3
                    className={cn(
                      "mt-2 font-heading text-2xl",
                      card.tone === "ink" ? "text-white" : "text-alba-ink",
                    )}
                  >
                    {card.title}
                  </h3>
                </div>
              </div>

              <p className={cn("mt-4 text-sm leading-7", focusTextClasses[card.tone])}>
                {card.detail}
              </p>

              <div
                className={cn(
                  "mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition group-hover:gap-3",
                  card.tone === "ink"
                    ? "border-white/14 bg-white/8 text-alba-gold"
                    : "border-alba-forest/15 bg-white/88 text-alba-forest group-hover:bg-alba-cream/70",
                )}
              >
                {card.linkLabel}
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
