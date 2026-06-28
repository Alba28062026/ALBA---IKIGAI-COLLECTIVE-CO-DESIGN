import { NextResponse } from "next/server";
import { resolveLocale } from "@/lib/i18n";
import { runDigitalTwinAgent } from "@/lib/digital-twin-agent";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = resolveLocale(searchParams.get("lang"));
  const report = await runDigitalTwinAgent({ locale });

  return NextResponse.json(report, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
