import { EmptyStateNotice } from "@/components/EmptyStateNotice";
import { buildAppHref } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n";
import { getLocalizedPatterns, getLocalizedWhy } from "@/lib/localized-data";

type WhyPageProps = {
  searchParams?: Promise<{
    lang?: string | string[];
  }>;
};

export default async function WhyPage({ searchParams }: WhyPageProps) {
  const params = await searchParams;
  const locale = resolveLocale(params?.lang);
  const why = getLocalizedWhy(locale);
  const patterns = getLocalizedPatterns(locale);
  const linkedPatterns = patterns.filter((pattern) =>
    why.linkedPatternIds.includes(pattern.id),
  );
  const copy = {
    en: {
      eyebrow: "WHY hypothesis",
      confidence: "Confidence",
      cautiousReading: "Cautious reading",
      readWhy: "How to read the WHY",
      linkedPatterns: "Linked patterns",
      emptyTitle: "No WHY hypothesis yet.",
      emptyDescription:
        "ALBA drafts the WHY only after enough evidence and patterns exist. In this blank demo state, the WHY stays intentionally empty.",
    },
    it: {
      eyebrow: "Ipotesi WHY",
      confidence: "Confidenza",
      cautiousReading: "Lettura cauta",
      readWhy: "Come leggere il WHY",
      linkedPatterns: "Pattern collegati",
      emptyTitle: "Ancora nessuna ipotesi WHY.",
      emptyDescription:
        "ALBA formula il WHY solo dopo che esistono abbastanza evidenze e pattern. In questo stato vuoto della demo, il WHY resta intenzionalmente non compilato.",
    },
  }[locale];

  if (why.confidence === 0) {
    return (
      <div className="space-y-8">
        <EmptyStateNotice
          ctaHref={buildAppHref("/patterns", { locale })}
          ctaLabel={locale === "it" ? "Apri Pattern" : "Open Patterns"}
          description={copy.emptyDescription}
          locale={locale}
          title={copy.emptyTitle}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="card-surface bg-alba-ink text-white">
        <p className="eyebrow text-white/70">{copy.eyebrow}</p>
        <h2 className="mt-3 font-heading text-4xl">{why.title}</h2>
        <p className="mt-5 max-w-3xl text-base leading-8 text-white/84">{why.statement}</p>
        <div className="mt-6 flex flex-wrap gap-3 text-sm text-white/78">
          <span className="rounded-full bg-white/10 px-4 py-2">
            {copy.confidence} {why.confidence}/10
          </span>
          <span className="rounded-full bg-white/10 px-4 py-2">{why.status}</span>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)]">
        <div className="card-surface">
          <p className="eyebrow">{copy.cautiousReading}</p>
          <h3 className="mt-3 font-heading text-3xl text-alba-ink">{copy.readWhy}</h3>
          <p className="mt-4 text-sm leading-7 text-alba-ink/72">{why.evidenceNote}</p>
        </div>

        <div className="card-surface">
          <p className="eyebrow">{copy.linkedPatterns}</p>
          <div className="mt-5 space-y-4">
            {linkedPatterns.map((pattern) => (
              <div key={pattern.id} className="rounded-[1.5rem] bg-white/78 p-4">
                <p className="font-semibold text-alba-ink">{pattern.title}</p>
                <p className="mt-2 text-sm leading-7 text-alba-ink/72">{pattern.summary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
