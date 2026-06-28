import type {
  ActivationPlan,
  DigitalTwinAgentReport,
  DossierExport,
  Evidence,
  Experiment,
  GamificationProfile,
  IkigaiMap,
  LiveOpportunityPipeline,
  Opportunity,
  Pattern,
  PortfolioSummary,
  Scenario,
  Signal,
  SkillProfile,
  WellbeingTarget,
  WhyHypothesis,
} from "@/lib/types";
import type { Locale } from "@/lib/i18n";
import { buildAppHref } from "@/lib/i18n";
import { computeActivationNeed, computeGap } from "@/lib/utils";

export const valuesMock = [
  "Curiosity with rigor",
  "Concrete contribution",
  "Responsible autonomy",
  "Alignment between life and work",
  "Shared growth",
];

export const evidenceMock: Evidence[] = [
  {
    id: "ev-retro-facilitation",
    title: "Cross-team retrospective on internal adoption",
    sourceType: "Project feedback",
    summary:
      "A mixed product and operations team reported that structured workshops and visual synthesis accelerated alignment and decision-making.",
    dateLabel: "February 2026",
    tags: ["facilitation", "sensemaking", "collaboration"],
    confidence: 8,
    note: "Useful signal for identifying flow conditions linked to mediating complexity.",
    linkedSignalIds: ["sg-facilitation", "sg-complexity"],
    linkedPatternIds: ["pt-translation"],
  },
  {
    id: "ev-learning-lab",
    title: "Peer learning pilot program",
    sourceType: "Achievement",
    summary:
      "An internal learning lab generated strong participation, repeated sessions, and follow-up requests around career conversations.",
    dateLabel: "November 2025",
    tags: ["learning design", "peer learning", "community"],
    confidence: 9,
    note: "To validate as an indicator of motivation for building shared-growth spaces.",
    linkedSignalIds: ["sg-learning", "sg-energy-social"],
    linkedPatternIds: ["pt-community"],
  },
  {
    id: "ev-taxonomy-note",
    title: "Research note on skill taxonomies",
    sourceType: "Personal study",
    summary:
      "A comparative note across skill architecture, ESCO, and O*NET made visible the links between capabilities, emerging roles, and work design.",
    dateLabel: "January 2026",
    tags: ["research", "taxonomy mapping", "future of work"],
    confidence: 7,
    note: "Possible signal of long-term interest in bridge roles across people, work, and systems.",
    linkedSignalIds: ["sg-taxonomy", "sg-complexity"],
    linkedPatternIds: ["pt-future-work"],
  },
  {
    id: "ev-feedback-clarity",
    title: "Feedback on clarity in ambiguous contexts",
    sourceType: "Peer feedback",
    summary:
      "Peers reported that a distinctive strength appears when scattered inputs need to become narrative, decisions, and practical next steps.",
    dateLabel: "December 2025",
    tags: ["clarity", "decision making", "narrative"],
    confidence: 8,
    linkedSignalIds: ["sg-complexity"],
    linkedPatternIds: ["pt-translation"],
  },
  {
    id: "ev-wellbeing-reset",
    title: "Personal energy reset sprint",
    sourceType: "Routine / wellbeing log",
    summary:
      "A four-week period with more regular sleep, walking, and protected focus blocks improved energy and perceived work quality.",
    dateLabel: "March 2026",
    tags: ["energy", "routine", "recovery"],
    confidence: 6,
    note: "Non-clinical: only a signal to validate about the relationship between context, rhythm, and clarity.",
    linkedSignalIds: ["sg-energy-social"],
    linkedPatternIds: ["pt-community"],
  },
];

export const signalsMock: Signal[] = [
  {
    id: "sg-facilitation",
    title: "Transformative facilitation",
    description: "In mixed groups, traction appears when the work is orchestrated with rhythm, questions, and visual supports.",
    domain: "Power skill",
    strength: 8,
    evidenceId: "ev-retro-facilitation",
  },
  {
    id: "sg-complexity",
    title: "Complexity translation",
    description: "Recurring pattern in turning ambiguity, taxonomies, and decisions into shared tools.",
    domain: "Strategic skill",
    strength: 9,
    evidenceId: "ev-feedback-clarity",
  },
  {
    id: "sg-learning",
    title: "Learning experience design",
    description: "Recurring signal when content and sessions are designed to trigger practical application and growth conversations.",
    domain: "Capability",
    strength: 7,
    evidenceId: "ev-learning-lab",
  },
  {
    id: "sg-taxonomy",
    title: "Interest in role architectures",
    description: "Motivation increases when capabilities, roles, and opportunities are mapped into readable systems.",
    domain: "Interest",
    strength: 7,
    evidenceId: "ev-taxonomy-note",
  },
  {
    id: "sg-energy-social",
    title: "Sustainable energy in intentional contexts",
    description: "Routines, selective relationships, and focus windows appear to correlate with greater vitality and effectiveness.",
    domain: "Wellbeing",
    strength: 6,
    evidenceId: "ev-wellbeing-reset",
  },
];

export const patternsMock: Pattern[] = [
  {
    id: "pt-translation",
    title: "Turning complexity into practical trajectories",
    summary:
      "Pattern to validate: energy and contribution quality increase when the role requires sensemaking, architecture, and decision facilitation.",
    validationQuestion: "Does this pattern still hold under pressure and in less collaborative contexts?",
    confidence: 8,
    status: "Hypothesis",
    linkedSignalIds: ["sg-facilitation", "sg-complexity"],
  },
  {
    id: "pt-community",
    title: "Building shared-growth spaces",
    summary:
      "Pattern to validate: motivation grows when work combines learning, nourishing relationships, and mutual support.",
    validationQuestion: "Which organizational conditions make this pattern sustainable over time?",
    confidence: 7,
    status: "Signal cluster",
    linkedSignalIds: ["sg-learning", "sg-energy-social"],
  },
  {
    id: "pt-future-work",
    title: "Orientation toward the future of work",
    summary:
      "Pattern to validate: curiosity stays high when the problem touches work design, skill architecture, and organizational transformation.",
    validationQuestion: "Does this signal lead to a stable role, or is it better suited to side projects and advisory work?",
    confidence: 7,
    status: "Exploration",
    linkedSignalIds: ["sg-taxonomy", "sg-complexity"],
  },
];

export const whyHypothesisMock: WhyHypothesis = {
  id: "why-purpose-bridge",
  title: "Provisional WHY",
  statement:
    "Hypothesis: create contexts, maps, and conversations that help people and teams orient themselves with more clarity, growth, and coherence.",
  confidence: 7,
  status: "Provisional",
  evidenceNote:
    "This is not an identity label: it is an operating synthesis to validate through more evidence, experiments, and real contexts.",
  linkedPatternIds: ["pt-translation", "pt-community", "pt-future-work"],
};

export const ikigaiMapMock: IkigaiMap = {
  id: "ikigai-alba-prototype",
  loves: [
    "Giving shape to complex ideas",
    "Designing growth conversations",
    "Building tools that clarify choices",
  ],
  strengths: [
    "Facilitation",
    "Sensemaking",
    "Structured research",
    "Decision storytelling",
  ],
  worldNeeds: [
    "More human work transitions",
    "Readable lifelong learning",
    "Sustainable wellbeing in professional systems",
  ],
  paidFor: [
    "People innovation",
    "Future of work design",
    "Portfolio and learning products",
  ],
  centerOfGravity:
    "Ikigai as a dynamic map: the center moves when purpose, context, and sustainability find a workable balance.",
  note:
    "The map does not assign a final label. It is here to generate hypotheses about alignment between contribution, energy, and sustainability.",
};

const scenarioIkigaiFocusMap = {
  "sc-job-crafting": {
    loves: ["Giving shape to complex ideas", "Designing growth conversations"],
    strengths: ["Facilitation", "Decision storytelling"],
    worldNeeds: [
      "Readable lifelong learning",
      "Sustainable wellbeing in professional systems",
    ],
    paidFor: ["People innovation", "Portfolio and learning products"],
    centerOfGravity:
      "In job crafting, the center of gravity moves closer to what is already strong and already recognizable in the current context, without promising total reinvention.",
    note:
      "Scenario-aware reading: here Ikigai helps test whether the current job can be realigned toward more meaning and contribution without demanding an immediate professional identity shift.",
  },
  "sc-people-innovation": {
    loves: [
      "Giving shape to complex ideas",
      "Building tools that clarify choices",
    ],
    strengths: ["Sensemaking", "Structured research"],
    worldNeeds: [
      "More human work transitions",
      "Readable lifelong learning",
    ],
    paidFor: ["People innovation", "Future of work design"],
    centerOfGravity:
      "In the People Innovation scenario, the center moves when love, strengths, and market demand begin to converge into a professional language that is legible beyond the current context.",
    note:
      "Scenario-aware reading: the map highlights the elements that make repositioning toward skill architecture, people systems, and the future of work credible.",
  },
  "sc-purpose-lab": {
    loves: [
      "Designing growth conversations",
      "Building tools that clarify choices",
    ],
    strengths: ["Decision storytelling", "Structured research"],
    worldNeeds: [
      "More human work transitions",
      "Sustainable wellbeing in professional systems",
    ],
    paidFor: ["Portfolio and learning products", "People innovation"],
    centerOfGravity:
      "In Purpose Lab, the center shifts toward meaning and world need, but stays credible only if financial sustainability is built step by step.",
    note:
      "Scenario-aware reading: Ikigai becomes a map for balancing purpose, usefulness to others, and early signs of sustainability, not a romantic justification for a side project.",
  },
} as const;

export const wellbeingTargetsMock: WellbeingTarget[] = [
  { id: "wb-physical", domain: "Physical / Vitality", currentLevel: 6, desiredLevel: 8, priority: 4, note: "More consistency in recovery and light movement." },
  { id: "wb-mental", domain: "Mental / Cognitive clarity", currentLevel: 7, desiredLevel: 9, priority: 5, note: "Protect focus and decision load." },
  { id: "wb-emotional", domain: "Emotional", currentLevel: 6, desiredLevel: 8, priority: 3, note: "Reduce dispersion and prolonged friction." },
  { id: "wb-relational", domain: "Relational", currentLevel: 7, desiredLevel: 8, priority: 4, note: "Cultivate nourishing exchanges and high-quality feedback." },
  { id: "wb-social", domain: "Social / Belonging", currentLevel: 5, desiredLevel: 8, priority: 4, note: "Increase the sense of professional tribe." },
  { id: "wb-spiritual", domain: "Spiritual / Purpose", currentLevel: 6, desiredLevel: 9, priority: 5, note: "Make the link between work and meaning more visible." },
  { id: "wb-intellectual", domain: "Intellectual / Learning", currentLevel: 8, desiredLevel: 9, priority: 3, note: "Keep curiosity alive through tangible outputs." },
  { id: "wb-professional", domain: "Professional / Contribution", currentLevel: 6, desiredLevel: 9, priority: 5, note: "Create more room for leverage roles, not only execution." },
  { id: "wb-financial", domain: "Financial", currentLevel: 5, desiredLevel: 8, priority: 4, note: "Increase safety and optionality." },
  { id: "wb-environment", domain: "Environment / Lifestyle", currentLevel: 6, desiredLevel: 8, priority: 3, note: "A context more aligned with energy and routine." },
];

export const skillsMock: SkillProfile[] = [
  {
    id: "sk-facilitation",
    name: "Workshop facilitation",
    category: "Power skill",
    band: "expressed",
    level: 8,
    evidenceSignal: "Cross-team retrospectives and labs",
    escoHint: "Facilitate group discussion",
    onetHint: "Facilitating workshops / Training and development",
    suggestedOnetCodes: ["11-3131.00", "13-1082.00"],
    note: "Already visible in multi-stakeholder contexts.",
  },
  {
    id: "sk-sensemaking",
    name: "Strategic sensemaking",
    category: "Strategic skill",
    band: "expressed",
    level: 8,
    evidenceSignal: "Synthesis of ambiguous inputs and taxonomies",
    escoHint: "Analyse organisational needs",
    onetHint: "Complex problem solving",
    suggestedOnetCodes: ["13-1111.00", "13-1082.00"],
  },
  {
    id: "sk-learning-design",
    name: "Learning experience design",
    category: "Technical / human systems",
    band: "expressed",
    level: 7,
    evidenceSignal: "Pilot programs and peer learning sessions",
    escoHint: "Develop training programmes",
    onetHint: "Instructional design",
    suggestedOnetCodes: ["11-3131.00", "21-1012.00"],
  },
  {
    id: "sk-opportunity-mapping",
    name: "Opportunity mapping",
    category: "Portfolio / career design",
    band: "latent",
    level: 6,
    evidenceSignal: "Recurring interest in roles, taxonomies, and possible futures",
    escoHint: "Develop strategic planning",
    onetHint: "Personnel resources / labour market analysis",
    suggestedOnetCodes: ["21-1012.00", "13-1111.00"],
  },
  {
    id: "sk-mentorship",
    name: "Structured mentorship",
    category: "Relational",
    band: "latent",
    level: 5,
    evidenceSignal: "Strong traction in growth conversations, not yet systematized",
    escoHint: "Coach employees",
    onetHint: "Coaching and developing others",
    suggestedOnetCodes: ["21-1012.00", "11-3131.00"],
  },
  {
    id: "sk-portfolio-story",
    name: "Portfolio narrative",
    category: "Strategic communication",
    band: "strategic",
    level: 7,
    evidenceSignal: "Ability to connect evidence, patterns, and scenarios",
    escoHint: "Create communication strategy",
    onetHint: "Communicating with persons outside organization",
    suggestedOnetCodes: ["21-1012.00", "13-1111.00"],
  },
  {
    id: "sk-human-systems",
    name: "Human systems design",
    category: "Systems",
    band: "strategic",
    level: 6,
    evidenceSignal: "Motivation toward work design, rituals, and sustainable contexts",
    escoHint: "Design organisational processes",
    onetHint: "Work design / organizational development",
    suggestedOnetCodes: ["13-1111.00", "11-3131.00"],
  },
  {
    id: "sk-taxonomy-translation",
    name: "ESCO / O*NET translation",
    category: "Taxonomy bridge",
    band: "strategic",
    level: 5,
    evidenceSignal: "Research note on skill architecture and emerging roles",
    escoHint: "Skill taxonomy mapping TODO",
    onetHint: "Crosswalk placeholder TODO",
    suggestedOnetCodes: ["13-1111.00", "11-3131.00"],
    note: "In the first sprint this remains an explicit placeholder with mock data.",
  },
];

export const opportunitiesMock: Opportunity[] = [
  {
    id: "op-job-crafting",
    title: "Job crafting in the current role",
    path: "Internal scenario",
    summary:
      "Recalibrate scope and rituals to increase facilitation, learning design, and strategic contribution without changing context right away.",
    context: "Low transition friction, high dependence on how much room can actually be negotiated inside the current role.",
    compensationModel: "Stability + scope redesign",
    escoHint: "Process improvement / capability enablement",
    onetHint: "Training and development / project coordination",
    onetMatches: [
      {
        code: "13-1082.00",
        title: "Project Management Specialists",
        summary:
          "O*NET role oriented toward coordinating timelines, budget, staffing, and project delivery.",
        officialUrl: "https://www.onetonline.org/link/summary/13-1082.00",
        updatedLabel: "Updated 2026",
        brightOutlook: true,
        sampleTitles: ["Program Management Analyst", "Business Project Lead"],
        alignment: "Core match",
        whyAligned:
          "Translates job crafting into a market-readable shape: orchestration, coordination, and cross-team alignment.",
        albaOverlap: ["facilitation", "sensemaking", "project coordination"],
      },
      {
        code: "11-3131.00",
        title: "Training and Development Managers",
        summary:
          "O*NET role centered on leading training programs, staff development, and continuous learning improvement.",
        officialUrl: "https://www.onetonline.org/link/summary/11-3131.00",
        updatedLabel: "Updated 2026",
        brightOutlook: true,
        sampleTitles: ["Learning Manager", "Staff Development Director"],
        alignment: "Adjacent match",
        whyAligned:
          "Helps test whether the current role can move toward learning enablement and capability building without changing company.",
        albaOverlap: ["learning design", "coaching", "capability building"],
      },
    ],
    fit: {
      skillFit: 82,
      purposeFit: 71,
      valuesFit: 78,
      energyFit: 68,
      workContextFit: 73,
      wellbeingFit: 69,
      growthPotential: 74,
    },
    note: "Credible hypothesis if the context genuinely allows job crafting and visibility of contribution.",
  },
  {
    id: "op-people-innovation",
    title: "New role: People Innovation / Future of Work",
    path: "Career transition",
    summary:
      "Bridge role across research, experience design, skill architecture, and organizational transformation.",
    context: "A more demanding transition, but with better convergence between curiosity, purpose, and systemic leverage.",
    compensationModel: "Role growth + specialist positioning",
    escoHint: "Human resources development manager",
    onetHint: "Training and Development Managers / Organizational Development",
    onetMatches: [
      {
        code: "11-3131.00",
        title: "Training and Development Managers",
        summary:
          "O*NET role focused on learning strategy, staff development, and the improvement of training programs.",
        officialUrl: "https://www.onetonline.org/link/summary/11-3131.00",
        updatedLabel: "Updated 2026",
        brightOutlook: true,
        sampleTitles: ["Learning and Development Director", "OD Manager"],
        alignment: "Core match",
        whyAligned:
          "This is the most direct bridge between learning systems, people innovation, and work design in Alba's mock portfolio.",
        albaOverlap: ["learning systems", "organizational development", "coaching others"],
      },
      {
        code: "13-1111.00",
        title: "Management Analysts",
        summary:
          "O*NET role dedicated to organizational studies, process design, and recommendations that make systems more effective.",
        officialUrl: "https://www.onetonline.org/link/summary/13-1111.00",
        updatedLabel: "Updated 2026",
        brightOutlook: true,
        sampleTitles: ["Management Consultant", "Organizational Development Consultant"],
        alignment: "Core match",
        whyAligned:
          "Opens a concrete outlet for sensemaking, process design, and turning complexity into operating choices.",
        albaOverlap: ["organizational studies", "systems thinking", "decision support"],
      },
    ],
    fit: {
      skillFit: 76,
      purposeFit: 88,
      valuesFit: 84,
      energyFit: 81,
      workContextFit: 74,
      wellbeingFit: 79,
      growthPotential: 89,
    },
    note: "Requires proof of work and a credible translation of current skills toward the target market.",
  },
  {
    id: "op-purpose-lab",
    title: "Side project: Purpose Lab",
    path: "Entrepreneurial experiment",
    summary:
      "Product-lab for human portfolios, wellbeing design, and professional scenario simulation.",
    context: "High creative freedom and strong alignment, but financial sustainability still needs progressive validation.",
    compensationModel: "Hybrid portfolio / demand validation",
    escoHint: "Career guidance services",
    onetHint: "Self-employment / consulting prototype",
    onetMatches: [
      {
        code: "21-1012.00",
        title: "Educational, Guidance, and Career Counselors and Advisors",
        summary:
          "O*NET role covering educational and career guidance, with a focus on decision support and guidance services.",
        officialUrl: "https://www.onetonline.org/link/summary/21-1012.00",
        updatedLabel: "Updated 2026",
        sampleTitles: ["Career Counselor", "Academic Advisor"],
        alignment: "Core match",
        whyAligned:
          "It is the closest O*NET translation for a Purpose Lab that helps others clarify options, constraints, and direction.",
        albaOverlap: ["career guidance", "structured conversations", "purpose exploration"],
      },
      {
        code: "13-1111.00",
        title: "Management Analysts",
        summary:
          "O*NET role oriented toward designing more effective systems and procedures, often in consulting or advisory settings.",
        officialUrl: "https://www.onetonline.org/link/summary/13-1111.00",
        updatedLabel: "Updated 2026",
        brightOutlook: true,
        sampleTitles: ["Business Consultant", "Performance Management Analyst"],
        alignment: "Adjacent match",
        whyAligned:
          "Keeps the consulting component of the side project open if the lab evolves into services for teams or organizations.",
        albaOverlap: ["consulting", "portfolio narrative", "organizational redesign"],
      },
    ],
    fit: {
      skillFit: 79,
      purposeFit: 91,
      valuesFit: 90,
      energyFit: 84,
      workContextFit: 72,
      wellbeingFit: 77,
      growthPotential: 86,
    },
    note: "Useful as a learning lab, not as an impulsive leap.",
  },
];

export const scenariosMock: Scenario[] = [
  {
    id: "sc-job-crafting",
    title: "Scenario 1 - Job crafting in the current role",
    horizon: "90 days",
    thesis:
      "Redistribute work toward more facilitation, enablement, and narrative strategy to test how much real room exists inside the current context.",
    opportunityIds: ["op-job-crafting"],
    fit: opportunitiesMock[0].fit,
    permav: {
      positiveEmotion: 66,
      engagement: 72,
      relationships: 74,
      meaning: 69,
      accomplishment: 77,
      vitality: 64,
    },
    ikigaiSignal: "Good alignment with existing strengths, medium alignment on sustainability and purpose.",
    wellbeingShift: "Improves contribution and relationships, but stays fragile if the context does not truly change.",
  },
  {
    id: "sc-people-innovation",
    title: "Scenario 2 - People Innovation / Future of Work",
    horizon: "6-12 months",
    thesis:
      "Reposition toward a role explicitly focused on skill architecture, learning systems, and work design.",
    opportunityIds: ["op-people-innovation"],
    fit: opportunitiesMock[1].fit,
    permav: {
      positiveEmotion: 78,
      engagement: 83,
      relationships: 76,
      meaning: 88,
      accomplishment: 79,
      vitality: 75,
    },
    ikigaiSignal: "Strong area across love, world need, and paid value, with some context gaps still to explore.",
    wellbeingShift: "Higher flourishing potential, balanced by transition risk and the need for a strong narrative.",
  },
  {
    id: "sc-purpose-lab",
    title: "Scenario 3 - Side project Purpose Lab",
    horizon: "12 weeks",
    thesis:
      "Use a disciplined side project to validate demand, voice, and format for the Portable Human Portfolio without depending on an immediate leap.",
    opportunityIds: ["op-purpose-lab"],
    fit: opportunitiesMock[2].fit,
    permav: {
      positiveEmotion: 81,
      engagement: 89,
      relationships: 70,
      meaning: 92,
      accomplishment: 73,
      vitality: 72,
    },
    ikigaiSignal: "Strongest signal on meaning, with financial sustainability still to be built step by step.",
    wellbeingShift: "Increases creative energy and purpose, but needs guardrails around load and personal finances.",
  },
];

export const defaultScenarioId = "sc-people-innovation";

const scenarioExperimentMap = {
  "sc-job-crafting": "ex-role-audit",
  "sc-people-innovation": "ex-market-signals",
  "sc-purpose-lab": "ex-purpose-lab-pilot",
} as const;

const scenarioWellbeingFocusMap = {
  "sc-job-crafting": {
    targetIds: ["wb-professional", "wb-relational", "wb-physical"],
    note:
      "In job crafting, wellbeing depends mainly on perceived contribution, work relationship quality, and recovery energy.",
    permavLens: ["Accomplishment", "Relationships", "Vitality"],
  },
  "sc-people-innovation": {
    targetIds: ["wb-professional", "wb-spiritual", "wb-mental"],
    note:
      "The transition toward People Innovation requires cognitive clarity, a sense of purpose, and a professional frame that can support repositioning.",
    permavLens: ["Meaning", "Engagement", "Accomplishment"],
  },
  "sc-purpose-lab": {
    targetIds: ["wb-spiritual", "wb-financial", "wb-environment"],
    note:
      "A Purpose Lab needs high meaning, financial guardrails, and a life context that protects creative space and sustainability.",
    permavLens: ["Meaning", "Positive Emotion", "Vitality"],
  },
} as const;

export const onetRolesMock = Array.from(
  new Map(
    opportunitiesMock
      .flatMap((opportunity) => opportunity.onetMatches)
      .map((role) => [role.code, role]),
  ).values(),
);

export function getOnetRoleByCode(code: string) {
  return onetRolesMock.find((role) => role.code === code);
}

export function getSkillBandOnetSuggestions(skills: SkillProfile[]) {
  const grouped = new Map<
    string,
    {
      role: NonNullable<ReturnType<typeof getOnetRoleByCode>>;
      supportingSkills: SkillProfile[];
    }
  >();

  for (const skill of skills) {
    for (const code of skill.suggestedOnetCodes ?? []) {
      const role = getOnetRoleByCode(code);

      if (!role) {
        continue;
      }

      const current = grouped.get(code);

      if (current) {
        current.supportingSkills.push(skill);
      } else {
        grouped.set(code, {
          role,
          supportingSkills: [skill],
        });
      }
    }
  }

  return Array.from(grouped.values()).sort((left, right) => {
    if (right.supportingSkills.length !== left.supportingSkills.length) {
      return right.supportingSkills.length - left.supportingSkills.length;
    }

    return left.role.title.localeCompare(right.role.title);
  });
}

export const activationPlansMock: ActivationPlan[] = [
  {
    id: "ap-role-redesign",
    title: "Activation plan - Role redesign",
    scenarioId: "sc-job-crafting",
    focus: "Renegotiate the scope of the current role with visible proof of impact.",
    duration: "4 weeks",
    moves: [
      "Prepare a short narrative deck with evidence, patterns, and higher-leverage activities.",
      "Propose a monthly workshop experiment on alignment and capability building.",
      "Reduce at least one high-friction, low-meaning task with an alternative proposal.",
    ],
    wellbeingLevers: [
      "Sleep consistency",
      "Walking meetings",
      "Protected deep-work blocks",
      "Steadier lunches",
      "Two mobility sessions each week",
    ],
    routineBundle: {
      sleep: ["Sleep window within 45 minutes", "No email in the last 30 minutes of the evening"],
      nutrition: ["One protein-forward lunch prepared in advance", "Hydration cue at the start of each focus block"],
      movement: ["Walking meetings twice a week", "Two short mobility or light-strength sessions"],
      recovery: ["Protected deep-work blocks", "10-minute shutdown note before leaving work"],
    },
    riskGuardrail: "If after 30-45 days the context still does not create real space, do not force staying as the only option.",
  },
  {
    id: "ap-transition-fow",
    title: "Activation plan - Future of Work transition",
    scenarioId: "sc-people-innovation",
    focus: "Build market credibility for People Innovation / Future of Work roles.",
    duration: "8 weeks",
    moves: [
      "Translate 3 current evidence points into case studies oriented toward skill architecture and organizational learning.",
      "Map 15 target job titles with placeholder ESCO/O*NET language and priority gaps.",
      "Start 5 exploratory conversations with domain professionals.",
    ],
    wellbeingLevers: [
      "Light strength training",
      "Mindfulness 10 min",
      "Boundary review weekly",
      "Higher-protein breakfast",
      "One no-meeting recovery block",
    ],
    routineBundle: {
      sleep: ["Consistent wake-up time on workdays", "Device cutoff 45 minutes before bed three nights a week"],
      nutrition: ["Protein-first breakfast before interviews or deep work", "Batch one simple dinner for transition weeks"],
      movement: ["Two light strength sessions", "One longer walk after networking or interviews"],
      recovery: ["Mindfulness 10 minutes", "One no-meeting recovery block every week"],
    },
    riskGuardrail: "Avoid scattered upskilling: choose 1-2 portfolio assets with the strongest signal value.",
  },
  {
    id: "ap-purpose-lab",
    title: "Activation plan - Purpose Lab",
    scenarioId: "sc-purpose-lab",
    focus: "Validate a useful lab or artifact without treating it as a final identity.",
    duration: "12 weeks",
    moves: [
      "Build a low-fi demo of the exportable dossier and a scenario/fit page.",
      "Test 3 guided conversations with pilot profiles using only the mock framework and no diagnosis.",
      "Define a micro-offer consistent with time and energy constraints.",
    ],
    wellbeingLevers: [
      "Weekly recovery block",
      "Breathwork before creation",
      "Money review biweekly",
      "Simple anti-crash meal plan",
      "Three movement breaks on creation days",
    ],
    routineBundle: {
      sleep: ["Protect one earlier night before a creation sprint", "No new work after the planned stop time"],
      nutrition: ["Simple anti-crash meal plan for creation days", "Snack and hydration check before facilitation or pilots"],
      movement: ["Three movement breaks on creation days", "One longer outdoor session every weekend"],
      recovery: ["Weekly recovery block", "Breathwork before creation"],
    },
    riskGuardrail: "Treat the side project as an experiment with explicit budget, time, and stop criteria.",
  },
];

export const experimentsMock: Experiment[] = [
  {
    id: "ex-role-audit",
    scenarioId: "sc-job-crafting",
    title: "Job crafting audit",
    horizon: "2 weeks",
    theme: "Work design",
    hypothesis:
      "If facilitation and learning windows are protected, perceived contribution and energy improve.",
    effort: 2,
    impact: 4,
    status: "Ready",
    note: "Define a simple metric: quality of the conversations generated and post-activity energy level.",
  },
  {
    id: "ex-market-signals",
    scenarioId: "sc-people-innovation",
    title: "Signal scan of 15 target roles",
    horizon: "3 weeks",
    theme: "Career crafting",
    hypothesis:
      "Translating skills into market language reveals more readable and realistic occupational clusters.",
    effort: 3,
    impact: 5,
    status: "In progress",
    note: "Use ESCO/O*NET placeholders, not definitive fit claims.",
  },
  {
    id: "ex-purpose-lab-pilot",
    scenarioId: "sc-purpose-lab",
    title: "Purpose Lab pilot",
    horizon: "4 weeks",
    theme: "Prototype validation",
    hypothesis:
      "A portfolio plus scenario-map artifact helps other people clarify hypotheses without feeling labeled.",
    effort: 4,
    impact: 5,
    status: "Idea",
    note: "Success = useful conversations, not identity confirmation.",
  },
];

export const dossierExportMock: DossierExport = {
  id: "de-master-dossier",
  title: "ALBA Portable Human Portfolio",
  format: "Markdown + JSON",
  summary:
    "Local summary of evidence, skills, values, provisional why, wellbeing baseline, simulated scenarios, and activation levers.",
};

export const portfolioSummaryMock: PortfolioSummary = {
  expressedSkills: ["Workshop facilitation", "Strategic sensemaking", "Learning experience design"],
  latentSkills: ["Opportunity mapping", "Structured mentorship"],
  strategicSkills: ["Portfolio narrative", "Human systems design", "ESCO / O*NET translation"],
  values: valuesMock,
  interests: ["Future of Work", "Skill architecture", "Learning systems"],
  passions: ["Conversations that unlock choices", "Tooling for human orientation", "Sustainable wellbeing"],
  why: whyHypothesisMock.statement,
  flowPatterns: patternsMock.map((pattern) => pattern.title),
  wellbeingBaseline: wellbeingTargetsMock.map(
    (target) => `${target.domain}: ${target.currentLevel}/10`,
  ),
  constraints: [
    "Avoid impulsive leaps without a narrative and financial buffer.",
    "Protect energy, recovery, and cognitive load during transitions.",
    "Favor progressive experiments before irreversible decisions.",
  ],
  evidenceIds: evidenceMock.map((evidence) => evidence.id),
};

export const digitalTwinAgentMock: DigitalTwinAgentReport = {
  id: "dt-alba-orchestrator",
  title: "Digital Twin intake agent",
  status: "dummy-live",
  objective:
    "Collect already-existing user traces, turn them into cautious input hypotheses, and route them into Evidence, Wellbeing, Skills, Why, and Simulation.",
  lastRunLabel: "Synced with dummy sources on June 28, 2026",
  sources: [
    {
      id: "dt-linkedin",
      title: "Professional profile snapshot",
      status: "ready",
      lastSyncLabel: "Today",
      coverage: ["Evidence", "Skills", "Opportunities"],
      note: "Dummy import of profile headline, role history, and saved job themes.",
    },
    {
      id: "dt-cv",
      title: "CV and portfolio archive",
      status: "ready",
      lastSyncLabel: "Today",
      coverage: ["Evidence", "Why", "Dossier"],
      note: "Dummy extraction of projects, achievements, and recurring contribution language.",
    },
    {
      id: "dt-wellbeing",
      title: "Routine and wearable snapshot",
      status: "watching",
      lastSyncLabel: "This week",
      coverage: ["Wellbeing", "Activation"],
      note: "Dummy stream of sleep consistency, walking cadence, and focus-recovery signals.",
    },
  ],
  signals: [
    {
      id: "dts-role-story",
      title: "Career story ready for translation",
      summary: "Existing material already contains reusable language for role transitions and proof-of-work excerpts.",
      targetAreas: ["Evidence", "Skills", "Simulation"],
      confidence: 7,
    },
    {
      id: "dts-energy-rhythm",
      title: "Routine-sensitive energy rhythm",
      summary: "Vitality appears stronger when sleep, movement, and focused time stay more regular.",
      targetAreas: ["Wellbeing", "Activation"],
      confidence: 6,
    },
    {
      id: "dts-purpose-threads",
      title: "Repeated purpose thread",
      summary: "Projects and notes repeatedly converge on human orientation, growth conversations, and systems clarity.",
      targetAreas: ["Why", "Ikigai", "Simulation"],
      confidence: 7,
    },
  ],
  suggestedInputs: [
    "Sync a CV or portfolio PDF as the baseline artifact.",
    "Add one recent wellbeing or routine snapshot to calibrate activation suggestions.",
    "Capture one target role or job ad to improve the live opportunity bridge.",
  ],
  nextActions: [
    "Promote one dummy source into a real local attachment when the user uploads a file.",
    "Generate draft evidence suggestions before manual review.",
    "Refresh scenario and opportunity hints after each new attachment.",
  ],
  guardrail:
    "The agent only proposes intake hypotheses. It does not infer identity, diagnosis, or definitive career fit.",
};

export const gamificationProfileMock: GamificationProfile = {
  level: 3,
  xp: 340,
  nextLevelXp: 500,
  badge: "Momentum Builder",
  momentumLabel: "Steady progress with low drama and clear next steps.",
  wins: [
    "3 evidence cards already support the active scenario",
    "1 simulation bridge is ready to compare with live ESCO data",
    "1 activation plan now includes sleep, nutrition, movement, and recovery cues",
  ],
  phases: [
    {
      phaseId: "awareness",
      title: "Awareness",
      progress: 68,
      streakDays: 4,
      currentQuest: "Turn one uploaded artifact into 2-3 validated evidence notes.",
      reward: "Unlock a cleaner portfolio baseline.",
    },
    {
      phaseId: "simulation",
      title: "Simulation",
      progress: 54,
      streakDays: 3,
      currentQuest: "Compare the active scenario against 3 live ESCO role families.",
      reward: "Unlock a stronger market-language bridge.",
    },
    {
      phaseId: "activation",
      title: "Activation",
      progress: 47,
      streakDays: 2,
      currentQuest: "Choose one weekly routine stack and one lead experiment.",
      reward: "Unlock a more testable 2-week plan.",
    },
  ],
};

export function buildLiveOpportunityFallback(
  query: string,
  opportunity?: Opportunity,
): LiveOpportunityPipeline {
  const fallbackRoles = opportunity?.onetMatches.slice(0, 3) ?? [];

  return {
    query,
    searchedAt: "Local fallback",
    esco: {
      status: "fallback",
      note: "ESCO live search is not available in this fallback view, so Alba shows the local bridge already mapped in the prototype.",
      total: fallbackRoles.length,
      items: fallbackRoles.map((role) => ({
        uri: `fallback://${role.code}`,
        title: role.title,
        code: role.code,
        language: "en",
        officialUrl: role.officialUrl,
      })),
    },
    onet: {
      status: "fallback",
      note: "O*NET live search requires official credentials. Alba falls back to the local O*NET bridge already saved in the prototype.",
      credentialsConfigured: false,
      items: fallbackRoles.map((role) => ({
        code: role.code,
        title: role.title,
        officialUrl: role.officialUrl,
        source: "portfolio-fallback",
      })),
    },
    bridgeSummary: [
      "Local fallback keeps the Simulation experience stable even when live sources are unavailable.",
      "The prototype still presents every opportunity as a hypothesis to validate, not as a final match.",
    ],
  };
}

export function getEvidenceById(id: string) {
  return evidenceMock.find((evidence) => evidence.id === id);
}

export function getSignalsForEvidence(evidenceId: string) {
  return signalsMock.filter((signal) => signal.evidenceId === evidenceId);
}

export function getPatternsForEvidence(evidenceId: string) {
  const evidence = getEvidenceById(evidenceId);

  if (!evidence) {
    return [];
  }

  return patternsMock.filter((pattern) => evidence.linkedPatternIds.includes(pattern.id));
}

export function getOpportunityById(id: string) {
  return opportunitiesMock.find((opportunity) => opportunity.id === id);
}

export function getScenarioById(id: string) {
  return scenariosMock.find((scenario) => scenario.id === id);
}

export function resolveScenarioId(candidate?: string | string[]) {
  const normalized = Array.isArray(candidate) ? candidate[0] : candidate;

  if (normalized && getScenarioById(normalized)) {
    return normalized;
  }

  return defaultScenarioId;
}

export function getDefaultScenario() {
  return getScenarioById(defaultScenarioId) ?? scenariosMock[0];
}

export function getDigitalTwinAgentReport() {
  return digitalTwinAgentMock;
}

export function getGamificationProfile() {
  return gamificationProfileMock;
}

export function getScenarioForRoute(candidate?: string | string[]) {
  return getScenarioById(resolveScenarioId(candidate)) ?? getDefaultScenario();
}

export function getScenariosForOpportunity(opportunityId: string) {
  return scenariosMock.filter((scenario) => scenario.opportunityIds.includes(opportunityId));
}

export function getPrimaryOpportunityForScenario(scenarioId: string) {
  const scenario = getScenarioById(scenarioId);

  if (!scenario) {
    return undefined;
  }

  return scenario.opportunityIds
    .map((opportunityId) => getOpportunityById(opportunityId))
    .find((opportunity): opportunity is NonNullable<typeof opportunity> => Boolean(opportunity));
}

export function getSkillsForScenario(scenarioId: string) {
  const opportunity = getPrimaryOpportunityForScenario(scenarioId);

  if (!opportunity) {
    return [];
  }

  return getSkillsForOpportunity(opportunity.id);
}

export function getSkillsForOpportunity(opportunityId: string) {
  const opportunity = getOpportunityById(opportunityId);

  if (!opportunity) {
    return [];
  }

  return skillsMock.filter((skill) =>
    skill.suggestedOnetCodes?.some((code) =>
      opportunity.onetMatches.some((role) => role.code === code),
    ),
  );
}

export function getOpportunitiesForSkill(skillId: string) {
  const skill = skillsMock.find((candidate) => candidate.id === skillId);

  if (!skill) {
    return [];
  }

  return opportunitiesMock.filter((opportunity) =>
    opportunity.onetMatches.some((role) =>
      (skill.suggestedOnetCodes ?? []).includes(role.code),
    ),
  );
}

export function buildOpportunityGraphEntries() {
  return opportunitiesMock.map((opportunity) => ({
    opportunity,
    scenarios: getScenariosForOpportunity(opportunity.id),
    skills: getSkillsForOpportunity(opportunity.id),
  }));
}

export function getActivationPlanForScenario(scenarioId: string) {
  return activationPlansMock.find((plan) => plan.scenarioId === scenarioId);
}

export function getExperimentForScenario(scenarioId: string) {
  return (
    experimentsMock.find((experiment) => experiment.scenarioId === scenarioId) ??
    experimentsMock.find(
      (experiment) =>
        experiment.id ===
        scenarioExperimentMap[scenarioId as keyof typeof scenarioExperimentMap],
    )
  );
}

export function getWellbeingFocusForScenario(scenarioId: string) {
  const config =
    scenarioWellbeingFocusMap[
      scenarioId as keyof typeof scenarioWellbeingFocusMap
    ] ?? scenarioWellbeingFocusMap[defaultScenarioId];
  const targets = config.targetIds
    .map((targetId) => wellbeingTargetsMock.find((target) => target.id === targetId))
    .filter((target): target is (typeof wellbeingTargetsMock)[number] => Boolean(target));
  const plan = getActivationPlanForScenario(scenarioId);

  return {
    levers: plan?.wellbeingLevers ?? [],
    note: config.note,
    permavLens: config.permavLens,
    targets,
  };
}

function prioritizeIkigaiItems(items: string[], focusedItems: readonly string[]) {
  const focusedSet = new Set(focusedItems);

  return [...items].sort((left, right) => {
    const leftFocused = focusedSet.has(left);
    const rightFocused = focusedSet.has(right);

    if (leftFocused === rightFocused) {
      return 0;
    }

    return leftFocused ? -1 : 1;
  });
}

export function getIkigaiFocusForScenario(scenarioId: string) {
  const config =
    scenarioIkigaiFocusMap[
      scenarioId as keyof typeof scenarioIkigaiFocusMap
    ] ?? scenarioIkigaiFocusMap[defaultScenarioId];

  return {
    centerOfGravity: config.centerOfGravity,
    highlightedItems: [
      ...config.loves,
      ...config.strengths,
      ...config.worldNeeds,
      ...config.paidFor,
    ],
    note: config.note,
  };
}

export function buildIkigaiMapForScenario(scenarioId: string): IkigaiMap {
  const config =
    scenarioIkigaiFocusMap[
      scenarioId as keyof typeof scenarioIkigaiFocusMap
    ] ?? scenarioIkigaiFocusMap[defaultScenarioId];

  return {
    ...ikigaiMapMock,
    id: `${ikigaiMapMock.id}-${scenarioId}`,
    loves: prioritizeIkigaiItems(ikigaiMapMock.loves, config.loves),
    strengths: prioritizeIkigaiItems(ikigaiMapMock.strengths, config.strengths),
    worldNeeds: prioritizeIkigaiItems(ikigaiMapMock.worldNeeds, config.worldNeeds),
    paidFor: prioritizeIkigaiItems(ikigaiMapMock.paidFor, config.paidFor),
    centerOfGravity: config.centerOfGravity,
    note: config.note,
  };
}

export function buildScenarioHref(
  path: string,
  scenarioId?: string,
  hash?: string,
  locale?: Locale,
) {
  const resolvedScenarioId = resolveScenarioId(scenarioId);

  return buildAppHref(path, {
    hash,
    locale,
    scenarioId: resolvedScenarioId,
  });
}

export function enrichWellbeingTargets(targets: WellbeingTarget[]) {
  return targets.map((target) => ({
    ...target,
    gap: computeGap(target.currentLevel, target.desiredLevel),
    activationNeed: computeActivationNeed(
      target.currentLevel,
      target.desiredLevel,
      target.priority,
    ),
  }));
}

export function buildDossierPayload(scenarioId?: string) {
  const activeScenario = getScenarioById(resolveScenarioId(scenarioId));
  const focusedOpportunity = activeScenario
    ? getPrimaryOpportunityForScenario(activeScenario.id)
    : undefined;
  const focusedPlan = activeScenario ? getActivationPlanForScenario(activeScenario.id) : undefined;
  const focusedExperiment = activeScenario ? getExperimentForScenario(activeScenario.id) : undefined;

  return {
    generatedAt: "Mock export",
    scope:
      activeScenario && focusedOpportunity
        ? {
            scenarioId: activeScenario.id,
            scenarioTitle: activeScenario.title,
            opportunityTitle: focusedOpportunity.title,
          }
        : null,
    portfolio: portfolioSummaryMock,
    evidence: evidenceMock,
    patterns: patternsMock,
    why: whyHypothesisMock,
    ikigai: ikigaiMapMock,
    wellbeing: enrichWellbeingTargets(wellbeingTargetsMock),
    scenarios: activeScenario ? [activeScenario] : scenariosMock,
    opportunities: focusedOpportunity ? [focusedOpportunity] : opportunitiesMock,
    activationPlans: focusedPlan ? [focusedPlan] : activationPlansMock,
    experiments: focusedExperiment ? [focusedExperiment] : experimentsMock,
  };
}

export function buildDossierMarkdown(scenarioId?: string) {
  const activeScenario = getScenarioById(resolveScenarioId(scenarioId));
  const focusedOpportunity = activeScenario
    ? getPrimaryOpportunityForScenario(activeScenario.id)
    : undefined;
  const focusedPlan = activeScenario ? getActivationPlanForScenario(activeScenario.id) : undefined;
  const focusedExperiment = activeScenario ? getExperimentForScenario(activeScenario.id) : undefined;
  const wellbeingLines = enrichWellbeingTargets(wellbeingTargetsMock)
    .map(
      (target) =>
        `- ${target.domain}: current ${target.currentLevel}/10, desired ${target.desiredLevel}/10, priority ${target.priority}, activationNeed ${target.activationNeed}`,
    )
    .join("\n");

  const scenarioLines = (activeScenario ? [activeScenario] : scenariosMock)
    .map(
      (scenario) =>
        `## ${scenario.title}\n- Thesis: ${scenario.thesis}\n- Ikigai signal: ${scenario.ikigaiSignal}\n- Wellbeing shift: ${scenario.wellbeingShift}`,
    )
    .join("\n\n");

  const focusBlock =
    activeScenario && focusedOpportunity && focusedPlan && focusedExperiment
      ? `## Active focus scenario\n- Scenario: ${activeScenario.title}\n- Opportunity: ${focusedOpportunity.title}\n- Activation plan: ${focusedPlan.title}\n- Lead experiment: ${focusedExperiment.title}\n`
      : "";

  return `# ${dossierExportMock.title}

${focusBlock}

## Provisional WHY
${whyHypothesisMock.statement}

## Guiding values
${valuesMock.map((value) => `- ${value}`).join("\n")}

## Skills
### Expressed
${portfolioSummaryMock.expressedSkills.map((skill) => `- ${skill}`).join("\n")}

### Latent
${portfolioSummaryMock.latentSkills.map((skill) => `- ${skill}`).join("\n")}

### Strategic
${portfolioSummaryMock.strategicSkills.map((skill) => `- ${skill}`).join("\n")}

## Wellbeing baseline
${wellbeingLines}

## Simulated scenarios
${scenarioLines}
`;
}
