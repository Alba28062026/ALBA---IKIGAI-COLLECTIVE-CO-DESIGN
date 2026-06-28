import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdirSync, openSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { networkInterfaces } from "node:os";
import { join } from "node:path";
import process from "node:process";

const command = process.argv[2] ?? "up";
const shouldOpenBrowser = process.argv.includes("--open");
const port = Number(process.env.PORT || "3000");
const host = "0.0.0.0";
const stateDir = join(process.cwd(), ".alba");
const pidFile = join(stateDir, "server.pid");
const logFile = join(stateDir, "server.log");

function ensureStateDir() {
  mkdirSync(stateDir, { recursive: true });
}

function readPidsOnPort(targetPort) {
  const result = spawnSync("lsof", ["-ti", `tcp:${targetPort}`], {
    encoding: "utf8",
  });

  if (result.error || !result.stdout.trim()) {
    return [];
  }

  return Array.from(
    new Set(
      result.stdout
        .trim()
        .split(/\s+/)
        .map((value) => Number(value))
        .filter((value) => Number.isInteger(value) && value > 0),
    ),
  );
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function readStoredPid() {
  if (!existsSync(pidFile)) {
    return null;
  }

  const value = Number(readFileSync(pidFile, "utf8").trim());

  return Number.isInteger(value) && value > 0 ? value : null;
}

function removeStoredPid() {
  rmSync(pidFile, { force: true });
}

function isPidAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function stopPid(pid) {
  if (!pid || !isPidAlive(pid)) {
    return;
  }

  try {
    process.kill(-pid, "SIGTERM");
  } catch {
    try {
      process.kill(pid, "SIGTERM");
    } catch {}
  }

  for (let attempt = 0; attempt < 10; attempt += 1) {
    if (!isPidAlive(pid)) {
      return;
    }

    await sleep(300);
  }

  try {
    process.kill(-pid, "SIGKILL");
  } catch {
    try {
      process.kill(pid, "SIGKILL");
    } catch {}
  }
}

async function freePort(targetPort) {
  const storedPid = readStoredPid();

  if (storedPid) {
    await stopPid(storedPid);
    removeStoredPid();
  }

  const portPids = readPidsOnPort(targetPort);

  for (const pid of portPids) {
    await stopPid(pid);
  }
}

function getLanIps(targetPort) {
  const urls = [];

  for (const entries of Object.values(networkInterfaces())) {
    for (const entry of entries ?? []) {
      if (entry.family !== "IPv4" || entry.internal) {
        continue;
      }

      urls.push(`http://${entry.address}:${targetPort}`);
    }
  }

  return urls;
}

function getBonjourUrl(targetPort) {
  const result = spawnSync("scutil", ["--get", "LocalHostName"], {
    encoding: "utf8",
  });

  if (result.error) {
    return null;
  }

  const value = result.stdout.trim();

  return value ? `http://${value}.local:${targetPort}` : null;
}

function getConnectionUrls(targetPort) {
  const urls = [`http://localhost:${targetPort}`, `http://127.0.0.1:${targetPort}`];
  const bonjourUrl = getBonjourUrl(targetPort);

  if (bonjourUrl) {
    urls.push(bonjourUrl);
  }

  return [...new Set([...urls, ...getLanIps(targetPort)])];
}

function getPrimaryUrls(targetPort) {
  const bonjourUrl = getBonjourUrl(targetPort);
  const lanUrl = getLanIps(targetPort)[0] ?? null;

  return {
    macUrl: `http://localhost:${targetPort}`,
    iphoneUrl: bonjourUrl ?? lanUrl ?? `http://127.0.0.1:${targetPort}`,
    fallbackUrl: lanUrl && lanUrl !== bonjourUrl ? lanUrl : null,
  };
}

function isServerHealthy(targetPort) {
  return fetch(`http://127.0.0.1:${targetPort}/api/health`, {
    cache: "no-store",
  })
    .then((response) => response.ok)
    .catch(() => false);
}

async function waitForHealth(targetPort, timeoutMs = 20_000) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (await isServerHealthy(targetPort)) {
      return true;
    }

    await sleep(500);
  }

  return false;
}

function run(commandName, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(commandName, args, {
      env: process.env,
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${commandName} ${args.join(" ")} failed with code ${code}`));
    });
  });
}

function printUrls(targetPort) {
  const { macUrl, iphoneUrl, fallbackUrl } = getPrimaryUrls(targetPort);

  console.log("");
  console.log("Alba is running.");
  console.log(`Mac: ${macUrl}`);
  console.log(`iPhone: ${iphoneUrl}`);

  if (fallbackUrl) {
    console.log(`Fallback: ${fallbackUrl}`);
  }

  console.log(`Logs: ${logFile}`);
  console.log("Stop: pnpm run alba:down");
  console.log("");
}

function openBrowser(targetPort) {
  if (process.platform !== "darwin") {
    return;
  }

  const child = spawn("open", [`http://localhost:${targetPort}`], {
    detached: true,
    stdio: "ignore",
  });

  child.unref();
}

async function startDetached(targetPort) {
  ensureStateDir();
  await freePort(targetPort);

  console.log("Building Alba...");
  await run("pnpm", ["run", "build"]);

  writeFileSync(logFile, "");
  const logFd = openSync(logFile, "a");

  const child = spawn(
    "pnpm",
    ["exec", "next", "start", "--hostname", host, "--port", String(targetPort)],
    {
      detached: true,
      env: process.env,
      stdio: ["ignore", logFd, logFd],
    },
  );

  child.unref();
  writeFileSync(pidFile, String(child.pid));

  const healthy = await waitForHealth(targetPort);

  if (!healthy) {
    throw new Error(`Alba did not become healthy on port ${targetPort}. Check ${logFile}.`);
  }

  if (shouldOpenBrowser) {
    openBrowser(targetPort);
  }

  printUrls(targetPort);
}

async function stopDetached(targetPort) {
  await freePort(targetPort);
  removeStoredPid();
  console.log("Alba stopped.");
}

async function showStatus(targetPort) {
  const healthy = await isServerHealthy(targetPort);
  const isListening = readPidsOnPort(targetPort).length > 0;

  if (!healthy && !isListening) {
    console.log("Alba is not running.");
    console.log("Start it with: pnpm run alba");
    return;
  }

  printUrls(targetPort);
}

async function main() {
  if (command === "up") {
    await startDetached(port);
    return;
  }

  if (command === "down") {
    await stopDetached(port);
    return;
  }

  if (command === "status") {
    await showStatus(port);
    return;
  }

  if (command === "open") {
    const healthy = await isServerHealthy(port);

    if (!healthy) {
      await startDetached(port);
      return;
    }

    openBrowser(port);
    printUrls(port);
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
