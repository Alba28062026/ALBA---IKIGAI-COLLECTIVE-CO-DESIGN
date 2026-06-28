export const allEvidenceAttachmentSourceTypes = [
  "Feedback",
  "Achievement",
  "Story",
  "Routine",
  "Research note",
  "CV / Resume",
  "LinkedIn profile export",
  "Visual attachment",
  "Certificate / credential",
  "Learning artifact",
  "Job ad / opportunity brief",
  "Health / wearable snapshot",
  "Context / finance snapshot",
  "Personal reflection",
] as const;

export type EvidenceAttachmentSourceType =
  (typeof allEvidenceAttachmentSourceTypes)[number];

export const allEvidenceAttachmentCoverageAreas = [
  "Patterns",
  "Why",
  "Ikigai",
  "Wellbeing",
  "Skills",
  "Opportunities",
  "Experiments",
  "Dossier",
] as const;

export type EvidenceAttachmentCoverageArea =
  (typeof allEvidenceAttachmentCoverageAreas)[number];

export type EvidenceAttachmentExtractionStatus =
  | "extracted"
  | "metadata_only"
  | "failed";

export type EvidenceAttachmentExtractionResult = {
  status: EvidenceAttachmentExtractionStatus;
  preview?: string;
  textLength?: number;
  error?: string;
};

export type StoredEvidenceAttachment = {
  id: string;
  originalName: string;
  storedName: string;
  relativePath: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
  titleSuggestion: string;
  sourceTypeSuggestion: EvidenceAttachmentSourceType;
  summarySuggestion?: string;
  tagsSuggestion: string[];
  coverageAreas: EvidenceAttachmentCoverageArea[];
  extractionStatus: EvidenceAttachmentExtractionStatus;
  extractionPreview?: string;
};

export const evidenceAttachmentIntakeDir = "vault/evidence-intake";
export const evidenceAttachmentMetaSuffix = ".meta.json";

export const evidenceAttachmentAccept =
  ".pdf,.doc,.docx,.txt,.md,.markdown,.json,.csv,.png,.jpg,.jpeg,.webp";

export const evidenceAttachmentFormats = [
  "PDF",
  "DOC",
  "DOCX",
  "TXT",
  "MD",
  "JSON",
  "CSV",
  "PNG",
  "JPG",
  "WEBP",
];

export function sanitizeFilename(filename: string) {
  return filename
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .replace(/-+/g, "-")
    .toLowerCase();
}

export function getFileExtension(filename: string) {
  const match = filename.toLowerCase().match(/\.([a-z0-9]+)$/);
  return match?.[1] ?? "";
}

export function guessAttachmentTitle(filename: string) {
  const raw = filename.replace(/\.[^.]+$/, "");
  const normalized = raw.replace(/[_-]+/g, " ").trim();

  if (!normalized) {
    return "New attachment evidence";
  }

  return normalized.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function uniqueCoverageAreas(areas: EvidenceAttachmentCoverageArea[]) {
  return Array.from(new Set(areas));
}

export function isEvidenceAttachmentSourceType(
  value: string,
): value is EvidenceAttachmentSourceType {
  return (allEvidenceAttachmentSourceTypes as readonly string[]).includes(value);
}

export function isEvidenceAttachmentCoverageArea(
  value: string,
): value is EvidenceAttachmentCoverageArea {
  return (allEvidenceAttachmentCoverageAreas as readonly string[]).includes(value);
}

export function guessAttachmentSourceType(
  filename: string,
  mimeType = "",
): EvidenceAttachmentSourceType {
  const lower = filename.toLowerCase();
  const extension = getFileExtension(filename);
  const looksLikeResearch =
    lower.includes("research") ||
    lower.includes("note") ||
    lower.includes("article") ||
    lower.includes("study");
  const looksLikeReflection =
    lower.includes("journal") ||
    lower.includes("reflection") ||
    lower.includes("diary") ||
    lower.includes("personal");
  const looksLikeCredential =
    lower.includes("certificate") ||
    lower.includes("credential") ||
    lower.includes("badge") ||
    lower.includes("license");
  const looksLikeLearningArtifact =
    lower.includes("case-study") ||
    lower.includes("case study") ||
    lower.includes("portfolio") ||
    lower.includes("project") ||
    lower.includes("learning artifact");
  const looksLikeJobAd =
    lower.includes("job") ||
    lower.includes("vacancy") ||
    lower.includes("role") ||
    lower.includes("jd") ||
    lower.includes("description") ||
    lower.includes("opportunity");
  const looksLikeHealth =
    lower.includes("wearable") ||
    lower.includes("sleep") ||
    lower.includes("hrv") ||
    lower.includes("steps") ||
    lower.includes("garmin") ||
    lower.includes("oura") ||
    lower.includes("whoop") ||
    lower.includes("fitbit") ||
    lower.includes("health");
  const looksLikeFinance =
    lower.includes("budget") ||
    lower.includes("finance") ||
    lower.includes("income") ||
    lower.includes("expense") ||
    lower.includes("salary") ||
    lower.includes("cashflow") ||
    lower.includes("money");

  if (lower.includes("linkedin")) {
    return "LinkedIn profile export";
  }

  if (lower.includes("cv") || lower.includes("resume") || lower.includes("curriculum")) {
    return "CV / Resume";
  }

  if (looksLikeCredential) {
    return "Certificate / credential";
  }

  if (looksLikeJobAd) {
    return "Job ad / opportunity brief";
  }

  if (looksLikeHealth) {
    return "Health / wearable snapshot";
  }

  if (looksLikeFinance) {
    return "Context / finance snapshot";
  }

  if (looksLikeReflection) {
    return "Personal reflection";
  }

  if (looksLikeLearningArtifact) {
    return "Learning artifact";
  }

  if (mimeType.startsWith("image/")) {
    return "Visual attachment";
  }

  if (looksLikeResearch || ["md", "markdown", "txt", "json", "csv"].includes(extension)) {
    return "Research note";
  }

  if (extension === "doc" || extension === "docx") {
    return "CV / Resume";
  }

  return "Story";
}

export function guessAttachmentTags(filename: string, extractedText = "") {
  const haystack = `${filename} ${extractedText}`.toLowerCase();
  const tags = new Set<string>();

  if (haystack.includes("linkedin")) tags.add("linkedin");
  if (haystack.includes("cv") || haystack.includes("resume")) tags.add("cv");
  if (haystack.includes("certificate") || haystack.includes("credential")) tags.add("credential");
  if (haystack.includes("job") || haystack.includes("vacancy")) tags.add("opportunity");
  if (haystack.includes("sleep") || haystack.includes("hrv") || haystack.includes("wearable")) {
    tags.add("wellbeing");
  }
  if (haystack.includes("budget") || haystack.includes("finance") || haystack.includes("salary")) {
    tags.add("finance");
  }
  if (haystack.includes("workshop")) tags.add("facilitazione");
  if (haystack.includes("learning")) tags.add("apprendimento");
  if (haystack.includes("career")) tags.add("career");
  if (haystack.includes("skills")) tags.add("skill");
  if (haystack.includes("wellbeing")) tags.add("wellbeing");
  if (haystack.includes("purpose")) tags.add("purpose");
  if (haystack.includes("portfolio")) tags.add("portfolio");

  return Array.from(tags);
}

export function inferAttachmentCoverageAreas(
  sourceTypeSuggestion: EvidenceAttachmentSourceType,
  filename: string,
  extractedText = "",
) {
  const haystack = `${filename} ${extractedText}`.toLowerCase();

  const areasBySource: Record<
    EvidenceAttachmentSourceType,
    EvidenceAttachmentCoverageArea[]
  > = {
    Feedback: ["Patterns", "Skills", "Why", "Dossier"],
    Achievement: ["Patterns", "Skills", "Why", "Ikigai", "Dossier"],
    Story: ["Patterns", "Why", "Ikigai", "Dossier"],
    Routine: ["Wellbeing", "Experiments", "Dossier"],
    "Research note": ["Patterns", "Skills", "Why", "Opportunities", "Dossier"],
    "CV / Resume": ["Skills", "Why", "Ikigai", "Opportunities", "Dossier"],
    "LinkedIn profile export": ["Skills", "Why", "Ikigai", "Opportunities", "Dossier"],
    "Visual attachment": ["Patterns", "Why", "Ikigai", "Wellbeing", "Dossier"],
    "Certificate / credential": ["Skills", "Opportunities", "Dossier"],
    "Learning artifact": ["Skills", "Why", "Opportunities", "Dossier"],
    "Job ad / opportunity brief": ["Skills", "Opportunities", "Experiments", "Dossier"],
    "Health / wearable snapshot": ["Wellbeing", "Experiments", "Dossier"],
    "Context / finance snapshot": ["Wellbeing", "Opportunities", "Experiments", "Dossier"],
    "Personal reflection": ["Patterns", "Why", "Ikigai", "Wellbeing", "Dossier"],
  };

  const inferred = [...areasBySource[sourceTypeSuggestion]];

  if (
    haystack.includes("purpose") ||
    haystack.includes("meaning") ||
    haystack.includes("calling")
  ) {
    inferred.push("Why", "Ikigai");
  }

  if (
    haystack.includes("sleep") ||
    haystack.includes("energy") ||
    haystack.includes("hrv") ||
    haystack.includes("stress") ||
    haystack.includes("wellbeing")
  ) {
    inferred.push("Wellbeing", "Experiments");
  }

  if (
    haystack.includes("job") ||
    haystack.includes("role") ||
    haystack.includes("vacancy") ||
    haystack.includes("skills") ||
    haystack.includes("career")
  ) {
    inferred.push("Skills", "Opportunities");
  }

  if (
    haystack.includes("workshop") ||
    haystack.includes("feedback") ||
    haystack.includes("achievement") ||
    haystack.includes("pattern")
  ) {
    inferred.push("Patterns");
  }

  return uniqueCoverageAreas(inferred);
}

export function buildSummarySuggestion(
  extractionPreview: string | undefined,
  sourceTypeSuggestion: EvidenceAttachmentSourceType,
) {
  if (extractionPreview) {
    return extractionPreview;
  }

  switch (sourceTypeSuggestion) {
    case "LinkedIn profile export":
      return "LinkedIn profile export attached locally. Observable signals will be refined from the uploaded material.";
    case "CV / Resume":
      return "CV or resume attached locally. Observable signals will be refined from the uploaded material.";
    case "Certificate / credential":
      return "Credential attached locally. Skills and opportunity signals will be refined from the uploaded material.";
    case "Job ad / opportunity brief":
      return "Opportunity material attached locally. Fit, context, and scenario signals will be refined from the uploaded material.";
    case "Health / wearable snapshot":
      return "Wellbeing snapshot stored locally. Any interpretation stays non-clinical and will remain a hypothesis to validate.";
    case "Context / finance snapshot":
      return "Context snapshot stored locally. Opportunity and wellbeing implications will be refined cautiously from the uploaded material.";
    case "Personal reflection":
      return "Personal reflection stored locally. Why, Ikigai, and pattern signals will be refined cautiously from the uploaded material.";
    case "Visual attachment":
      return "Visual attachment stored locally as supporting evidence for later interpretation.";
    default:
      return "Attachment stored locally as evidence input. Observable signals will be refined in the next step.";
  }
}

export function formatAttachmentSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function truncateText(value: string | undefined, maxLength = 220) {
  const normalized = value?.trim();

  if (!normalized) {
    return "";
  }

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}
