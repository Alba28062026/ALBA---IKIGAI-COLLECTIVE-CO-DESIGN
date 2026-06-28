import Link from "next/link";

type GraphLinkPillProps = {
  href: string;
  label: string;
};

export function GraphLinkPill({ href, label }: GraphLinkPillProps) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center justify-center rounded-full border border-alba-forest/12 bg-white px-4 py-2 text-center text-xs font-medium text-alba-forest transition hover:bg-alba-cream/70"
    >
      {label}
    </Link>
  );
}
