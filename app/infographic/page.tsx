import Image from "next/image";
import Link from "next/link";
import { resolveLocale } from "@/lib/i18n";

type InfographicPageProps = {
  searchParams?: Promise<{
    lang?: string | string[];
    view?: string | string[];
  }>;
};

export default async function InfographicPage({ searchParams }: InfographicPageProps) {
  const params = await searchParams;
  const locale = resolveLocale(params?.lang);
  const view = Array.isArray(params?.view) ? params?.view[0] : params?.view;
  const isFocusView = view === "focus";
  const assetPath = locale === "it" ? "/alba-infographic-it.svg" : "/alba-infographic-en.svg";
  const defaultHref = `/infographic?lang=${locale}`;
  const focusHref = `/infographic?lang=${locale}&view=focus`;
  const copy =
    locale === "it"
      ? {
          eyebrow: "Supporto presentazione",
          title: "Infografica Alba per un racconto da 5 minuti",
          description:
            "Una versione piu' visuale e stabile dell'infografica, pensata per essere leggibile sia su Mac sia su iPhone.",
          openFocus: "Apri a tutto schermo",
          backToGuide: "Torna alla scheda",
          focusDescription:
            "Questa vista mostra solo il poster, con il minimo di interfaccia possibile.",
          speakingGuide: "Traccia rapida",
          guide:
            "Parti dal problema: i segnali utili esistono gia', ma sono sparsi. Alba li raccoglie, li organizza in un portfolio, simula scenari credibili e traduce uno scenario in azioni pratiche.",
        }
      : {
          eyebrow: "Presentation aid",
          title: "Alba infographic for a 5-minute talk",
          description:
            "A more visual and stable infographic view, designed to stay readable on both Mac and iPhone.",
          openFocus: "Open full screen",
          backToGuide: "Back to page",
          focusDescription: "This view shows only the poster, with the smallest possible interface.",
          speakingGuide: "Quick speaking guide",
          guide:
            "Start from the problem: useful signals already exist, but they are scattered. Alba gathers them, organizes them into a portfolio, simulates credible scenarios, and translates one scenario into practical action.",
        };

  if (isFocusView) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Link
            href={defaultHref}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-alba-forest/15 bg-white/85 px-5 py-3 text-sm font-semibold text-alba-forest transition hover:bg-white"
          >
            {copy.backToGuide}
          </Link>
        </div>

        <section className="relative overflow-hidden rounded-[2.4rem] border border-[#203b33] bg-[#15241f] p-3 shadow-[0_30px_80px_rgba(18,26,22,0.28)] sm:p-6">
          <div className="pointer-events-none absolute inset-x-10 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(232,207,133,0.18),transparent_60%)]" />
          <div className="pointer-events-none absolute inset-y-20 right-[-4rem] w-40 rounded-full bg-[radial-gradient(circle,rgba(197,102,52,0.18),transparent_70%)] blur-2xl" />
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/54">
                {copy.eyebrow}
              </p>
              <p className="mt-2 text-sm text-white/72">{copy.focusDescription}</p>
            </div>
          </div>

          <Image
            src={assetPath}
            alt={copy.title}
            width={1440}
            height={2100}
            unoptimized
            priority
            className="relative h-auto w-full rounded-[1.7rem] border border-white/18 bg-white shadow-[0_35px_80px_rgba(0,0,0,0.32)]"
          />
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="card-surface">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow">{copy.eyebrow}</p>
            <h2 className="mt-3 font-heading text-4xl text-alba-ink">{copy.title}</h2>
            <p className="mt-4 text-sm leading-7 text-alba-ink/72">{copy.description}</p>
          </div>

          <Link
            href={focusHref}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-alba-forest/15 bg-white/85 px-5 py-3 text-sm font-semibold text-alba-forest transition hover:bg-white"
          >
            {copy.openFocus}
          </Link>
        </div>
      </section>

      <Link href={focusHref} className="block rounded-[2.4rem] transition hover:-translate-y-0.5">
        <section className="relative overflow-hidden rounded-[2.4rem] border border-[#203b33] bg-[#15241f] p-3 shadow-[0_30px_80px_rgba(18,26,22,0.28)] sm:p-6">
          <div className="pointer-events-none absolute inset-x-10 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(232,207,133,0.18),transparent_60%)]" />
          <div className="pointer-events-none absolute bottom-10 left-[-3rem] h-36 w-36 rounded-full bg-[radial-gradient(circle,rgba(197,102,52,0.18),transparent_70%)] blur-2xl" />
          <div className="mb-4 flex items-center justify-between gap-3 px-1">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/54">
                {copy.eyebrow}
              </p>
              <p className="mt-2 text-sm text-white/72">{copy.speakingGuide}</p>
            </div>
          </div>

          <Image
            src={assetPath}
            alt={copy.title}
            width={1440}
            height={2100}
            unoptimized
            className="relative h-auto w-full rounded-[1.7rem] border border-white/18 bg-white shadow-[0_35px_80px_rgba(0,0,0,0.32)]"
          />
        </section>
      </Link>

      <section className="rounded-[1.8rem] border border-alba-forest/10 bg-white/76 p-5 shadow-[0_20px_50px_rgba(29,48,41,0.05)]">
        <p className="eyebrow">{copy.speakingGuide}</p>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-alba-ink/72">{copy.guide}</p>
      </section>
    </div>
  );
}
