import { spawn, spawnSync } from "node:child_process";
import { networkInterfaces } from "node:os";
import process from "node:process";

const isLanMode = process.argv.includes("--lan");
const host = isLanMode ? "0.0.0.0" : "127.0.0.1";
const port = Number(process.env.PORT || "3000");

function readPidsOnPort(targetPort) {
  const result = spawnSync("lsof", ["-ti", `tcp:${targetPort}`], {
    encoding: "utf8",
  });

  if (result.error) {
    throw result.error;
  }

  if (!result.stdout.trim()) {
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

async function freePort(targetPort) {
  const pids = readPidsOnPort(targetPort);

  if (!pids.length) {
    return;
  }

  console.log(`Freeing port ${targetPort}: stopping ${pids.join(", ")}`);

  for (const pid of pids) {
    try {
      process.kill(pid, "SIGTERM");
    } catch (error) {
      console.warn(`Could not stop process ${pid} with SIGTERM: ${error.message}`);
    }
  }

  await sleep(1200);

  const remaining = readPidsOnPort(targetPort);

  for (const pid of remaining) {
    try {
      process.kill(pid, "SIGKILL");
      console.log(`Force stopped process ${pid} on port ${targetPort}`);
    } catch (error) {
      console.warn(`Could not stop process ${pid} with SIGKILL: ${error.message}`);
    }
  }
}

function getLanUrls(targetPort) {
  const interfaces = networkInterfaces();
  const urls = [];

  for (const entries of Object.values(interfaces)) {
    for (const entry of entries ?? []) {
      if (entry.family !== "IPv4" || entry.internal) {
        continue;
      }

      urls.push(`http://${entry.address}:${targetPort}`);
    }
  }

  return urls;
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      env: process.env,
      ...options,
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} ${args.join(" ")} failed with code ${code}`));
    });
  });
}

async function main() {
  await freePort(port);

  console.log(`Starting Alba in stable ${isLanMode ? "LAN" : "local"} mode...`);
  await run("pnpm", ["run", "build"]);

  console.log("");
  console.log("Alba is ready to serve in production mode.");
  console.log(`Local URL: http://127.0.0.1:${port}`);

  if (isLanMode) {
    const lanUrls = getLanUrls(port);

    for (const url of lanUrls) {
      console.log(`LAN URL: ${url}`);
    }
  }

  console.log("");

  const child = spawn(
    "pnpm",
    ["exec", "next", "start", "--hostname", host, "--port", String(port)],
    {
      stdio: "inherit",
      env: process.env,
    },
  );

  const forwardSignal = (signal) => {
    if (!child.killed) {
      child.kill(signal);
    }
  };

  process.on("SIGINT", forwardSignal);
  process.on("SIGTERM", forwardSignal);

  child.on("close", (code) => {
    process.exit(code ?? 0);
  });
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
