"use client";

import { usePathname, useSearchParams } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { buildAppHref, resolveLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type LocalizedLabel = Record<Locale, string>;

type NavItemDefinition = {
  href: string;
  label: LocalizedLabel;
  preserveScenario?: boolean;
};

type NavSectionDefinition = {
  title: LocalizedLabel;
  description: LocalizedLabel;
  items: NavItemDefinition[];
};

const quickLinks: NavItemDefinition[] = [
  {
    href: "/",
    label: {
      en: "Home",
      it: "Home",
    },
    preserveScenario: true,
  },
  {
    href: "/infographic",
    label: {
      en: "Infographic",
      it: "Infografica",
    },
  },
  {
    href: "/evidence",
    label: {
      en: "Evidence",
      it: "Evidenze",
    },
  },
];

const phaseSections: NavSectionDefinition[] = [
  {
    title: {
      en: "Phase 1 · Awareness",
      it: "Fase 1 · Awareness",
    },
    description: {
      en: "Collect evidence, signals, and a first reading of what already exists.",
      it: "Raccogli evidenze, segnali e una prima lettura di cio' che esiste gia'.",
    },
    items: [
      {
        href: "/evidence",
        label: {
          en: "Evidence",
          it: "Evidenze",
        },
      },
      {
        href: "/patterns",
        label: {
          en: "Patterns",
          it: "Pattern",
        },
      },
      {
        href: "/why",
        label: {
          en: "Why",
          it: "Why",
        },
      },
    ],
  },
  {
    title: {
      en: "Phase 2 · Simulation",
      it: "Fase 2 · Simulation",
    },
    description: {
      en: "Translate the portfolio into ESCO/O*NET language and compare scenarios, Ikigai, and wellbeing.",
      it: "Traduce il portfolio nel linguaggio ESCO/O*NET e confronta scenari, Ikigai e wellbeing.",
    },
    items: [
      {
        href: "/ikigai",
        label: {
          en: "Ikigai",
          it: "Ikigai",
        },
        preserveScenario: true,
      },
      {
        href: "/wellbeing",
        label: {
          en: "Wellbeing",
          it: "Benessere",
        },
        preserveScenario: true,
      },
      {
        href: "/skills",
        label: {
          en: "Skills",
          it: "Skill",
        },
        preserveScenario: true,
      },
    ],
  },
  {
    title: {
      en: "Phase 3 · Activation",
      it: "Fase 3 · Activation",
    },
    description: {
      en: "Turn simulation outputs into opportunities, routines, experiments, and next moves.",
      it: "Trasforma gli output della simulation in opportunita', routine, esperimenti e prossime mosse.",
    },
    items: [
      {
        href: "/opportunities",
        label: {
          en: "Opportunities",
          it: "Opportunita'",
        },
        preserveScenario: true,
      },
      {
        href: "/experiments",
        label: {
          en: "Experiments",
          it: "Esperimenti",
        },
        preserveScenario: true,
      },
      {
        href: "/dossier",
        label: {
          en: "Dossier",
          it: "Dossier",
        },
        preserveScenario: true,
      },
    ],
  },
];

function isRouteActive(pathname: string, route: string) {
  return route === "/"
    ? pathname === "/"
    : pathname === route || pathname.startsWith(`${route}/`);
}

export function Navigation() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = resolveLocale(searchParams.get("lang"));
  const scenarioId = searchParams.get("scenario");
  const copy =
    locale === "it"
      ? {
          navigationLabel: "Navigazione",
          quickAccess: "Accesso rapido",
        }
      : {
          navigationLabel: "Navigation",
          quickAccess: "Quick access",
        };

  function buildHref(link: NavItemDefinition) {
    return buildAppHref(link.href, {
      locale,
      scenarioId: scenarioId && link.preserveScenario ? scenarioId : undefined,
    });
  }

  return (
    <nav className="mt-6 space-y-4">
      <div>
        <p className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-alba-forest/72">
          {copy.navigationLabel}
        </p>
        <div className="grid gap-3">
          <section className="rounded-[1.7rem] border border-alba-forest/10 bg-alba-cream/55 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-alba-forest/72">
              {copy.quickAccess}
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {quickLinks.map((item) => {
                const href = buildHref(item);
                const isActive = isRouteActive(pathname, item.href);

                return (
                  <a
                    key={item.href}
                    href={href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "inline-flex min-h-[3.4rem] touch-manipulation items-center justify-center rounded-2xl px-5 py-3 text-center text-sm font-semibold transition",
                      isActive
                        ? "bg-alba-forest text-white shadow-[0_12px_28px_rgba(29,48,41,0.18)]"
                        : "bg-white text-alba-ink shadow-[0_10px_30px_rgba(29,48,41,0.06)] hover:bg-white/95 hover:text-alba-forest",
                    )}
                  >
                    {item.label[locale]}
                  </a>
                );
              })}
            </div>
          </section>

          <div className="grid gap-3 xl:grid-cols-3">
            {phaseSections.map((section) => (
              <section
                key={section.title.en}
                className="rounded-[1.7rem] border border-alba-forest/10 bg-white/82 p-4 shadow-[0_10px_30px_rgba(29,48,41,0.04)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-alba-forest/72">
                  {section.title[locale]}
                </p>
                <p className="mt-2 text-sm leading-6 text-alba-ink/68">
                  {section.description[locale]}
                </p>

                <div className="mt-4 grid gap-2">
                  {section.items.map((item) => {
                    const href = buildHref(item);
                    const isActive = isRouteActive(pathname, item.href);

                    return (
                      <a
                        key={item.href}
                        href={href}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "inline-flex min-h-[3.4rem] touch-manipulation items-center justify-center rounded-2xl px-4 py-3 text-center text-sm font-medium transition",
                          isActive
                            ? "bg-alba-forest text-white shadow-[0_12px_28px_rgba(29,48,41,0.16)]"
                            : "bg-alba-cream/58 text-alba-ink hover:bg-alba-cream hover:text-alba-forest",
                        )}
                      >
                        {item.label[locale]}
                      </a>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
