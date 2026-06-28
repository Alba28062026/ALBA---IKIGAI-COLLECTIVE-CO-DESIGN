import type { Locale } from "@/lib/i18n";
import type { DigitalTwinAgentReport } from "@/lib/types";

type DigitalTwinAgentCardProps = {
  locale?: Locale;
  report: DigitalTwinAgentReport;
};

export function DigitalTwinAgentCard({
  locale = "en",
  report,
}: DigitalTwinAgentCardProps) {
  const copy = {
    en: {
      eyebrow: "Digital twin agent",
      objective: "Objective",
      sources: "Dummy sources already watched",
      signals: "Signals extracted",
      nextActions: "Next automatic actions",
      suggestedInputs: "Best next user inputs",
    },
    it: {
      eyebrow: "Agente digital twin",
      objective: "Obiettivo",
      sources: "Fonti dummy gia' osservate",
      signals: "Segnali estratti",
      nextActions: "Prossime azioni automatiche",
      suggestedInputs: "Input utente piu' utili adesso",
    },
  }[locale];

  return (
    <section className="card-surface space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h3 className="mt-3 font-heading text-3xl text-alba-ink">{report.title}</h3>
          <p className="mt-3 text-sm leading-7 text-alba-ink/72">{report.objective}</p>
        </div>
        <div className="rounded-full bg-[#dff0ea] px-4 py-2 text-sm font-semibold text-alba-forest">
          {report.lastRunLabel}
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
        <div className="space-y-4">
          <div className="rounded-[1.5rem] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alba-forest/72">
              {copy.sources}
            </p>
            <div className="mt-4 space-y-3">
              {report.sources.map((source) => (
                <div key={source.id} className="rounded-2xl border border-alba-forest/8 bg-alba-cream/32 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="text-base font-semibold text-alba-ink">{source.title}</h4>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-alba-forest">
                      {source.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-alba-ink/72">{source.note}</p>
                  <p className="mt-2 text-xs text-alba-ink/58">{source.coverage.join(" · ")}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alba-forest/72">
              {copy.signals}
            </p>
            <div className="mt-4 space-y-3">
              {report.signals.map((signal) => (
                <div key={signal.id} className="rounded-2xl border border-alba-forest/8 bg-alba-cream/32 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="text-base font-semibold text-alba-ink">{signal.title}</h4>
                    <span className="text-sm text-alba-ink/58">{signal.confidence}/10</span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-alba-ink/72">{signal.summary}</p>
                  <p className="mt-2 text-xs text-alba-ink/58">{signal.targetAreas.join(" · ")}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.5rem] bg-alba-ink p-5 text-white">
            <p className="eyebrow text-white/70">{copy.suggestedInputs}</p>
            <ul className="mt-3 space-y-2 text-sm leading-7 text-white/82">
              {report.suggestedInputs.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-[1.5rem] bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alba-forest/72">
              {copy.nextActions}
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-alba-ink/72">
              {report.nextActions.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-7 text-alba-ink/58">{report.guardrail}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
