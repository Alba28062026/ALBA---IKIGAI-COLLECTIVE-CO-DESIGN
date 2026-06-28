import { buildLiveOpportunityFallback } from "@/lib/mock-data";
import type { Locale } from "@/lib/i18n";
import type { LiveOpportunityPipeline, OnetLiveMatch, Opportunity } from "@/lib/types";

type EscoSearchResponse = {
  total?: number;
  _embedded?: {
    results?: Array<{
      uri?: string;
      title?: string;
      code?: string;
      _links?: {
        self?: {
          href?: string;
          uri?: string;
          title?: string;
        };
      };
    }>;
  };
};

type OnetSearchResponse = {
  occupation?:
    | Array<{
        code?: string;
        title?: string;
      }>
    | {
        code?: string;
        title?: string;
      };
  occupations?:
    | Array<{
        code?: string;
        title?: string;
      }>
    | {
        occupation?:
          | Array<{
              code?: string;
              title?: string;
            }>
          | {
              code?: string;
              title?: string;
            };
      };
};

type GetLiveOpportunityPipelineArgs = {
  locale?: Locale;
  opportunity?: Opportunity;
  query: string;
};

function dedupeOnetMatches(items: OnetLiveMatch[]) {
  return Array.from(new Map(items.map((item) => [item.code, item])).values());
}

function getCopy(locale: Locale) {
  return locale === "it"
    ? {
        escoLive: "ESCO live attivo dall'API pubblica ufficiale.",
        escoFallback:
          "ESCO live non disponibile in questo momento: Alba usa il ponte locale del prototipo per non interrompere la lettura.",
        onetLive: "O*NET live attivo con credenziali ufficiali configurate.",
        onetFallback:
          "O*NET live richiede credenziali ufficiali. Alba mantiene visibile il ponte locale gia' presente nel portfolio.",
        onetUnavailable:
          "O*NET live non ha restituito risultati utili in questo momento. Il ponte locale resta disponibile come fallback.",
        bridgeSummary: [
          "La pipeline live amplia la Simulation, ma ogni opportunita' resta un'ipotesi da validare.",
          "Quando una fonte esterna non risponde, Alba ricade su dati locali per restare stabile.",
        ],
      }
    : {
        escoLive: "ESCO live is active through the official public API.",
        escoFallback:
          "ESCO live is unavailable right now, so Alba keeps the local bridge visible to preserve a stable reading.",
        onetLive: "O*NET live is active with official credentials configured.",
        onetFallback:
          "O*NET live requires official credentials. Alba keeps the local O*NET bridge already stored in the portfolio.",
        onetUnavailable:
          "O*NET live did not return useful results right now. The local bridge remains available as fallback.",
        bridgeSummary: [
          "The live pipeline expands Simulation, but every opportunity still remains a hypothesis to validate.",
          "When an external source is unavailable, Alba falls back to local data so the prototype stays stable.",
        ],
      };
}

async function searchEsco(query: string, locale: Locale) {
  const response = await fetch(
    `https://ec.europa.eu/esco/api/search?text=${encodeURIComponent(query)}&language=${
      locale === "it" ? "it" : "en"
    }&type=occupation&limit=4`,
    {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(4500),
    },
  );

  if (!response.ok) {
    throw new Error(`ESCO ${response.status}`);
  }

  const payload = (await response.json()) as EscoSearchResponse;
  const results = payload._embedded?.results ?? [];

  return {
    total: payload.total ?? results.length,
    items: results
      .filter((item) => item.uri && item.title)
      .map((item) => ({
        uri: item.uri as string,
        title: item.title as string,
        code: item.code,
        language: locale === "it" ? "it" : "en",
        officialUrl: item._links?.self?.href ?? "https://esco.ec.europa.eu/en/use-esco",
      })),
  };
}

function getOnetCredentialPair() {
  const username = process.env.ONET_USERNAME?.trim();
  const password = (process.env.ONET_PASSWORD ?? process.env.ONET_API_KEY)?.trim();

  if (!username || !password) {
    return null;
  }

  return { username, password };
}

function normalizeOnetSearchResponse(payload: OnetSearchResponse): OnetLiveMatch[] {
  const directOccupations = Array.isArray(payload.occupation)
    ? payload.occupation
    : payload.occupation
      ? [payload.occupation]
      : [];
  const nestedOccupations = Array.isArray(payload.occupations)
    ? payload.occupations
    : Array.isArray(payload.occupations?.occupation)
      ? payload.occupations.occupation
      : payload.occupations?.occupation
        ? [payload.occupations.occupation]
        : [];

  return [...directOccupations, ...nestedOccupations]
    .filter((item) => item.code && item.title)
    .map((item) => ({
      code: item.code as string,
      title: item.title as string,
      officialUrl: `https://www.onetonline.org/link/summary/${item.code}`,
      source: "search" as const,
    }));
}

async function searchOnet(query: string) {
  const credentials = getOnetCredentialPair();

  if (!credentials) {
    return null;
  }

  const response = await fetch(
    `https://services.onetcenter.org/ws/online/search?keyword=${encodeURIComponent(query)}`,
    {
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(
          `${credentials.username}:${credentials.password}`,
        ).toString("base64")}`,
      },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(4500),
    },
  );

  if (!response.ok) {
    throw new Error(`O*NET ${response.status}`);
  }

  const payload = (await response.json()) as OnetSearchResponse;
  return normalizeOnetSearchResponse(payload);
}

export async function getLiveOpportunityPipeline({
  locale = "en",
  opportunity,
  query,
}: GetLiveOpportunityPipelineArgs): Promise<LiveOpportunityPipeline> {
  const copy = getCopy(locale);
  const fallback = buildLiveOpportunityFallback(query, opportunity);

  const [escoResult, onetResult] = await Promise.allSettled([
    searchEsco(query, locale),
    searchOnet(query),
  ]);

  const liveEscoItems =
    escoResult.status === "fulfilled"
      ? escoResult.value.items
      : fallback.esco.items;

  const liveOnetItems =
    onetResult.status === "fulfilled" && onetResult.value
      ? dedupeOnetMatches([
          ...onetResult.value,
          ...(opportunity?.onetMatches ?? []).map((role) => ({
            code: role.code,
            title: role.title,
            officialUrl: role.officialUrl,
            source: "portfolio-fallback" as const,
          })),
        ]).slice(0, 4)
      : fallback.onet.items;

  const credentialsConfigured = Boolean(getOnetCredentialPair());

  return {
    query,
    searchedAt: new Date().toLocaleString(locale === "it" ? "it-IT" : "en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
    esco: {
      status: escoResult.status === "fulfilled" ? "live" : fallback.esco.status,
      note: escoResult.status === "fulfilled" ? copy.escoLive : copy.escoFallback,
      total:
        escoResult.status === "fulfilled"
          ? escoResult.value.total
          : fallback.esco.total ?? fallback.esco.items.length,
      items: liveEscoItems,
    },
    onet: {
      status:
        onetResult.status === "fulfilled" && onetResult.value
          ? "live"
          : credentialsConfigured
            ? "unavailable"
            : fallback.onet.status,
      note:
        onetResult.status === "fulfilled" && onetResult.value
          ? copy.onetLive
          : credentialsConfigured
            ? copy.onetUnavailable
            : copy.onetFallback,
      credentialsConfigured,
      items: liveOnetItems,
    },
    bridgeSummary: copy.bridgeSummary,
  };
}
