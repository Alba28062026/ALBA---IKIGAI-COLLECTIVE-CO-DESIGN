#!/usr/bin/env python3

import json
import re
import sys
from pathlib import Path


TEXT_EXTENSIONS = {
    ".txt",
    ".md",
    ".markdown",
    ".json",
    ".csv",
}


def normalize_preview(text: str) -> str:
    compact = re.sub(r"\s+", " ", text or "").strip()
    return compact[:640]


def extract_text(path: Path) -> str:
    suffix = path.suffix.lower()

    if suffix in TEXT_EXTENSIONS:
        return path.read_text(encoding="utf-8", errors="ignore")

    if suffix == ".pdf":
        from pypdf import PdfReader

        reader = PdfReader(str(path))
        pages = [(page.extract_text() or "") for page in reader.pages]
        return "\n".join(pages)

    if suffix == ".docx":
        from docx import Document

        document = Document(str(path))
        paragraphs = [paragraph.text for paragraph in document.paragraphs]
        return "\n".join(paragraphs)

    return ""


def main() -> None:
    if len(sys.argv) < 2:
        print(json.dumps({"status": "failed", "error": "Missing file path"}))
        return

    target = Path(sys.argv[1])

    if not target.exists():
        print(json.dumps({"status": "failed", "error": "File not found"}))
        return

    try:
        extracted = extract_text(target)
        preview = normalize_preview(extracted)

        if preview:
            print(
                json.dumps(
                    {
                        "status": "extracted",
                        "preview": preview,
                        "textLength": len(extracted),
                    }
                )
            )
            return

        print(json.dumps({"status": "metadata_only"}))
    except Exception as exc:
        print(
            json.dumps(
                {
                    "status": "metadata_only",
                    "error": str(exc),
                }
            )
        )


if __name__ == "__main__":
    main()
