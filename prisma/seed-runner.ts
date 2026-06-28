import path from "node:path";
import process from "node:process";

process.env.DATABASE_URL ??= `file:${path.join(process.cwd(), "prisma/dev.db")}`;

async function main() {
  await import("./seed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
