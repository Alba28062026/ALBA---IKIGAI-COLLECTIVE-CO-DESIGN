"use client";

import {
  getLocalizedScenarioForRoute,
  buildLocalizedDossierMarkdown,
  buildLocalizedDossierPayload,
} from "@/lib/localized-data";
import type { Locale } from "@/lib/i18n";

type DossierExportPanelProps = {
  locale?: Locale;
  scenarioId?: string;
};

function formatFilenameSuffix(locale: Locale, scenarioId?: string) {
  const scenario = scenarioId ? getLocalizedScenarioForRoute(locale, scenarioId) : undefined;

  if (!scenario) {
    return "master";
  }

  return scenario.title
    .toLowerCase()
    .replace(/^scenario \d+ - /, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function DossierExportPanel({
  locale = "en",
  scenarioId,
}: DossierExportPanelProps) {
  const copy = {
    en: {
      eyebrow: "Export mock",
      title: "Local dossier in Markdown or JSON.",
      description:
        "The first sprint does not use cloud or external APIs. Export is generated directly in the browser from mock portfolio data and the active scenario focus.",
      downloadJson: "Download JSON",
      downloadMarkdown: "Download Markdown",
    },
    it: {
      eyebrow: "Export mock",
      title: "Dossier locale in Markdown o JSON.",
      description:
        "Il primo sprint non usa cloud o API esterne. L'export viene generato direttamente nel browser dai dati mock del portfolio e dal focus scenario attivo.",
      downloadJson: "Scarica JSON",
      downloadMarkdown: "Scarica Markdown",
    },
  }[locale];
  const filenameSuffix = formatFilenameSuffix(locale, scenarioId);

  function download(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="card-surface">
      <p className="eyebrow">{copy.eyebrow}</p>
      <h2 className="mt-3 font-heading text-3xl text-alba-ink">{copy.title}</h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-alba-ink/72">{copy.description}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() =>
            download(
              JSON.stringify(buildLocalizedDossierPayload(locale, scenarioId), null, 2),
              `alba-dossier-${filenameSuffix}.json`,
              "application/json",
            )
          }
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-alba-forest px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#16443c]"
        >
          {copy.downloadJson}
        </button>
        <button
          type="button"
          onClick={() =>
            download(
              buildLocalizedDossierMarkdown(locale, scenarioId),
              `alba-dossier-${filenameSuffix}.md`,
              "text/markdown;charset=utf-8",
            )
          }
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-alba-clay px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b55828]"
        >
          {copy.downloadMarkdown}
        </button>
      </div>
    </div>
  );
}
