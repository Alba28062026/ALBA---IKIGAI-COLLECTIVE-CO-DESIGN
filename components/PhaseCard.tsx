import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";

type PhaseCardProps = {
  phase: string;
  title: string;
  description: string;
  inputs: string[];
  outputs: string[];
  href: string;
  locale?: Locale;
};

export function PhaseCard({
  phase,
  title,
  description,
  inputs,
  outputs,
  href,
  locale = "en",
}: PhaseCardProps) {
  const copy = {
    en: {
      journey: "Journey",
      input: "Input",
      output: "Output",
      cta: "Open related area",
    },
    it: {
      journey: "Journey",
      input: "Input",
      output: "Output",
      cta: "Apri area collegata",
    },
  }[locale];

  return (
    <Link
      href={href}
      className="card-surface group flex h-full flex-col gap-5 transition hover:-translate-y-0.5 hover:bg-white/90"
      aria-label={`${title} - ${copy.cta}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow">{phase}</p>
          <h2 className="mt-3 font-heading text-2xl text-alba-ink">{title}</h2>
        </div>
        <div className="rounded-2xl bg-alba-rose/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-alba-clay">
          {copy.journey}
        </div>
      </div>

      <p className="text-sm leading-7 text-alba-ink/72">{description}</p>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl bg-white/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-alba-forest/70">
            {copy.input}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-alba-ink/75">
            {inputs.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl bg-alba-cream/75 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-alba-clay/80">
            {copy.output}
          </p>
          <ul className="mt-3 space-y-2 text-sm text-alba-ink/75">
            {outputs.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-alba-forest/15 bg-white/88 px-4 py-3 text-sm font-semibold text-alba-forest transition group-hover:bg-alba-cream/70 group-hover:gap-3">
        {copy.cta}
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}
