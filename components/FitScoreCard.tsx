import type { FitMetrics } from "@/lib/types";
import type { Locale } from "@/lib/i18n";

type FitScoreCardProps = {
  title: string;
  scores: FitMetrics;
  note?: string;
  locale?: Locale;
};

export function FitScoreCard({ title, scores, note, locale = "en" }: FitScoreCardProps) {
  const labels: Array<{ key: keyof FitMetrics; label: string }> =
    locale === "it"
      ? [
          { key: "skillFit", label: "Fit skill" },
          { key: "purposeFit", label: "Fit purpose" },
          { key: "valuesFit", label: "Fit valori" },
          { key: "energyFit", label: "Fit energia" },
          { key: "workContextFit", label: "Fit contesto di lavoro" },
          { key: "wellbeingFit", label: "Fit benessere" },
          { key: "growthPotential", label: "Potenziale di crescita" },
        ]
      : [
          { key: "skillFit", label: "Skill fit" },
          { key: "purposeFit", label: "Purpose fit" },
          { key: "valuesFit", label: "Values fit" },
          { key: "energyFit", label: "Energy fit" },
          { key: "workContextFit", label: "Work-context fit" },
          { key: "wellbeingFit", label: "Wellbeing fit" },
          { key: "growthPotential", label: "Growth potential" },
        ];

  return (
    <article className="card-surface">
      <h3 className="font-heading text-2xl text-alba-ink">{title}</h3>

      <div className="mt-5 grid gap-3">
        {labels.map((item) => (
          <div key={item.key}>
            <div className="mb-1 flex items-center justify-between text-sm text-alba-ink/70">
              <span>{item.label}</span>
              <span>{scores[item.key]}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-alba-cream">
              <div
                className="h-full rounded-full bg-gradient-to-r from-alba-clay via-alba-gold to-alba-forest"
                style={{ width: `${scores[item.key]}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {note ? <p className="mt-5 text-sm leading-7 text-alba-ink/65">{note}</p> : null}
    </article>
  );
}
