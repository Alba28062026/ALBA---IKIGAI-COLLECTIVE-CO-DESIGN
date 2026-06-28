import Link from "next/link";
import { AttachmentCoverageChips } from "@/components/AttachmentCoverageChips";
import { DigitalTwinAgentCard } from "@/components/DigitalTwinAgentCard";
import { GamificationCard } from "@/components/GamificationCard";
import { IkigaiMapPreview } from "@/components/IkigaiMapPreview";
import { PhaseCard } from "@/components/PhaseCard";
import { PortfolioSummary } from "@/components/PortfolioSummary";
import { StrategicDashboard } from "@/components/StrategicDashboard";
import { allEvidenceAttachmentCoverageAreas } from "@/lib/evidence-attachments";
import { readStoredEvidenceAttachments } from "@/lib/evidence-upload-store";
import { runDigitalTwinAgent } from "@/lib/digital-twin-agent";
import { buildAppHref, resolveLocale } from "@/lib/i18n";
import { buildScenarioHref } from "@/lib/mock-data";
import {
  buildLocalizedIkigaiMapForScenario,
  getLocalizedGamificationProfile,
  getLocalizedIkigaiFocusForScenario,
  getLocalizedOpportunities,
  getLocalizedPortfolioSummary,
  getLocalizedScenarioForRoute,
  getLocalizedWellbeingTargets,
} from "@/lib/localized-data";

type HomePageProps = {
  searchParams?: Promise<{
    lang?: string | string[];
    scenario?: string | string[];
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const locale = resolveLocale(params?.lang);
  const activeScenario = getLocalizedScenarioForRoute(locale, params?.scenario);
  const ikigaiMap = buildLocalizedIkigaiMapForScenario(locale, activeScenario.id);
  const ikigaiFocus = getLocalizedIkigaiFocusForScenario(locale, activeScenario.id);
  const portfolioSummary = getLocalizedPortfolioSummary(locale);
  const wellbeingTargets = getLocalizedWellbeingTargets(locale);
  const opportunities = getLocalizedOpportunities(locale);
  const digitalTwinReport = await runDigitalTwinAgent({ locale });
  const gamificationProfile = getLocalizedGamificationProfile(locale);
  const storedAttachments = await readStoredEvidenceAttachments();
  const copy = {
    en: {
      phases: [
        {
          phase: "Phase 1",
          title: "Awareness",
          description:
            "Start from skills, values, evidence, wellbeing signals, and present motivation to build a more concrete reading of what already exists.",
          inputs: [
            "Technical skills and power skills",
            "Values, interests, passions, and flow patterns",
            "Feedback, achievements, story, and wellbeing baseline",
          ],
          outputs: [
            "Portable Human Portfolio",
            "Provisional WHY",
            "Baseline across concrete wellbeing domains",
          ],
          href: "/evidence",
        },
        {
          phase: "Phase 2",
          title: "Simulation",
          description:
            "Use the portfolio, mock ESCO/O*NET taxonomies, and wellbeing targets to generate scenarios, an opportunity graph, and multidimensional fit scores.",
          inputs: [
            "Canonical human portfolio",
            "Mock taxonomies and target roles",
            "Desired flourishing and context targets",
          ],
          outputs: [
            "Life and career crafting scenarios",
            "Opportunity graph with fit scores",
            "Simulated Ikigai and PERMAV map",
          ],
          href: buildScenarioHref("/opportunities", activeScenario.id, undefined, locale),
        },
        {
          phase: "Phase 3",
          title: "Activation",
          description:
            "Translate the chosen scenario into practical levers, routines, learning paths, and experiments that respect constraints, energy, and sustainability.",
          inputs: [
            "Preferred scenario",
            "Skill, values, and wellbeing gaps",
            "Personal constraints and real room for action",
          ],
          outputs: [
            "Activation plan",
            "Learning paths and wellbeing routines",
            "Concrete experiments and progressive decisions",
          ],
          href: buildScenarioHref("/experiments", activeScenario.id, undefined, locale),
        },
      ],
      journeyEyebrow: "Journey architecture",
      journeyTitle: "The three-phase structure, in detail.",
      journeyDescription:
        "Under the dashboard, the journey architecture stays visible: inputs, outputs, and the logic of each phase, so you can read both the strategic direction and the working model.",
      wellbeingEyebrow: "Wellbeing baseline",
      wellbeingTitle: "Concrete domains",
      wellbeingStats: "Current",
      desired: "Desired",
      priority: "Priority",
      openWellbeing: "Open wellbeing studio",
      opportunityEyebrow: "Opportunity graph",
      opportunityTitle: "Mock roles",
      infographicLabel: "Presentation aid",
      infographicTitle: "Open the Alba infographic",
      infographicDescription:
        "A one-page visual summary of Alba's objective, the three phases, and the privacy-first guardrails for your 5-minute talk.",
      openInfographic: "Open infographic",
      intakeEyebrow: "Local intake",
      intakeTitle: "One upload flow can feed the whole Alba map.",
      intakeDescription:
        "Attachments do not stay confined to Evidence. Once stored locally, Alba can reuse them as cautious inputs for the rest of the journey as well.",
      intakeEmpty:
        "No local attachment yet. When you are ready, start from anything you already have: CV, LinkedIn export, certificate, job ad, wearable snapshot, finance/context note, or screenshot.",
      intakeStoredPrefix: "Stored local drafts",
      intakeStoredSuffix: "available now",
      openIntake: "Open local intake",
      twinEyebrow: "Autonomous intake",
      twinTitle: "A dummy digital twin can already prepare cautious input suggestions.",
      twinDescription:
        "The agent does not make identity claims. It watches existing materials, drafts signals, and helps route them into the right Alba phase.",
      gameEyebrow: "Progress design",
      gameTitle: "A light momentum system keeps the three phases easier to use.",
      gameDescription:
        "Gamification stays soft: clear quests, visible progress, and small wins instead of pressure or streak obsession.",
    },
    it: {
      phases: [
        {
          phase: "Fase 1",
          title: "Awareness",
          description:
            "Parti da skill, valori, evidenze, segnali di benessere e motivazione presente per costruire una lettura piu' concreta di cio' che esiste gia'.",
          inputs: [
            "Competenze tecniche e power skill",
            "Valori, interessi, passioni e pattern di flow",
            "Feedback, achievement, storia e baseline di benessere",
          ],
          outputs: [
            "Portable Human Portfolio",
            "WHY provvisorio",
            "Baseline dei domini concreti di wellbeing",
          ],
          href: "/evidence",
        },
        {
          phase: "Fase 2",
          title: "Simulation",
          description:
            "Usa portfolio, tassonomie mock ESCO/O*NET e target di wellbeing per generare scenari, opportunity graph e fit score multidimensionali.",
          inputs: [
            "Portfolio umano canonico",
            "Tassonomie mock e ruoli target",
            "Target di flourishing e contesto desiderati",
          ],
          outputs: [
            "Scenari di life e career crafting",
            "Opportunity graph con fit score",
            "Mappa simulata di Ikigai e PERMAV",
          ],
          href: buildScenarioHref("/opportunities", activeScenario.id, undefined, locale),
        },
        {
          phase: "Fase 3",
          title: "Activation",
          description:
            "Traduce lo scenario scelto in leve pratiche, routine, learning path ed esperimenti coerenti con vincoli, energia e sostenibilita'.",
          inputs: [
            "Scenario preferito",
            "Gap di skill, valori e wellbeing",
            "Vincoli personali e margine d'azione reale",
          ],
          outputs: [
            "Piano di attivazione",
            "Learning path e routine di benessere",
            "Esperimenti concreti e decisioni progressive",
          ],
          href: buildScenarioHref("/experiments", activeScenario.id, undefined, locale),
        },
      ],
      journeyEyebrow: "Architettura del journey",
      journeyTitle: "La struttura in tre fasi, nel dettaglio.",
      journeyDescription:
        "Sotto il dashboard resta visibile l'architettura del journey: input, output e logica di ogni fase, cosi' puoi leggere sia la direzione strategica sia il modello operativo.",
      wellbeingEyebrow: "Baseline di benessere",
      wellbeingTitle: "Domini concreti",
      wellbeingStats: "Attuale",
      desired: "Desiderato",
      priority: "Priorita'",
      openWellbeing: "Apri wellbeing studio",
      opportunityEyebrow: "Opportunity graph",
      opportunityTitle: "Ruoli mock",
      infographicLabel: "Supporto presentazione",
      infographicTitle: "Apri l'infografica di Alba",
      infographicDescription:
        "Una sintesi visiva in una pagina dell'obiettivo di Alba, delle tre fasi e dei guardrail privacy-first per il tuo racconto da 5 minuti.",
      openInfographic: "Apri infografica",
      intakeEyebrow: "Intake locale",
      intakeTitle: "Un solo flusso di upload puo' alimentare tutta la mappa Alba.",
      intakeDescription:
        "Gli allegati non restano confinati in Evidence. Una volta salvati localmente, Alba puo' riusarli come input prudenziali anche nel resto del journey.",
      intakeEmpty:
        "Nessun allegato locale ancora presente. Quando vuoi, puoi partire da qualunque materiale tu abbia gia': CV, export LinkedIn, certificato, job ad, snapshot wearable, nota finanziaria o di contesto, oppure screenshot.",
      intakeStoredPrefix: "Bozze locali salvate",
      intakeStoredSuffix: "gia' disponibili",
      openIntake: "Apri intake locale",
      twinEyebrow: "Intake autonomo",
      twinTitle: "Un digital twin dummy puo' gia' preparare suggerimenti prudenti di input.",
      twinDescription:
        "L'agente non fa claim identitari. Osserva materiali esistenti, propone segnali e aiuta a instradarli nella fase Alba giusta.",
      gameEyebrow: "Design del progresso",
      gameTitle: "Un sistema di momentum leggero rende piu' usabili le tre fasi.",
      gameDescription:
        "La gamification resta morbida: quest chiare, progressi visibili e piccole win invece di pressione o ossessione per le streak.",
    },
  }[locale];

  return (
    <div className="space-y-8">
      <StrategicDashboard initialScenarioId={activeScenario.id} locale={locale} />

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-4">
          <div className="card-surface">
            <p className="eyebrow">{copy.twinEyebrow}</p>
            <h2 className="mt-3 font-heading text-3xl text-alba-ink">{copy.twinTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-alba-ink/72">{copy.twinDescription}</p>
          </div>
          <DigitalTwinAgentCard locale={locale} report={digitalTwinReport} />
        </div>

        <div className="space-y-4">
          <div className="card-surface">
            <p className="eyebrow">{copy.gameEyebrow}</p>
            <h2 className="mt-3 font-heading text-3xl text-alba-ink">{copy.gameTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-alba-ink/72">{copy.gameDescription}</p>
          </div>
          <GamificationCard locale={locale} profile={gamificationProfile} />
        </div>
      </section>

      <section className="space-y-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow">{copy.journeyEyebrow}</p>
            <h2 className="mt-3 font-heading text-4xl text-alba-ink">{copy.journeyTitle}</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-alba-ink/68">
            {copy.journeyDescription}
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          {copy.phases.map((phase) => (
            <PhaseCard key={phase.phase} {...phase} locale={locale} />
          ))}
        </div>
      </section>

      <PortfolioSummary locale={locale} summary={portfolioSummary} />

      <section className="card-surface">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow">{copy.intakeEyebrow}</p>
            <h2 className="mt-3 font-heading text-3xl text-alba-ink">{copy.intakeTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-alba-ink/72">{copy.intakeDescription}</p>
          </div>

          <Link
            href={buildAppHref("/evidence/new", { locale })}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-alba-forest px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#16443c]"
          >
            {copy.openIntake}
          </Link>
        </div>

        <div className="mt-6 rounded-[1.6rem] bg-alba-cream/72 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-sm text-alba-ink/72">
              {storedAttachments.length > 0
                ? `${copy.intakeStoredPrefix}: ${storedAttachments.length} ${copy.intakeStoredSuffix}.`
                : copy.intakeEmpty}
            </p>
          </div>

          <div className="mt-4">
            <AttachmentCoverageChips
              areas={[...allEvidenceAttachmentCoverageAreas]}
              locale={locale}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <IkigaiMapPreview
          focusLabel={activeScenario.title}
          focusSummary={activeScenario.ikigaiSignal}
          highlightedItems={ikigaiFocus.highlightedItems}
          map={ikigaiMap}
        />

        <div className="space-y-6">
          <div className="card-surface">
            <p className="eyebrow">{copy.wellbeingEyebrow}</p>
            <h2 className="mt-3 font-heading text-3xl text-alba-ink">{copy.wellbeingTitle}</h2>
            <div className="mt-5 space-y-3">
              {wellbeingTargets.slice(0, 5).map((target) => (
                <div
                  key={target.id}
                  className="rounded-[1.5rem] bg-white/78 px-4 py-3 text-sm text-alba-ink/72"
                >
                  <p className="font-medium text-alba-ink">{target.domain}</p>
                  <p className="mt-1">
                    {copy.wellbeingStats} {target.currentLevel}/10 | {copy.desired}{" "}
                    {target.desiredLevel}/10 | {copy.priority} {target.priority}/5
                  </p>
                </div>
              ))}
            </div>
            <Link
              href={buildScenarioHref("/wellbeing", activeScenario.id, undefined, locale)}
              className="mt-5 inline-flex min-h-11 items-center text-sm font-semibold text-alba-forest"
            >
              {copy.openWellbeing}
            </Link>
          </div>

          <div className="card-surface">
            <p className="eyebrow">{copy.opportunityEyebrow}</p>
            <h2 className="mt-3 font-heading text-3xl text-alba-ink">{copy.opportunityTitle}</h2>
            <div className="mt-5 space-y-4">
              {opportunities.map((opportunity) => (
                <div key={opportunity.id} className="rounded-[1.5rem] bg-alba-cream/75 p-4">
                  <p className="font-semibold text-alba-ink">{opportunity.title}</p>
                  <p className="mt-2 text-sm text-alba-ink/68">{opportunity.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="card-surface">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow">{copy.infographicLabel}</p>
            <h2 className="mt-3 font-heading text-3xl text-alba-ink">{copy.infographicTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-alba-ink/72">{copy.infographicDescription}</p>
          </div>
          <Link
            href={`/infographic?lang=${locale}`}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-alba-clay px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b55828]"
          >
            {copy.openInfographic}
          </Link>
        </div>
      </section>
    </div>
  );
}
