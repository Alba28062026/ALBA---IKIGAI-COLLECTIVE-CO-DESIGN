import { PrismaClient } from "@prisma/client";
import {
  activationPlansMock,
  digitalTwinAgentMock,
  dossierExportMock,
  evidenceMock,
  experimentsMock,
  gamificationProfileMock,
  ikigaiMapMock,
  opportunitiesMock,
  patternsMock,
  signalsMock,
  skillsMock,
  wellbeingTargetsMock,
  whyHypothesisMock,
} from "../lib/mock-data";

const prisma = new PrismaClient();

async function main() {
  await prisma.whyPattern.deleteMany();
  await prisma.patternSignal.deleteMany();
  await prisma.roleFitAssessment.deleteMany();
  await prisma.activationPlan.deleteMany();
  await prisma.signal.deleteMany();
  await prisma.pattern.deleteMany();
  await prisma.whyHypothesis.deleteMany();
  await prisma.opportunityFeedSnapshot.deleteMany();
  await prisma.digitalTwinSignal.deleteMany();
  await prisma.digitalTwinProfile.deleteMany();
  await prisma.gamificationSnapshot.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.skillProfile.deleteMany();
  await prisma.wellbeingTarget.deleteMany();
  await prisma.ikigaiMap.deleteMany();
  await prisma.experiment.deleteMany();
  await prisma.dossierExport.deleteMany();
  await prisma.evidence.deleteMany();

  await prisma.evidence.createMany({
    data: evidenceMock.map((evidence) => ({
      id: evidence.id,
      title: evidence.title,
      sourceType: evidence.sourceType,
      summary: evidence.summary,
      dateLabel: evidence.dateLabel,
      tags: evidence.tags.join(" | "),
      confidence: evidence.confidence,
      note: evidence.note,
    })),
  });

  await prisma.signal.createMany({
    data: signalsMock.map((signal) => ({
      id: signal.id,
      title: signal.title,
      description: signal.description,
      domain: signal.domain,
      strength: signal.strength,
      evidenceId: signal.evidenceId,
    })),
  });

  await prisma.pattern.createMany({
    data: patternsMock.map((pattern) => ({
      id: pattern.id,
      title: pattern.title,
      summary: pattern.summary,
      validationQuestion: pattern.validationQuestion,
      confidence: pattern.confidence,
      status: pattern.status,
    })),
  });

  await prisma.patternSignal.createMany({
    data: patternsMock.flatMap((pattern) =>
      pattern.linkedSignalIds.map((signalId) => ({
        id: `${pattern.id}-${signalId}`,
        patternId: pattern.id,
        signalId,
      })),
    ),
  });

  await prisma.whyHypothesis.create({
    data: {
      id: whyHypothesisMock.id,
      title: whyHypothesisMock.title,
      statement: whyHypothesisMock.statement,
      confidence: whyHypothesisMock.confidence,
      status: whyHypothesisMock.status,
      evidenceNote: whyHypothesisMock.evidenceNote,
    },
  });

  await prisma.whyPattern.createMany({
    data: whyHypothesisMock.linkedPatternIds.map((patternId) => ({
      id: `${whyHypothesisMock.id}-${patternId}`,
      whyHypothesisId: whyHypothesisMock.id,
      patternId,
    })),
  });

  await prisma.ikigaiMap.create({
    data: {
      id: ikigaiMapMock.id,
      loves: ikigaiMapMock.loves.join(" | "),
      strengths: ikigaiMapMock.strengths.join(" | "),
      worldNeeds: ikigaiMapMock.worldNeeds.join(" | "),
      paidFor: ikigaiMapMock.paidFor.join(" | "),
      centerOfGravity: ikigaiMapMock.centerOfGravity,
      note: ikigaiMapMock.note,
    },
  });

  await prisma.wellbeingTarget.createMany({
    data: wellbeingTargetsMock,
  });

  await prisma.skillProfile.createMany({
    data: skillsMock.map((skill) => ({
      id: skill.id,
      name: skill.name,
      category: skill.category,
      band: skill.band,
      level: skill.level,
      evidenceSignal: skill.evidenceSignal,
      escoHint: skill.escoHint,
      onetHint: skill.onetHint,
      note: skill.note,
    })),
  });

  await prisma.opportunity.createMany({
    data: opportunitiesMock.map((opportunity) => ({
      id: opportunity.id,
      title: opportunity.title,
      path: opportunity.path,
      summary: opportunity.summary,
      context: opportunity.context,
      compensationModel: opportunity.compensationModel,
      escoHint: opportunity.escoHint,
      onetHint: opportunity.onetHint,
    })),
  });

  await prisma.roleFitAssessment.createMany({
    data: opportunitiesMock.map((opportunity) => ({
      id: `${opportunity.id}-fit`,
      opportunityId: opportunity.id,
      skillFit: opportunity.fit.skillFit,
      purposeFit: opportunity.fit.purposeFit,
      valuesFit: opportunity.fit.valuesFit,
      energyFit: opportunity.fit.energyFit,
      workContextFit: opportunity.fit.workContextFit,
      wellbeingFit: opportunity.fit.wellbeingFit,
      growthPotential: opportunity.fit.growthPotential,
      note: opportunity.note,
    })),
  });

  await prisma.activationPlan.createMany({
    data: activationPlansMock.map((plan) => ({
      id: plan.id,
      scenarioId: plan.scenarioId,
      title: plan.title,
      focus: plan.focus,
      duration: plan.duration,
      moves: plan.moves.join(" | "),
      wellbeingLevers: plan.wellbeingLevers.join(" | "),
      routineSleep: plan.routineBundle.sleep.join(" | "),
      routineNutrition: plan.routineBundle.nutrition.join(" | "),
      routineMovement: plan.routineBundle.movement.join(" | "),
      routineRecovery: plan.routineBundle.recovery.join(" | "),
      riskGuardrail: plan.riskGuardrail,
    })),
  });

  await prisma.experiment.createMany({
    data: experimentsMock.map((experiment) => ({
      id: experiment.id,
      scenarioId: experiment.scenarioId,
      title: experiment.title,
      horizon: experiment.horizon,
      theme: experiment.theme,
      hypothesis: experiment.hypothesis,
      effort: experiment.effort,
      impact: experiment.impact,
      status: experiment.status,
      note: experiment.note,
    })),
  });

  await prisma.digitalTwinProfile.create({
    data: {
      id: digitalTwinAgentMock.id,
      title: digitalTwinAgentMock.title,
      status: digitalTwinAgentMock.status,
      objective: digitalTwinAgentMock.objective,
      lastRunLabel: digitalTwinAgentMock.lastRunLabel,
      guardrail: digitalTwinAgentMock.guardrail,
    },
  });

  await prisma.digitalTwinSignal.createMany({
    data: digitalTwinAgentMock.signals.map((signal) => ({
      id: signal.id,
      profileId: digitalTwinAgentMock.id,
      title: signal.title,
      summary: signal.summary,
      targetAreas: signal.targetAreas.join(" | "),
      confidence: signal.confidence,
    })),
  });

  await prisma.opportunityFeedSnapshot.create({
    data: {
      id: "ofs-live-fallback",
      query: "people innovation",
      escoStatus: "live-ready",
      onetStatus: "credentials-required",
      escoTitles: "corporate training manager | instructional designer",
      onetTitles: "Training and Development Managers | Management Analysts",
      bridgeSummary:
        "Live ESCO is available from the official public API. O*NET requires official credentials, so the local bridge remains active as stable fallback.",
    },
  });

  await prisma.gamificationSnapshot.create({
    data: {
      id: "gs-main",
      level: gamificationProfileMock.level,
      xp: gamificationProfileMock.xp,
      nextLevelXp: gamificationProfileMock.nextLevelXp,
      badge: gamificationProfileMock.badge,
      momentumLabel: gamificationProfileMock.momentumLabel,
      wins: gamificationProfileMock.wins.join(" | "),
    },
  });

  await prisma.dossierExport.create({
    data: dossierExportMock,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
