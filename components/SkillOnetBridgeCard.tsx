import { ArrowUpRight } from "lucide-react";
import { GraphLinkPill } from "@/components/GraphLinkPill";
import { buildScenarioHref } from "@/lib/mock-data";
import type { Locale } from "@/lib/i18n";
import type { OnetOpportunityLink, Opportunity, SkillProfile } from "@/lib/types";
import { cn } from "@/lib/utils";

type SkillOnetBridgeCardProps = {
  active?: boolean;
  linkedOpportunities?: Opportunity[];
  locale?: Locale;
  role: OnetOpportunityLink;
  scenarioId?: string;
  supportingSkills: SkillProfile[];
};

export function SkillOnetBridgeCard({
  active = false,
  linkedOpportunities = [],
  locale = "en",
  role,
  scenarioId,
  supportingSkills,
}: SkillOnetBridgeCardProps) {
  const copy = {
    en: {
      scenarioFocus: "Scenario focus",
      brightOutlook: "Bright Outlook",
      coreMatch: "Core match",
      adjacentMatch: "Adjacent match",
      supportedBy: "Supported by",
      clusterSkills: "cluster skills",
      connectedOpportunities: "Connected Alba opportunities",
      sampleTitles: "Sample titles",
      openOfficial: "Open official O*NET profile",
    },
    it: {
      scenarioFocus: "Focus scenario",
      brightOutlook: "Bright Outlook",
      coreMatch: "Match centrale",
      adjacentMatch: "Match adiacente",
      supportedBy: "Supportato da",
      clusterSkills: "skill del cluster",
      connectedOpportunities: "Opportunita' Alba collegate",
      sampleTitles: "Titoli di esempio",
      openOfficial: "Apri profilo O*NET ufficiale",
    },
  }[locale];
  const alignmentLabel = role.alignment === "Core match" ? copy.coreMatch : copy.adjacentMatch;

  return (
    <article
      className={cn(
        "rounded-[1.7rem] border border-white/60 bg-white/82 p-5 shadow-[0_20px_50px_rgba(29,48,41,0.05)]",
        active &&
          "border-alba-gold/28 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(239,230,200,0.52))]",
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[#dff0ea] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-alba-forest">
          O*NET {role.code}
        </span>
        <span className="rounded-full bg-alba-cream px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-alba-clay">
          {alignmentLabel}
        </span>
        {active ? (
          <span className="rounded-full bg-alba-ink px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
            {copy.scenarioFocus}
          </span>
        ) : null}
        {role.brightOutlook ? (
          <span className="rounded-full bg-alba-rose/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-alba-clay">
            {copy.brightOutlook}
          </span>
        ) : null}
      </div>

      <h4 className="mt-4 font-heading text-2xl text-alba-ink">{role.title}</h4>
      <p className="mt-3 text-sm leading-7 text-alba-ink/72">{role.summary}</p>

      <div className="mt-4 rounded-[1.4rem] bg-alba-cream/72 p-4 text-sm text-alba-ink/74">
        <p className="font-semibold text-alba-ink">
          {copy.supportedBy} {supportingSkills.length} {copy.clusterSkills}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {supportingSkills.map((skill) => (
            <span
              key={`${role.code}-${skill.id}`}
              className="rounded-full border border-alba-forest/12 bg-white px-3 py-1 text-xs text-alba-forest"
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>

      {linkedOpportunities.length ? (
        <div className="mt-4 rounded-[1.4rem] bg-alba-cream/72 p-4 text-sm text-alba-ink/74">
          <p className="font-semibold text-alba-ink">{copy.connectedOpportunities}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {linkedOpportunities.map((opportunity) => (
              <GraphLinkPill
                key={`${role.code}-${opportunity.id}`}
                href={buildScenarioHref(
                  "/opportunities",
                  scenarioId,
                  `opportunity-${opportunity.id}`,
                  locale,
                )}
                label={opportunity.title}
              />
            ))}
          </div>
        </div>
      ) : null}

      <p className="mt-4 break-words text-sm leading-7 text-alba-ink/65">
        {copy.sampleTitles}: {role.sampleTitles.join(" | ")}
      </p>

      <a
        href={role.officialUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-alba-forest transition hover:gap-3"
      >
        {copy.openOfficial}
        <ArrowUpRight className="h-4 w-4" />
      </a>
    </article>
  );
}
