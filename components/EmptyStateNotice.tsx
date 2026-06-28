import Link from "next/link";
import type { Locale } from "@/lib/i18n";

type EmptyStateNoticeProps = {
  ctaHref?: string;
  ctaLabel?: string;
  description: string;
  locale?: Locale;
  title: string;
};

export function EmptyStateNotice({
  ctaHref,
  ctaLabel,
  description,
  locale = "en",
  title,
}: EmptyStateNoticeProps) {
  const copy = {
    en: {
      eyebrow: "Blank demo state",
    },
    it: {
      eyebrow: "Demo in empty state",
    },
  }[locale];

  return (
    <section className="rounded-[1.8rem] border border-dashed border-alba-forest/18 bg-white/76 p-5 shadow-[0_20px_50px_rgba(29,48,41,0.04)]">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h3 className="mt-3 font-heading text-3xl text-alba-ink">{title}</h3>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-alba-ink/72">{description}</p>

      {ctaHref && ctaLabel ? (
        <Link
          href={ctaHref}
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-alba-forest px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#16443c]"
        >
          {ctaLabel}
        </Link>
      ) : null}
    </section>
  );
}
