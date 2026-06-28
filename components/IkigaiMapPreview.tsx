import type { IkigaiMap } from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type IkigaiMapPreviewProps = {
  focusLabel?: string;
  focusSummary?: string;
  highlightedItems?: string[];
  locale?: Locale;
  map: IkigaiMap;
};

export function IkigaiMapPreview({
  focusLabel,
  focusSummary,
  highlightedItems = [],
  locale = "en",
  map,
}: IkigaiMapPreviewProps) {
  const highlightedSet = new Set(highlightedItems);
  const copy = {
    en: {
      eyebrow: "Ikigai",
      title: "Dynamic map, not a static test.",
      scenarioFocus: "Scenario focus",
      emptyItems: "No mapped items yet.",
      loves: "What I love",
      strengths: "What I am good at",
      worldNeeds: "What the world needs",
      paidFor: "What can sustain my life",
    },
    it: {
      eyebrow: "Ikigai",
      title: "Mappa dinamica, non test statico.",
      scenarioFocus: "Focus scenario",
      emptyItems: "Ancora nessun elemento mappato.",
      loves: "Cio' che amo",
      strengths: "Cio' in cui sono bravo",
      worldNeeds: "Cio' di cui il mondo ha bisogno",
      paidFor: "Cio' che puo' sostenere la mia vita",
    },
  }[locale];
  const quadrants = [
    { title: copy.loves, items: map.loves, accent: "bg-alba-rose/60" },
    { title: copy.strengths, items: map.strengths, accent: "bg-alba-cream/70" },
    { title: copy.worldNeeds, items: map.worldNeeds, accent: "bg-[#dff0ea]" },
    { title: copy.paidFor, items: map.paidFor, accent: "bg-[#efe6c8]" },
  ];

  return (
    <section className="card-surface">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 className="mt-3 font-heading text-3xl text-alba-ink">{copy.title}</h2>
          <p className="mt-4 text-sm leading-7 text-alba-ink/72">{map.note}</p>
        </div>

        <div className="rounded-[1.8rem] bg-alba-ink px-5 py-4 text-sm text-white/82 lg:max-w-sm">
          {focusLabel ? (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/62">
              {focusLabel}
            </p>
          ) : null}
          <p className={cn("leading-7", focusLabel ? "mt-3" : "")}>
            {focusSummary ?? map.centerOfGravity}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {quadrants.map((quadrant) => (
          <div key={quadrant.title} className={`rounded-[1.75rem] p-5 ${quadrant.accent}`}>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-alba-ink/70">
                {quadrant.title}
              </h3>
              {quadrant.items.some((item) => highlightedSet.has(item)) ? (
                <span className="rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-alba-ink/62">
                  {copy.scenarioFocus}
                </span>
              ) : null}
            </div>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-alba-ink/80">
              {quadrant.items.length > 0 ? (
                quadrant.items.map((item) => (
                  <li
                    key={item}
                    className={cn(
                      "rounded-2xl px-3 py-2 transition",
                      highlightedSet.has(item) ? "bg-white/72 font-medium text-alba-ink" : "",
                    )}
                  >
                    - {item}
                  </li>
                ))
              ) : (
                <li className="rounded-2xl bg-white/55 px-3 py-2 text-alba-ink/58">
                  - {copy.emptyItems}
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
