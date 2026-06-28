"use client";

import type { ChangeEvent } from "react";
import { useState } from "react";
import { AttachmentCoverageChips } from "@/components/AttachmentCoverageChips";
import type {
  EvidenceAttachmentCoverageArea,
  EvidenceAttachmentSourceType,
  StoredEvidenceAttachment,
} from "@/lib/evidence-attachments";
import {
  allEvidenceAttachmentCoverageAreas,
  allEvidenceAttachmentSourceTypes,
  evidenceAttachmentAccept,
  evidenceAttachmentFormats,
  formatAttachmentSize,
  truncateText,
} from "@/lib/evidence-attachments";
import {
  coverageAreaLabels,
  extractionStatusLabels,
  sourceTypeLabels,
} from "@/lib/evidence-labels";
import { isPublicSharedDemo } from "@/lib/demo-mode";
import type { Locale } from "@/lib/i18n";

type EvidenceFormProps = {
  initialAttachments?: StoredEvidenceAttachment[];
  locale?: Locale;
};

type EvidenceFormState = {
  title: string;
  sourceType: EvidenceAttachmentSourceType;
  summary: string;
  tags: string;
  privacyCheck: boolean;
};

type UploadFeedback = {
  message: string;
  tone: "error" | "success";
};

type UploadWizardSourceType = EvidenceAttachmentSourceType | "auto";

const sourceOptions: EvidenceAttachmentSourceType[] = [...allEvidenceAttachmentSourceTypes];

const quickUploadSourceOptions: EvidenceAttachmentSourceType[] = [
  "CV / Resume",
  "LinkedIn profile export",
  "Certificate / credential",
  "Job ad / opportunity brief",
  "Health / wearable snapshot",
  "Personal reflection",
  "Learning artifact",
];

const initialState: EvidenceFormState = {
  title: "",
  sourceType: "Feedback",
  summary: "",
  tags: "",
  privacyCheck: true,
};

export function EvidenceForm({
  initialAttachments = [],
  locale = "en",
}: EvidenceFormProps) {
  const publicDemo = isPublicSharedDemo();
  const [formData, setFormData] = useState<EvidenceFormState>(initialState);
  const [saved, setSaved] = useState(false);
  const [attachments, setAttachments] = useState<StoredEvidenceAttachment[]>(initialAttachments);
  const [uploadSourceType, setUploadSourceType] = useState<UploadWizardSourceType>("auto");
  const [uploadCoverageAreas, setUploadCoverageAreas] = useState<EvidenceAttachmentCoverageArea[]>(
    [],
  );
  const [isUploading, setIsUploading] = useState(false);
  const [uploadFeedback, setUploadFeedback] = useState<UploadFeedback | null>(null);
  const copy = {
    en: {
      title: "Evidence title",
      titlePlaceholder: "Example: workshop, feedback, research note, achievement",
      sourceType: "Source type",
      summary: "Observable summary",
      summaryPlaceholder:
        "Describe facts, context, and signals without absolute interpretations.",
      tags: "Comma-separated tags",
      tagsPlaceholder: "facilitation, energy, learning",
      privacy:
        "I confirm this demo uses only fictional or redacted data and that every output remains a hypothesis to validate.",
      save: "Save as local mock",
      saved:
        "This form is still a first-sprint mock. Any uploaded files are already stored locally in vault/evidence-intake for later interpretation.",
      preview: "Preview",
      previewTitle: "Form before interpretation",
      previewBody:
        "Alba collects observable traces. The reading stays cautious: signals, patterns, and hypotheses are orientation tools, not permanent labels.",
      previewValueTitle: "Title",
      previewValueSource: "Source",
      previewValueTags: "Tags",
      previewValueAttachment: "Attachment draft",
      previewValueAttachmentEmpty: "No attachment selected yet",
      previewEmptyTitle: "New mock evidence",
      previewEmptyTags: "none",
      uploadEyebrow: "Attachment intake",
      uploadTitle: "Upload the evidence you already have",
      uploadDescription:
        "You can attach CVs, LinkedIn exports, certificates, job ads, notes, screenshots, wearable snapshots, finance/context notes, and other materials. Alba stores them locally and drafts a cautious evidence summary for you to refine.",
      uploadButton: "Choose one or more files",
      uploading: "Uploading locally...",
      uploadFormats: "Accepted formats",
      wizardStepOne: "Step 1",
      wizardStepTwo: "Step 2",
      wizardSourceTitle: "What are you uploading?",
      wizardSourceDescription:
        "Pick a source type if you want Alba to prioritize your intent. Leave it on auto-detect if you prefer a lighter flow.",
      wizardSourceMore: "Or choose another source type",
      wizardCoverageTitle: "Which Alba areas should this inform?",
      wizardCoverageDescription:
        "Select one or more destination areas if this material should guide a specific part of the journey.",
      wizardReset: "Reset upload focus",
      autoDetect: "Auto-detect from file",
      uploadPlanTitle: "Current upload focus",
      uploadPlanAuto: "Auto-detect source type",
      uploadPlanAreasEmpty: "No specific Alba area selected yet",
      uploadHint:
        "Privacy-first: files stay on this device inside vault/evidence-intake. Extraction is best-effort and remains a hypothesis, not a final reading. Each upload can later support Skills, Why, Ikigai, Wellbeing, Opportunities, Experiments, and Dossier.",
      uploadEmpty:
        "No local attachment yet. You can still fill the form manually, or start by attaching an existing file.",
      uploadSuccess: (count: number) =>
        `${count} attachment${count === 1 ? "" : "s"} stored locally and merged into the current draft where fields were empty.`,
      uploadError:
        "The local upload did not complete. Try again with PDF, DOCX, TXT, JSON, CSV, or image files.",
      useDraft: "Use this draft",
      attachedDrafts: "Stored local drafts",
      localPath: "Local path",
      extractionStatus: "Extraction status",
      coverageTitle: "Can also inform",
      attachmentPreview: "Extracted preview",
      attachmentPreviewEmpty: "No text preview extracted yet.",
      attachmentSize: "Size",
      latestAttachmentNote:
        "The latest uploaded draft is visible here. You can reuse any stored draft to prefill the form and route it into the rest of Alba.",
      publicDemoTitle: "Public demo mode",
      publicDemoBody:
        "This shared demo is read-only. Uploads are disabled so the prototype stays empty and no participant files are stored. You can still explore the flow and use the manual fields as a walkthrough.",
    },
    it: {
      title: "Titolo evidenza",
      titlePlaceholder: "Esempio: workshop, feedback, nota di ricerca, achievement",
      sourceType: "Tipo di fonte",
      summary: "Sintesi osservabile",
      summaryPlaceholder:
        "Descrivi fatti, contesto e segnali senza interpretazioni assolute.",
      tags: "Tag separati da virgola",
      tagsPlaceholder: "facilitazione, energia, apprendimento",
      privacy:
        "Confermo che questa demo usa solo dati fittizi o redatti e che ogni output resta un'ipotesi da validare.",
      save: "Salva come mock locale",
      saved:
        "Questo form resta un mock del primo sprint. Gli eventuali file caricati sono gia' salvati in locale dentro vault/evidence-intake per la lettura successiva.",
      preview: "Anteprima",
      previewTitle: "Form prima dell'interpretazione",
      previewBody:
        "Alba raccoglie tracce osservabili. La lettura resta cauta: segnali, pattern e ipotesi sono strumenti di orientamento, non etichette permanenti.",
      previewValueTitle: "Titolo",
      previewValueSource: "Fonte",
      previewValueTags: "Tag",
      previewValueAttachment: "Bozza da allegato",
      previewValueAttachmentEmpty: "Nessun allegato selezionato",
      previewEmptyTitle: "Nuova evidenza mock",
      previewEmptyTags: "nessuno",
      uploadEyebrow: "Intake da allegato",
      uploadTitle: "Carica le evidenze che hai gia'",
      uploadDescription:
        "Puoi allegare CV, export LinkedIn, certificati, job ad, note, screenshot, snapshot wearable, note finanziarie o di contesto e altri materiali. Alba li salva in locale e prepara una bozza prudente dell'evidenza da rifinire.",
      uploadButton: "Scegli uno o piu' file",
      uploading: "Caricamento locale in corso...",
      uploadFormats: "Formati accettati",
      wizardStepOne: "Step 1",
      wizardStepTwo: "Step 2",
      wizardSourceTitle: "Che cosa stai caricando?",
      wizardSourceDescription:
        "Scegli il tipo di materiale se vuoi che Alba dia priorita' alla tua intenzione. Se preferisci un flusso piu' leggero, lascia il rilevamento automatico.",
      wizardSourceMore: "Oppure scegli un altro tipo di fonte",
      wizardCoverageTitle: "Quali aree di Alba dovrebbe informare?",
      wizardCoverageDescription:
        "Seleziona una o piu' aree di destinazione se vuoi che questo materiale orienti una parte specifica del journey.",
      wizardReset: "Reimposta focus upload",
      autoDetect: "Rileva automaticamente dal file",
      uploadPlanTitle: "Focus upload corrente",
      uploadPlanAuto: "Tipo fonte rilevato automaticamente",
      uploadPlanAreasEmpty: "Ancora nessuna area Alba selezionata",
      uploadHint:
        "Privacy-first: i file restano su questo dispositivo dentro vault/evidence-intake. L'estrazione e' best-effort e resta un'ipotesi, non una lettura finale. Ogni upload puo' poi contribuire anche a Skills, Why, Ikigai, Wellbeing, Opportunities, Experiments e Dossier.",
      uploadEmpty:
        "Nessun allegato locale ancora presente. Puoi comunque compilare il form a mano, oppure partire direttamente da un file esistente.",
      uploadSuccess: (count: number) =>
        `${count} allegat${count === 1 ? "o" : "i"} salvati in locale e integrati nella bozza corrente dove i campi erano vuoti.`,
      uploadError:
        "Il caricamento locale non e' andato a buon fine. Riprova con PDF, DOCX, TXT, JSON, CSV o immagini.",
      useDraft: "Usa questa bozza",
      attachedDrafts: "Bozze locali salvate",
      localPath: "Percorso locale",
      extractionStatus: "Stato estrazione",
      coverageTitle: "Puo' contribuire anche a",
      attachmentPreview: "Anteprima estratta",
      attachmentPreviewEmpty: "Ancora nessuna anteprima testuale disponibile.",
      attachmentSize: "Dimensione",
      latestAttachmentNote:
        "Qui vedi l'ultima bozza allegata. Puoi riusare qualunque bozza salvata per precompilare il form e instradarla nel resto di Alba.",
      publicDemoTitle: "Modalita' demo pubblica",
      publicDemoBody:
        "Questa demo condivisa e' in sola lettura. Gli upload sono disattivati cosi' il prototipo resta vuoto e non salva file dei partecipanti. Puoi comunque esplorare il flusso e usare i campi manuali come walkthrough.",
    },
  }[locale];

  const latestAttachment = attachments[0] ?? null;

  const localizedSourceOptions = sourceOptions.map((option) => ({
    label: sourceTypeLabels[locale][option],
    value: option,
  }));

  function toggleUploadCoverageArea(area: EvidenceAttachmentCoverageArea) {
    setUploadCoverageAreas((current) =>
      current.includes(area)
        ? current.filter((entry) => entry !== area)
        : [...current, area],
    );
  }

  function resetUploadWizard() {
    setUploadSourceType("auto");
    setUploadCoverageAreas([]);
  }

  function updateField(field: keyof EvidenceFormState, value: string | boolean) {
    setSaved(false);
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function mergeAttachmentIntoForm(attachment: StoredEvidenceAttachment) {
    setSaved(false);
    setFormData((current) => ({
      ...current,
      title: current.title || attachment.titleSuggestion,
      sourceType: attachment.sourceTypeSuggestion,
      summary: current.summary || attachment.summarySuggestion || "",
      tags: current.tags || attachment.tagsSuggestion.join(", "),
    }));
  }

  function replaceFormWithAttachment(attachment: StoredEvidenceAttachment) {
    setSaved(false);
    setFormData((current) => ({
      ...current,
      title: attachment.titleSuggestion,
      sourceType: attachment.sourceTypeSuggestion,
      summary: attachment.summarySuggestion || "",
      tags: attachment.tagsSuggestion.join(", "),
    }));
  }

  async function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = event.target.files;

    if (!selectedFiles?.length) {
      return;
    }

    const payload = new FormData();

    Array.from(selectedFiles).forEach((file) => {
      payload.append("files", file);
    });

    payload.append("preferredSourceType", uploadSourceType);
    uploadCoverageAreas.forEach((area) => {
      payload.append("preferredCoverageAreas", area);
    });

    setIsUploading(true);
    setUploadFeedback(null);
    setSaved(false);

    try {
      const response = await fetch("/api/evidence/attachments", {
        method: "POST",
        body: payload,
      });

      const json = (await response.json()) as {
        attachments?: StoredEvidenceAttachment[];
        error?: string;
      };

      if (!response.ok || !json.attachments) {
        throw new Error(json.error || copy.uploadError);
      }

      const uploaded = json.attachments;

      setAttachments((current) => [...uploaded, ...current]);

      if (uploaded[0]) {
        mergeAttachmentIntoForm(uploaded[0]);
      }

      setUploadFeedback({
        message: copy.uploadSuccess(uploaded.length),
        tone: "success",
      });
    } catch (error) {
      setUploadFeedback({
        message: error instanceof Error ? error.message : copy.uploadError,
        tone: "error",
      });
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
      <form
        className="card-surface"
        onSubmit={(event) => {
          event.preventDefault();
          setSaved(true);
        }}
      >
        <div className="grid gap-5">
          <section className="rounded-[1.8rem] border border-alba-forest/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.96),rgba(223,240,234,0.48))] p-5">
            <p className="eyebrow">{copy.uploadEyebrow}</p>
            <h3 className="mt-3 font-heading text-2xl text-alba-ink">{copy.uploadTitle}</h3>
            <p className="mt-3 text-sm leading-7 text-alba-ink/72">{copy.uploadDescription}</p>

            {publicDemo ? (
              <div className="mt-5 rounded-[1.5rem] border border-alba-forest/12 bg-white/84 p-4 text-sm leading-7 text-alba-ink/74">
                <p className="font-semibold text-alba-ink">{copy.publicDemoTitle}</p>
                <p className="mt-2">{copy.publicDemoBody}</p>
              </div>
            ) : null}

            <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
              <div className="rounded-[1.5rem] border border-alba-forest/10 bg-white/78 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-alba-forest/72">
                  {copy.wizardStepOne}
                </p>
                <h4 className="mt-3 font-heading text-xl text-alba-ink">
                  {copy.wizardSourceTitle}
                </h4>
                <p className="mt-2 text-sm leading-7 text-alba-ink/70">
                  {copy.wizardSourceDescription}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setUploadSourceType("auto")}
                    className={[
                      "rounded-full border px-4 py-2 text-sm font-semibold transition",
                      uploadSourceType === "auto"
                        ? "border-alba-forest bg-alba-forest text-white"
                        : "border-alba-forest/12 bg-white text-alba-ink/78 hover:bg-alba-cream/68",
                    ].join(" ")}
                  >
                    {copy.autoDetect}
                  </button>

                  {quickUploadSourceOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setUploadSourceType(option)}
                      className={[
                        "rounded-full border px-4 py-2 text-sm font-semibold transition",
                        uploadSourceType === option
                          ? "border-alba-forest bg-alba-forest text-white"
                          : "border-alba-forest/12 bg-white text-alba-ink/78 hover:bg-alba-cream/68",
                      ].join(" ")}
                    >
                      {sourceTypeLabels[locale][option]}
                    </button>
                  ))}
                </div>

                <label
                  className="mt-4 block text-xs font-semibold uppercase tracking-[0.18em] text-alba-forest/72"
                  htmlFor="uploadSourceType"
                >
                  {copy.wizardSourceMore}
                </label>
                <select
                  id="uploadSourceType"
                  value={uploadSourceType}
                  onChange={(event) =>
                    setUploadSourceType(event.target.value as UploadWizardSourceType)
                  }
                  className="mt-3 w-full rounded-2xl border border-alba-forest/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-alba-clay"
                >
                  <option value="auto">{copy.autoDetect}</option>
                  {localizedSourceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-[1.5rem] border border-alba-forest/10 bg-white/78 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-alba-forest/72">
                  {copy.wizardStepTwo}
                </p>
                <h4 className="mt-3 font-heading text-xl text-alba-ink">
                  {copy.wizardCoverageTitle}
                </h4>
                <p className="mt-2 text-sm leading-7 text-alba-ink/70">
                  {copy.wizardCoverageDescription}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {allEvidenceAttachmentCoverageAreas.map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => toggleUploadCoverageArea(area)}
                      className={[
                        "rounded-full border px-4 py-2 text-sm font-semibold transition",
                        uploadCoverageAreas.includes(area)
                          ? "border-alba-clay bg-alba-clay text-white"
                          : "border-alba-forest/12 bg-white text-alba-ink/78 hover:bg-alba-cream/68",
                      ].join(" ")}
                    >
                      {coverageAreaLabels[locale][area]}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={resetUploadWizard}
                  disabled={publicDemo}
                  className="mt-4 inline-flex min-h-10 items-center justify-center rounded-full border border-alba-forest/15 bg-white px-4 py-2 text-sm font-semibold text-alba-forest transition hover:bg-alba-cream/68"
                >
                  {copy.wizardReset}
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-[1.5rem] bg-alba-cream/70 p-4 text-sm text-alba-ink/75">
              <p className="font-semibold text-alba-ink">{copy.uploadPlanTitle}</p>
              <p className="mt-2">
                {uploadSourceType === "auto"
                  ? copy.uploadPlanAuto
                  : sourceTypeLabels[locale][uploadSourceType]}
              </p>
              <div className="mt-3">
                {uploadCoverageAreas.length > 0 ? (
                  <AttachmentCoverageChips areas={uploadCoverageAreas} locale={locale} />
                ) : (
                  <p>{copy.uploadPlanAreasEmpty}</p>
                )}
              </div>
            </div>

            {!publicDemo ? (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <label className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-alba-forest px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#16443c]">
                  <input
                    type="file"
                    accept={evidenceAttachmentAccept}
                    multiple
                    className="sr-only"
                    onChange={handleFileSelection}
                    disabled={isUploading}
                  />
                  {isUploading ? copy.uploading : copy.uploadButton}
                </label>

                <span className="rounded-full border border-alba-forest/12 bg-white px-3 py-2 text-xs font-medium text-alba-ink/72">
                  {copy.uploadFormats}: {evidenceAttachmentFormats.join(" / ")}
                </span>
              </div>
            ) : null}

            <p className="mt-4 text-sm leading-7 text-alba-ink/68">{copy.uploadHint}</p>

            {uploadFeedback ? (
              <div
                className={[
                  "mt-4 rounded-3xl border p-4 text-sm",
                  uploadFeedback.tone === "success"
                    ? "border-alba-forest/15 bg-white/82 text-alba-ink/75"
                    : "border-alba-clay/18 bg-alba-rose/55 text-alba-ink/80",
                ].join(" ")}
              >
                {uploadFeedback.message}
              </div>
            ) : null}

            {attachments.length > 0 ? (
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-alba-forest/72">
                    {copy.attachedDrafts}
                  </h4>
                  <p className="text-xs text-alba-ink/55">{copy.latestAttachmentNote}</p>
                </div>

                <div className="grid gap-4 md:max-h-[42rem] md:overflow-y-auto md:pr-2">
                  {attachments.map((attachment) => (
                    <article
                      key={attachment.id}
                      className="rounded-[1.6rem] border border-alba-forest/10 bg-white/82 p-4 shadow-[0_18px_40px_rgba(29,48,41,0.04)]"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h5 className="font-heading text-xl text-alba-ink">
                            {attachment.titleSuggestion}
                          </h5>
                          <p className="mt-2 text-sm text-alba-ink/58">
                            {attachment.originalName}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => replaceFormWithAttachment(attachment)}
                          className="inline-flex min-h-10 items-center justify-center rounded-full border border-alba-forest/15 bg-white px-4 py-2 text-sm font-semibold text-alba-forest transition hover:bg-alba-cream/68"
                        >
                          {copy.useDraft}
                        </button>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="rounded-full bg-[#dff0ea] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-alba-forest">
                          {sourceTypeLabels[locale][attachment.sourceTypeSuggestion]}
                        </span>
                        <span className="rounded-full bg-alba-cream px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-alba-clay">
                          {copy.extractionStatus}:{" "}
                          {extractionStatusLabels[locale][attachment.extractionStatus]}
                        </span>
                        <span className="rounded-full border border-alba-forest/10 bg-white px-3 py-1 text-xs text-alba-ink/68">
                          {copy.attachmentSize}: {formatAttachmentSize(attachment.sizeBytes)}
                        </span>
                      </div>

                      <div className="mt-4 rounded-[1.4rem] bg-white/78 p-4 text-sm text-alba-ink/74">
                        <p className="font-semibold text-alba-ink">{copy.coverageTitle}</p>
                        <div className="mt-3">
                          <AttachmentCoverageChips
                            areas={attachment.coverageAreas}
                            locale={locale}
                          />
                        </div>
                      </div>

                      <div className="mt-4 rounded-[1.4rem] bg-alba-cream/62 p-4 text-sm leading-7 text-alba-ink/74">
                        <p className="font-semibold text-alba-ink">{copy.localPath}</p>
                        <p className="mt-2 break-all">{attachment.relativePath}</p>
                      </div>

                      <div className="mt-4 rounded-[1.4rem] bg-white p-4 text-sm leading-7 text-alba-ink/72">
                        <p className="font-semibold text-alba-ink">{copy.attachmentPreview}</p>
                        <p className="mt-2">
                          {truncateText(
                            attachment.extractionPreview || attachment.summarySuggestion,
                            180,
                          ) || copy.attachmentPreviewEmpty}
                        </p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-[1.5rem] border border-dashed border-alba-forest/18 bg-white/66 p-4 text-sm leading-7 text-alba-ink/68">
                {copy.uploadEmpty}
              </div>
            )}
          </section>

          <div>
            <label className="block text-sm font-semibold text-alba-ink" htmlFor="title">
              {copy.title}
            </label>
            <input
              id="title"
              value={formData.title}
              onChange={(event) => updateField("title", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-alba-forest/15 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-alba-clay"
              placeholder={copy.titlePlaceholder}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-alba-ink" htmlFor="sourceType">
              {copy.sourceType}
            </label>
            <select
              id="sourceType"
              value={formData.sourceType}
              onChange={(event) =>
                updateField("sourceType", event.target.value as EvidenceAttachmentSourceType)
              }
              className="mt-2 w-full rounded-2xl border border-alba-forest/15 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-alba-clay"
            >
              {localizedSourceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-alba-ink" htmlFor="summary">
              {copy.summary}
            </label>
            <textarea
              id="summary"
              value={formData.summary}
              onChange={(event) => updateField("summary", event.target.value)}
              rows={6}
              className="mt-2 w-full rounded-3xl border border-alba-forest/15 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-alba-clay"
              placeholder={copy.summaryPlaceholder}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-alba-ink" htmlFor="tags">
              {copy.tags}
            </label>
            <input
              id="tags"
              value={formData.tags}
              onChange={(event) => updateField("tags", event.target.value)}
              className="mt-2 w-full rounded-2xl border border-alba-forest/15 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-alba-clay"
              placeholder={copy.tagsPlaceholder}
            />
          </div>

          <label className="flex items-start gap-3 rounded-3xl bg-alba-cream/75 p-4 text-sm text-alba-ink/75">
            <input
              type="checkbox"
              checked={formData.privacyCheck}
              onChange={(event) => updateField("privacyCheck", event.target.checked)}
              className="mt-1"
            />
            {copy.privacy}
          </label>

          <button
            type="submit"
            className="rounded-full bg-alba-clay px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b55828]"
          >
            {copy.save}
          </button>

          {saved ? (
            <div className="rounded-3xl border border-alba-forest/15 bg-white/85 p-4 text-sm text-alba-ink/75">
              {copy.saved}
            </div>
          ) : null}
        </div>
      </form>

      <aside className="card-surface bg-alba-ink text-white">
        <p className="eyebrow text-white/70">{copy.preview}</p>
        <h3 className="mt-3 font-heading text-2xl">{copy.previewTitle}</h3>
        <p className="mt-4 text-sm leading-7 text-white/78">{copy.previewBody}</p>

        <div className="mt-6 rounded-3xl bg-white/10 p-4 text-sm text-white/80">
          <p>
            {copy.previewValueTitle}: {formData.title || copy.previewEmptyTitle}
          </p>
          <p className="mt-2">
            {copy.previewValueSource}: {sourceTypeLabels[locale][formData.sourceType]}
          </p>
          <p className="mt-2">
            {copy.previewValueTags}: {formData.tags || copy.previewEmptyTags}
          </p>
        </div>

        <div className="mt-4 rounded-3xl bg-white/10 p-4 text-sm text-white/80">
          <p className="font-semibold text-white">{copy.previewValueAttachment}</p>
          <p className="mt-2">
            {latestAttachment
              ? `${latestAttachment.originalName} · ${extractionStatusLabels[locale][latestAttachment.extractionStatus]}`
              : copy.previewValueAttachmentEmpty}
          </p>
          {latestAttachment?.relativePath ? (
            <p className="mt-2 break-all text-white/68">{latestAttachment.relativePath}</p>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
