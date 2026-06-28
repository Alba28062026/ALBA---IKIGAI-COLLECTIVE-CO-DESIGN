import {
  coverageAreaLabels,
} from "@/lib/evidence-labels";
import type { EvidenceAttachmentCoverageArea } from "@/lib/evidence-attachments";
import type { Locale } from "@/lib/i18n";

type AttachmentCoverageChipsProps = {
  areas: EvidenceAttachmentCoverageArea[];
  locale?: Locale;
};

export function AttachmentCoverageChips({
  areas,
  locale = "en",
}: AttachmentCoverageChipsProps) {
  if (areas.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {areas.map((area) => (
        <span
          key={area}
          className="rounded-full border border-alba-forest/12 bg-white px-3 py-1 text-xs text-alba-forest"
        >
          {coverageAreaLabels[locale][area]}
        </span>
      ))}
    </div>
  );
}
