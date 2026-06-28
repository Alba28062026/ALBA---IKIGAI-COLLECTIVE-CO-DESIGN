import type { Locale } from "@/lib/i18n";
import type { LiveOpportunityPipeline } from "@/lib/types";
import { cn } from "@/lib/utils";

type LiveOpportunityPipelineCardProps = {
  locale?: Locale;
  pipeline: LiveOpportunityPipeline;
};

function statusClasses(status: LiveOpportunityPipeline["esco"]["status"]) {
  if (status === "live") {
    return "bg-[#dff0ea] text-alba-forest";
  }

  if (status === "unavailable") {
    return "bg-alba-rose/70 text-alba-clay";
  }

  return "bg-[#efe6c8] text-alba-clay";
}

export function LiveOpportunityPipelineCard({
  locale = "en",
  pipeline,
}: LiveOpportunityPipelineCardProps) {
  const copy = {
    en: {
      eyebrow: "Live opportunity pipeline",
      title: "Official taxonomies, with stable fallback.",
      searchedAt: "Last refresh",
      esco: "ESCO",
      onet: "O*NET",
      live: "Live",
      fallback: "Fallback",
      unavailable: "Unavailable",
      openSource: "Open source",
      credentialsReady: "Credentials configured",
      credentialsMissing: "Credentials missing",
      bridgeSummary: "Why this matters",
    },
    it: {
      eyebrow: "Pipeline live delle opportunita'",
      title: "Tassonomie ufficiali, con fallback stabile.",
      searchedAt: "Ultimo refresh",
      esco: "ESCO",
      onet: "O*NET",
      live: "Live",
      fallback: "Fallback",
      unavailable: "Non disponibile",
      openSource: "Apri fonte",
      credentialsReady: "Credenziali configurate",
      credentialsMissing: "Credenziali mancanti",
      bridgeSummary: "Perche' conta",
    },
  }[locale];

  const statusLabel = {
    live: copy.live,
    fallback: copy.fallback,
    unavailable: copy.unavailable,
  };

  return (
    <section className="card-surface space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h3 className="mt-3 font-heading text-3xl text-alba-ink">{copy.title}</h3>
          <p className="mt-3 text-sm leading-7 text-alba-ink/72">
            {pipeline.query} · {copy.searchedAt}: {pipeline.searchedAt}
          </p>
        </div>

        <div
          className={cn(
            "inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2 text-sm font-semibold",
            pipeline.onet.credentialsConfigured
              ? "bg-[#dff0ea] text-alba-forest"
              : "bg-[#efe6c8] text-alba-clay",
          )}
        >
          {pipeline.onet.credentialsConfigured ? copy.credentialsReady : copy.credentialsMissing}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <article className="rounded-[1.5rem] border border-alba-forest/10 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-heading text-2xl text-alba-ink">{copy.esco}</h4>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
                statusClasses(pipeline.esco.status),
              )}
            >
              {statusLabel[pipeline.esco.status]}
            </span>
          </div>
          <p className="mt-3 text-sm leading-7 text-alba-ink/72">{pipeline.esco.note}</p>

          <div className="mt-4 space-y-3">
            {pipeline.esco.items.map((item) => (
              <div key={item.uri} className="rounded-2xl border border-alba-forest/8 bg-alba-cream/36 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alba-forest/72">
                  {item.code ?? item.language.toUpperCase()}
                </p>
                <h5 className="mt-2 text-base font-semibold text-alba-ink">{item.title}</h5>
                <a
                  href={item.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex min-h-10 items-center rounded-full border border-alba-forest/12 bg-white px-4 py-2 text-sm font-medium text-alba-forest transition hover:bg-alba-cream/72"
                >
                  {copy.openSource}
                </a>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[1.5rem] border border-alba-forest/10 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-heading text-2xl text-alba-ink">{copy.onet}</h4>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]",
                statusClasses(pipeline.onet.status),
              )}
            >
              {statusLabel[pipeline.onet.status]}
            </span>
          </div>
          <p className="mt-3 text-sm leading-7 text-alba-ink/72">{pipeline.onet.note}</p>

          <div className="mt-4 space-y-3">
            {pipeline.onet.items.map((item) => (
              <div key={`${item.code}-${item.source}`} className="rounded-2xl border border-alba-forest/8 bg-alba-cream/36 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alba-forest/72">
                  {item.code}
                </p>
                <h5 className="mt-2 text-base font-semibold text-alba-ink">{item.title}</h5>
                <a
                  href={item.officialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-flex min-h-10 items-center rounded-full border border-alba-forest/12 bg-white px-4 py-2 text-sm font-medium text-alba-forest transition hover:bg-alba-cream/72"
                >
                  {copy.openSource}
                </a>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="rounded-[1.5rem] bg-alba-ink p-5 text-white">
        <p className="eyebrow text-white/70">{copy.bridgeSummary}</p>
        <ul className="mt-3 space-y-2 text-sm leading-7 text-white/82">
          {pipeline.bridgeSummary.map((item) => (
            <li key={item}>- {item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
