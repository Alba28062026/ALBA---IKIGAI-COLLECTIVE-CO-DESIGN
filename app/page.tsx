import Link from "next/link";
import { AttachmentCoverageChips } from "@/components/AttachmentCoverageChips";
import { EmptyStateNotice } from "@/components/EmptyStateNotice";
import { PhaseCard } from "@/components/PhaseCard";
import { allEvidenceAttachmentCoverageAreas } from "@/lib/evidence-attachments";
import { readStoredEvidenceAttachments } from "@/lib/evidence-upload-store";
import { buildAppHref, resolveLocale } from "@/lib/i18n";

type HomePageProps = {
  searchParams?: Promise<{
    lang?: string | string[];
  }>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const locale = resolveLocale(params?.lang);
  const storedAttachments = await readStoredEvidenceAttachments();
  const copy = {
    en: {
      emptyTitle: "This shared ALBA demo now starts from a true blank state.",
      emptyDescription:
        "All personal uploads have been removed. The prototype keeps the full journey structure, but it waits for real Phase 1 inputs before generating patterns, WHY hypotheses, taxonomy translations, scenarios, opportunities, or activation moves.",
      startNow: "Start from Evidence",
      phases: [
        {
          phase: "Phase 1",
          title: "Awareness",
          description:
            "Collect evidence, values, strengths, constraints, and wellbeing baseline without making identity claims.",
          inputs: [
            "Evidence, attachments, feedback, history",
            "Values, interests, and constraints",
            "Current wellbeing baseline",
          ],
          outputs: [
            "Portable Human Portfolio",
            "Cautious signals and patterns",
            "Provisional WHY to validate",
          ],
          href: "/evidence",
        },
        {
          phase: "Phase 2",
          title: "Simulation",
          description:
            "Translate the portfolio into ESCO and O*NET language, position hypotheses on Ikigai, and compare them against wellbeing targets.",
          inputs: [
            "Portable Human Portfolio",
            "Ikigai direction to test",
            "Desired wellbeing thresholds",
          ],
          outputs: [
            "ESCO / O*NET translation layer",
            "Scenario hypotheses to compare",
            "Decision criteria across Ikigai and wellbeing",
          ],
          href: "/skills",
        },
        {
          phase: "Phase 3",
          title: "Activation",
          description:
            "Turn simulation outputs into practical opportunities, routines, experiments, and next choices.",
          inputs: [
            "Simulation outputs",
            "Chosen direction to validate",
            "Real-world constraints",
          ],
          outputs: [
            "Possible professional opportunities",
            "Activation plan and routines",
            "Concrete experiments and next moves",
          ],
          href: "/opportunities",
        },
      ],
      journeyEyebrow: "Journey architecture",
      journeyTitle: "The three-phase ALBA flow stays intact.",
      journeyDescription:
        "The structure is unchanged in English and Italian. What changed is only the state: the demo is now empty and ready to be populated from scratch.",
      intakeEyebrow: "Local intake",
      intakeTitle: "One local upload flow can still feed the whole ALBA map.",
      intakeDescription:
        "When you add your first file in Evidence, Alba can later reuse it across Patterns, Why, Ikigai, Wellbeing, Skills, Opportunities, Experiments, and Dossier.",
      intakeEmpty:
        "No local attachment is stored right now. This shared build is clean and ready for a fresh first upload.",
      intakeStoredPrefix: "Stored local drafts",
      intakeStoredSuffix: "available now",
      openIntake: "Open local intake",
      infographicLabel: "Presentation aid",
      infographicTitle: "Open the ALBA infographic",
      infographicDescription:
        "Use the infographic as the fast visual explanation of ALBA's objective, phases, and privacy-first guardrails.",
      openInfographic: "Open infographic",
    },
    it: {
      emptyTitle: "Questa demo condivisibile di ALBA ora parte da un vero stato vuoto.",
      emptyDescription:
        "Tutti gli upload personali sono stati rimossi. Il prototipo mantiene l'intera struttura del journey, ma aspetta input reali di fase 1 prima di generare pattern, ipotesi WHY, traduzioni tassonomiche, scenari, opportunita' o mosse di activation.",
      startNow: "Parti da Evidence",
      phases: [
        {
          phase: "Fase 1",
          title: "Awareness",
          description:
            "Raccogli evidenze, valori, punti di forza, vincoli e baseline di wellbeing senza fare claim identitari.",
          inputs: [
            "Evidenze, allegati, feedback, storia",
            "Valori, interessi e vincoli",
            "Baseline attuale di wellbeing",
          ],
          outputs: [
            "Portable Human Portfolio",
            "Segnali e pattern prudenti",
            "WHY provvisorio da validare",
          ],
          href: "/evidence",
        },
        {
          phase: "Fase 2",
          title: "Simulation",
          description:
            "Traduce il portfolio nel linguaggio ESCO e O*NET, posiziona le ipotesi su Ikigai e le confronta con i target di wellbeing.",
          inputs: [
            "Portable Human Portfolio",
            "Direzione Ikigai da testare",
            "Soglie desiderate di wellbeing",
          ],
          outputs: [
            "Layer di traduzione ESCO / O*NET",
            "Ipotesi di scenario da confrontare",
            "Criteri decisionali tra Ikigai e wellbeing",
          ],
          href: "/skills",
        },
        {
          phase: "Fase 3",
          title: "Activation",
          description:
            "Trasforma gli output della simulation in opportunita' pratiche, routine, esperimenti e prossime scelte.",
          inputs: [
            "Output della simulation",
            "Direzione scelta da validare",
            "Vincoli del mondo reale",
          ],
          outputs: [
            "Possibili opportunita' professionali",
            "Piano di activation e routine",
            "Esperimenti concreti e prossime mosse",
          ],
          href: "/opportunities",
        },
      ],
      journeyEyebrow: "Architettura del journey",
      journeyTitle: "Il flusso ALBA in tre fasi resta intatto.",
      journeyDescription:
        "La struttura e' identica in inglese e in italiano. E' cambiato solo lo stato: la demo ora e' vuota e pronta a popolarsi da zero.",
      intakeEyebrow: "Intake locale",
      intakeTitle: "Un solo flusso di upload locale puo' ancora alimentare tutta la mappa ALBA.",
      intakeDescription:
        "Quando aggiungi il primo file in Evidence, Alba potra' poi riusarlo anche in Patterns, Why, Ikigai, Wellbeing, Skills, Opportunities, Experiments e Dossier.",
      intakeEmpty:
        "Adesso non e' salvato nessun allegato locale. Questa build condivisibile e' pulita e pronta per un primo upload da zero.",
      intakeStoredPrefix: "Bozze locali salvate",
      intakeStoredSuffix: "gia' disponibili",
      openIntake: "Apri intake locale",
      infographicLabel: "Supporto presentazione",
      infographicTitle: "Apri l'infografica di ALBA",
      infographicDescription:
        "Usa l'infografica come spiegazione visiva rapida dell'obiettivo di ALBA, delle sue fasi e dei guardrail privacy-first.",
      openInfographic: "Apri infografica",
    },
  }[locale];

  return (
    <div className="space-y-8">
      <EmptyStateNotice
        ctaHref={buildAppHref("/evidence", { locale })}
        ctaLabel={copy.startNow}
        description={copy.emptyDescription}
        locale={locale}
        title={copy.emptyTitle}
      />

      <section className="space-y-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow">{copy.journeyEyebrow}</p>
            <h2 className="mt-3 font-heading text-4xl text-alba-ink">{copy.journeyTitle}</h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-alba-ink/68">
            {copy.journeyDescription}
          </p>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          {copy.phases.map((phase) => (
            <PhaseCard key={phase.phase} {...phase} locale={locale} />
          ))}
        </div>
      </section>

      <section className="card-surface">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow">{copy.intakeEyebrow}</p>
            <h2 className="mt-3 font-heading text-3xl text-alba-ink">{copy.intakeTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-alba-ink/72">{copy.intakeDescription}</p>
          </div>

          <Link
            href={buildAppHref("/evidence/new", { locale })}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-alba-forest px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#16443c]"
          >
            {copy.openIntake}
          </Link>
        </div>

        <div className="mt-6 rounded-[1.6rem] bg-alba-cream/72 p-4">
          <p className="text-sm text-alba-ink/72">
            {storedAttachments.length > 0
              ? `${copy.intakeStoredPrefix}: ${storedAttachments.length} ${copy.intakeStoredSuffix}.`
              : copy.intakeEmpty}
          </p>

          <div className="mt-4">
            <AttachmentCoverageChips
              areas={[...allEvidenceAttachmentCoverageAreas]}
              locale={locale}
            />
          </div>
        </div>
      </section>

      <section className="card-surface">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow">{copy.infographicLabel}</p>
            <h2 className="mt-3 font-heading text-3xl text-alba-ink">{copy.infographicTitle}</h2>
            <p className="mt-4 text-sm leading-7 text-alba-ink/72">
              {copy.infographicDescription}
            </p>
          </div>
          <Link
            href={buildAppHref("/infographic", { locale })}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-alba-clay px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#b55828]"
          >
            {copy.openInfographic}
          </Link>
        </div>
      </section>
    </div>
  );
}
