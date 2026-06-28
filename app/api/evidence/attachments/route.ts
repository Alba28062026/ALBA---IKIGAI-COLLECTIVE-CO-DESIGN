import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { NextResponse } from "next/server";
import { isPublicSharedDemo } from "@/lib/demo-mode";
import { extractEvidenceAttachment } from "@/lib/evidence-attachment-extractor";
import {
  buildSummarySuggestion,
  guessAttachmentSourceType,
  guessAttachmentTags,
  guessAttachmentTitle,
  inferAttachmentCoverageAreas,
  isEvidenceAttachmentCoverageArea,
  isEvidenceAttachmentSourceType,
  uniqueCoverageAreas,
  sanitizeFilename,
  type EvidenceAttachmentCoverageArea,
  type EvidenceAttachmentSourceType,
  type StoredEvidenceAttachment,
} from "@/lib/evidence-attachments";
import {
  buildEvidenceAttachmentAbsolutePath,
  buildEvidenceAttachmentMetaAbsolutePath,
  buildEvidenceAttachmentRelativePath,
  ensureEvidenceAttachmentIntakeDir,
} from "@/lib/evidence-upload-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isUploadFile(value: FormDataEntryValue): value is File {
  return typeof value !== "string" && typeof value.arrayBuffer === "function";
}

type UploadPreferences = {
  preferredCoverageAreas: EvidenceAttachmentCoverageArea[];
  preferredSourceType?: EvidenceAttachmentSourceType;
};

async function storeUploadedFile(
  file: File,
  preferences: UploadPreferences,
): Promise<StoredEvidenceAttachment> {
  const id = randomUUID();
  const timestamp = Date.now();
  const normalizedFilename = sanitizeFilename(file.name);
  const safeFilename = normalizedFilename || `attachment-${id.slice(0, 8)}`;
  const storedName = `${timestamp}-${safeFilename}`;
  const absolutePath = buildEvidenceAttachmentAbsolutePath(storedName);
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(absolutePath, buffer);

  const extraction = await extractEvidenceAttachment(absolutePath);
  const sourceTypeSuggestion =
    preferences.preferredSourceType ?? guessAttachmentSourceType(file.name, file.type);
  const preview = extraction.preview?.trim();
  const inferredCoverageAreas = inferAttachmentCoverageAreas(
    sourceTypeSuggestion,
    file.name,
    preview,
  );
  const coverageAreas = uniqueCoverageAreas([
    ...preferences.preferredCoverageAreas,
    ...inferredCoverageAreas,
  ]);

  const metadata: StoredEvidenceAttachment = {
    id,
    originalName: file.name,
    storedName,
    relativePath: buildEvidenceAttachmentRelativePath(storedName),
    mimeType: file.type || "application/octet-stream",
    sizeBytes: file.size,
    uploadedAt: new Date(timestamp).toISOString(),
    titleSuggestion: guessAttachmentTitle(file.name),
    sourceTypeSuggestion,
    summarySuggestion: buildSummarySuggestion(preview, sourceTypeSuggestion),
    tagsSuggestion: guessAttachmentTags(file.name, preview),
    coverageAreas,
    extractionStatus: extraction.status,
    extractionPreview: preview,
  };

  await writeFile(
    buildEvidenceAttachmentMetaAbsolutePath(storedName),
    JSON.stringify(metadata, null, 2),
    "utf8",
  );

  return metadata;
}

export async function POST(request: Request) {
  try {
    if (isPublicSharedDemo()) {
      return NextResponse.json(
        {
          error:
            "This shared public demo is read-only. Uploads are disabled so no participant files are stored.",
        },
        { status: 403 },
      );
    }

    const formData = await request.formData();
    const files = formData.getAll("files").filter(isUploadFile).filter((file) => file.size > 0);
    const preferredSourceTypeRaw = formData.get("preferredSourceType");
    const preferredSourceType =
      typeof preferredSourceTypeRaw === "string" &&
      preferredSourceTypeRaw !== "auto" &&
      isEvidenceAttachmentSourceType(preferredSourceTypeRaw)
        ? preferredSourceTypeRaw
        : undefined;
    const preferredCoverageAreas = formData
      .getAll("preferredCoverageAreas")
      .filter((value): value is string => typeof value === "string")
      .filter(isEvidenceAttachmentCoverageArea);

    if (files.length === 0) {
      return NextResponse.json(
        {
          error: "No files received. Use the attachment picker to upload one or more evidence files.",
        },
        { status: 400 },
      );
    }

    await ensureEvidenceAttachmentIntakeDir();

    const attachments = await Promise.all(
      files.map((file) =>
        storeUploadedFile(file, {
          preferredCoverageAreas,
          preferredSourceType,
        }),
      ),
    );

    return NextResponse.json(
      {
        attachments,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Evidence attachment upload failed.",
      },
      { status: 500 },
    );
  }
}
