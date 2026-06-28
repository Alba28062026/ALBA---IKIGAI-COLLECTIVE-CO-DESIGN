import { EmptyStateNotice } from "@/components/EmptyStateNotice";
import { ScenarioContextBar } from "@/components/ScenarioContextBar";
import { WellbeingDashboard } from "@/components/WellbeingDashboard";
import { buildAppHref, resolveLocale } from "@/lib/i18n";
import { buildScenarioHref } from "@/lib/mock-data";
import {
  getLocalizedScenarioForRoute,
  getLocalizedScenarios,
  getLocalizedWellbeingFocusForScenario,
  getLocalizedWellbeingTargets,
} from "@/lib/localized-data";

type WellbeingPageProps = {
  searchParams?: Promise<{
    lang?: string | string[];
    scenario?: string | string[];
  }>;
};

export default async function WellbeingPage({ searchParams }: WellbeingPageProps) {
  const params = await searchParams;
  const locale = resolveLocale(params?.lang);
  const activeScenario = getLocalizedScenarioForRoute(locale, params?.scenario);
  const wellbeingFocus = getLocalizedWellbeingFocusForScenario(locale, activeScenario.id);
  const wellbeingTargets = getLocalizedWellbeingTargets(locale);
  const scenarios = getLocalizedScenarios(locale);
  const hasConfiguredTargets = wellbeingTargets.some(
    (target) => target.currentLevel > 0 || target.desiredLevel > 0 || target.priority > 0,
  );
  const copy = {
    en: {
      eyebrow: "Wellbeing studio",
      title: "Mock sliders for targets, gaps, and activation need.",
      description:
        "Alba uses two layers: ten concrete domains as decision axes, and PERMAV as an interpretive flourishing layer across scenarios. This page now follows the active hypothesis too, so wellbeing stops being only a baseline and becomes a decision criterion.",
      barDescription:
        "Wellbeing is not a separate module: it helps clarify whether a scenario is sustainable in practice, not only interesting in theory.",
      openActivation: "Open linked Activation",
      openDossier: "Open focused dossier",
      barTitle: "Wellbeing focus by scenario.",
      emptyTitle: "No wellbeing baseline yet.",
      emptyDescription:
        "The sliders are ready, but every domain is still empty. Set current level, desired level, and priority only when you want Simulation and Activation to use wellbeing as a real decision criterion.",
    },
    it: {
      eyebrow: "Wellbeing studio",
      title: "Slider mock per target, gap e activation need.",
      description:
        "Alba usa due layer: dieci domini concreti come assi decisionali e PERMAV come layer interpretativo di flourishing sugli scenari. Questa pagina segue l'ipotesi attiva, cosi' il wellbeing smette di essere solo baseline e diventa criterio di decisione.",
      barDescription:
        "Il wellbeing non e' un modulo separato: aiuta a chiarire se uno scenario e' sostenibile nella pratica, non solo interessante in teoria.",
      openActivation: "Apri Activation collegata",
      openDossier: "Apri dossier focalizzato",
      barTitle: "Focus wellbeing per scenario.",
      emptyTitle: "Ancora nessuna baseline di wellbeing.",
      emptyDescription:
        "Gli slider sono pronti, ma ogni dominio e' ancora vuoto. Imposta livello attuale, livello desiderato e priorita' solo quando vuoi che Simulation e Activation usino davvero il wellbeing come criterio di decisione.",
    },
  }[locale];

  return (
    <div className="space-y-8">
      <section className="card-surface">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2 className="mt-3 font-heading text-4xl text-alba-ink">{copy.title}</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-alba-ink/72">{copy.description}</p>
      </section>

      {!hasConfiguredTargets ? (
        <EmptyStateNotice
          ctaHref={buildAppHref("/evidence", { locale })}
          ctaLabel={locale === "it" ? "Apri Evidence" : "Open Evidence"}
          description={copy.emptyDescription}
          locale={locale}
          title={copy.emptyTitle}
        />
      ) : null}

      <ScenarioContextBar
        activeScenario={activeScenario}
        basePath="/wellbeing"
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

      <WellbeingDashboard
        focusLabel={activeScenario.title}
        focusNote={wellbeingFocus.note}
        focusPermav={activeScenario.permav}
        focusTargetIds={wellbeingFocus.targets.map((target) => target.id)}
        initialTargets={wellbeingTargets}
        locale={locale}
        wellbeingLevers={wellbeingFocus.levers}
      />
    </div>
  );
}
