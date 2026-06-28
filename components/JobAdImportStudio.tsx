"use client";

import Link from "next/link";
import { startTransition, useState } from "react";
import { ArrowRight, BriefcaseBusiness, DatabaseZap, Network, Sparkles } from "lucide-react";
import { FitScoreCard } from "@/components/FitScoreCard";
import type { Locale } from "@/lib/i18n";
import { buildScenarioHref } from "@/lib/mock-data";
import type { Opportunity, Scenario } from "@/lib/types";
import { cn } from "@/lib/utils";

type JobAdImportStudioProps = {
  activeScenarioId: string;
  locale: Locale;
  opportunities: Opportunity[];
  scenarios: Scenario[];
};

type JobAdSample = {
  id: string;
  body: string;
  company: string;
  label: string;
  location: string;
  title: string;
};

type SignalDescriptor = {
  id: string;
  keywords: string[];
  label: Record<Locale, string>;
};

type AnalysisResult = {
  confidence: string;
  escoOccupation: string;
  escoSkillCluster: string[];
  extractedSignals: string[];
  matchedKeywords: string[];
  normalizedTitle: string;
  opportunity: Opportunity;
  scenario: Scenario | null;
  sourceLabel: string;
};

const signalLibrary: SignalDescriptor[] = [
  {
    id: "learning-systems",
    keywords: ["learning", "capability", "upskilling", "academy", "talent", "skills"],
    label: {
      en: "Learning systems and capability building",
      it: "Learning systems e capability building",
    },
  },
  {
    id: "future-work",
    keywords: ["future of work", "employee experience", "organizational design", "people strategy"],
    label: {
      en: "Future of work and organization design",
      it: "Future of work e organization design",
    },
  },
  {
    id: "operations-crafting",
    keywords: ["operations", "program", "delivery", "pmo", "stakeholder", "continuous improvement"],
    label: {
      en: "Program coordination and operational crafting",
      it: "Coordinamento di programma e job crafting operativo",
    },
  },
  {
    id: "facilitation",
    keywords: ["facilitation", "workshop", "alignment", "cross-functional", "rituals"],
    label: {
      en: "Cross-functional facilitation",
      it: "Facilitazione cross-funzionale",
    },
  },
  {
    id: "guidance",
    keywords: ["career", "coaching", "guidance", "community", "wellbeing", "purpose", "portfolio"],
    label: {
      en: "Guidance, portfolio, and purpose support",
      it: "Supporto a guidance, portfolio e purpose",
    },
  },
];

const keywordFamilies: Array<{
  confidence: Record<Locale, string>;
  escoOccupation: Record<Locale, string>;
  escoSkillCluster: Record<Locale, string[]>;
  normalizedTitle: Record<Locale, string>;
  opportunityId: string;
  sourceLabel: Record<Locale, string>;
  terms: string[];
}> = [
  {
    opportunityId: "op-people-innovation",
    terms: [
      "people innovation",
      "future of work",
      "learning",
      "l&d",
      "talent",
      "employee experience",
      "skills taxonomy",
      "capability",
      "workforce",
      "organization design",
    ],
    normalizedTitle: {
      en: "People innovation and learning systems role",
      it: "Ruolo people innovation e learning systems",
    },
    escoOccupation: {
      en: "Mock ESCO bridge: learning and development manager / organisation design specialist",
      it: "Ponte ESCO mock: learning and development manager / organisation design specialist",
    },
    escoSkillCluster: {
      en: ["skills strategy", "learning design", "organisation change"],
      it: ["skills strategy", "learning design", "organisation change"],
    },
    sourceLabel: {
      en: "LinkedIn-style import interpreted locally",
      it: "Import stile LinkedIn interpretato in locale",
    },
    confidence: {
      en: "High hypothesis strength",
      it: "Ipotesi ad alta trazione",
    },
  },
  {
    opportunityId: "op-job-crafting",
    terms: [
      "operations",
      "program manager",
      "delivery",
      "continuous improvement",
      "internal enablement",
      "project coordination",
      "stakeholder",
      "pmo",
      "process",
      "cross-functional",
    ],
    normalizedTitle: {
      en: "Program and operations crafting role",
      it: "Ruolo di program e operations crafting",
    },
    escoOccupation: {
      en: "Mock ESCO bridge: project manager / operations coordinator",
      it: "Ponte ESCO mock: project manager / operations coordinator",
    },
    escoSkillCluster: {
      en: ["project delivery", "process improvement", "stakeholder coordination"],
      it: ["project delivery", "process improvement", "stakeholder coordination"],
    },
    sourceLabel: {
      en: "LinkedIn-style import interpreted locally",
      it: "Import stile LinkedIn interpretato in locale",
    },
    confidence: {
      en: "Solid internal translation",
      it: "Traduzione interna solida",
    },
  },
  {
    opportunityId: "op-purpose-lab",
    terms: [
      "purpose",
      "career",
      "community",
      "founder",
      "coach",
      "coaching",
      "wellbeing",
      "portfolio",
      "facilitator",
      "advisory",
    ],
    normalizedTitle: {
      en: "Purpose guidance and community facilitation role",
      it: "Ruolo di purpose guidance e community facilitation",
    },
    escoOccupation: {
      en: "Mock ESCO bridge: career guidance adviser / community development lead",
      it: "Ponte ESCO mock: career guidance adviser / community development lead",
    },
    escoSkillCluster: {
      en: ["career guidance", "community facilitation", "portfolio coaching"],
      it: ["career guidance", "community facilitation", "portfolio coaching"],
    },
    sourceLabel: {
      en: "LinkedIn-style import interpreted locally",
      it: "Import stile LinkedIn interpretato in locale",
    },
    confidence: {
      en: "Exploratory but coherent",
      it: "Esplorativa ma coerente",
    },
  },
];

function buildSamples(locale: Locale): JobAdSample[] {
  return locale === "it"
    ? [
        {
          id: "linkedin-people-innovation",
          label: "Sample: People Innovation",
          title: "Senior People Innovation Manager",
          company: "Northstar Work Design",
          location: "Milano · Hybrid",
          body:
            "Senior People Innovation Manager\nNorthstar Work Design\nMilano · Hybrid\n\nWe are looking for a leader who can design learning architecture, capability building programs, future of work pilots, and skills taxonomy initiatives. The role partners with HR, business leaders, and employee experience teams to shape workforce upskilling, organization design, and talent transformation.",
        },
        {
          id: "linkedin-job-crafting",
          label: "Sample: Job Crafting",
          title: "Program Manager, Internal Operations Excellence",
          company: "Atlas Product Studio",
          location: "Torino · On-site + flexible",
          body:
            "Program Manager, Internal Operations Excellence\nAtlas Product Studio\nTorino · On-site + flexible\n\nThe role coordinates cross-functional delivery, stakeholder alignment, facilitation of internal rituals, PMO reporting, and continuous improvement initiatives. We need someone who can bring structure, process clarity, and enablement across multiple teams.",
        },
        {
          id: "linkedin-purpose-lab",
          label: "Sample: Purpose Lab",
          title: "Founder in Residence, Career & Community Studio",
          company: "Common Path Collective",
          location: "Remote · Europe",
          body:
            "Founder in Residence, Career & Community Studio\nCommon Path Collective\nRemote · Europe\n\nWe are building a portfolio-first community experience around career guidance, purpose exploration, group facilitation, community learning, and wellbeing programs. The person will design labs, host workshops, and support portfolio coaching for people navigating transitions.",
        },
      ]
    : [
        {
          id: "linkedin-people-innovation",
          label: "Sample: People Innovation",
          title: "Senior People Innovation Manager",
          company: "Northstar Work Design",
          location: "Milan · Hybrid",
          body:
            "Senior People Innovation Manager\nNorthstar Work Design\nMilan · Hybrid\n\nWe are looking for a leader who can design learning architecture, capability building programs, future of work pilots, and skills taxonomy initiatives. The role partners with HR, business leaders, and employee experience teams to shape workforce upskilling, organization design, and talent transformation.",
        },
        {
          id: "linkedin-job-crafting",
          label: "Sample: Job Crafting",
          title: "Program Manager, Internal Operations Excellence",
          company: "Atlas Product Studio",
          location: "Turin · On-site + flexible",
          body:
            "Program Manager, Internal Operations Excellence\nAtlas Product Studio\nTurin · On-site + flexible\n\nThe role coordinates cross-functional delivery, stakeholder alignment, facilitation of internal rituals, PMO reporting, and continuous improvement initiatives. We need someone who can bring structure, process clarity, and enablement across multiple teams.",
        },
        {
          id: "linkedin-purpose-lab",
          label: "Sample: Purpose Lab",
          title: "Founder in Residence, Career & Community Studio",
          company: "Common Path Collective",
          location: "Remote · Europe",
          body:
            "Founder in Residence, Career & Community Studio\nCommon Path Collective\nRemote · Europe\n\nWe are building a portfolio-first community experience around career guidance, purpose exploration, group facilitation, community learning, and wellbeing programs. The person will design labs, host workshops, and support portfolio coaching for people navigating transitions.",
        },
      ];
}

function analyzeText(
  locale: Locale,
  text: string,
  opportunities: Opportunity[],
  scenarios: Scenario[],
): AnalysisResult {
  const normalized = text.toLowerCase();
  const opportunityScores = keywordFamilies.map((family) => {
    const matchedKeywords = family.terms.filter((term) => normalized.includes(term));

    return {
      family,
      matchedKeywords,
      score: matchedKeywords.length,
    };
  });

  const topFamily =
    opportunityScores.sort((left, right) => right.score - left.score)[0]?.family ?? keywordFamilies[0];
  const matchedKeywords =
    opportunityScores.find((item) => item.family.opportunityId === topFamily.opportunityId)
      ?.matchedKeywords ?? [];
  const fallbackOpportunity = opportunities[0];
  const opportunity =
    opportunities.find((item) => item.id === topFamily.opportunityId) ?? fallbackOpportunity;
  const scenario =
    scenarios.find((item) => item.opportunityIds.includes(opportunity.id)) ?? scenarios[0] ?? null;
  const extractedSignals = signalLibrary
    .filter((signal) => signal.keywords.some((keyword) => normalized.includes(keyword)))
    .map((signal) => signal.label[locale]);

  return {
    confidence:
      matchedKeywords.length >= 4
        ? topFamily.confidence[locale]
        : locale === "it"
          ? "Ipotesi iniziale da validare"
          : "Early hypothesis to validate",
    escoOccupation: topFamily.escoOccupation[locale],
    escoSkillCluster: topFamily.escoSkillCluster[locale],
    extractedSignals:
      extractedSignals.length > 0
        ? extractedSignals
        : [
            locale === "it"
              ? "Segnali ancora troppo deboli: serve piu' testo del job ad"
              : "Signals still weak: this job ad needs more text",
          ],
    matchedKeywords,
    normalizedTitle: topFamily.normalizedTitle[locale],
    opportunity,
    scenario,
    sourceLabel: topFamily.sourceLabel[locale],
  };
}

export function JobAdImportStudio({
  activeScenarioId,
  locale,
  opportunities,
  scenarios,
}: JobAdImportStudioProps) {
  const samples = buildSamples(locale);
  const [selectedSampleId, setSelectedSampleId] = useState(samples[0]?.id ?? "manual");
  const [draftText, setDraftText] = useState(samples[0]?.body ?? "");
  const [result, setResult] = useState<AnalysisResult | null>(() =>
    samples[0] ? analyzeText(locale, samples[0].body, opportunities, scenarios) : null,
  );

  const copy =
    locale === "it"
      ? {
          badge: "LinkedIn -> ESCO -> O*NET",
          title: "Import locale di annunci lavoro per la Simulation.",
          description:
            "Qui Alba non usa API esterne: interpreta in locale un annuncio stile LinkedIn o un testo incollato, poi lo ancora in mock a scenario, opportunita', ESCO e O*NET.",
          localOnly: "Locale only",
          noApi: "No LinkedIn API",
          pickSample: "Scegli un esempio",
          textareaLabel: "Testo annuncio",
          textareaHint:
            "Puoi usare un sample oppure incollare un job ad reale. L'analisi resta una traduzione ipotetica, non un parsing ufficiale.",
          analyze: "Analizza in locale",
          clear: "Pulisci",
          interoperability: "Catena di interoperabilita'",
          extractedSignals: "Segnali estratti",
          matchedKeywords: "Keyword intercettate",
          scenarioBridge: "Scenario suggerito",
          openScenario: "Apri scenario in Simulation",
          openSkills: "Apri skill collegate",
          escoBridge: "Ponte ESCO",
          onetBridge: "Ponte O*NET",
          source: "Sorgente",
          normalizedRole: "Ruolo normalizzato",
          fitTitle: "Fit ipotetico",
          fitNote:
            "Questa lettura serve a rendere leggibile il ponte da job ad a tassonomie. Non e' un match definitivo e non implica accesso diretto a LinkedIn.",
        }
      : {
          badge: "LinkedIn -> ESCO -> O*NET",
          title: "Local job-ad import for Simulation.",
          description:
            "Alba does not use external APIs here: it interprets a LinkedIn-style post or pasted text locally, then anchors it as a mock bridge to scenarios, opportunities, ESCO, and O*NET.",
          localOnly: "Local only",
          noApi: "No LinkedIn API",
          pickSample: "Pick a sample",
          textareaLabel: "Job text",
          textareaHint:
            "Use a sample or paste a real job ad. The analysis stays a working hypothesis, not an official parsing pipeline.",
          analyze: "Analyze locally",
          clear: "Clear",
          interoperability: "Interoperability chain",
          extractedSignals: "Extracted signals",
          matchedKeywords: "Matched keywords",
          scenarioBridge: "Suggested scenario",
          openScenario: "Open scenario in Simulation",
          openSkills: "Open linked skills",
          escoBridge: "ESCO bridge",
          onetBridge: "O*NET bridge",
          source: "Source",
          normalizedRole: "Normalized role",
          fitTitle: "Hypothesis fit",
          fitNote:
            "This reading is here to make the bridge from job ad to taxonomies legible. It is not a definitive match and does not imply direct LinkedIn access.",
        };

  return (
    <section className="card-surface space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="eyebrow">{copy.badge}</p>
          <h3 className="mt-3 font-heading text-3xl text-alba-ink">{copy.title}</h3>
          <p className="mt-4 text-sm leading-7 text-alba-ink/72">{copy.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-alba-cream px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-alba-clay">
            {copy.localOnly}
          </span>
          <span className="rounded-full bg-[#dff0ea] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-alba-forest">
            {copy.noApi}
          </span>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.92fr)_minmax(340px,1.08fr)]">
        <div className="space-y-5 rounded-[1.8rem] border border-alba-forest/10 bg-white/72 p-4 sm:p-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-alba-forest/72">
              {copy.pickSample}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {samples.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => {
                    startTransition(() => {
                      setSelectedSampleId(sample.id);
                      setDraftText(sample.body);
                      setResult(analyzeText(locale, sample.body, opportunities, scenarios));
                    });
                  }}
                  className={cn(
                    "rounded-full border px-3 py-2 text-sm font-medium transition",
                    selectedSampleId === sample.id
                      ? "border-alba-forest bg-alba-forest text-white"
                      : "border-alba-forest/12 bg-white text-alba-ink/78 hover:bg-alba-cream/68",
                  )}
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-alba-forest/72">
              {copy.textareaLabel}
            </span>
            <textarea
              value={draftText}
              onChange={(event) => setDraftText(event.target.value)}
              rows={14}
              className="mt-3 w-full rounded-[1.4rem] border border-alba-forest/12 bg-white px-4 py-4 text-sm leading-7 text-alba-ink shadow-[0_18px_40px_rgba(29,48,41,0.04)] outline-none transition focus:border-alba-forest focus:ring-2 focus:ring-alba-forest/10"
            />
          </label>

          <p className="text-sm leading-7 text-alba-ink/62">{copy.textareaHint}</p>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setResult(analyzeText(locale, draftText, opportunities, scenarios))}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-alba-clay px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b55828]"
            >
              {copy.analyze}
            </button>
            <button
              type="button"
              onClick={() => {
                startTransition(() => {
                  setSelectedSampleId("manual");
                  setDraftText("");
                  setResult(null);
                });
              }}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-alba-forest/15 bg-white/88 px-5 py-3 text-sm font-semibold text-alba-forest transition hover:bg-white"
            >
              {copy.clear}
            </button>
          </div>
        </div>

        {result ? (
          <div className="space-y-5">
            <div className="rounded-[1.8rem] border border-alba-forest/10 bg-alba-ink p-5 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/64">
                {copy.interoperability}
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-[1.4rem] bg-white/10 p-4">
                  <div className="flex items-center gap-2 text-white/82">
                    <BriefcaseBusiness className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                      {copy.source}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7">{result.sourceLabel}</p>
                </div>
                <div className="rounded-[1.4rem] bg-white/10 p-4">
                  <div className="flex items-center gap-2 text-white/82">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                      {copy.normalizedRole}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7">{result.normalizedTitle}</p>
                </div>
                <div className="rounded-[1.4rem] bg-white/10 p-4">
                  <div className="flex items-center gap-2 text-white/82">
                    <DatabaseZap className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                      {copy.escoBridge}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7">{result.escoOccupation}</p>
                </div>
                <div className="rounded-[1.4rem] bg-white/10 p-4">
                  <div className="flex items-center gap-2 text-white/82">
                    <Network className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-[0.16em]">
                      {copy.onetBridge}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-7">
                    {result.opportunity.onetMatches.map((role) => role.code).join(" | ")}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(280px,1.05fr)]">
              <div className="space-y-5">
                <div className="rounded-[1.6rem] bg-alba-cream/72 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alba-forest/72">
                    {copy.extractedSignals}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {result.extractedSignals.map((signal) => (
                      <span
                        key={signal}
                        className="rounded-full border border-alba-forest/10 bg-white px-3 py-1 text-xs text-alba-forest"
                      >
                        {signal}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.6rem] bg-white/82 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alba-clay/84">
                    {copy.matchedKeywords}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-alba-ink/70">
                    {result.matchedKeywords.length > 0
                      ? result.matchedKeywords.join(" | ")
                      : locale === "it"
                        ? "Ancora nessuna keyword forte: prova a incollare piu' dettaglio sul ruolo."
                        : "No strong keywords yet: try pasting more detail about the role."}
                  </p>
                  <p className="mt-4 text-sm font-medium text-alba-ink">{result.confidence}</p>
                </div>

                <div className="rounded-[1.6rem] bg-white/82 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alba-forest/72">
                    {copy.scenarioBridge}
                  </p>
                  <h4 className="mt-3 font-heading text-2xl text-alba-ink">
                    {result.scenario?.title ?? result.opportunity.title}
                  </h4>
                  <p className="mt-3 text-sm leading-7 text-alba-ink/70">
                    {result.scenario?.thesis ?? result.opportunity.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      href={buildScenarioHref(
                        "/opportunities",
                        result.scenario?.id ?? activeScenarioId,
                        undefined,
                        locale,
                      )}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-alba-forest/15 bg-white px-4 py-2 text-sm font-semibold text-alba-forest transition hover:bg-alba-cream/60"
                    >
                      {copy.openScenario}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href={buildScenarioHref(
                        "/skills",
                        result.scenario?.id ?? activeScenarioId,
                        undefined,
                        locale,
                      )}
                      className="inline-flex min-h-11 items-center gap-2 rounded-full border border-alba-forest/15 bg-white px-4 py-2 text-sm font-semibold text-alba-forest transition hover:bg-alba-cream/60"
                    >
                      {copy.openSkills}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>

              <FitScoreCard
                locale={locale}
                title={`${copy.fitTitle} - ${result.opportunity.title}`}
                scores={result.opportunity.fit}
                note={copy.fitNote}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {result.opportunity.onetMatches.slice(0, 2).map((role) => (
                <article
                  key={`${result.opportunity.id}-${role.code}`}
                  className="rounded-[1.6rem] border border-alba-forest/10 bg-white/82 p-4 shadow-[0_18px_40px_rgba(29,48,41,0.04)]"
                >
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-[#dff0ea] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-alba-forest">
                      {role.code}
                    </span>
                    <span className="rounded-full bg-alba-cream px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-alba-clay">
                      O*NET
                    </span>
                  </div>
                  <h4 className="mt-3 font-heading text-xl text-alba-ink">{role.title}</h4>
                  <p className="mt-2 text-sm leading-7 text-alba-ink/70">{role.summary}</p>
                  <p className="mt-3 text-sm text-alba-ink/58">
                    {role.sampleTitles.join(" | ")}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {result.escoSkillCluster.map((cluster) => (
                      <span
                        key={`${role.code}-${cluster}`}
                        className="rounded-full border border-alba-forest/10 bg-alba-cream/60 px-3 py-1 text-xs text-alba-forest"
                      >
                        {cluster}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
