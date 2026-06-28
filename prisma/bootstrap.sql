PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS "Evidence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "dateLabel" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS "Signal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "strength" INTEGER NOT NULL,
    "evidenceId" TEXT,
    CONSTRAINT "Signal_evidenceId_fkey" FOREIGN KEY ("evidenceId") REFERENCES "Evidence" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Pattern" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "validationQuestion" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL,
    "status" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "PatternSignal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patternId" TEXT NOT NULL,
    "signalId" TEXT NOT NULL,
    CONSTRAINT "PatternSignal_patternId_fkey" FOREIGN KEY ("patternId") REFERENCES "Pattern" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "PatternSignal_signalId_fkey" FOREIGN KEY ("signalId") REFERENCES "Signal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "WhyHypothesis" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "evidenceNote" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "WhyPattern" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "whyHypothesisId" TEXT NOT NULL,
    "patternId" TEXT NOT NULL,
    CONSTRAINT "WhyPattern_whyHypothesisId_fkey" FOREIGN KEY ("whyHypothesisId") REFERENCES "WhyHypothesis" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WhyPattern_patternId_fkey" FOREIGN KEY ("patternId") REFERENCES "Pattern" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "IkigaiMap" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "loves" TEXT NOT NULL,
    "strengths" TEXT NOT NULL,
    "worldNeeds" TEXT NOT NULL,
    "paidFor" TEXT NOT NULL,
    "centerOfGravity" TEXT NOT NULL,
    "note" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "WellbeingTarget" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "domain" TEXT NOT NULL,
    "currentLevel" INTEGER NOT NULL,
    "desiredLevel" INTEGER NOT NULL,
    "priority" INTEGER NOT NULL,
    "note" TEXT
);

CREATE TABLE IF NOT EXISTS "SkillProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "band" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "evidenceSignal" TEXT NOT NULL,
    "escoHint" TEXT,
    "onetHint" TEXT,
    "note" TEXT
);

CREATE TABLE IF NOT EXISTS "Opportunity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "compensationModel" TEXT NOT NULL,
    "escoHint" TEXT,
    "onetHint" TEXT
);

CREATE TABLE IF NOT EXISTS "RoleFitAssessment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "opportunityId" TEXT NOT NULL,
    "skillFit" INTEGER NOT NULL,
    "purposeFit" INTEGER NOT NULL,
    "valuesFit" INTEGER NOT NULL,
    "energyFit" INTEGER NOT NULL,
    "workContextFit" INTEGER NOT NULL,
    "wellbeingFit" INTEGER NOT NULL,
    "growthPotential" INTEGER NOT NULL,
    "note" TEXT NOT NULL,
    CONSTRAINT "RoleFitAssessment_opportunityId_fkey" FOREIGN KEY ("opportunityId") REFERENCES "Opportunity" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "ActivationPlan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scenarioId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "focus" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "moves" TEXT NOT NULL,
    "wellbeingLevers" TEXT NOT NULL,
    "routineSleep" TEXT NOT NULL,
    "routineNutrition" TEXT NOT NULL,
    "routineMovement" TEXT NOT NULL,
    "routineRecovery" TEXT NOT NULL,
    "riskGuardrail" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "Experiment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "scenarioId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "horizon" TEXT NOT NULL,
    "theme" TEXT NOT NULL,
    "hypothesis" TEXT NOT NULL,
    "effort" INTEGER NOT NULL,
    "impact" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "note" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "DigitalTwinProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "lastRunLabel" TEXT NOT NULL,
    "guardrail" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "DigitalTwinSignal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "targetAreas" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL,
    CONSTRAINT "DigitalTwinSignal_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "DigitalTwinProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "OpportunityFeedSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "query" TEXT NOT NULL,
    "searchedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "escoStatus" TEXT NOT NULL,
    "onetStatus" TEXT NOT NULL,
    "escoTitles" TEXT NOT NULL,
    "onetTitles" TEXT NOT NULL,
    "bridgeSummary" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "GamificationSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "level" INTEGER NOT NULL,
    "xp" INTEGER NOT NULL,
    "nextLevelXp" INTEGER NOT NULL,
    "badge" TEXT NOT NULL,
    "momentumLabel" TEXT NOT NULL,
    "wins" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "DossierExport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "generatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS "PatternSignal_patternId_signalId_key" ON "PatternSignal"("patternId", "signalId");
CREATE UNIQUE INDEX IF NOT EXISTS "WhyPattern_whyHypothesisId_patternId_key" ON "WhyPattern"("whyHypothesisId", "patternId");
CREATE UNIQUE INDEX IF NOT EXISTS "RoleFitAssessment_opportunityId_key" ON "RoleFitAssessment"("opportunityId");
