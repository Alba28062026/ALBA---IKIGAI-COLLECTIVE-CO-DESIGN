export type Evidence = {
  id: string;
  title: string;
  sourceType: string;
  summary: string;
  dateLabel: string;
  tags: string[];
  confidence: number;
  note?: string;
  linkedSignalIds: string[];
  linkedPatternIds: string[];
};

export type Signal = {
  id: string;
  title: string;
  description: string;
  domain: string;
  strength: number;
  evidenceId?: string;
};

export type Pattern = {
  id: string;
  title: string;
  summary: string;
  validationQuestion: string;
  confidence: number;
  status: string;
  linkedSignalIds: string[];
};

export type WhyHypothesis = {
  id: string;
  title: string;
  statement: string;
  confidence: number;
  status: string;
  evidenceNote: string;
  linkedPatternIds: string[];
};

export type IkigaiMap = {
  id: string;
  loves: string[];
  strengths: string[];
  worldNeeds: string[];
  paidFor: string[];
  centerOfGravity: string;
  note: string;
};

export type WellbeingTarget = {
  id: string;
  domain: string;
  currentLevel: number;
  desiredLevel: number;
  priority: number;
  note?: string;
};

export type SkillBand = "expressed" | "latent" | "strategic";

export type SkillProfile = {
  id: string;
  name: string;
  category: string;
  band: SkillBand;
  level: number;
  evidenceSignal: string;
  escoHint?: string;
  onetHint?: string;
  suggestedOnetCodes?: string[];
  note?: string;
};

export type FitMetrics = {
  skillFit: number;
  purposeFit: number;
  valuesFit: number;
  energyFit: number;
  workContextFit: number;
  wellbeingFit: number;
  growthPotential: number;
};

export type OnetOpportunityLink = {
  code: string;
  title: string;
  summary: string;
  officialUrl: string;
  updatedLabel: string;
  brightOutlook?: boolean;
  sampleTitles: string[];
  alignment: "Core match" | "Adjacent match";
  whyAligned: string;
  albaOverlap: string[];
};

export type Opportunity = {
  id: string;
  title: string;
  path: string;
  summary: string;
  context: string;
  compensationModel: string;
  escoHint?: string;
  onetHint?: string;
  onetMatches: OnetOpportunityLink[];
  fit: FitMetrics;
  note: string;
};

export type PermavScores = {
  positiveEmotion: number;
  engagement: number;
  relationships: number;
  meaning: number;
  accomplishment: number;
  vitality: number;
};

export type Scenario = {
  id: string;
  title: string;
  horizon: string;
  thesis: string;
  opportunityIds: string[];
  fit: FitMetrics;
  permav: PermavScores;
  ikigaiSignal: string;
  wellbeingShift: string;
};

export type ActivationPlan = {
  id: string;
  title: string;
  scenarioId: string;
  focus: string;
  duration: string;
  moves: string[];
  wellbeingLevers: string[];
  routineBundle: {
    sleep: string[];
    nutrition: string[];
    movement: string[];
    recovery: string[];
  };
  riskGuardrail: string;
};

export type Experiment = {
  id: string;
  scenarioId: string;
  title: string;
  horizon: string;
  theme: string;
  hypothesis: string;
  effort: number;
  impact: number;
  status: string;
  note: string;
};

export type DossierExport = {
  id: string;
  title: string;
  format: string;
  summary: string;
};

export type PortfolioSummary = {
  expressedSkills: string[];
  latentSkills: string[];
  strategicSkills: string[];
  values: string[];
  interests: string[];
  passions: string[];
  why: string;
  flowPatterns: string[];
  wellbeingBaseline: string[];
  constraints: string[];
  evidenceIds: string[];
};

export type LiveSourceStatus = "live" | "fallback" | "unavailable";

export type EscoLiveMatch = {
  uri: string;
  title: string;
  code?: string;
  language: string;
  officialUrl: string;
};

export type OnetLiveMatch = {
  code: string;
  title: string;
  officialUrl: string;
  source: "search" | "crosswalk" | "portfolio-fallback";
};

export type LiveOpportunityPipeline = {
  query: string;
  searchedAt: string;
  esco: {
    status: LiveSourceStatus;
    note: string;
    total?: number;
    items: EscoLiveMatch[];
  };
  onet: {
    status: LiveSourceStatus;
    note: string;
    credentialsConfigured: boolean;
    items: OnetLiveMatch[];
  };
  bridgeSummary: string[];
};

export type DigitalTwinSource = {
  id: string;
  title: string;
  status: "ready" | "watching" | "draft";
  lastSyncLabel: string;
  coverage: string[];
  note: string;
};

export type DigitalTwinSignal = {
  id: string;
  title: string;
  summary: string;
  targetAreas: string[];
  confidence: number;
};

export type DigitalTwinAgentReport = {
  id: string;
  title: string;
  status: "dummy-live";
  objective: string;
  lastRunLabel: string;
  sources: DigitalTwinSource[];
  signals: DigitalTwinSignal[];
  suggestedInputs: string[];
  nextActions: string[];
  guardrail: string;
};

export type PhaseProgress = {
  phaseId: "awareness" | "simulation" | "activation";
  title: string;
  progress: number;
  streakDays: number;
  currentQuest: string;
  reward: string;
};

export type GamificationProfile = {
  level: number;
  xp: number;
  nextLevelXp: number;
  badge: string;
  momentumLabel: string;
  wins: string[];
  phases: PhaseProgress[];
};
