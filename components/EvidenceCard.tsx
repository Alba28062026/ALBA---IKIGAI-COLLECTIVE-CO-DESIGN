import Link from "next/link";
import { buildAppHref } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n";
import type { Evidence } from "@/lib/types";

type EvidenceCardProps = {
  evidence: Evidence;
  locale?: Locale;
};

export function EvidenceCard({ evidence, locale = "en" }: EvidenceCardProps) {
  const copy = {
    en: {
      confidence: "Confidence",
      mockLinks: "Mock links",
      signal: "Signal",
      pattern: "Pattern",
      openDetail: "Open detail",
    },
    it: {
      confidence: "Confidenza",
      mockLinks: "Link mock",
      signal: "Segnale",
      pattern: "Pattern",
      openDetail: "Apri dettaglio",
    },
  }[locale];

  return (
    <Link
      href={buildAppHref(`/evidence/${evidence.id}`, { locale })}
      className="card-surface group flex h-full flex-col gap-4 transition hover:-translate-y-0.5 hover:bg-white/90"
      aria-label={`${evidence.title} - ${copy.openDetail}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full bg-alba-rose/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-alba-clay">
          {evidence.sourceType}
        </span>
        <span className="text-sm text-alba-ink/55">
          {copy.confidence} {evidence.confidence}/10
        </span>
      </div>

      <div>
        <h3 className="font-heading text-2xl text-alba-ink">{evidence.title}</h3>
        <p className="mt-2 text-sm text-alba-ink/55">{evidence.dateLabel}</p>
      </div>

      <p className="text-sm leading-7 text-alba-ink/72">{evidence.summary}</p>

      <div className="flex flex-wrap gap-2">
        {evidence.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-alba-forest/15 bg-white/70 px-3 py-1 text-xs text-alba-forest"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="rounded-3xl bg-alba-cream/70 p-4 text-sm text-alba-ink/72">
        <p className="font-medium text-alba-ink">{copy.mockLinks}</p>
        <p className="mt-2">
          {copy.signal}: {evidence.linkedSignalIds.length}
        </p>
        <p>
          {copy.pattern}: {evidence.linkedPatternIds.length}
        </p>
      </div>

      <div className="mt-auto inline-flex min-h-12 items-center justify-center rounded-2xl border border-alba-forest/15 bg-white/88 px-4 py-3 text-sm font-semibold text-alba-forest transition group-hover:bg-alba-cream/70">
        {copy.openDetail}
      </div>
    </Link>
  );
}
