import { EmptyStateNotice } from "@/components/EmptyStateNotice";
import { ScenarioContextBar } from "@/components/ScenarioContextBar";
import { SkillOnetBridgeCard } from "@/components/SkillOnetBridgeCard";
import { SkillCard } from "@/components/SkillCard";
import { buildAppHref, resolveLocale } from "@/lib/i18n";
import { buildScenarioHref } from "@/lib/mock-data";
import {
  getLocalizedOpportunitiesForSkill,
  getLocalizedPrimaryOpportunityForScenario,
  getLocalizedScenarioForRoute,
  getLocalizedScenarios,
  getLocalizedSkillBandOnetSuggestions,
  getLocalizedSkills,
  getLocalizedSkillsForScenario,
} from "@/lib/localized-data";
import { formatBandLabel } from "@/lib/utils";

type SkillsPageProps = {
  searchParams?: Promise<{
    lang?: string | string[];
    scenario?: string | string[];
  }>;
};

export default async function SkillsPage({ searchParams }: SkillsPageProps) {
  const params = await searchParams;
  const locale = resolveLocale(params?.lang);
  const activeScenario = getLocalizedScenarioForRoute(locale, params?.scenario);
  const activeOpportunity = getLocalizedPrimaryOpportunityForScenario(locale, activeScenario.id);
  const scenarioSkills = getLocalizedSkillsForScenario(locale, activeScenario.id);
  const skills = getLocalizedSkills(locale);
  const scenarios = getLocalizedScenarios(locale);
  const scenarioSkillIds = new Set(scenarioSkills.map((skill) => skill.id));
  const activeOnetCodes = new Set(activeOpportunity?.onetMatches.map((role) => role.code) ?? []);
  const groupedSkills = {
    expressed: skills.filter((skill) => skill.band === "expressed"),
    latent: skills.filter((skill) => skill.band === "latent"),
    strategic: skills.filter((skill) => skill.band === "strategic"),
  };

  const bandSuggestions = {
    expressed: getLocalizedSkillBandOnetSuggestions(locale, groupedSkills.expressed),
    latent: getLocalizedSkillBandOnetSuggestions(locale, groupedSkills.latent),
    strategic: getLocalizedSkillBandOnetSuggestions(locale, groupedSkills.strategic),
  };

  const bandOrder = ["expressed", "latent", "strategic"] as const;
  const copy = {
    en: {
      eyebrow: "Simulation",
      title: "Portable Human Portfolio to ESCO / O*NET translation layer.",
      description:
        "Simulation does not begin from job ads. It begins from the Phase 1 portfolio, translates skills and other signals into shared taxonomy language, then compares the result against Ikigai direction and wellbeing thresholds.",
      todo:
        "Future TODO: ESCO-O*NET crosswalk, knowledge / abilities / work styles, work-context reading, and evidence-based multidimensional scoring.",
      barDescription:
        "Skills are not fixed labels. Their weight changes with the hypothesis you are validating and with the ESCO / O*NET translation you are trying to make credible.",
      openIkigai: "Open linked Ikigai",
      openWellbeing: "Open linked wellbeing",
      barTitle: "Simulation focus for the active hypothesis.",
      cluster: "Translated role family",
      hypothesisNote:
        "ALBA shows taxonomy signals as operating hypotheses, not final professional matches.",
      suggestedRoles: "O*NET roles suggested by this cluster",
      outcomes: "Suggested O*NET outcomes",
      emptyTitle: "No portfolio translation yet.",
      emptyDescription:
        "Simulation starts only after Phase 1 collects real evidence. When the Portable Human Portfolio exists, ALBA can translate it into ESCO and O*NET terminology before Activation surfaces any opportunity.",
      emptyCta: "Start from Evidence",
      translationTitle: "How Simulation works before opportunities appear",
      pipeline: [
        {
          title: "1. Portable Human Portfolio",
          body: "Skills, values, interests, constraints, signals, and baseline wellbeing stay in a cautious profile instead of becoming identity labels.",
        },
        {
          title: "2. ESCO / O*NET translation",
          body: "ALBA rewrites that profile into shared taxonomy language: skill families, knowledge areas, work activities, role signals, and context cues.",
        },
        {
          title: "3. Ikigai + wellbeing filters",
          body: "Desired Ikigai direction and wellbeing thresholds decide which translated hypotheses remain sustainable enough to keep exploring.",
        },
        {
          title: "4. Activation handoff",
          body: "Only after this translation layer is credible does ALBA surface possible opportunities inside Phase 3 Activation.",
        },
      ],
    },
    it: {
      eyebrow: "Simulation",
      title: "Portable Human Portfolio -> layer di traduzione ESCO / O*NET.",
      description:
        "La Simulation non parte dagli annunci. Parte dal portfolio di fase 1, traduce skill e altri segnali in un linguaggio tassonomico condiviso, poi confronta il risultato con la direzione Ikigai e con le soglie di wellbeing.",
      todo:
        "TODO futuro: crosswalk ESCO-O*NET, knowledge / abilities / work styles, lettura del contesto di lavoro e scoring multidimensionale evidence-based.",
      barDescription:
        "Le skill non sono etichette fisse. Il loro peso cambia con l'ipotesi che stai validando e con la traduzione ESCO / O*NET che stai cercando di rendere credibile.",
      openIkigai: "Apri Ikigai collegato",
      openWellbeing: "Apri wellbeing collegato",
      barTitle: "Focus Simulation per l'ipotesi attiva.",
      cluster: "Famiglia di ruolo tradotta",
      hypothesisNote:
        "ALBA mostra i segnali tassonomici come ipotesi operative, non come match professionali finali.",
      suggestedRoles: "Ruoli O*NET suggeriti da questo cluster",
      outcomes: "Esiti O*NET suggeriti",
      emptyTitle: "Ancora nessuna traduzione del portfolio.",
      emptyDescription:
        "La Simulation parte solo dopo che la fase 1 raccoglie evidenze reali. Quando esiste il Portable Human Portfolio, ALBA puo' tradurlo in termini ESCO e O*NET prima di far emergere qualunque opportunita'.",
      emptyCta: "Parti da Evidence",
      translationTitle: "Come funziona la Simulation prima che compaiano opportunita'",
      pipeline: [
        {
          title: "1. Portable Human Portfolio",
          body: "Skill, valori, interessi, vincoli, segnali e baseline di wellbeing restano dentro un profilo prudente invece di diventare etichette identitarie.",
        },
        {
          title: "2. Traduzione ESCO / O*NET",
          body: "ALBA riscrive il profilo in un linguaggio tassonomico condiviso: famiglie di skill, aree di knowledge, work activities, segnali di ruolo e indizi di contesto.",
        },
        {
          title: "3. Filtri Ikigai + wellbeing",
          body: "La direzione Ikigai desiderata e le soglie di wellbeing tengono in vita solo le ipotesi tradotte che risultano abbastanza sostenibili.",
        },
        {
          title: "4. Passaggio ad Activation",
          body: "Solo quando questo layer di traduzione e' credibile ALBA fa emergere le possibili opportunita' dentro la Fase 3 Activation.",
        },
      ],
    },
  }[locale];

  if (skills.length === 0) {
    return (
      <div className="space-y-8">
        <section className="card-surface">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 className="mt-3 font-heading text-4xl text-alba-ink">{copy.title}</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-alba-ink/72">{copy.description}</p>
        </section>

        <section className="space-y-4">
          <div>
            <p className="eyebrow">Simulation</p>
            <h3 className="mt-3 font-heading text-3xl text-alba-ink">{copy.translationTitle}</h3>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {copy.pipeline.map((step) => (
              <article key={step.title} className="card-surface">
                <h4 className="font-heading text-2xl text-alba-ink">{step.title}</h4>
                <p className="mt-4 text-sm leading-7 text-alba-ink/72">{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <EmptyStateNotice
          ctaHref={buildAppHref("/evidence", { locale })}
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
      <section className="card-surface flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 className="mt-3 font-heading text-4xl text-alba-ink">{copy.title}</h2>
          <p className="mt-4 text-sm leading-7 text-alba-ink/72">{copy.description}</p>
        </div>

        <div className="rounded-[1.6rem] bg-alba-cream/78 p-4 text-sm leading-7 text-alba-ink/72 lg:max-w-md">
          {copy.todo}
        </div>
      </section>

      <ScenarioContextBar
        activeScenario={activeScenario}
        basePath="/skills"
        description={copy.barDescription}
        links={[
          {
            href: buildScenarioHref("/ikigai", activeScenario.id, undefined, locale),
            label: copy.openIkigai,
          },
          {
            href: buildScenarioHref("/wellbeing", activeScenario.id, undefined, locale),
            label: copy.openWellbeing,
          },
        ]}
        locale={locale}
        scenarios={scenarios}
        title={copy.barTitle}
      />

      {activeOpportunity ? (
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
          <div className="card-surface">
            <p className="eyebrow">{copy.cluster}</p>
            <h3 className="mt-3 font-heading text-3xl text-alba-ink">{activeOpportunity.title}</h3>
            <p className="mt-4 text-sm leading-7 text-alba-ink/72">{activeOpportunity.summary}</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {scenarioSkills.map((skill) => (
                <SkillCard
                  key={skill.id}
                  active
                  anchorId={`skill-${skill.id}`}
                  linkedOpportunities={getLocalizedOpportunitiesForSkill(locale, skill.id)}
                  locale={locale}
                  scenarioId={activeScenario.id}
                  skill={skill}
                />
              ))}
            </div>
          </div>

          <div className="space-y-5">
            {activeOpportunity.onetMatches.map((role) => (
              <SkillOnetBridgeCard
                key={`${activeScenario.id}-${role.code}`}
                active
                linkedOpportunities={[activeOpportunity]}
                locale={locale}
                role={role}
                scenarioId={activeScenario.id}
                supportingSkills={scenarioSkills.filter((skill) =>
                  (skill.suggestedOnetCodes ?? []).includes(role.code),
                )}
              />
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-8">
        {bandOrder.map((band) => {
          const orderedSkills = [...groupedSkills[band]].sort((left, right) => {
            const leftFocused = scenarioSkillIds.has(left.id);
            const rightFocused = scenarioSkillIds.has(right.id);

            if (leftFocused !== rightFocused) {
              return leftFocused ? -1 : 1;
            }

            if (right.level !== left.level) {
              return right.level - left.level;
            }

            return left.name.localeCompare(right.name);
          });

          return (
            <div key={band} className="space-y-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h3 className="font-heading text-3xl text-alba-ink">
                    {formatBandLabel(band, locale)}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-alba-ink/68">
                    {copy.hypothesisNote}
                  </p>
                </div>

                <div className="rounded-[1.5rem] bg-alba-cream/72 px-4 py-3 text-sm text-alba-ink/70">
                  {bandSuggestions[band].length} {copy.suggestedRoles}
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {orderedSkills.map((skill) => (
                  <SkillCard
                    key={skill.id}
                    active={scenarioSkillIds.has(skill.id)}
                    anchorId={`skill-${skill.id}`}
                    linkedOpportunities={getLocalizedOpportunitiesForSkill(locale, skill.id)}
                    locale={locale}
                    scenarioId={activeScenario.id}
                    skill={skill}
                  />
                ))}
              </div>

              <div className="rounded-[1.8rem] bg-alba-ink p-5 text-white">
                <p className="eyebrow text-white/70">{copy.outcomes}</p>
                <div className="mt-4 grid gap-5 lg:grid-cols-2">
                  {bandSuggestions[band].map(({ role, supportingSkills }) => (
                    <SkillOnetBridgeCard
                      key={`${band}-${role.code}`}
                      active={activeOnetCodes.has(role.code)}
                      linkedOpportunities={supportingSkills
                        .flatMap((skill) => getLocalizedOpportunitiesForSkill(locale, skill.id))
                        .filter(
                          (opportunity, index, array) =>
                            array.findIndex((candidate) => candidate.id === opportunity.id) ===
                            index,
                        )}
                      locale={locale}
                      role={role}
                      scenarioId={activeScenario.id}
                      supportingSkills={supportingSkills}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
