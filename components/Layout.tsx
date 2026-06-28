"use client";

import { Suspense, type ReactNode } from "react";
import { Compass, ShieldCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Navigation } from "@/components/Navigation";
import { resolveLocale } from "@/lib/i18n";

type LayoutProps = {
  children: ReactNode;
};

function LayoutInner({ children }: LayoutProps) {
  const searchParams = useSearchParams();
  const locale = resolveLocale(searchParams.get("lang"));
  const copy =
    locale === "it"
      ? {
          badge: "Alba Prototype",
          privacy:
            "Nessun login, nessuna analytics, nessun cloud pubblico. Tutto il prototipo resta locale e ogni insight viene presentato come ipotesi da validare.",
          title: "Portable Human Portfolio per life crafting e career crafting.",
          subtitle:
            "Web app locale, single-user e privacy-first per raccogliere evidenze, formulare ipotesi e simulare scenari senza trattarli come verita' assolute.",
        }
      : {
          badge: "Alba Prototype",
          privacy:
            "No login, no analytics, no public cloud. The whole prototype stays local and every insight is presented as a hypothesis to validate.",
          title: "Portable Human Portfolio for life crafting and career crafting.",
          subtitle:
            "Local, single-user, privacy-first web app for gathering evidence, shaping hypotheses, and simulating scenarios without treating them as absolute truth.",
        };

  return (
    <div>
      <div
        className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-16 pt-5 sm:px-6 lg:px-8"
        style={{
          paddingTop: "max(1.25rem, env(safe-area-inset-top))",
          paddingLeft: "max(1rem, env(safe-area-inset-left))",
          paddingRight: "max(1rem, env(safe-area-inset-right))",
          paddingBottom: "max(4rem, env(safe-area-inset-bottom))",
        }}
      >
        <header className="relative z-10 mb-8 rounded-[1.75rem] border border-alba-forest/10 bg-white p-4 shadow-[0_16px_40px_rgba(29,48,41,0.05)] sm:rounded-[2rem] sm:p-5">
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex items-center gap-2 rounded-full border border-alba-clay/16 bg-alba-cream/72 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-alba-clay">
              <Compass className="h-3.5 w-3.5" />
              {copy.badge}
            </div>
            <LanguageToggle />
          </div>

          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <h1 className="font-heading text-[2.2rem] leading-[1.03] text-alba-ink sm:text-5xl">
                {copy.title}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-alba-ink/70 sm:max-w-xl sm:text-base sm:leading-7">
                {copy.subtitle}
              </p>
            </div>

            <div className="flex max-w-md items-start gap-3 rounded-3xl border border-alba-forest/10 bg-alba-cream/72 p-4 text-xs leading-6 text-alba-ink/70 sm:text-sm sm:leading-7">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-alba-forest" />
              <p>{copy.privacy}</p>
            </div>
          </div>

          <Suspense fallback={<div className="mt-6 h-11" />}>
            <Navigation />
          </Suspense>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

function LayoutFallback({ children }: LayoutProps) {
  return (
    <div>
      <div
        className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-16 pt-5 sm:px-6 lg:px-8"
        style={{
          paddingTop: "max(1.25rem, env(safe-area-inset-top))",
          paddingLeft: "max(1rem, env(safe-area-inset-left))",
          paddingRight: "max(1rem, env(safe-area-inset-right))",
          paddingBottom: "max(4rem, env(safe-area-inset-bottom))",
        }}
      >
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}

export function Layout({ children }: LayoutProps) {
  return (
    <Suspense fallback={<LayoutFallback>{children}</LayoutFallback>}>
      <LayoutInner>{children}</LayoutInner>
    </Suspense>
  );
}
