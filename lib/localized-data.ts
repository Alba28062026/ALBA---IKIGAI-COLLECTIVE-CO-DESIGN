import type { Locale } from "@/lib/i18n";
import { isBlankDemoMode } from "@/lib/demo-mode";
import {
  activationPlansMock,
  buildDossierMarkdown,
  buildDossierPayload,
  digitalTwinAgentMock,
  buildIkigaiMapForScenario,
  buildOpportunityGraphEntries,
  dossierExportMock,
  enrichWellbeingTargets,
  evidenceMock,
  experimentsMock,
  gamificationProfileMock,
  getActivationPlanForScenario,
  getDigitalTwinAgentReport,
  getExperimentForScenario,
  getIkigaiFocusForScenario,
  getOpportunitiesForSkill,
  getPatternsForEvidence,
  getGamificationProfile,
  getPrimaryOpportunityForScenario,
  getScenarioForRoute,
  getScenariosForOpportunity,
  getSignalsForEvidence,
  getSkillBandOnetSuggestions,
  getSkillsForOpportunity,
  getSkillsForScenario,
  getWellbeingFocusForScenario,
  ikigaiMapMock,
  opportunitiesMock,
  patternsMock,
  portfolioSummaryMock,
  scenariosMock,
  signalsMock,
  skillsMock,
  valuesMock,
  wellbeingTargetsMock,
  whyHypothesisMock,
} from "@/lib/mock-data";
import type {
  ActivationPlan,
  DigitalTwinAgentReport,
  DossierExport,
  Evidence,
  Experiment,
  GamificationProfile,
  IkigaiMap,
  Opportunity,
  Pattern,
  PortfolioSummary,
  Scenario,
  Signal,
  SkillProfile,
  WellbeingTarget,
  WhyHypothesis,
} from "@/lib/types";

type PartialMap<T extends { id: string }> = Record<string, Partial<T>>;

function localizeById<T extends { id: string }>(
  locale: Locale,
  items: T[],
  overrides: PartialMap<T>,
) {
  if (locale === "en") {
    return items;
  }

  return items.map((item) => ({
    ...item,
    ...(overrides[item.id] ?? {}),
  }));
}

function localizeSingle<T extends { id: string }>(locale: Locale, item: T, overrides: PartialMap<T>) {
  if (locale === "en") {
    return item;
  }

  return {
    ...item,
    ...(overrides[item.id] ?? {}),
  };
}

const valuesByLocale: Record<Locale, string[]> = {
  en: valuesMock,
  it: [
    "Curiosita' con rigore",
    "Contributo concreto",
    "Autonomia responsabile",
    "Allineamento tra vita e lavoro",
    "Crescita condivisa",
  ],
};

const evidenceIt: PartialMap<Evidence> = {
  "ev-retro-facilitation": {
    title: "Retrospettiva cross-team sull'adozione interna",
    sourceType: "Feedback di progetto",
    summary:
      "Un team misto tra prodotto e operations ha riportato che workshop strutturati e sintesi visiva hanno accelerato allineamento e decisioni.",
    dateLabel: "Febbraio 2026",
    note:
      "Segnale utile per riconoscere condizioni di flow legate alla mediazione della complessita'.",
    tags: ["facilitazione", "sensemaking", "collaborazione"],
  },
  "ev-learning-lab": {
    title: "Programma pilota di peer learning",
    sourceType: "Achievement",
    summary:
      "Un learning lab interno ha generato alta partecipazione, sessioni ripetute e richieste di follow-up sulle conversazioni di carriera.",
    dateLabel: "Novembre 2025",
    note:
      "Da validare come indicatore di motivazione nel costruire spazi di crescita condivisa.",
    tags: ["learning design", "peer learning", "community"],
  },
  "ev-taxonomy-note": {
    title: "Nota di ricerca sulle skill taxonomies",
    sourceType: "Studio personale",
    summary:
      "Una nota comparativa tra skill architecture, ESCO e O*NET ha reso visibili i legami tra capability, ruoli emergenti e work design.",
    dateLabel: "Gennaio 2026",
    note:
      "Possibile segnale di interesse di lungo periodo per ruoli ponte tra persone, lavoro e sistemi.",
    tags: ["ricerca", "taxonomy mapping", "future of work"],
  },
  "ev-feedback-clarity": {
    title: "Feedback sulla chiarezza in contesti ambigui",
    sourceType: "Feedback tra pari",
    summary:
      "I colleghi hanno riportato che emerge una forza distintiva quando input dispersi devono diventare narrazione, decisioni e prossimi passi pratici.",
    dateLabel: "Dicembre 2025",
    tags: ["chiarezza", "decision making", "narrazione"],
  },
  "ev-wellbeing-reset": {
    title: "Sprint personale di reset energetico",
    sourceType: "Routine / log di benessere",
    summary:
      "Un periodo di quattro settimane con sonno piu' regolare, camminate e blocchi di focus protetti ha migliorato energia e qualita' percepita del lavoro.",
    dateLabel: "Marzo 2026",
    note:
      "Non clinico: solo un segnale da validare sul rapporto tra contesto, ritmo e chiarezza.",
    tags: ["energia", "routine", "recovery"],
  },
};

const signalsIt: PartialMap<Signal> = {
  "sg-facilitation": {
    title: "Facilitazione trasformativa",
    description:
      "Nei gruppi misti emerge trazione quando il lavoro e' orchestrato con ritmo, domande e supporti visivi.",
    domain: "Power skill",
  },
  "sg-complexity": {
    title: "Traduzione della complessita'",
    description:
      "Pattern ricorrente nel trasformare ambiguita', tassonomie e decisioni in strumenti condivisi.",
    domain: "Skill strategica",
  },
  "sg-learning": {
    title: "Learning experience design",
    description:
      "Segnale ricorrente quando contenuti e sessioni sono progettati per attivare applicazione pratica e conversazioni di crescita.",
    domain: "Capacita'",
  },
  "sg-taxonomy": {
    title: "Interesse per le architetture di ruolo",
    description:
      "La motivazione cresce quando skill, ruoli e opportunita' vengono mappati in sistemi leggibili.",
    domain: "Interesse",
  },
  "sg-energy-social": {
    title: "Energia sostenibile in contesti intenzionali",
    description:
      "Routine, relazioni selettive e finestre di focus sembrano correlare con maggiore vitalita' ed efficacia.",
    domain: "Benessere",
  },
};

const patternsIt: PartialMap<Pattern> = {
  "pt-translation": {
    title: "Trasformare la complessita' in traiettorie pratiche",
    summary:
      "Pattern da validare: energia e qualita' del contributo aumentano quando il ruolo richiede sensemaking, architettura e facilitazione delle decisioni.",
    validationQuestion:
      "Questo pattern regge anche sotto pressione e in contesti meno collaborativi?",
    status: "Ipotesi",
  },
  "pt-community": {
    title: "Costruire spazi di crescita condivisa",
    summary:
      "Pattern da validare: la motivazione cresce quando il lavoro unisce apprendimento, relazioni nutrienti e supporto reciproco.",
    validationQuestion:
      "Quali condizioni organizzative rendono questo pattern sostenibile nel tempo?",
    status: "Cluster di segnali",
  },
  "pt-future-work": {
    title: "Orientamento verso il futuro del lavoro",
    summary:
      "Pattern da validare: la curiosita' resta alta quando il problema tocca work design, skill architecture e trasformazione organizzativa.",
    validationQuestion:
      "Questo segnale porta a un ruolo stabile o funziona meglio come side project e advisory?",
    status: "Esplorazione",
  },
};

const whyIt: PartialMap<WhyHypothesis> = {
  "why-purpose-bridge": {
    title: "WHY provvisorio",
    statement:
      "Ipotesi: creare contesti, mappe e conversazioni che aiutano persone e team a orientarsi con piu' chiarezza, crescita e coerenza.",
    status: "Provvisorio",
    evidenceNote:
      "Non e' un'etichetta identitaria: e' una sintesi operativa da validare con piu' evidenze, esperimenti e contesti reali.",
  },
};

const wellbeingIt: PartialMap<WellbeingTarget> = {
  "wb-physical": { domain: "Fisico / Vitalita'", note: "Piu' continuita' in recovery e movimento leggero." },
  "wb-mental": { domain: "Mentale / Chiarezza cognitiva", note: "Proteggere focus e carico decisionale." },
  "wb-emotional": { domain: "Emotivo", note: "Ridurre dispersione e frizione prolungata." },
  "wb-relational": { domain: "Relazionale", note: "Coltivare scambi nutrienti e feedback di qualita'." },
  "wb-social": { domain: "Sociale / Appartenenza", note: "Aumentare il senso di tribu' professionale." },
  "wb-spiritual": { domain: "Spirituale / Purpose", note: "Rendere piu' visibile il legame tra lavoro e significato." },
  "wb-intellectual": { domain: "Intellettuale / Apprendimento", note: "Tenere viva la curiosita' attraverso output tangibili." },
  "wb-professional": { domain: "Professionale / Contributo", note: "Creare piu' spazio per ruoli a leva, non solo esecuzione." },
  "wb-financial": { domain: "Economico-finanziario", note: "Aumentare sicurezza e opzionalita'." },
  "wb-environment": { domain: "Ambiente / Stile di vita", note: "Un contesto piu' allineato con energia e routine." },
};

const skillsIt: PartialMap<SkillProfile> = {
  "sk-facilitation": {
    name: "Facilitazione di workshop",
    evidenceSignal: "Retrospettive cross-team e lab",
    note: "Gia' visibile in contesti multi-stakeholder.",
  },
  "sk-sensemaking": {
    name: "Sensemaking strategico",
    category: "Skill strategica",
    evidenceSignal: "Sintesi di input ambigui e tassonomie",
  },
  "sk-learning-design": {
    name: "Progettazione di esperienze di apprendimento",
    category: "Tecnica / human systems",
    evidenceSignal: "Programmi pilota e sessioni di peer learning",
  },
  "sk-opportunity-mapping": {
    name: "Opportunity mapping",
    category: "Portfolio / career design",
    evidenceSignal: "Interesse ricorrente per ruoli, tassonomie e futuri possibili",
  },
  "sk-mentorship": {
    name: "Mentorship strutturata",
    category: "Relazionale",
    evidenceSignal: "Forte trazione nelle conversazioni di crescita, non ancora sistematizzata",
  },
  "sk-portfolio-story": {
    name: "Narrazione di portfolio",
    category: "Comunicazione strategica",
    evidenceSignal: "Capacita' di collegare evidenze, pattern e scenari",
  },
  "sk-human-systems": {
    name: "Design di sistemi umani",
    category: "Sistemi",
    evidenceSignal: "Motivazione verso work design, rituali e contesti sostenibili",
  },
  "sk-taxonomy-translation": {
    name: "Traduzione ESCO / O*NET",
    category: "Ponte tassonomico",
    evidenceSignal: "Nota di ricerca su skill architecture e ruoli emergenti",
    note: "Nel primo sprint resta un placeholder esplicito con mock data.",
  },
};

const opportunityIt: PartialMap<Opportunity> = {
  "op-job-crafting": {
    title: "Job crafting nel ruolo attuale",
    path: "Scenario interno",
    summary:
      "Ricalibrare scope e rituali per aumentare facilitazione, learning design e contributo strategico senza cambiare subito contesto.",
    context:
      "Bassa frizione di transizione, alta dipendenza da quanto spazio reale si puo' negoziare nel ruolo attuale.",
    compensationModel: "Stabilita' + ridisegno dello scope",
    note:
      "Ipotesi credibile se il contesto consente davvero job crafting e visibilita' del contributo.",
  },
  "op-people-innovation": {
    title: "Nuovo ruolo: People Innovation / Future of Work",
    path: "Transizione di carriera",
    summary:
      "Ruolo ponte tra ricerca, experience design, skill architecture e trasformazione organizzativa.",
    context:
      "Transizione piu' impegnativa, ma con migliore convergenza tra curiosita', purpose e leva sistemica.",
    compensationModel: "Crescita di ruolo + posizionamento specialistico",
    note:
      "Richiede proof of work e una traduzione credibile delle skill attuali verso il mercato target.",
  },
  "op-purpose-lab": {
    title: "Side project: Purpose Lab",
    path: "Esperimento imprenditoriale",
    summary:
      "Product lab per human portfolios, wellbeing design e simulazione di scenari professionali.",
    context:
      "Alta liberta' creativa e forte allineamento, ma la sostenibilita' economica va validata in modo progressivo.",
    compensationModel: "Portfolio ibrido / validazione della domanda",
    note: "Utile come learning lab, non come salto impulsivo.",
  },
};

const scenarioIt: PartialMap<Scenario> = {
  "sc-job-crafting": {
    title: "Scenario 1 - Job crafting nel ruolo attuale",
    horizon: "90 giorni",
    thesis:
      "Redistribuire il lavoro verso piu' facilitazione, enablement e strategia narrativa per testare quanto spazio reale esiste nel contesto attuale.",
    ikigaiSignal:
      "Buon allineamento con i punti di forza esistenti, allineamento medio su sostenibilita' e purpose.",
    wellbeingShift:
      "Migliora contributo e relazioni, ma resta fragile se il contesto non cambia davvero.",
  },
  "sc-people-innovation": {
    title: "Scenario 2 - People Innovation / Future of Work",
    horizon: "6-12 mesi",
    thesis:
      "Ripositionarsi verso un ruolo esplicitamente focalizzato su skill architecture, learning systems e work design.",
    ikigaiSignal:
      "Area forte tra cio' che ami, bisogno del mondo e valore pagabile, con alcuni gap di contesto ancora da esplorare.",
    wellbeingShift:
      "Maggiore potenziale di flourishing, bilanciato dal rischio di transizione e dal bisogno di una narrativa forte.",
  },
  "sc-purpose-lab": {
    title: "Scenario 3 - Side project Purpose Lab",
    horizon: "12 settimane",
    thesis:
      "Usare un side project disciplinato per validare domanda, voce e formato del Portable Human Portfolio senza dipendere da un salto immediato.",
    ikigaiSignal:
      "Segnale piu' forte sul significato, con la sostenibilita' finanziaria ancora da costruire passo dopo passo.",
    wellbeingShift:
      "Aumenta energia creativa e purpose, ma richiede guardrail su carico e finanze personali.",
  },
};

const activationIt: PartialMap<ActivationPlan> = {
  "ap-role-redesign": {
    title: "Piano di attivazione - Ridisegno del ruolo",
    focus: "Rinegoziare lo scope del ruolo attuale con prove visibili di impatto.",
    duration: "4 settimane",
    moves: [
      "Preparare un breve deck narrativo con evidenze, pattern e attivita' ad alta leva.",
      "Proporre un esperimento mensile di workshop su allineamento e capability building.",
      "Ridurre almeno un task ad alta frizione e basso significato con una proposta alternativa.",
    ],
    wellbeingLevers: [
      "Sonno piu' regolare",
      "Walking meeting",
      "Blocchi di deep work protetti",
      "Pranzi piu' stabili",
      "Due sessioni di mobilita' a settimana",
    ],
    routineBundle: {
      sleep: [
        "Finestra del sonno entro 45 minuti",
        "Niente email negli ultimi 30 minuti della sera",
      ],
      nutrition: [
        "Un pranzo protein-forward preparato in anticipo",
        "Cue di idratazione all'inizio di ogni blocco di focus",
      ],
      movement: [
        "Walking meeting due volte a settimana",
        "Due brevi sessioni di mobilita' o forza leggera",
      ],
      recovery: [
        "Blocchi di deep work protetti",
        "Shutdown note di 10 minuti prima di chiudere il lavoro",
      ],
    },
    riskGuardrail:
      "Se dopo 30-45 giorni il contesto non crea spazio reale, non forzare il restare come unica opzione.",
  },
  "ap-transition-fow": {
    title: "Piano di attivazione - Transizione Future of Work",
    focus: "Costruire credibilita' di mercato per ruoli People Innovation / Future of Work.",
    duration: "8 settimane",
    moves: [
      "Tradurre 3 evidenze attuali in case study orientati a skill architecture e organizational learning.",
      "Mappare 15 job title target con linguaggio ESCO/O*NET placeholder e gap prioritari.",
      "Avviare 5 conversazioni esplorative con professionisti del dominio.",
    ],
    wellbeingLevers: [
      "Allenamento di forza leggero",
      "Mindfulness 10 min",
      "Boundary review settimanale",
      "Colazione piu' proteica",
      "Un blocco recovery senza meeting",
    ],
    routineBundle: {
      sleep: [
        "Orario di risveglio coerente nei giorni lavorativi",
        "Stop device 45 minuti prima di dormire per tre sere a settimana",
      ],
      nutrition: [
        "Colazione protein-first prima di interview o deep work",
        "Batch di una cena semplice nelle settimane di transizione",
      ],
      movement: [
        "Due sessioni leggere di forza",
        "Una camminata piu' lunga dopo networking o colloqui",
      ],
      recovery: [
        "Mindfulness 10 minuti",
        "Un blocco recovery senza meeting ogni settimana",
      ],
    },
    riskGuardrail:
      "Evitare upskilling dispersivo: scegliere 1-2 asset di portfolio con il segnale piu' forte.",
  },
  "ap-purpose-lab": {
    title: "Piano di attivazione - Purpose Lab",
    focus: "Validare un lab o un artifact utile senza trattarlo come identita' finale.",
    duration: "12 settimane",
    moves: [
      "Costruire una demo low-fi del dossier esportabile e di una pagina scenario/fit.",
      "Testare 3 conversazioni guidate con profili pilota usando solo il framework mock e nessuna diagnosi.",
      "Definire una micro-offerta coerente con vincoli di tempo ed energia.",
    ],
    wellbeingLevers: [
      "Blocco settimanale di recovery",
      "Breathwork prima di creare",
      "Money review quindicinale",
      "Meal plan semplice anti-crash",
      "Tre pause di movimento nei giorni creativi",
    ],
    routineBundle: {
      sleep: [
        "Proteggere una sera piu' leggera prima di uno sprint creativo",
        "Nessun nuovo lavoro dopo l'orario di stop pianificato",
      ],
      nutrition: [
        "Meal plan semplice anti-crash nei giorni creativi",
        "Check snack e idratazione prima di pilot o facilitazioni",
      ],
      movement: [
        "Tre pause di movimento nei giorni creativi",
        "Una sessione outdoor piu' lunga ogni weekend",
      ],
      recovery: [
        "Blocco settimanale di recovery",
        "Breathwork prima di creare",
      ],
    },
    riskGuardrail:
      "Trattare il side project come esperimento con budget, tempo e criteri di stop espliciti.",
  },
};

const experimentIt: PartialMap<Experiment> = {
  "ex-role-audit": {
    title: "Audit di job crafting",
    horizon: "2 settimane",
    theme: "Work design",
    hypothesis:
      "Se finestre di facilitazione e apprendimento vengono protette, contributo percepito ed energia migliorano.",
    status: "Pronto",
    note:
      "Definire una metrica semplice: qualita' delle conversazioni generate e livello di energia post-attivita'.",
  },
  "ex-market-signals": {
    title: "Signal scan di 15 ruoli target",
    horizon: "3 settimane",
    theme: "Career crafting",
    hypothesis:
      "Tradurre le skill nel linguaggio di mercato rende piu' leggibili e realistiche le famiglie occupazionali.",
    status: "In corso",
    note: "Usare placeholder ESCO/O*NET, non claim definitivi di fit.",
  },
  "ex-purpose-lab-pilot": {
    title: "Pilot di Purpose Lab",
    horizon: "4 settimane",
    theme: "Validazione del prototipo",
    hypothesis:
      "Un artifact di portfolio piu' scenario map aiuta altre persone a chiarire ipotesi senza sentirsi etichettate.",
    status: "Idea",
    note: "Successo = conversazioni utili, non conferma identitaria.",
  },
};

const digitalTwinIt: PartialMap<DigitalTwinAgentReport> = {
  "dt-alba-orchestrator": {
    title: "Agente di intake del Digital Twin",
    objective:
      "Raccogliere tracce utente gia' esistenti, trasformarle in ipotesi prudenti di input e instradarle verso Evidence, Wellbeing, Skills, Why e Simulation.",
    lastRunLabel: "Sincronizzato con fonti dummy il 28 giugno 2026",
    sources: [
      {
        id: "dt-linkedin",
        title: "Snapshot del profilo professionale",
        status: "ready",
        lastSyncLabel: "Oggi",
        coverage: ["Evidence", "Skills", "Opportunities"],
        note: "Import dummy di headline profilo, storia dei ruoli e temi dei job salvati.",
      },
      {
        id: "dt-cv",
        title: "Archivio CV e portfolio",
        status: "ready",
        lastSyncLabel: "Oggi",
        coverage: ["Evidence", "Why", "Dossier"],
        note: "Estrazione dummy di progetti, achievement e linguaggio ricorrente di contributo.",
      },
      {
        id: "dt-wellbeing",
        title: "Snapshot routine e wearable",
        status: "watching",
        lastSyncLabel: "Questa settimana",
        coverage: ["Wellbeing", "Activation"],
        note: "Flusso dummy di continuita' del sonno, camminate e segnali di focus-recovery.",
      },
    ],
    signals: [
      {
        id: "dts-role-story",
        title: "Storia professionale pronta per la traduzione",
        summary: "Il materiale esistente contiene gia' linguaggio riusabile per transizioni di ruolo e proof of work.",
        targetAreas: ["Evidence", "Skills", "Simulation"],
        confidence: 7,
      },
      {
        id: "dts-energy-rhythm",
        title: "Ritmo energetico sensibile alle routine",
        summary: "La vitalita' sembra piu' forte quando sonno, movimento e focus restano piu' regolari.",
        targetAreas: ["Wellbeing", "Activation"],
        confidence: 6,
      },
      {
        id: "dts-purpose-threads",
        title: "Thread di purpose ripetuto",
        summary: "Progetti e note convergono spesso su orientamento umano, conversazioni di crescita e chiarezza dei sistemi.",
        targetAreas: ["Why", "Ikigai", "Simulation"],
        confidence: 7,
      },
    ],
    suggestedInputs: [
      "Sincronizzare un PDF di CV o portfolio come artifact di base.",
      "Aggiungere uno snapshot recente di benessere o routine per calibrare Activation.",
      "Catturare un ruolo target o una job ad per migliorare il ponte live delle opportunita'.",
    ],
    nextActions: [
      "Promuovere una fonte dummy a vero allegato locale quando l'utente carica un file.",
      "Generare suggerimenti di evidenza prima della revisione manuale.",
      "Aggiornare scenario e hint opportunita' dopo ogni nuovo allegato.",
    ],
    guardrail:
      "L'agente propone solo ipotesi di intake. Non inferisce identita', diagnosi o fit professionale definitivo.",
  },
};

const gamificationByLocale: Record<Locale, GamificationProfile> = {
  en: gamificationProfileMock,
  it: {
    level: 3,
    xp: 340,
    nextLevelXp: 500,
    badge: "Costruttore di momentum",
    momentumLabel: "Progressi stabili, poca frizione inutile e prossimi passi chiari.",
    wins: [
      "3 evidenze sostengono gia' lo scenario attivo",
      "1 ponte di Simulation e' pronto da confrontare con ruoli ESCO live",
      "1 activation plan include ora sonno, nutrizione, movimento e recovery",
    ],
    phases: [
      {
        phaseId: "awareness",
        title: "Awareness",
        progress: 68,
        streakDays: 4,
        currentQuest: "Trasforma un artifact caricato in 2-3 note di evidenza validate.",
        reward: "Sblocca una baseline di portfolio piu' pulita.",
      },
      {
        phaseId: "simulation",
        title: "Simulation",
        progress: 54,
        streakDays: 3,
        currentQuest: "Confronta lo scenario attivo con 3 famiglie di ruolo ESCO live.",
        reward: "Sblocca un ponte piu' forte verso il linguaggio di mercato.",
      },
      {
        phaseId: "activation",
        title: "Activation",
        progress: 47,
        streakDays: 2,
        currentQuest: "Scegli una routine stack settimanale e un esperimento guida.",
        reward: "Sblocca un piano di 2 settimane piu' testabile.",
      },
    ],
  },
};

const dossierIt: PartialMap<DossierExport> = {
  "de-master-dossier": {
    title: "ALBA Portable Human Portfolio",
    summary:
      "Sintesi locale di evidenze, skill, valori, why provvisorio, baseline di benessere, scenari simulati e leve di attivazione.",
  },
};

const portfolioSummaryByLocale: Record<Locale, PortfolioSummary> = {
  en: portfolioSummaryMock,
  it: {
    expressedSkills: ["Facilitazione di workshop", "Sensemaking strategico", "Learning experience design"],
    latentSkills: ["Opportunity mapping", "Mentorship strutturata"],
    strategicSkills: ["Narrazione di portfolio", "Design di sistemi umani", "Traduzione ESCO / O*NET"],
    values: valuesByLocale.it,
    interests: ["Future of Work", "Skill architecture", "Learning systems"],
    passions: ["Conversazioni che sbloccano scelte", "Strumenti per l'orientamento umano", "Benessere sostenibile"],
    why: whyIt["why-purpose-bridge"].statement ?? whyHypothesisMock.statement,
    flowPatterns: [
      patternsIt["pt-translation"].title ?? patternsMock[0].title,
      patternsIt["pt-community"].title ?? patternsMock[1].title,
      patternsIt["pt-future-work"].title ?? patternsMock[2].title,
    ],
    wellbeingBaseline: localizeById("it", wellbeingTargetsMock, wellbeingIt).map(
      (target) => `${target.domain}: ${target.currentLevel}/10`,
    ),
    constraints: [
      "Evitare salti impulsivi senza narrativa e buffer finanziario.",
      "Proteggere energia, recovery e carico cognitivo durante le transizioni.",
      "Favorire esperimenti progressivi prima di decisioni irreversibili.",
    ],
    evidenceIds: evidenceMock.map((evidence) => evidence.id),
  },
};

const blankWhyByLocale: Record<Locale, WhyHypothesis> = {
  en: {
    id: "why-empty-demo",
    title: "Provisional WHY",
    statement:
      "No provisional WHY has been assembled yet. It will emerge as a cautious hypothesis after enough evidence, signals, and patterns have been reviewed.",
    confidence: 0,
    status: "Not drafted yet",
    evidenceNote:
      "This shared demo is intentionally empty. Start from Phase 1 and validate observable evidence before drafting any WHY statement.",
    linkedPatternIds: [],
  },
  it: {
    id: "why-empty-demo",
    title: "WHY provvisorio",
    statement:
      "Ancora nessun WHY provvisorio assemblato. Emergera' come ipotesi prudente dopo aver letto abbastanza evidenze, segnali e pattern.",
    confidence: 0,
    status: "Ancora da formulare",
    evidenceNote:
      "Questa demo condivisibile e' volutamente vuota. Parti dalla fase 1 e valida prima le evidenze osservabili, poi formula il WHY.",
    linkedPatternIds: [],
  },
};

const blankScenarioByLocale: Record<Locale, Scenario> = {
  en: {
    id: "sc-empty-demo",
    title: "Scenario to define",
    horizon: "Not set yet",
    thesis:
      "No scenario has been generated yet. Alba will compare future scenarios after the Portable Human Portfolio, the Ikigai direction, and the wellbeing thresholds have been set.",
    opportunityIds: [],
    fit: {
      skillFit: 0,
      purposeFit: 0,
      valuesFit: 0,
      energyFit: 0,
      workContextFit: 0,
      wellbeingFit: 0,
      growthPotential: 0,
    },
    permav: {
      positiveEmotion: 0,
      engagement: 0,
      relationships: 0,
      meaning: 0,
      accomplishment: 0,
      vitality: 0,
    },
    ikigaiSignal: "No Ikigai-based scenario signal yet.",
    wellbeingShift: "Set desired wellbeing levels to make future scenarios comparable.",
  },
  it: {
    id: "sc-empty-demo",
    title: "Scenario da definire",
    horizon: "Ancora non impostato",
    thesis:
      "Ancora nessuno scenario generato. Alba confrontera' scenari futuri dopo che Portable Human Portfolio, direzione Ikigai e soglie di wellbeing saranno stati impostati.",
    opportunityIds: [],
    fit: {
      skillFit: 0,
      purposeFit: 0,
      valuesFit: 0,
      energyFit: 0,
      workContextFit: 0,
      wellbeingFit: 0,
      growthPotential: 0,
    },
    permav: {
      positiveEmotion: 0,
      engagement: 0,
      relationships: 0,
      meaning: 0,
      accomplishment: 0,
      vitality: 0,
    },
    ikigaiSignal: "Ancora nessun segnale di scenario basato su Ikigai.",
    wellbeingShift: "Imposta i livelli desiderati di wellbeing per rendere confrontabili gli scenari futuri.",
  },
};

const blankIkigaiByLocale: Record<Locale, IkigaiMap> = {
  en: {
    id: "ikigai-empty-demo",
    loves: [],
    strengths: [],
    worldNeeds: [],
    paidFor: [],
    centerOfGravity: "No Ikigai center of gravity yet.",
    note:
      "The map is still empty. Alba will populate it only after Phase 1 evidence and simulation criteria are explicit enough to compare hypotheses.",
  },
  it: {
    id: "ikigai-empty-demo",
    loves: [],
    strengths: [],
    worldNeeds: [],
    paidFor: [],
    centerOfGravity: "Ancora nessun centro di gravita' Ikigai.",
    note:
      "La mappa e' ancora vuota. Alba la popola solo quando le evidenze di fase 1 e i criteri di simulation sono abbastanza espliciti da confrontare ipotesi.",
  },
};

const blankPortfolioSummaryByLocale: Record<Locale, PortfolioSummary> = {
  en: {
    expressedSkills: [],
    latentSkills: [],
    strategicSkills: [],
    values: [],
    interests: [],
    passions: [],
    why:
      "No Portable Human Portfolio has been assembled yet. This shared demo starts from a blank state.",
    flowPatterns: [],
    wellbeingBaseline: [],
    constraints: [],
    evidenceIds: [],
  },
  it: {
    expressedSkills: [],
    latentSkills: [],
    strategicSkills: [],
    values: [],
    interests: [],
    passions: [],
    why:
      "Ancora nessun Portable Human Portfolio assemblato. Questa demo condivisibile parte da uno stato vuoto.",
    flowPatterns: [],
    wellbeingBaseline: [],
    constraints: [],
    evidenceIds: [],
  },
};

const blankDossierByLocale: Record<Locale, DossierExport> = {
  en: {
    id: "dossier-empty-demo",
    title: "ALBA Portable Human Portfolio",
    format: "Markdown / JSON",
    summary:
      "This dossier export is intentionally empty and ready to be populated only after the first evidence, translations, and activation choices exist.",
  },
  it: {
    id: "dossier-empty-demo",
    title: "ALBA Portable Human Portfolio",
    format: "Markdown / JSON",
    summary:
      "Questo export dossier e' volutamente vuoto ed e' pronto a popolarsi solo dopo che esisteranno prime evidenze, traduzioni tassonomiche e scelte di attivazione.",
  },
};

const blankDigitalTwinByLocale: Record<Locale, DigitalTwinAgentReport> = {
  en: {
    id: "dt-empty-demo",
    title: "Digital Twin intake agent",
    status: "dummy-live",
    objective:
      "Wait for the first approved evidence before drafting any cautious intake hypothesis.",
    lastRunLabel: "No local source connected yet",
    sources: [],
    signals: [],
    suggestedInputs: [
      "Upload one first artifact in Evidence.",
      "Set your current and desired wellbeing levels.",
      "Decide which direction you want to test first in Ikigai.",
    ],
    nextActions: [
      "Create the first evidence draft from a local attachment.",
      "Translate explicit skills into ESCO and O*NET language.",
      "Generate activation opportunities only after simulation criteria exist.",
    ],
    guardrail:
      "No identity claims are made while the demo is empty. Alba waits for real inputs before proposing hypotheses.",
  },
  it: {
    id: "dt-empty-demo",
    title: "Agente di intake del Digital Twin",
    status: "dummy-live",
    objective:
      "Attendere la prima evidenza approvata prima di formulare qualunque ipotesi prudente di intake.",
    lastRunLabel: "Ancora nessuna fonte locale collegata",
    sources: [],
    signals: [],
    suggestedInputs: [
      "Carica un primo artefatto in Evidence.",
      "Imposta i livelli attuali e desiderati di wellbeing.",
      "Decidi quale direzione vuoi testare per prima in Ikigai.",
    ],
    nextActions: [
      "Creare la prima bozza di evidenza da un allegato locale.",
      "Tradurre le skill esplicite nel linguaggio ESCO e O*NET.",
      "Generare opportunita' di activation solo dopo che esistono criteri di simulation.",
    ],
    guardrail:
      "Finche' la demo e' vuota non viene fatto alcun claim identitario. Alba aspetta input reali prima di proporre ipotesi.",
  },
};

function buildBlankWellbeingTargets(locale: Locale) {
  return localizeById(locale, wellbeingTargetsMock, wellbeingIt).map((target) => ({
    ...target,
    currentLevel: 0,
    desiredLevel: 0,
    priority: 0,
    note:
      locale === "it"
        ? "Ancora da impostare."
        : "Not set yet.",
  }));
}

export function getLocalizedValues(locale: Locale) {
  if (isBlankDemoMode()) {
    return [];
  }

  return valuesByLocale[locale];
}

export function getLocalizedEvidence(locale: Locale) {
  if (isBlankDemoMode()) {
    return [];
  }

  return localizeById(locale, evidenceMock, evidenceIt);
}

export function getLocalizedSignals(locale: Locale) {
  if (isBlankDemoMode()) {
    return [];
  }

  return localizeById(locale, signalsMock, signalsIt);
}

export function getLocalizedSignalsForEvidence(locale: Locale, evidenceId: string) {
  if (isBlankDemoMode()) {
    return [];
  }

  return localizeById(locale, getSignalsForEvidence(evidenceId), signalsIt);
}

export function getLocalizedPatterns(locale: Locale) {
  if (isBlankDemoMode()) {
    return [];
  }

  return localizeById(locale, patternsMock, patternsIt);
}

export function getLocalizedPatternsForEvidence(locale: Locale, evidenceId: string) {
  if (isBlankDemoMode()) {
    return [];
  }

  return localizeById(locale, getPatternsForEvidence(evidenceId), patternsIt);
}

export function getLocalizedWhy(locale: Locale) {
  if (isBlankDemoMode()) {
    return blankWhyByLocale[locale];
  }

  return localizeSingle(locale, whyHypothesisMock, whyIt);
}

export function getLocalizedIkigaiMap(locale: Locale) {
  if (isBlankDemoMode()) {
    return blankIkigaiByLocale[locale];
  }

  if (locale === "en") {
    return ikigaiMapMock;
  }

  return {
    ...ikigaiMapMock,
    loves: [
      "Dare forma a idee complesse",
      "Progettare conversazioni di crescita",
      "Costruire strumenti che chiariscono scelte",
    ],
    strengths: ["Facilitazione", "Sensemaking", "Ricerca strutturata", "Storytelling decisionale"],
    worldNeeds: [
      "Transizioni lavorative piu' umane",
      "Apprendimento permanente piu' leggibile",
      "Benessere sostenibile nei sistemi professionali",
    ],
    paidFor: ["People innovation", "Future of work design", "Prodotti su portfolio e apprendimento"],
    centerOfGravity:
      "Ikigai come mappa dinamica: il centro si sposta quando purpose, contesto e sostenibilita' trovano un equilibrio praticabile.",
    note:
      "La mappa non assegna un'etichetta finale. Serve a generare ipotesi sull'allineamento tra contributo, energia e sostenibilita'.",
  };
}

export function getLocalizedWellbeingTargets(locale: Locale) {
  if (isBlankDemoMode()) {
    return buildBlankWellbeingTargets(locale);
  }

  return localizeById(locale, wellbeingTargetsMock, wellbeingIt);
}

export function getLocalizedSkills(locale: Locale) {
  if (isBlankDemoMode()) {
    return [];
  }

  return localizeById(locale, skillsMock, skillsIt);
}

export function getLocalizedOpportunities(locale: Locale) {
  if (isBlankDemoMode()) {
    return [];
  }

  const localized = localizeById(locale, opportunitiesMock, opportunityIt);

  if (locale === "en") {
    return localized;
  }

    return localized.map((opportunity) => ({
      ...opportunity,
      onetMatches: opportunity.onetMatches.map((role) => ({
        ...role,
        alignment: role.alignment,
        summary:
          role.code === "13-1082.00" && role.title === "Project Management Specialists"
            ? "Ruolo O*NET orientato al coordinamento di tempi, budget, persone e delivery di progetto."
          : role.code === "11-3131.00" && role.title === "Training and Development Managers"
            ? "Ruolo O*NET centrato sulla guida di programmi formativi, sviluppo delle persone e miglioramento continuo dell'apprendimento."
            : role.code === "13-1111.00"
              ? "Ruolo O*NET dedicato a studi organizzativi, process design e raccomandazioni che rendono i sistemi piu' efficaci."
              : role.code === "21-1012.00"
                ? "Ruolo O*NET relativo a orientamento educativo e di carriera, con focus su supporto decisionale e servizi di guidance."
                : role.summary,
      updatedLabel: "Aggiornato 2026",
      whyAligned:
        role.code === "13-1082.00" && opportunity.id === "op-job-crafting"
          ? "Traduce il job crafting in una forma leggibile dal mercato: orchestrazione, coordinamento e allineamento cross-team."
          : role.code === "11-3131.00" && opportunity.id === "op-job-crafting"
            ? "Aiuta a testare se il ruolo attuale puo' spostarsi verso learning enablement e capability building senza cambiare azienda."
            : role.code === "11-3131.00" && opportunity.id === "op-people-innovation"
              ? "E' il ponte piu' diretto tra learning systems, people innovation e work design nel portfolio mock di Alba."
              : role.code === "13-1111.00" && opportunity.id === "op-people-innovation"
                ? "Apre un outlet concreto per sensemaking, process design e trasformazione della complessita' in scelte operative."
                : role.code === "21-1012.00"
                  ? "E' la traduzione O*NET piu' vicina per un Purpose Lab che aiuta altre persone a chiarire opzioni, vincoli e direzione."
                  : role.code === "13-1111.00" && opportunity.id === "op-purpose-lab"
                    ? "Tiene aperta la componente consulenziale del side project se il lab evolve verso servizi per team o organizzazioni."
                    : role.whyAligned,
    })),
  }));
}

export function getLocalizedScenarios(locale: Locale) {
  if (isBlankDemoMode()) {
    return [blankScenarioByLocale[locale]];
  }

  return localizeById(locale, scenariosMock, scenarioIt);
}

export function getLocalizedScenarioForRoute(locale: Locale, candidate?: string | string[]) {
  if (isBlankDemoMode()) {
    return blankScenarioByLocale[locale];
  }

  return localizeSingle(locale, getScenarioForRoute(candidate), scenarioIt);
}

export function getLocalizedPrimaryOpportunityForScenario(locale: Locale, scenarioId: string) {
  if (isBlankDemoMode()) {
    return undefined;
  }

  const opportunity = getPrimaryOpportunityForScenario(scenarioId);

  return opportunity ? localizeSingle(locale, opportunity, opportunityIt) : undefined;
}

export function getLocalizedScenariosForOpportunity(locale: Locale, opportunityId: string) {
  if (isBlankDemoMode()) {
    return [];
  }

  return localizeById(locale, getScenariosForOpportunity(opportunityId), scenarioIt);
}

export function getLocalizedSkillsForOpportunity(locale: Locale, opportunityId: string) {
  if (isBlankDemoMode()) {
    return [];
  }

  return localizeById(locale, getSkillsForOpportunity(opportunityId), skillsIt);
}

export function getLocalizedSkillsForScenario(locale: Locale, scenarioId: string) {
  if (isBlankDemoMode()) {
    return [];
  }

  return localizeById(locale, getSkillsForScenario(scenarioId), skillsIt);
}

export function getLocalizedOpportunitiesForSkill(locale: Locale, skillId: string) {
  if (isBlankDemoMode()) {
    return [];
  }

  return localizeById(locale, getOpportunitiesForSkill(skillId), opportunityIt);
}

export function getLocalizedOpportunityGraphEntries(locale: Locale) {
  if (isBlankDemoMode()) {
    return [];
  }

  return buildOpportunityGraphEntries().map((entry) => ({
    opportunity: localizeSingle(locale, entry.opportunity, opportunityIt),
    scenarios: localizeById(locale, entry.scenarios, scenarioIt),
    skills: localizeById(locale, entry.skills, skillsIt),
  }));
}

export function getLocalizedActivationPlans(locale: Locale) {
  if (isBlankDemoMode()) {
    return [];
  }

  return localizeById(locale, activationPlansMock, activationIt);
}

export function getLocalizedActivationPlanForScenario(locale: Locale, scenarioId: string) {
  if (isBlankDemoMode()) {
    return undefined;
  }

  const plan = getActivationPlanForScenario(scenarioId);

  return plan ? localizeSingle(locale, plan, activationIt) : undefined;
}

export function getLocalizedExperiments(locale: Locale) {
  if (isBlankDemoMode()) {
    return [];
  }

  return localizeById(locale, experimentsMock, experimentIt);
}

export function getLocalizedExperimentForScenario(locale: Locale, scenarioId: string) {
  if (isBlankDemoMode()) {
    return undefined;
  }

  const experiment = getExperimentForScenario(scenarioId);

  return experiment ? localizeSingle(locale, experiment, experimentIt) : undefined;
}

export function getLocalizedDossierExport(locale: Locale) {
  if (isBlankDemoMode()) {
    return blankDossierByLocale[locale];
  }

  return localizeSingle(locale, dossierExportMock, dossierIt);
}

export function getLocalizedPortfolioSummary(locale: Locale) {
  if (isBlankDemoMode()) {
    return blankPortfolioSummaryByLocale[locale];
  }

  return portfolioSummaryByLocale[locale];
}

export function getLocalizedDigitalTwinAgent(locale: Locale) {
  if (isBlankDemoMode()) {
    return blankDigitalTwinByLocale[locale];
  }

  return locale === "en"
    ? getDigitalTwinAgentReport()
    : localizeSingle(locale, digitalTwinAgentMock, digitalTwinIt);
}

export function getLocalizedGamificationProfile(locale: Locale) {
  if (isBlankDemoMode()) {
    return locale === "en" ? gamificationProfileMock : gamificationByLocale[locale];
  }

  return locale === "en" ? getGamificationProfile() : gamificationByLocale[locale];
}

export function getLocalizedWellbeingFocusForScenario(locale: Locale, scenarioId: string) {
  if (isBlankDemoMode()) {
    return {
      levers: [],
      note:
        locale === "it"
          ? "Imposta prima i target di wellbeing per capire quali soglie vuoi proteggere nella simulation."
          : "Set your wellbeing targets first so Alba can understand which thresholds must be protected in simulation.",
      permavLens: [],
      targets: getLocalizedWellbeingTargets(locale),
    };
  }

  const focus = getWellbeingFocusForScenario(scenarioId);

  if (locale === "en") {
    return {
      ...focus,
      targets: localizeById(locale, focus.targets, wellbeingIt),
    };
  }

  const noteByScenario: Record<string, string> = {
    "sc-job-crafting":
      "Nel job crafting il benessere dipende soprattutto da contributo percepito, qualita' delle relazioni di lavoro ed energia di recovery.",
    "sc-people-innovation":
      "La transizione verso People Innovation richiede chiarezza cognitiva, senso di purpose e una cornice professionale che sostenga il riposizionamento.",
    "sc-purpose-lab":
      "Un Purpose Lab richiede alto significato, guardrail finanziari e un contesto di vita che protegga spazio creativo e sostenibilita'.",
  };

  return {
    ...focus,
    note: noteByScenario[scenarioId] ?? focus.note,
    permavLens:
      scenarioId === "sc-job-crafting"
        ? ["Accomplishment", "Relationships", "Vitality"]
        : scenarioId === "sc-people-innovation"
          ? ["Meaning", "Engagement", "Accomplishment"]
          : ["Meaning", "Positive Emotion", "Vitality"],
    targets: localizeById(locale, focus.targets, wellbeingIt),
  };
}

export function getLocalizedIkigaiFocusForScenario(locale: Locale, scenarioId: string) {
  if (isBlankDemoMode()) {
    return {
      centerOfGravity: blankIkigaiByLocale[locale].centerOfGravity,
      highlightedItems: [],
      note: blankIkigaiByLocale[locale].note,
    };
  }

  const focus = getIkigaiFocusForScenario(scenarioId);

  if (locale === "en") {
    return focus;
  }

  const noteByScenario: Record<string, string> = {
    "sc-job-crafting":
      "Lettura scenario-aware: qui Ikigai aiuta a testare se il lavoro attuale puo' essere riallineato verso piu' significato e contributo senza richiedere uno shift identitario immediato.",
    "sc-people-innovation":
      "Lettura scenario-aware: la mappa evidenzia gli elementi che rendono credibile il riposizionamento verso skill architecture, people systems e futuro del lavoro.",
    "sc-purpose-lab":
      "Lettura scenario-aware: Ikigai diventa una mappa per bilanciare purpose, utilita' per gli altri e primi segnali di sostenibilita', non una giustificazione romantica per un side project.",
  };

  const centerByScenario: Record<string, string> = {
    "sc-job-crafting":
      "Nel job crafting il centro di gravita' si avvicina a cio' che e' gia' forte e gia' riconoscibile nel contesto attuale, senza promettere reinvenzione totale.",
    "sc-people-innovation":
      "Nello scenario People Innovation il centro si sposta quando amore, punti di forza e domanda di mercato iniziano a convergere in un linguaggio professionale leggibile oltre il contesto attuale.",
    "sc-purpose-lab":
      "In Purpose Lab il centro si sposta verso significato e bisogno del mondo, ma resta credibile solo se la sostenibilita' economica viene costruita passo dopo passo.",
  };

  return {
    ...focus,
    centerOfGravity: centerByScenario[scenarioId] ?? focus.centerOfGravity,
    note: noteByScenario[scenarioId] ?? focus.note,
  };
}

export function buildLocalizedIkigaiMapForScenario(locale: Locale, scenarioId: string): IkigaiMap {
  if (isBlankDemoMode()) {
    return blankIkigaiByLocale[locale];
  }

  const map = buildIkigaiMapForScenario(scenarioId);

  if (locale === "en") {
    return map;
  }

  const localizedBase = getLocalizedIkigaiMap(locale);
  const focus = getLocalizedIkigaiFocusForScenario(locale, scenarioId);

  return {
    ...localizedBase,
    id: map.id,
    loves: localizedBase.loves,
    strengths: localizedBase.strengths,
    worldNeeds: localizedBase.worldNeeds,
    paidFor: localizedBase.paidFor,
    centerOfGravity: focus.centerOfGravity,
    note: focus.note,
  };
}

export function getLocalizedSkillBandOnetSuggestions(locale: Locale, skills: SkillProfile[]) {
  if (isBlankDemoMode()) {
    return [];
  }

  return getSkillBandOnetSuggestions(skills).map((item) => ({
    role:
      locale === "en"
        ? item.role
        : {
            ...item.role,
            updatedLabel: "Aggiornato 2026",
          },
    supportingSkills: localizeById(locale, item.supportingSkills, skillsIt),
  }));
}

export function buildLocalizedDossierPayload(locale: Locale, scenarioId?: string) {
  if (isBlankDemoMode()) {
    return {
      scope: null,
      portfolio: getLocalizedPortfolioSummary(locale),
      evidence: getLocalizedEvidence(locale),
      patterns: getLocalizedPatterns(locale),
      why: getLocalizedWhy(locale),
      ikigai: getLocalizedIkigaiMap(locale),
      wellbeing: enrichWellbeingTargets(getLocalizedWellbeingTargets(locale)),
      scenarios: getLocalizedScenarios(locale),
      opportunities: getLocalizedOpportunities(locale),
      activationPlans: getLocalizedActivationPlans(locale),
      experiments: getLocalizedExperiments(locale),
    };
  }

  if (locale === "en") {
    return buildDossierPayload(scenarioId);
  }

  const activeScenario = scenarioId ? getLocalizedScenarioForRoute(locale, scenarioId) : undefined;
  const activeOpportunity = activeScenario
    ? getLocalizedPrimaryOpportunityForScenario(locale, activeScenario.id)
    : undefined;
  const activePlan = activeScenario
    ? getLocalizedActivationPlanForScenario(locale, activeScenario.id)
    : undefined;
  const activeExperiment = activeScenario
    ? getLocalizedExperimentForScenario(locale, activeScenario.id)
    : undefined;

  return {
    ...buildDossierPayload(scenarioId),
    scope:
      activeScenario && activeOpportunity
        ? {
            scenarioId: activeScenario.id,
            scenarioTitle: activeScenario.title,
            opportunityTitle: activeOpportunity.title,
          }
        : null,
    portfolio: getLocalizedPortfolioSummary(locale),
    evidence: getLocalizedEvidence(locale),
    patterns: getLocalizedPatterns(locale),
    why: getLocalizedWhy(locale),
    ikigai: getLocalizedIkigaiMap(locale),
    wellbeing: enrichWellbeingTargets(getLocalizedWellbeingTargets(locale)),
    scenarios: activeScenario ? [activeScenario] : getLocalizedScenarios(locale),
    opportunities: activeOpportunity ? [activeOpportunity] : getLocalizedOpportunities(locale),
    activationPlans: activePlan ? [activePlan] : getLocalizedActivationPlans(locale),
    experiments: activeExperiment ? [activeExperiment] : getLocalizedExperiments(locale),
  };
}

export function buildLocalizedDossierMarkdown(locale: Locale, scenarioId?: string) {
  if (isBlankDemoMode()) {
    return locale === "it"
      ? `# ${getLocalizedDossierExport(locale).title}

## Stato del prototipo
- Demo in empty state: nessun dato personale, nessuna evidenza, nessuna opportunita' ancora generata.

## Prossimi passi
- Aggiungi la prima evidenza
- Imposta i target di wellbeing
- Traduci skill e criteri nella fase di simulation
- Valida poi le opportunita' in activation
`
      : `# ${getLocalizedDossierExport(locale).title}

## Prototype status
- Blank demo state: no personal data, no evidence, and no generated opportunities yet.

## Next steps
- Add the first evidence item
- Set wellbeing targets
- Translate skills and criteria in simulation
- Validate opportunities later in activation
`;
  }

  if (locale === "en") {
    return buildDossierMarkdown(scenarioId);
  }

  const payload = buildLocalizedDossierPayload(locale, scenarioId);
  const scopedScenario = payload.scenarios[0];
  const scopedOpportunity = payload.opportunities[0];
  const scopedPlan = payload.activationPlans[0];
  const scopedExperiment = payload.experiments[0];
  const wellbeingLines = payload.wellbeing
    .map(
      (target) =>
        `- ${target.domain}: attuale ${target.currentLevel}/10, desiderato ${target.desiredLevel}/10, priorita' ${target.priority}`,
    )
    .join("\n");
  const scenarioLines = payload.scenarios
    .map(
      (scenario) =>
        `## ${scenario.title}\n- Tesi: ${scenario.thesis}\n- Segnale Ikigai: ${scenario.ikigaiSignal}\n- Shift di benessere: ${scenario.wellbeingShift}`,
    )
    .join("\n\n");

  return `# ${getLocalizedDossierExport(locale).title}

## Scenario attivo
- Scenario: ${scopedScenario?.title ?? "-"}
- Opportunita': ${scopedOpportunity?.title ?? "-"}
- Piano di attivazione: ${scopedPlan?.title ?? "-"}
- Esperimento guida: ${scopedExperiment?.title ?? "-"}

## WHY provvisorio
${getLocalizedWhy(locale).statement}

## Valori guida
${getLocalizedValues(locale)
  .map((value) => `- ${value}`)
  .join("\n")}

## Skill
### Espresse
${getLocalizedPortfolioSummary(locale).expressedSkills.map((skill) => `- ${skill}`).join("\n")}

### Latenti
${getLocalizedPortfolioSummary(locale).latentSkills.map((skill) => `- ${skill}`).join("\n")}

### Strategiche
${getLocalizedPortfolioSummary(locale).strategicSkills.map((skill) => `- ${skill}`).join("\n")}

## Baseline di benessere
${wellbeingLines}

## Scenari simulati
${scenarioLines}
`;
}
