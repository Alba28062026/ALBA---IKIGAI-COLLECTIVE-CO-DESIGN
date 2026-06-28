import { mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { DatabaseSync } from "node:sqlite";

function resolveDatabasePath(databaseUrl) {
  if (!databaseUrl.startsWith("file:")) {
    throw new Error(`Unsupported DATABASE_URL for local prototype: ${databaseUrl}`);
  }

  const relativePath = databaseUrl.slice("file:".length);
  const normalized = relativePath.startsWith("./") ? relativePath.slice(2) : relativePath;

  return path.resolve(process.cwd(), normalized);
}

const databaseUrl = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const databasePath = resolveDatabasePath(databaseUrl);
const schemaPath = path.resolve(process.cwd(), "prisma/bootstrap.sql");
const sql = readFileSync(schemaPath, "utf8");
const migrationStatements = [
  'ALTER TABLE "Experiment" ADD COLUMN "scenarioId" TEXT NOT NULL DEFAULT \'sc-job-crafting\'',
];

mkdirSync(path.dirname(databasePath), { recursive: true });

const database = new DatabaseSync(databasePath);

database.exec(sql);

for (const statement of migrationStatements) {
  try {
    database.exec(statement);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (message.includes("duplicate column name")) {
      continue;
    }

    throw error;
  }
}

database.close();

console.log(`SQLite schema initialized at ${databasePath}`);
