import type {
  EvidenceAttachmentCoverageArea,
  EvidenceAttachmentExtractionStatus,
  EvidenceAttachmentSourceType,
} from "@/lib/evidence-attachments";
import type { Locale } from "@/lib/i18n";

export const sourceTypeLabels: Record<Locale, Record<EvidenceAttachmentSourceType, string>> = {
  en: {
    Feedback: "Feedback",
    Achievement: "Achievement",
    Story: "Story",
    Routine: "Routine",
    "Research note": "Research note",
    "CV / Resume": "CV / Resume",
    "LinkedIn profile export": "LinkedIn profile export",
    "Visual attachment": "Visual attachment",
    "Certificate / credential": "Certificate / credential",
    "Learning artifact": "Learning artifact",
    "Job ad / opportunity brief": "Job ad / opportunity brief",
    "Health / wearable snapshot": "Health / wearable snapshot",
    "Context / finance snapshot": "Context / finance snapshot",
    "Personal reflection": "Personal reflection",
  },
  it: {
    Feedback: "Feedback",
    Achievement: "Achievement",
    Story: "Storia",
    Routine: "Routine",
    "Research note": "Nota di ricerca",
    "CV / Resume": "CV / Resume",
    "LinkedIn profile export": "Export profilo LinkedIn",
    "Visual attachment": "Allegato visivo",
    "Certificate / credential": "Certificato / credenziale",
    "Learning artifact": "Artefatto di apprendimento",
    "Job ad / opportunity brief": "Annuncio / brief opportunita'",
    "Health / wearable snapshot": "Snapshot salute / wearable",
    "Context / finance snapshot": "Snapshot contesto / finanza",
    "Personal reflection": "Riflessione personale",
  },
};

export const extractionStatusLabels: Record<
  Locale,
  Record<EvidenceAttachmentExtractionStatus, string>
> = {
  en: {
    extracted: "Extracted preview",
    metadata_only: "Metadata only",
    failed: "Extraction failed",
  },
  it: {
    extracted: "Anteprima estratta",
    metadata_only: "Solo metadata",
    failed: "Estrazione non riuscita",
  },
};

export const coverageAreaLabels: Record<Locale, Record<EvidenceAttachmentCoverageArea, string>> = {
  en: {
    Patterns: "Patterns",
    Why: "Why",
    Ikigai: "Ikigai",
    Wellbeing: "Wellbeing",
    Skills: "Skills",
    Opportunities: "Opportunities",
    Experiments: "Experiments",
    Dossier: "Dossier",
  },
  it: {
    Patterns: "Pattern",
    Why: "Why",
    Ikigai: "Ikigai",
    Wellbeing: "Benessere",
    Skills: "Skill",
    Opportunities: "Opportunita'",
    Experiments: "Esperimenti",
    Dossier: "Dossier",
  },
};
