import Link from "next/link";
import { notFound } from "next/navigation";
import { buildAppHref, resolveLocale } from "@/lib/i18n";
import {
  getLocalizedEvidence,
  getLocalizedPatternsForEvidence,
  getLocalizedSignalsForEvidence,
} from "@/lib/localized-data";

type EvidenceDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    lang?: string | string[];
  }>;
};

export default async function EvidenceDetailPage({
  params,
  searchParams,
}: EvidenceDetailPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const locale = resolveLocale(query?.lang);
  const evidence = getLocalizedEvidence(locale).find((item) => item.id === id);

  if (!evidence) {
    notFound();
  }

  const signals = getLocalizedSignalsForEvidence(locale, id);
  const patterns = getLocalizedPatternsForEvidence(locale, id);
  const copy = {
    en: {
      back: "Back to evidence",
      confidence: "Confidence",
      linkedSignals: "Linked signals",
      linkedPatterns: "Linked patterns",
    },
    it: {
      back: "Torna alle evidenze",
      confidence: "Confidenza",
      linkedSignals: "Segnali collegati",
      linkedPatterns: "Pattern collegati",
    },
  }[locale];

  return (
    <div className="space-y-8">
      <section className="card-surface">
        <Link href={buildAppHref("/evidence", { locale })} className="eyebrow">
          {copy.back}
        </Link>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <h2 className="font-heading text-4xl text-alba-ink">{evidence.title}</h2>
            <p className="mt-4 text-sm leading-7 text-alba-ink/72">{evidence.summary}</p>
          </div>
          <div className="rounded-[1.5rem] bg-alba-cream/75 px-5 py-4 text-sm text-alba-ink/72">
            <p>{evidence.sourceType}</p>
            <p className="mt-2">{evidence.dateLabel}</p>
            <p className="mt-2">
              {copy.confidence} {evidence.confidence}/10
            </p>
          </div>
        </div>

        {evidence.note ? (
          <div className="mt-6 rounded-[1.6rem] bg-white/82 p-4 text-sm leading-7 text-alba-ink/72">
            {evidence.note}
          </div>
        ) : null}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card-surface">
          <p className="eyebrow">{copy.linkedSignals}</p>
          <div className="mt-5 space-y-4">
            {signals.map((signal) => (
              <div key={signal.id} className="rounded-[1.5rem] bg-white/78 p-4">
                <p className="font-semibold text-alba-ink">{signal.title}</p>
                <p className="mt-2 text-sm leading-7 text-alba-ink/72">{signal.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card-surface">
          <p className="eyebrow">{copy.linkedPatterns}</p>
          <div className="mt-5 space-y-4">
            {patterns.map((pattern) => (
              <div key={pattern.id} className="rounded-[1.5rem] bg-alba-cream/78 p-4">
                <p className="font-semibold text-alba-ink">{pattern.title}</p>
                <p className="mt-2 text-sm leading-7 text-alba-ink/72">{pattern.summary}</p>
                <p className="mt-3 text-sm text-alba-ink/58">{pattern.validationQuestion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
