import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";
import type { OnetOpportunityLink } from "@/lib/types";

type OnetRoleCardProps = {
  locale?: Locale;
  role: OnetOpportunityLink;
};

export function OnetRoleCard({ locale = "en", role }: OnetRoleCardProps) {
  const copy = {
    en: {
      brightOutlook: "Bright Outlook",
      coreMatch: "Core match",
      adjacentMatch: "Adjacent match",
      whyItConnects: "Why it connects to Alba",
      sampleTitles: "Sample titles",
      openOfficial: "Open official O*NET profile",
    },
    it: {
      brightOutlook: "Bright Outlook",
      coreMatch: "Match centrale",
      adjacentMatch: "Match adiacente",
      whyItConnects: "Perche' si collega ad Alba",
      sampleTitles: "Titoli di esempio",
      openOfficial: "Apri profilo O*NET ufficiale",
    },
  }[locale];
  const alignmentLabel = role.alignment === "Core match" ? copy.coreMatch : copy.adjacentMatch;

  return (
    <article className="rounded-[1.6rem] border border-alba-forest/10 bg-white/85 p-4 shadow-[0_18px_40px_rgba(29,48,41,0.05)]">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-[#dff0ea] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-alba-forest">
          O*NET OnLine
        </span>
        <span className="rounded-full bg-alba-cream px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-alba-clay">
          {alignmentLabel}
        </span>
        {role.brightOutlook ? (
          <span className="rounded-full bg-alba-rose/75 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-alba-clay">
            {copy.brightOutlook}
          </span>
        ) : null}
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alba-ink/48">
          {role.code} · {role.updatedLabel}
        </p>
        <h4 className="mt-2 font-heading text-2xl text-alba-ink">{role.title}</h4>
        <p className="mt-3 text-sm leading-7 text-alba-ink/72">{role.summary}</p>
      </div>

      <div className="mt-4 rounded-[1.4rem] bg-alba-cream/72 p-4 text-sm leading-7 text-alba-ink/74">
        <p className="font-semibold text-alba-ink">{copy.whyItConnects}</p>
        <p className="mt-2">{role.whyAligned}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {role.albaOverlap.map((item) => (
          <span
            key={item}
            className="rounded-full border border-alba-forest/12 bg-white px-3 py-1 text-xs text-alba-forest"
          >
            {item}
          </span>
        ))}
      </div>

      <p className="mt-4 break-words text-sm text-alba-ink/58">
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
