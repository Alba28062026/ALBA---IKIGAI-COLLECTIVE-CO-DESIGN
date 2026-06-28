import "server-only";

import { getLocalizedDigitalTwinAgent } from "@/lib/localized-data";
import { readStoredEvidenceAttachments } from "@/lib/evidence-upload-store";
import type { Locale } from "@/lib/i18n";
import type { DigitalTwinAgentReport } from "@/lib/types";

type RunDigitalTwinAgentArgs = {
  locale?: Locale;
};

export async function runDigitalTwinAgent({
  locale = "en",
}: RunDigitalTwinAgentArgs = {}): Promise<DigitalTwinAgentReport> {
  const baseReport = getLocalizedDigitalTwinAgent(locale);
  const attachments = await readStoredEvidenceAttachments();

  if (!attachments.length) {
    return baseReport;
  }

  const coverage = Array.from(
    new Set(attachments.flatMap((attachment) => attachment.coverageAreas)),
  ).slice(0, 6);

  const latest = attachments[0];

  return {
    ...baseReport,
    lastRunLabel:
      locale === "it"
        ? `Aggiornato con ${attachments.length} allegati locali`
        : `Updated with ${attachments.length} local attachments`,
    sources: [
      {
        id: "dt-vault",
        title:
          locale === "it"
            ? "Vault locale delle evidenze"
            : "Local evidence vault",
        status: "ready",
        lastSyncLabel:
          locale === "it"
            ? "Adesso"
            : "Just now",
        coverage,
        note:
          locale === "it"
            ? `Ultimo file visto: ${latest.originalName}. L'agente puo' riutilizzare titolo, preview e aree coperte come input prudenziali.`
            : `Latest file seen: ${latest.originalName}. The agent can reuse title, preview, and coverage areas as cautious inputs.`,
      },
      ...baseReport.sources,
    ],
    signals: [
      {
        id: "dts-local-vault",
        title:
          locale === "it"
            ? "Input reali gia' presenti nel vault"
            : "Real inputs already present in the vault",
        summary:
          locale === "it"
            ? `Ci sono gia' ${attachments.length} allegati locali che possono alimentare Evidence, Simulation e Activation senza ricompilare tutto a mano.`
            : `There are already ${attachments.length} local attachments that can feed Evidence, Simulation, and Activation without rewriting everything manually.`,
        targetAreas: coverage.length ? coverage : ["Evidence", "Simulation", "Activation"],
        confidence: 8,
      },
      ...baseReport.signals,
    ],
    suggestedInputs: [
      locale === "it"
        ? "Rivedi le bozze generate dagli allegati e promuovi solo quelle che ti sembrano fedeli."
        : "Review the drafts generated from attachments and promote only the ones that feel accurate.",
      ...baseReport.suggestedInputs,
    ].slice(0, 4),
    nextActions: [
      locale === "it"
        ? "Ricalcola i suggerimenti di scenario dopo ogni nuovo upload approvato."
        : "Recalculate scenario suggestions after each approved upload.",
      ...baseReport.nextActions,
    ].slice(0, 4),
  };
}
