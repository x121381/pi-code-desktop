import { NextResponse } from "next/server";
import {
  flattenModelsDevCatalog,
  recommendModelCatalogPreset,
  searchModelCatalog,
  type ModelCatalogEntry,
  type ModelCatalogRecommendation,
} from "@/lib/model-catalog";
import {
  CHERRY_REGISTRY_SOURCE,
  loadCherryCatalog,
  lookupCherryPreset,
} from "@/lib/cherry-catalog";

export const dynamic = "force-dynamic";

const MODELS_DEV_URL = "https://models.dev/api.json";
const CATALOG_TTL_MS = 60 * 60 * 1000;
const FETCH_TIMEOUT_MS = 15_000;

interface CatalogCache {
  entries: ModelCatalogEntry[];
  expiresAt: number;
  inFlight?: Promise<ModelCatalogEntry[]>;
}

declare global {
  var __piModelsDevCatalogCache: CatalogCache | undefined;
}

function getCache(): CatalogCache {
  return globalThis.__piModelsDevCatalogCache ??= { entries: [], expiresAt: 0 };
}

async function fetchModelsDevCatalog(): Promise<ModelCatalogEntry[]> {
  const response = await fetch(MODELS_DEV_URL, {
    cache: "no-store",
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`models.dev returned HTTP ${response.status}`);
  const entries = flattenModelsDevCatalog(await response.json());
  if (entries.length === 0) throw new Error("models.dev returned an empty catalog");
  return entries;
}

async function loadModelsDevCatalog(): Promise<ModelCatalogEntry[]> {
  const cache = getCache();
  if (cache.entries.length > 0 && cache.expiresAt > Date.now()) return cache.entries;
  if (!cache.inFlight) {
    cache.inFlight = fetchModelsDevCatalog().then((entries) => {
      cache.entries = entries;
      cache.expiresAt = Date.now() + CATALOG_TTL_MS;
      return entries;
    }).finally(() => {
      cache.inFlight = undefined;
    });
  }

  try {
    return await cache.inFlight;
  } catch {
    return cache.entries;
  }
}

function cherryRecommendation(
  cherry: Awaited<ReturnType<typeof loadCherryCatalog>>,
  fallback: ModelCatalogRecommendation,
  query: string,
  provider: string,
): ModelCatalogRecommendation {
  const match = lookupCherryPreset(cherry, query, provider);
  if (!match) return fallback;

  const hasFullPrice = match.preset.cost?.input !== undefined
    && match.preset.cost?.output !== undefined;
  const price = !hasFullPrice
    ? fallback.price
    : {
        status: "reliable" as const,
        method: "cherry" as const,
        cost: match.preset.cost!,
        providerId: match.entry.providerId,
        providerName: match.entry.providerName,
        support: 1,
        total: 1,
      };

  return {
    exactMatches: Math.max(1, fallback.exactMatches),
    metadataMethod: "cherry",
    matchedProviderId: match.entry.providerId,
    matchedProviderName: match.entry.providerName,
    preset: {
      ...fallback.preset,
      ...match.preset,
      cost: match.preset.cost ?? fallback.preset.cost,
    },
    price,
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = (searchParams.get("q") ?? "").slice(0, 120);
  const provider = (searchParams.get("provider") ?? "").slice(0, 120);
  const baseUrl = (searchParams.get("baseUrl") ?? "").slice(0, 500);
  const parsedLimit = Number.parseInt(searchParams.get("limit") ?? "50", 10);
  const limit = Number.isFinite(parsedLimit) ? parsedLimit : 50;

  try {
    const [cherry, modelsDev] = await Promise.all([
      loadCherryCatalog(),
      loadModelsDevCatalog(),
    ]);
    const entries = [...cherry.entries, ...modelsDev];
    const models = searchModelCatalog(entries, query, provider, limit);
    const fallback = recommendModelCatalogPreset(modelsDev, query, provider, baseUrl);
    const recommendation = cherryRecommendation(cherry, fallback, query, provider);
    return NextResponse.json({
      models,
      recommendation,
      source: CHERRY_REGISTRY_SOURCE,
      fallbackSource: MODELS_DEV_URL,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 502 });
  }
}
