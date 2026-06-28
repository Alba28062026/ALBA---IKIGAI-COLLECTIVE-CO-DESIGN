"use client";

import { usePathname, useSearchParams } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { resolveLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type LanguageToggleProps = {
  className?: string;
};

const options: Array<{ label: string; value: Locale }> = [
  { label: "IT", value: "it" },
  { label: "EN", value: "en" },
];

export function LanguageToggle({ className }: LanguageToggleProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLocale = resolveLocale(searchParams.get("lang"));

  function buildLocaleHref(nextLocale: Locale) {
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.set("lang", nextLocale);
    const query = nextParams.toString();

    return `${pathname}${query ? `?${query}` : ""}`;
  }

  const copy = {
    en: {
      label: "Language",
    },
    it: {
      label: "Lingua",
    },
  }[currentLocale];

  return (
    <div
      className={cn(
        "relative z-[60] isolate flex w-full items-center justify-between gap-3 rounded-2xl border border-alba-forest/14 bg-white/95 px-3 py-2 shadow-[0_10px_25px_rgba(29,48,41,0.08)] sm:w-auto",
        className,
      )}
      aria-label="Language selector"
      role="group"
    >
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-alba-forest/72">
        {copy.label}
      </span>
      <div className="grid grid-cols-2 gap-2">
        {options.map((option) => (
          <a
            key={option.value}
            href={buildLocaleHref(option.value)}
            aria-current={option.value === currentLocale ? "page" : undefined}
            className={cn(
              "inline-flex min-h-11 min-w-[4.4rem] touch-manipulation items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition",
              option.value === currentLocale
                ? "bg-alba-forest text-white shadow-[0_10px_20px_rgba(29,48,41,0.16)]"
                : "bg-alba-cream/72 text-alba-ink hover:bg-alba-cream hover:text-alba-forest",
            )}
            title={option.value === "it" ? "Italiano" : "English"}
          >
            {option.label}
          </a>
        ))}
      </div>
    </div>
  );
}
