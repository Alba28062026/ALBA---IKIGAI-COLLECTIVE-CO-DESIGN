import { EmptyStateNotice } from "@/components/EmptyStateNotice";
import { IkigaiMapPreview } from "@/components/IkigaiMapPreview";
import { ScenarioContextBar } from "@/components/ScenarioContextBar";
import { buildAppHref, resolveLocale } from "@/lib/i18n";
import { buildScenarioHref } from "@/lib/mock-data";
import {
  buildLocalizedIkigaiMapForScenario,
  getLocalizedIkigaiFocusForScenario,
  getLocalizedPrimaryOpportunityForScenario,
  getLocalizedScenarioForRoute,
  getLocalizedScenarios,
} from "@/lib/localized-data";

type IkigaiPageProps = {
  searchParams?: Promise<{
    lang?: string | string[];
    scenario?: string | string[];
  }>;
};

export default async function IkigaiPage({ searchParams }: IkigaiPageProps) {
  const params = await searchParams;
  const locale = resolveLocale(params?.lang);
  const activeScenario = getLocalizedScenarioForRoute(locale, params?.scenario);
  const activeOpportunity = getLocalizedPrimaryOpportunityForScenario(locale, activeScenario.id);
  const activeIkigaiMap = buildLocalizedIkigaiMapForScenario(locale, activeScenario.id);
  const activeIkigaiFocus = getLocalizedIkigaiFocusForScenario(locale, activeScenario.id);
  const scenarios = getLocalizedScenarios(locale);
  const isBlankMap =
    activeIkigaiMap.loves.length === 0 &&
    activeIkigaiMap.strengths.length === 0 &&
    activeIkigaiMap.worldNeeds.length === 0 &&
    activeIkigaiMap.paidFor.length === 0;
  const orderedScenarios = [
    activeScenario,
    ...scenarios.filter((scenario) => scenario.id !== activeScenario.id),
  ];
  const copy = {
    en: {
      eyebrow: "Ikigai",
      title: "Dynamic four-quadrant map, read through each scenario.",
      description:
        "In Alba, Ikigai is not a static test: it is a Simulation lens whose weight changes with the active hypothesis, the context, and the desired sustainability.",
      barDescription:
        "Here Ikigai helps reveal which elements across the four quadrants are truly supporting the active hypothesis, and which ones are still fragile or open to negotiation.",
      openSimulation: "Open linked Simulation",
      openDossier: "Open focused dossier",
      barTitle: "Ikigai focus by scenario.",
      center: "Center of gravity",
      centerTitle: "What is holding the hypothesis together right now",
      bridgeOpportunity: "Bridge opportunity",
      signal: "Ikigai signal",
      library: "Scenario library",
      compareTitle: "Comparing Ikigai readings",
      compareDescription:
        "The active scenario appears first, but the comparison stays visible so you can see where meaning, sustainability, and perceived payability shift.",
      emptyTitle: "No Ikigai map yet.",
      emptyDescription:
        "Ikigai becomes useful only after Phase 1 evidence exists and Simulation has something real to position. In this blank state, the map stays intentionally empty.",
      emptyCta: "Open Skills translation",
    },
    it: {
      eyebrow: "Ikigai",
      title: "Mappa dinamica a quattro quadranti, letta attraverso ogni scenario.",
      description:
        "In Alba, Ikigai non e' un test statico: e' una lente di Simulation il cui peso cambia con l'ipotesi attiva, il contesto e la sostenibilita' desiderata.",
      barDescription:
        "Qui Ikigai aiuta a rendere visibili gli elementi dei quattro quadranti che stanno davvero sostenendo l'ipotesi attiva, e quelli che restano fragili o negoziabili.",
      openSimulation: "Apri Simulation collegata",
      openDossier: "Apri dossier focalizzato",
      barTitle: "Focus Ikigai per scenario.",
      center: "Centro di gravita'",
      centerTitle: "Che cosa sta tenendo insieme l'ipotesi in questo momento",
      bridgeOpportunity: "Opportunita' ponte",
      signal: "Segnale Ikigai",
      library: "Libreria scenari",
      compareTitle: "Confronto delle letture Ikigai",
      compareDescription:
        "Lo scenario attivo appare per primo, ma il confronto resta visibile per capire dove cambiano significato, sostenibilita' e percezione di pagabilita'.",
      emptyTitle: "Ancora nessuna mappa Ikigai.",
      emptyDescription:
        "Ikigai diventa utile solo dopo che esistono evidenze di fase 1 e la Simulation ha qualcosa di reale da posizionare. In questo stato vuoto, la mappa resta intenzionalmente non compilata.",
      emptyCta: "Apri traduzione Skill",
    },
  }[locale];

  if (isBlankMap) {
    return (
      <div className="space-y-8">
        <section className="card-surface">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 className="mt-3 font-heading text-4xl text-alba-ink">{copy.title}</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-alba-ink/72">{copy.description}</p>
        </section>

        <EmptyStateNotice
          ctaHref={buildAppHref("/skills", { locale })}
          ctaLabel={copy.emptyCta}
          description={copy.emptyDescription}
          locale={locale}
          title={copy.emptyTitle}
        />

        <IkigaiMapPreview locale={locale} map={activeIkigaiMap} />
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
        basePath="/ikigai"
        description={copy.barDescription}
        links={[
          {
            href: buildScenarioHref("/skills", activeScenario.id, undefined, locale),
            label: copy.openSimulation,
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

      <IkigaiMapPreview
        focusLabel={activeScenario.title}
        focusSummary={activeScenario.ikigaiSignal}
        highlightedItems={activeIkigaiFocus.highlightedItems}
        locale={locale}
        map={activeIkigaiMap}
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className="card-surface">
          <p className="eyebrow">{copy.center}</p>
          <h3 className="mt-3 font-heading text-3xl text-alba-ink">{copy.centerTitle}</h3>
          <p className="mt-4 text-sm leading-7 text-alba-ink/72">
            {activeIkigaiFocus.note}
          </p>
          {activeOpportunity ? (
            <div className="mt-5 rounded-[1.6rem] bg-alba-cream/72 p-4 text-sm text-alba-ink/72">
              <p className="font-semibold text-alba-ink">{copy.bridgeOpportunity}</p>
              <p className="mt-2">{activeOpportunity.title}</p>
              <p className="mt-3">{activeOpportunity.note}</p>
            </div>
          ) : null}
        </div>

        <div className="card-surface bg-alba-ink text-white">
          <p className="eyebrow text-white/70">{copy.signal}</p>
          <h3 className="mt-3 font-heading text-3xl">{activeScenario.title}</h3>
          <p className="mt-4 text-sm leading-7 text-white/82">{activeScenario.ikigaiSignal}</p>
          <p className="mt-4 text-sm leading-7 text-white/72">{activeScenario.wellbeingShift}</p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">{copy.library}</p>
            <h3 className="mt-3 font-heading text-3xl text-alba-ink">{copy.compareTitle}</h3>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-alba-ink/68">
            {copy.compareDescription}
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          {orderedScenarios.map((scenario) => (
            <article
              key={scenario.id}
              className={`card-surface ${
                scenario.id === activeScenario.id
                  ? "border-alba-clay/20 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(244,224,216,0.62))]"
                  : ""
              }`}
            >
              <p className="eyebrow">{scenario.horizon}</p>
              <h3 className="mt-3 font-heading text-2xl text-alba-ink">{scenario.title}</h3>
              <p className="mt-4 text-sm leading-7 text-alba-ink/72">{scenario.ikigaiSignal}</p>
              <p className="mt-4 text-sm leading-7 text-alba-ink/62">{scenario.wellbeingShift}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
