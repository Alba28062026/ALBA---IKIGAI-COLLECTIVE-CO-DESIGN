export type Locale = "it" | "en";

export const defaultLocale: Locale = "it";

export function resolveLocale(candidate?: string | string[] | null): Locale {
  const normalized = Array.isArray(candidate) ? candidate[0] : candidate;

  return normalized === "en" ? "en" : "it";
}

export function buildAppHref(
  path: string,
  options: {
    hash?: string;
    locale?: Locale;
    scenarioId?: string;
  } = {},
) {
  const params = new URLSearchParams();

  if (options.scenarioId) {
    params.set("scenario", options.scenarioId);
  }

  if (options.locale) {
    params.set("lang", options.locale);
  }

  const query = params.toString();
  const hash = options.hash ? `#${options.hash.replace(/^#/, "")}` : "";

  return `${path}${query ? `?${query}` : ""}${hash}`;
}

export const navigationLabels: Record<Locale, string[]> = {
  en: [
    "Home",
    "Evidence",
    "Patterns",
    "Why",
    "Ikigai",
    "Wellbeing",
    "Skills",
    "Opportunities",
    "Experiments",
    "Dossier",
    "Infographic",
  ],
  it: [
    "Home",
    "Evidenze",
    "Pattern",
    "Why",
    "Ikigai",
    "Benessere",
    "Skill",
    "Opportunita'",
    "Esperimenti",
    "Dossier",
    "Infografica",
  ],
};
