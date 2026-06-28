import "server-only";

import os from "node:os";
import path from "node:path";
import { access } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { EvidenceAttachmentExtractionResult } from "@/lib/evidence-attachments";

const execFileAsync = promisify(execFile);

async function canAccess(candidate: string) {
  try {
    await access(candidate);
    return true;
  } catch {
    return false;
  }
}

async function resolvePythonExecutable() {
  const homeDirectory = process.env.HOME ?? os.homedir();
  const bundledPython = path.join(
    homeDirectory,
    ".cache",
    "codex-runtimes",
    "codex-primary-runtime",
    "dependencies",
    "python",
    "bin",
    "python3",
  );

  const candidates = [
    process.env.ALBA_PYTHON_BIN,
    process.env.PYTHON_BIN,
    bundledPython,
    "/usr/bin/python3",
    "python3",
  ].filter(Boolean) as string[];

  for (const candidate of candidates) {
    if (!candidate.includes(path.sep)) {
      return candidate;
    }

    if (await canAccess(candidate)) {
      return candidate;
    }
  }

  return "python3";
}

export async function extractEvidenceAttachment(
  absolutePath: string,
): Promise<EvidenceAttachmentExtractionResult> {
  const pythonExecutable = await resolvePythonExecutable();
  const scriptPath = path.join(process.cwd(), "scripts", "extract_evidence_attachment.py");

  try {
    const { stdout } = await execFileAsync(pythonExecutable, [scriptPath, absolutePath], {
      timeout: 15000,
      maxBuffer: 1024 * 1024 * 4,
    });

    const parsed = JSON.parse(stdout || "{}") as EvidenceAttachmentExtractionResult;

    if (
      parsed.status === "extracted" ||
      parsed.status === "metadata_only" ||
      parsed.status === "failed"
    ) {
      return parsed;
    }

    return {
      status: "metadata_only",
    };
  } catch (error) {
    return {
      status: "metadata_only",
      error: error instanceof Error ? error.message : "Attachment extraction failed.",
    };
  }
}
