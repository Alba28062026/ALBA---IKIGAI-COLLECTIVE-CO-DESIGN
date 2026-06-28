import { chmodSync, existsSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const rootDir = process.cwd();
const openSource = join(rootDir, "scripts", "launcher-open.applescript");
const stopSource = join(rootDir, "scripts", "launcher-stop.applescript");
const openApp = join(rootDir, "Open Alba.app");
const stopApp = join(rootDir, "Stop Alba.app");
const openCommand = join(rootDir, "Open Alba.command");
const stopCommand = join(rootDir, "Stop Alba.command");

function compileApp(source, output) {
  if (existsSync(output)) {
    rmSync(output, { recursive: true, force: true });
  }

  const result = spawnSync("/usr/bin/osacompile", ["-o", output, source], {
    encoding: "utf8",
  });

  if (result.status !== 0) {
    console.warn(`Could not compile ${output}`);
    if (result.stderr.trim()) {
      console.warn(result.stderr.trim());
    }
    return false;
  }

  return true;
}

function writeCommand(filePath, command) {
  writeFileSync(
    filePath,
    `#!/bin/zsh
cd "${rootDir}"
export PATH="/Users/andrea/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/Users/andrea/Documents/ALBA/.pnpm-home:$PATH"
${command}
`,
  );
  chmodSync(filePath, 0o755);
}

const openAppCreated = compileApp(openSource, openApp);
const stopAppCreated = compileApp(stopSource, stopApp);
writeCommand(openCommand, "pnpm run alba");
writeCommand(stopCommand, "pnpm run alba:down");

console.log("Created Mac launchers:");
if (openAppCreated) {
  console.log(`- ${openApp}`);
}
if (stopAppCreated) {
  console.log(`- ${stopApp}`);
}
console.log(`- ${openCommand}`);
console.log(`- ${stopCommand}`);
