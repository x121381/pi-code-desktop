import { NextResponse } from "next/server";
import { resolveModelDiscoveryAuth } from "@/lib/model-discovery-auth";
import {
  buildModelsListUrl,
  discoveryEndpointForDisplay,
  fetchDiscoveryJson,
  MAX_DISCOVERY_RESPONSE_BYTES,
  ModelDiscoveryError,
  nextModelsPageUrl,
  parseDiscoveredModels,
} from "@/lib/model-discovery";
import { loadCherryCatalog, lookupCherryPreset } from "@/lib/cherry-catalog";
import { parseJsonWithinLimit, RequestBodyTooLargeError } from "@/lib/bounded-form-data";
import { hasJsonContentType, isApiRequestAllowed } from "@/lib/request-security";

export const dynamic = "force-dynamic";

const DISCOVERY_TIMEOUT_MS = 20_000;
const MAX_DISCOVERY_PAGES = 20;
const MAX_DISCOVERY_REQUEST_BYTES = 256 * 1024;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasHeader(headers: Headers, name: string): boolean {
  return headers.has(name);
}

function buildHeaders(api: string, apiKey: string | undefined, configured: Record<string, string>): Headers {
  const headers = new Headers(configured);
  if (!hasHeader(headers, "accept")) headers.set("Accept", "application/json");
  if (!apiKey) return headers;

  if (api === "anthropic-messages") {
    if (!hasHeader(headers, "x-api-key")) headers.set("x-api-key", apiKey);
    if (!hasHeader(headers, "anthropic-version")) headers.set("anthropic-version", "2023-06-01");
  } else if (api === "google-generative-ai") {
    if (!hasHeader(headers, "x-goog-api-key")) headers.set("x-goog-api-key", apiKey);
  } else if (!hasHeader(headers, "authorization")) {
    headers.set("Authorization", `Bearer ${apiKey}`);
  }
  return headers;
}

export async function POST(req: Request) {
  let displayEndpoint: string | undefined;

  if (!isApiRequestAllowed(req)) {
    return NextResponse.json(
      { error: "Untrusted API request", code: "UNTRUSTED_REQUEST" },
      { status: 403 },
    );
  }
  if (!hasJsonContentType(req)) {
    return NextResponse.json(
      { error: "Content-Type must be application/json", code: "INVALID_CONTENT_TYPE" },
      { status: 415 },
    );
  }

  try {
    const parsedBody = await parseJsonWithinLimit(req, MAX_DISCOVERY_REQUEST_BYTES);
    if (!isRecord(parsedBody)) {
      return NextResponse.json(
        { error: "Request body must be valid JSON", code: "INVALID_REQUEST" },
        { status: 400 },
      );
    }
    const body = parsedBody as { providerName?: unknown; provider?: unknown };
    const providerName = typeof body.providerName === "string" ? body.providerName.trim() : "";
    if (!providerName) return NextResponse.json({ error: "providerName is required", code: "INVALID_REQUEST" }, { status: 400 });
    if (!isRecord(body.provider)) return NextResponse.json({ error: "provider is required", code: "INVALID_REQUEST" }, { status: 400 });

    const baseUrl = typeof body.provider.baseUrl === "string" ? body.provider.baseUrl.trim() : "";
    if (!baseUrl) return NextResponse.json({ error: "Base URL is required", code: "INVALID_BASE_URL" }, { status: 400 });
    const api = typeof body.provider.api === "string" && body.provider.api
      ? body.provider.api
      : "openai-completions";

    let endpoint: URL;
    try {
      endpoint = buildModelsListUrl(baseUrl, api);
      displayEndpoint = discoveryEndpointForDisplay(endpoint);
    } catch {
      return NextResponse.json({ error: "Base URL is invalid", code: "INVALID_BASE_URL" }, { status: 400 });
    }

    const auth = await resolveModelDiscoveryAuth(providerName, body.provider);
    if (typeof body.provider.apiKey === "string" && body.provider.apiKey.trim() && !auth.apiKey) {
      return NextResponse.json({ error: "No API key was available", code: "API_KEY_UNAVAILABLE" }, { status: 400 });
    }

    const headers = buildHeaders(api, auth.apiKey, auth.headers);
    const collected: unknown[] = [];
    let pageUrl: URL | null = endpoint;
    let remainingBytes = MAX_DISCOVERY_RESPONSE_BYTES;

    for (let page = 0; pageUrl && page < MAX_DISCOVERY_PAGES; page += 1) {
      const result = await fetchDiscoveryJson(pageUrl, {
        headers,
        timeoutMs: DISCOVERY_TIMEOUT_MS,
        maxBytes: remainingBytes,
      });
      remainingBytes -= result.bytesRead;
      collected.push(result.payload);
      pageUrl = nextModelsPageUrl(pageUrl, api, result.payload);
    }

    const discovered = parseDiscoveredModels(collected.length === 1 ? collected[0] : collected);
    const cherry = await loadCherryCatalog().catch(() => null);
    const models = discovered.map((model) => {
      const match = cherry ? lookupCherryPreset(cherry, model.id, providerName) : null;
      return match ? { ...match.preset, ...model, name: model.name ?? match.preset.name } : model;
    });
    if (models.length === 0) {
      return NextResponse.json({ error: "No models found in the upstream response", code: "NO_MODELS_FOUND" }, { status: 502 });
    }

    return NextResponse.json({ models, endpoint: displayEndpoint });
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) {
      return NextResponse.json(
        { error: "Request body was too large", code: "REQUEST_TOO_LARGE" },
        { status: 413 },
      );
    }
    if (error instanceof ModelDiscoveryError) {
      return NextResponse.json(
        { error: error.message, code: error.code, endpoint: displayEndpoint },
        { status: error.code === "UPSTREAM_TIMEOUT" ? 504 : 502 },
      );
    }
    return NextResponse.json(
      { error: "Unable to discover models", code: "DISCOVERY_FAILED" },
      { status: 500 },
    );
  }
}
