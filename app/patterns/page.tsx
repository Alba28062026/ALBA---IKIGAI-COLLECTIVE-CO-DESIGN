import { EmptyStateNotice } from "@/components/EmptyStateNotice";
import { buildAppHref } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n";
import { getLocalizedPatterns, getLocalizedSignals } from "@/lib/localized-data";

type PatternsPageProps = {
  searchParams?: Promise<{
    lang?: string | string[];
  }>;
};

export default async function PatternsPage({ searchParams }: PatternsPageProps) {
  const params = await searchParams;
  const locale = resolveLocale(params?.lang);
  const patterns = getLocalizedPatterns(locale);
  const signals = getLocalizedSignals(locale);
  const copy = {
    en: {
      eyebrow: "Pattern layer",
      title: "Signal clusters to validate, not definitive labels.",
      description:
        "Here Alba connects observable signals to narrative patterns that help decide which scenarios deserve more attention.",
      confidence: "Confidence",
      validationQuestion: "Validation question",
      signalsInventory: "Signals inventory",
      emptyTitle: "No patterns to validate yet.",
      emptyDescription:
        "Patterns appear only after enough evidence and signals exist. Start from Phase 1 evidence before expecting scenario-level readings.",
    },
    it: {
      eyebrow: "Layer pattern",
      title: "Cluster di segnali da validare, non etichette definitive.",
      description:
        "Qui Alba collega segnali osservabili e pattern narrativi che aiutano a capire quali scenari meritano piu' attenzione.",
      confidence: "Confidenza",
      validationQuestion: "Domanda di validazione",
      signalsInventory: "Inventario segnali",
      emptyTitle: "Ancora nessun pattern da validare.",
      emptyDescription:
        "I pattern emergono solo quando esistono abbastanza evidenze e segnali. Parti dalle evidenze di fase 1 prima di aspettarti letture di livello scenario.",
    },
  }[locale];

  return (
    <div className="space-y-8">
      <section className="card-surface">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2 className="mt-3 font-heading text-4xl text-alba-ink">{copy.title}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-alba-ink/72">{copy.description}</p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-5">
          {patterns.length > 0 ? (
            patterns.map((pattern) => (
              <article key={pattern.id} className="card-surface">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="max-w-3xl">
                    <p className="eyebrow">{pattern.status}</p>
                    <h3 className="mt-3 font-heading text-3xl text-alba-ink">{pattern.title}</h3>
                    <p className="mt-4 text-sm leading-7 text-alba-ink/72">{pattern.summary}</p>
                  </div>
                  <div className="rounded-[1.5rem] bg-alba-cream/75 px-4 py-3 text-sm text-alba-ink/68">
                    {copy.confidence} {pattern.confidence}/10
                  </div>
                </div>

                <div className="mt-6 rounded-[1.5rem] bg-white/78 p-4 text-sm leading-7 text-alba-ink/72">
                  <p className="font-medium text-alba-ink">{copy.validationQuestion}</p>
                  <p className="mt-2">{pattern.validationQuestion}</p>
                </div>
              </article>
            ))
          ) : (
            <EmptyStateNotice
              ctaHref={buildAppHref("/evidence", { locale })}
              ctaLabel={locale === "it" ? "Apri Evidence" : "Open Evidence"}
              description={copy.emptyDescription}
              locale={locale}
              title={copy.emptyTitle}
            />
          )}
        </div>

        <aside className="card-surface">
          <p className="eyebrow">{copy.signalsInventory}</p>
          <div className="mt-5 space-y-4">
            {signals.length > 0 ? (
              signals.map((signal) => (
                <div key={signal.id} className="rounded-[1.5rem] bg-white/80 p-4">
                  <p className="font-semibold text-alba-ink">{signal.title}</p>
                  <p className="mt-2 text-sm leading-7 text-alba-ink/72">{signal.description}</p>
                </div>
              ))
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-alba-forest/18 bg-white/78 p-4 text-sm leading-7 text-alba-ink/68">
                {copy.emptyDescription}
              </div>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}
