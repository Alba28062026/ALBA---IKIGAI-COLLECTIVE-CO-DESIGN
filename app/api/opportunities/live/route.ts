import { NextResponse } from "next/server";
import { getOpportunityById } from "@/lib/mock-data";
import { getLiveOpportunityPipeline } from "@/lib/opportunity-live";
import { resolveLocale } from "@/lib/i18n";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = resolveLocale(searchParams.get("lang"));
  const opportunityId = searchParams.get("opportunityId") ?? undefined;
  const query = searchParams.get("query")?.trim() || "people innovation";
  const opportunity = opportunityId ? getOpportunityById(opportunityId) : undefined;

  const payload = await getLiveOpportunityPipeline({
    locale,
    opportunity,
    query,
  });

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=3600",
    },
  });
}
