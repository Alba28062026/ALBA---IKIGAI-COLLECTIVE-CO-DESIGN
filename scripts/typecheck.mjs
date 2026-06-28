import { readdirSync, rmSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";

const nextTypesDir = join(process.cwd(), ".next", "types");

try {
  for (const entry of readdirSync(nextTypesDir)) {
    if (/\s\d+\./.test(entry)) {
      rmSync(join(nextTypesDir, entry), { force: true });
    }
  }
} catch {}

const child = spawn("tsc", ["--noEmit"], {
  env: process.env,
  stdio: "inherit",
});

child.on("close", (code) => {
  process.exit(code ?? 0);
});

child.on("error", () => {
  process.exit(1);
});
