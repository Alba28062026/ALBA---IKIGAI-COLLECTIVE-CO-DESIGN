import Link from "next/link";
import { ArrowRight, Compass, Network, Sparkles } from "lucide-react";
import {
  buildScenarioHref,
  scenariosMock,
} from "@/lib/mock-data";
import type { Locale } from "@/lib/i18n";
import { getLocalizedPrimaryOpportunityForScenario } from "@/lib/localized-data";
import type { Scenario } from "@/lib/types";
import { cn } from "@/lib/utils";

type ScenarioContextBarProps = {
  activeScenario: Scenario;
  basePath: string;
  description: string;
  eyebrow?: string;
  links?: Array<{
    href: string;
    label: string;
  }>;
  locale?: Locale;
  scenarios?: Scenario[];
  title: string;
};

function compactScenarioLabel(title: string) {
  return title.replace(/^Scenario \d+ - /i, "");
}

export function ScenarioContextBar({
  activeScenario,
  basePath,
  description,
  eyebrow = "Active scenario",
  links = [],
  locale = "en",
  scenarios = scenariosMock,
  title,
}: ScenarioContextBarProps) {
  const copy = {
    en: {
      defaultEyebrow: "Active scenario",
      hypothesisInFocus: "Hypothesis in focus",
      horizon: "Horizon",
      wellbeingShift: "Wellbeing shift",
      patternToValidate: "Pattern to validate",
      onetBridge: "O*NET bridge",
      toDefine: "To define",
      noOpportunity: "The active scenario does not have a linked mock opportunity yet.",
    },
    it: {
      defaultEyebrow: "Scenario attivo",
      hypothesisInFocus: "Ipotesi in focus",
      horizon: "Orizzonte",
      wellbeingShift: "Shift di benessere",
      patternToValidate: "Pattern da validare",
      onetBridge: "Ponte O*NET",
      toDefine: "Da definire",
      noOpportunity: "Lo scenario attivo non ha ancora un'opportunita' mock collegata.",
    },
  }[locale];
  const focusedOpportunity = getLocalizedPrimaryOpportunityForScenario(locale, activeScenario.id);

  return (
    <section className="card-surface overflow-hidden bg-[linear-gradient(135deg,rgba(255,255,255,0.94),rgba(245,238,223,0.92))]">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow">{eyebrow === "Active scenario" ? copy.defaultEyebrow : eyebrow}</p>
            <h2 className="mt-3 font-heading text-3xl text-alba-ink sm:text-4xl">{title}</h2>
            <p className="mt-4 text-sm leading-7 text-alba-ink/72">{description}</p>
          </div>

          <div className="rounded-[1.6rem] bg-alba-ink p-4 text-white xl:max-w-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/62">
              {copy.hypothesisInFocus}
            </p>
            <h3 className="mt-3 font-heading text-2xl">{activeScenario.title}</h3>
            <p className="mt-2 text-sm leading-7 text-white/82">{activeScenario.thesis}</p>
          </div>
        </div>

        <div className="grid gap-2 sm:flex sm:flex-wrap">
          {scenarios.map((scenario) => {
            const isActive = scenario.id === activeScenario.id;

            return (
              <Link
                key={scenario.id}
                href={buildScenarioHref(basePath, scenario.id, undefined, locale)}
                className={cn(
                  "inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition",
                  isActive
                    ? "bg-alba-forest text-white shadow-lg shadow-alba-forest/15"
                    : "border border-alba-forest/15 bg-white/86 text-alba-forest hover:bg-white",
                )}
              >
                {compactScenarioLabel(scenario.title)}
              </Link>
            );
          })}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-[1.6rem] bg-white/82 p-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#efe6c8] text-alba-clay">
                <Compass className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alba-clay/80">
                  {copy.horizon}
                </p>
                <p className="text-sm font-medium text-alba-ink">{activeScenario.horizon}</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-7 text-alba-ink/72">{activeScenario.ikigaiSignal}</p>
          </div>

          <div className="rounded-[1.6rem] bg-white/82 p-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-alba-rose/72 text-alba-clay">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alba-clay/80">
                  {copy.wellbeingShift}
                </p>
                <p className="text-sm font-medium text-alba-ink">{copy.patternToValidate}</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-7 text-alba-ink/72">
              {activeScenario.wellbeingShift}
            </p>
          </div>

          <div className="rounded-[1.6rem] bg-white/82 p-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#dff0ea] text-alba-forest">
                <Network className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-alba-clay/80">
                  {copy.onetBridge}
                </p>
                <p className="text-sm font-medium text-alba-ink">
                  {focusedOpportunity?.title ?? copy.toDefine}
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-7 text-alba-ink/72">
              {focusedOpportunity?.note ?? copy.noOpportunity}
            </p>
          </div>
        </div>

        {links.length ? (
          <div className="grid gap-3 sm:flex sm:flex-wrap">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-alba-forest/15 bg-white/86 px-4 py-2 text-sm font-semibold text-alba-forest transition hover:bg-white"
              >
                {link.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
