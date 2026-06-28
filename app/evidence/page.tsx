import Link from "next/link";
import { AttachmentCoverageChips } from "@/components/AttachmentCoverageChips";
import { EmptyStateNotice } from "@/components/EmptyStateNotice";
import { EvidenceCard } from "@/components/EvidenceCard";
import { formatAttachmentSize } from "@/lib/evidence-attachments";
import { extractionStatusLabels, sourceTypeLabels } from "@/lib/evidence-labels";
import { readStoredEvidenceAttachments } from "@/lib/evidence-upload-store";
import { buildAppHref, resolveLocale } from "@/lib/i18n";
import { getLocalizedEvidence } from "@/lib/localized-data";

export const dynamic = "force-dynamic";

type EvidencePageProps = {
  searchParams?: Promise<{
    lang?: string | string[];
  }>;
};

export default async function EvidencePage({ searchParams }: EvidencePageProps) {
  const params = await searchParams;
  const locale = resolveLocale(params?.lang);
  const evidence = getLocalizedEvidence(locale);
  const attachments = await readStoredEvidenceAttachments({
    previewMaxLength: 220,
    summaryMaxLength: 240,
  });
  const attachmentSourceFamilies = new Set(
    attachments.map((attachment) => attachment.sourceTypeSuggestion),
  ).size;
  const latestAttachmentDate = attachments[0]
    ? new Intl.DateTimeFormat(locale === "it" ? "it-IT" : "en-US", {
        dateStyle: "medium",
      }).format(new Date(attachments[0].uploadedAt))
    : null;
  const copy = {
    en: {
      eyebrow: "Evidence vault",
      title: "Traces, feedback, stories, and observable signals.",
      description:
        "The first phase collects materials that already exist. Each piece of evidence is described cautiously, without rigid identity claims.",
      addEvidence: "Add evidence or attachment",
      emptyTitle: "No evidence has been loaded yet.",
      emptyDescription:
        "Start from one first artifact, one written note, or one small attachment. ALBA will stay empty until you approve the first observable input.",
      attachmentsEyebrow: "Local attachment vault",
      attachmentsTitle: "Uploaded materials available for interpretation.",
      attachmentsDescription:
        "These files were stored locally in vault/evidence-intake. They can prefill new evidence entries and also support downstream readings for Skills, Why, Ikigai, Wellbeing, Opportunities, Experiments, and Dossier.",
      attachmentsEmpty:
        "No local attachment has been uploaded yet. Start from a CV, LinkedIn export, certificate, note, job ad, wearable snapshot, or screenshot when useful.",
      localPath: "Local path",
      extractionStatus: "Extraction status",
      coverageTitle: "Can also inform",
      preview: "Extracted preview",
      previewEmpty: "No text preview available yet.",
      size: "Size",
      statTotal: "Stored attachments",
      statSources: "Source families",
      statLatest: "Latest upload",
      statLatestEmpty: "No uploads yet",
    },
    it: {
      eyebrow: "Evidence vault",
      title: "Tracce, feedback, storie e segnali osservabili.",
      description:
        "La prima fase raccoglie materiali che esistono gia'. Ogni evidenza viene descritta con cautela, senza claim identitari rigidi.",
      addEvidence: "Aggiungi evidenza o allegato",
      emptyTitle: "Ancora nessuna evidenza caricata.",
      emptyDescription:
        "Parti da un primo artefatto, una nota scritta o un piccolo allegato. ALBA restera' vuota finche' non approvi il primo input osservabile.",
      attachmentsEyebrow: "Vault allegati locali",
      attachmentsTitle: "Materiali caricati disponibili per l'interpretazione.",
      attachmentsDescription:
        "Questi file sono salvati localmente in vault/evidence-intake. Possono precompilare nuove evidenze e supportare anche le letture successive di Skills, Why, Ikigai, Wellbeing, Opportunities, Experiments e Dossier.",
      attachmentsEmpty:
        "Nessun allegato locale ancora caricato. Quando serve puoi partire da CV, export LinkedIn, certificato, nota, job ad, snapshot wearable o screenshot.",
      localPath: "Percorso locale",
      extractionStatus: "Stato estrazione",
      coverageTitle: "Puo' contribuire anche a",
      preview: "Anteprima estratta",
      previewEmpty: "Ancora nessuna anteprima testuale disponibile.",
      size: "Dimensione",
      statTotal: "Allegati salvati",
      statSources: "Famiglie di fonte",
      statLatest: "Ultimo upload",
      statLatestEmpty: "Ancora nessun upload",
    },
  }[locale];

  return (
    <div className="space-y-8">
      <section className="card-surface flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 className="mt-3 font-heading text-4xl text-alba-ink">{copy.title}</h2>
          <p className="mt-4 text-sm leading-7 text-alba-ink/72">{copy.description}</p>
        </div>

        <Link
          href={buildAppHref("/evidence/new", { locale })}
          className="inline-flex min-h-12 w-full touch-manipulation items-center justify-center rounded-full bg-alba-clay px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b55828] sm:w-auto"
        >
          {copy.addEvidence}
        </Link>
      </section>

      {evidence.length > 0 ? (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {evidence.map((item) => (
            <EvidenceCard key={item.id} evidence={item} locale={locale} />
          ))}
        </section>
      ) : (
        <EmptyStateNotice
          ctaHref={buildAppHref("/evidence/new", { locale })}
          ctaLabel={copy.addEvidence}
          description={copy.emptyDescription}
          locale={locale}
          title={copy.emptyTitle}
        />
      )}

      <section className="card-surface">
        <div className="max-w-3xl">
          <p className="eyebrow">{copy.attachmentsEyebrow}</p>
          <h3 className="mt-3 font-heading text-3xl text-alba-ink">{copy.attachmentsTitle}</h3>
          <p className="mt-4 text-sm leading-7 text-alba-ink/72">{copy.attachmentsDescription}</p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] bg-white/84 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-alba-forest/70">
              {copy.statTotal}
            </p>
            <p className="mt-3 font-heading text-3xl text-alba-ink">{attachments.length}</p>
          </div>

          <div className="rounded-[1.5rem] bg-white/84 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-alba-forest/70">
              {copy.statSources}
            </p>
            <p className="mt-3 font-heading text-3xl text-alba-ink">{attachmentSourceFamilies}</p>
          </div>

          <div className="rounded-[1.5rem] bg-white/84 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-alba-forest/70">
              {copy.statLatest}
            </p>
            <p className="mt-3 font-heading text-2xl text-alba-ink">
              {latestAttachmentDate ?? copy.statLatestEmpty}
            </p>
          </div>
        </div>

        {attachments.length > 0 ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {attachments.map((attachment) => (
              <article key={attachment.id} className="card-surface flex h-full flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="rounded-full bg-[#dff0ea] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-alba-forest">
                      {sourceTypeLabels[locale][attachment.sourceTypeSuggestion]}
                    </span>
                    <h4 className="mt-4 font-heading text-2xl text-alba-ink">
                      {attachment.titleSuggestion}
                    </h4>
                  </div>

                  <span className="text-sm text-alba-ink/55">
                    {copy.size}: {formatAttachmentSize(attachment.sizeBytes)}
                  </span>
                </div>

                <p className="text-sm text-alba-ink/58">{attachment.originalName}</p>

                <div className="rounded-3xl bg-alba-cream/70 p-4 text-sm text-alba-ink/74">
                  <p className="font-semibold text-alba-ink">{copy.localPath}</p>
                  <p className="mt-2 break-all">{attachment.relativePath}</p>
                </div>

                <div className="rounded-3xl bg-white/82 p-4 text-sm text-alba-ink/74">
                  <p className="font-semibold text-alba-ink">{copy.coverageTitle}</p>
                  <div className="mt-3">
                    <AttachmentCoverageChips areas={attachment.coverageAreas} locale={locale} />
                  </div>
                </div>

                <div className="rounded-3xl bg-white/82 p-4 text-sm text-alba-ink/74">
                  <p className="font-semibold text-alba-ink">{copy.extractionStatus}</p>
                  <p className="mt-2">
                    {extractionStatusLabels[locale][attachment.extractionStatus]}
                  </p>
                  <p className="mt-4 font-semibold text-alba-ink">{copy.preview}</p>
                  <p className="mt-2 leading-7">
                    {attachment.extractionPreview ||
                      attachment.summarySuggestion ||
                      copy.previewEmpty}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[1.6rem] border border-dashed border-alba-forest/18 bg-white/72 p-5 text-sm leading-7 text-alba-ink/68">
            {copy.attachmentsEmpty}
          </div>
        )}
      </section>
    </div>
  );
}
