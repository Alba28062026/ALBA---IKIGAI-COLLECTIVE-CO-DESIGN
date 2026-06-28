import "server-only";

import path from "node:path";
import { access, mkdir, readFile, readdir } from "node:fs/promises";
import { isPublicSharedDemo } from "@/lib/demo-mode";
import {
  buildSummarySuggestion,
  evidenceAttachmentIntakeDir,
  evidenceAttachmentMetaSuffix,
  guessAttachmentSourceType,
  guessAttachmentTags,
  guessAttachmentTitle,
  inferAttachmentCoverageAreas,
  isEvidenceAttachmentCoverageArea,
  isEvidenceAttachmentSourceType,
  truncateText,
  uniqueCoverageAreas,
  type StoredEvidenceAttachment,
} from "@/lib/evidence-attachments";

export function getEvidenceAttachmentIntakeAbsolutePath() {
  return path.join(process.cwd(), evidenceAttachmentIntakeDir);
}

export function buildEvidenceAttachmentRelativePath(storedName: string) {
  return `${evidenceAttachmentIntakeDir}/${storedName}`;
}

export function buildEvidenceAttachmentAbsolutePath(storedName: string) {
  return path.join(getEvidenceAttachmentIntakeAbsolutePath(), storedName);
}

export function buildEvidenceAttachmentMetaAbsolutePath(storedName: string) {
  return path.join(
    getEvidenceAttachmentIntakeAbsolutePath(),
    `${storedName}${evidenceAttachmentMetaSuffix}`,
  );
}

export async function ensureEvidenceAttachmentIntakeDir() {
  const directory = getEvidenceAttachmentIntakeAbsolutePath();

  await mkdir(directory, { recursive: true });

  return directory;
}

type ReadStoredEvidenceAttachmentsOptions = {
  previewMaxLength?: number;
  summaryMaxLength?: number;
};

function inferUploadedAt(storedName: string) {
  const timestamp = Number(storedName.split("-")[0]);

  if (Number.isFinite(timestamp) && timestamp > 0) {
    return new Date(timestamp).toISOString();
  }

  return new Date(0).toISOString();
}

function normalizeStoredEvidenceAttachment(
  entryName: string,
  parsed: Partial<StoredEvidenceAttachment>,
  options: ReadStoredEvidenceAttachmentsOptions,
): StoredEvidenceAttachment {
  const storedName =
    typeof parsed.storedName === "string" && parsed.storedName.trim().length > 0
      ? parsed.storedName
      : entryName.replace(evidenceAttachmentMetaSuffix, "");
  const originalName =
    typeof parsed.originalName === "string" && parsed.originalName.trim().length > 0
      ? parsed.originalName
      : storedName;
  const rawSourceType = parsed.sourceTypeSuggestion;
  const sourceTypeSuggestion: StoredEvidenceAttachment["sourceTypeSuggestion"] =
    typeof rawSourceType === "string" && isEvidenceAttachmentSourceType(rawSourceType)
      ? rawSourceType
      : guessAttachmentSourceType(originalName, parsed.mimeType ?? "");
  const extractionPreview = truncateText(parsed.extractionPreview, options.previewMaxLength ?? 220);
  const coverageAreas = uniqueCoverageAreas(
    (parsed.coverageAreas ?? []).filter(isEvidenceAttachmentCoverageArea),
  );
  const inferredCoverageAreas =
    coverageAreas.length > 0
      ? coverageAreas
      : inferAttachmentCoverageAreas(sourceTypeSuggestion, originalName, extractionPreview);

  return {
    id: typeof parsed.id === "string" && parsed.id.trim().length > 0 ? parsed.id : storedName,
    originalName,
    storedName,
    relativePath:
      typeof parsed.relativePath === "string" && parsed.relativePath.trim().length > 0
        ? parsed.relativePath
        : buildEvidenceAttachmentRelativePath(storedName),
    mimeType:
      typeof parsed.mimeType === "string" && parsed.mimeType.trim().length > 0
        ? parsed.mimeType
        : "application/octet-stream",
    sizeBytes: typeof parsed.sizeBytes === "number" && Number.isFinite(parsed.sizeBytes)
      ? parsed.sizeBytes
      : 0,
    uploadedAt:
      typeof parsed.uploadedAt === "string" && parsed.uploadedAt.trim().length > 0
        ? parsed.uploadedAt
        : inferUploadedAt(storedName),
    titleSuggestion:
      typeof parsed.titleSuggestion === "string" && parsed.titleSuggestion.trim().length > 0
        ? parsed.titleSuggestion
        : guessAttachmentTitle(originalName),
    sourceTypeSuggestion,
    summarySuggestion: truncateText(
      typeof parsed.summarySuggestion === "string" && parsed.summarySuggestion.trim().length > 0
        ? parsed.summarySuggestion
        : buildSummarySuggestion(extractionPreview, sourceTypeSuggestion),
      options.summaryMaxLength ?? 240,
    ),
    tagsSuggestion: Array.isArray(parsed.tagsSuggestion)
      ? parsed.tagsSuggestion.filter((value): value is string => typeof value === "string")
      : guessAttachmentTags(originalName, extractionPreview),
    coverageAreas: inferredCoverageAreas,
    extractionStatus:
      parsed.extractionStatus === "extracted" ||
      parsed.extractionStatus === "metadata_only" ||
      parsed.extractionStatus === "failed"
        ? parsed.extractionStatus
        : "metadata_only",
    extractionPreview,
  } satisfies StoredEvidenceAttachment;
}

export async function readStoredEvidenceAttachments(
  options: ReadStoredEvidenceAttachmentsOptions = {},
): Promise<StoredEvidenceAttachment[]> {
  if (isPublicSharedDemo()) {
    return [] satisfies StoredEvidenceAttachment[];
  }

  const directory = getEvidenceAttachmentIntakeAbsolutePath();

  try {
    await access(directory);
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;

    if (code === "ENOENT") {
      return [] satisfies StoredEvidenceAttachment[];
    }

    throw error;
  }

  const entries = await readdir(directory, { withFileTypes: true });
  const metaEntries = entries.filter(
    (entry) => entry.isFile() && entry.name.endsWith(evidenceAttachmentMetaSuffix),
  );

  const attachments = await Promise.all(
    metaEntries.map(async (entry) => {
      try {
        const payload = await readFile(path.join(directory, entry.name), "utf8");
        const parsed = JSON.parse(payload) as Partial<StoredEvidenceAttachment>;

        return normalizeStoredEvidenceAttachment(entry.name, parsed, options);
      } catch (error) {
        console.warn(
          `Skipping invalid evidence attachment metadata: ${entry.name}`,
          error instanceof Error ? error.message : error,
        );
        return null;
      }
    }),
  );

  return attachments
    .filter((attachment): attachment is StoredEvidenceAttachment => attachment !== null)
    .sort((left, right) => right.uploadedAt.localeCompare(left.uploadedAt));
}
