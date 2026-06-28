import type { PortfolioSummary as PortfolioSummaryType } from "@/lib/types";
import type { Locale } from "@/lib/i18n";

type PortfolioSummaryProps = {
  summary: PortfolioSummaryType;
  locale?: Locale;
};

export function PortfolioSummary({ summary, locale = "en" }: PortfolioSummaryProps) {
  const copy = {
    en: {
      eyebrow: "Portable Human Portfolio",
      title: "Unified view of skills, values, purpose, and wellbeing baseline.",
      flowPatterns: "Flow patterns",
      expressed: "Expressed skills",
      latent: "Latent skills",
      strategic: "Strategic skills",
      values: "Guiding values",
      interests: "Interests and passions",
      constraints: "Personal constraints",
    },
    it: {
      eyebrow: "Portable Human Portfolio",
      title: "Vista unificata di skill, valori, purpose e baseline di benessere.",
      flowPatterns: "Pattern di flow",
      expressed: "Skill espresse",
      latent: "Skill latenti",
      strategic: "Skill strategiche",
      values: "Valori guida",
      interests: "Interessi e passioni",
      constraints: "Vincoli personali",
    },
  }[locale];

  const groups = [
    { title: copy.expressed, items: summary.expressedSkills },
    { title: copy.latent, items: summary.latentSkills },
    { title: copy.strategic, items: summary.strategicSkills },
    { title: copy.values, items: summary.values },
    { title: copy.interests, items: [...summary.interests, ...summary.passions] },
    { title: copy.constraints, items: summary.constraints },
  ];

  return (
    <section className="card-surface">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 className="mt-3 font-heading text-3xl text-alba-ink">{copy.title}</h2>
          <p className="mt-4 text-sm leading-7 text-alba-ink/72">{summary.why}</p>
        </div>

        <div className="rounded-[1.75rem] bg-alba-ink p-5 text-white lg:max-w-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
            {copy.flowPatterns}
          </p>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-white/82">
            {summary.flowPatterns.map((pattern) => (
              <li key={pattern}>- {pattern}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => (
          <div key={group.title} className="rounded-[1.75rem] bg-white/75 p-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-alba-forest/70">
              {group.title}
            </h3>
            <ul className="mt-4 space-y-2 text-sm leading-7 text-alba-ink/78">
              {group.items.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
