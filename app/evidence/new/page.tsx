import { EvidenceForm } from "@/components/EvidenceForm";
import { readStoredEvidenceAttachments } from "@/lib/evidence-upload-store";
import { resolveLocale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

type NewEvidencePageProps = {
  searchParams?: Promise<{
    lang?: string | string[];
  }>;
};

export default async function NewEvidencePage({ searchParams }: NewEvidencePageProps) {
  const params = await searchParams;
  const locale = resolveLocale(params?.lang);
  const storedAttachments = await readStoredEvidenceAttachments({
    previewMaxLength: 180,
    summaryMaxLength: 220,
  });
  const copy = {
    en: {
      eyebrow: "New evidence",
      title: "Local intake for evidence and attachments.",
      description:
        "Use this screen to add evidence manually or upload materials you already have, such as a CV, a LinkedIn export, certificates, job ads, wearable snapshots, finance/context notes, screenshots, or research files. Alba keeps the same structure in English and Italian, stores attachments locally first, and can later reuse them across Skills, Why, Ikigai, Wellbeing, Opportunities, Experiments, and Dossier.",
    },
    it: {
      eyebrow: "Nuova evidenza",
      title: "Intake locale per evidenze e allegati.",
      description:
        "Usa questa schermata per aggiungere un'evidenza a mano oppure caricare materiali che hai gia', come CV, export LinkedIn, certificati, job ad, snapshot wearable, note finanziarie o di contesto, screenshot o file di ricerca. Alba mantiene la stessa struttura in italiano e in inglese, salva prima gli allegati in locale e puo' poi riusarli anche in Skills, Why, Ikigai, Wellbeing, Opportunities, Experiments e Dossier.",
    },
  }[locale];

  return (
    <div className="space-y-8">
      <section className="card-surface">
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2 className="mt-3 font-heading text-4xl text-alba-ink">{copy.title}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-alba-ink/72">{copy.description}</p>
      </section>

      <EvidenceForm initialAttachments={storedAttachments} locale={locale} />
    </div>
  );
}
