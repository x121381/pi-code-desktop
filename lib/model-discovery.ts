export interface DiscoveredModel {
  id: string;
  name?: string;
  reasoning?: boolean;
  input?: string[];
  contextWindow?: number;
  maxTokens?: number;
  cost?: { input?: number; output?: number; cacheRead?: number; cacheWrite?: number };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function optionalPositiveNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : undefined;
}

function optionalNonNegativeNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : undefined;
}

function parseCost(value: unknown): DiscoveredModel["cost"] | undefined {
  if (!isRecord(value)) return undefined;
  const read = (key: string, alternate: string): number | undefined =>
    optionalNonNegativeNumber(value[key]) ?? optionalNonNegativeNumber(value[alternate]);
  const cost = {
    input: read("input", "prompt"),
    output: read("output", "completion"),
    cacheRead: read("cacheRead", "cache_read"),
    cacheWrite: read("cacheWrite", "cache_write"),
  };
  return Object.values(cost).some((entry) => entry !== undefined) ? cost : undefined;
}

function modelFromValue(value: unknown): DiscoveredModel | null {
  if (typeof value === "string") {
    const id = value.trim();
    return id ? { id } : null;
  }
  if (!isRecord(value)) return null;

  const rawId = cleanString(value.id) ?? cleanString(value.model) ?? cleanString(value.name);
  if (!rawId) return null;
  const id = rawId.replace(/^models\//, "").trim();
  if (!id) return null;
  const name = cleanString(value.display_name)
    ?? cleanString(value.displayName)
    ?? (cleanString(value.id) || cleanString(value.model) ? cleanString(value.name) : undefined);
  const model: DiscoveredModel = name && name !== id ? { id, name } : { id };
  if (typeof value.reasoning === "boolean") model.reasoning = value.reasoning;
  const modalities = Array.isArray(value.input_modalities) ? value.input_modalities : value.input;
  if (Array.isArray(modalities)) {
    const input = [...new Set(modalities.filter((entry): entry is string => entry === "text" || entry === "image"))];
    if (input.length) model.input = input;
  }
  const limits = isRecord(value.limits) ? value.limits : {};
  const contextWindow = optionalPositiveNumber(value.contextWindow) ?? optionalPositiveNumber(value.context_window) ?? optionalPositiveNumber(limits.context);
  const maxTokens = optionalPositiveNumber(value.maxTokens) ?? optionalPositiveNumber(value.max_output_tokens) ?? optionalPositiveNumber(value.maxOutputTokens) ?? optionalPositiveNumber(limits.output);
  if (contextWindow !== undefined) model.contextWindow = contextWindow;
  if (maxTokens !== undefined) model.maxTokens = maxTokens;
  const cost = parseCost(value.cost);
  if (cost) model.cost = cost;
  return model;
}

const LIST_KEYS = ["data", "models", "results", "items"] as const;

function listFromResponse(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    // A raw model array passes through; an array of page payloads is flattened.
    return value.flatMap((item) =>
      isRecord(item) && LIST_KEYS.some((key) => Array.isArray(item[key]) || isRecord(item[key]))
        ? listFromResponse(item)
        : [item],
    );
  }
  if (!isRecord(value)) return [];
  for (const key of LIST_KEYS) {
    const candidate = value[key];
    if (Array.isArray(candidate)) return candidate;
    if (isRecord(candidate)) return Object.values(candidate);
  }
  return [];
}

export function parseDiscoveredModels(value: unknown): DiscoveredModel[] {
  const seen = new Set<string>();
  const models: DiscoveredModel[] = [];
  for (const item of listFromResponse(value)) {
    const model = modelFromValue(item);
    if (!model || seen.has(model.id)) continue;
    seen.add(model.id);
    models.push(model);
  }
  return models.sort((a, b) => (a.name ?? a.id).localeCompare(b.name ?? b.id, undefined, {
    numeric: true,
    sensitivity: "base",
  }));
}

// Chat/inference endpoint suffixes people often paste as the Base URL. The model
// list lives on the API root, so strip these before appending "/models".
const ENDPOINT_SUFFIX = /\/(?:chat\/completions|completions|messages|responses|embeddings|rerank|rerankings)$/i;

export function buildModelsListUrl(baseUrl: string, api: string): URL {
  const url = new URL(baseUrl.trim());
  const trimmedPath = url.pathname.replace(/\/+$/, "").replace(ENDPOINT_SUFFIX, "");

  if (!/\/models$/i.test(trimmedPath)) {
    let path = trimmedPath;
    if (api === "anthropic-messages" && !/\/v\d+(?:beta)?$/i.test(path)) path += "/v1";
    if (api === "google-generative-ai" && !/\/v\d+(?:beta)?$/i.test(path)) path += "/v1beta";
    url.pathname = `${path}/models`.replace(/\/+/g, "/");
  }

  // Both APIs accept a page size of 100; Anthropic-compatible proxies often
  // reject anything larger. Larger catalogs are walked via nextPageUrl().
  if (api === "anthropic-messages" && !url.searchParams.has("limit")) {
    url.searchParams.set("limit", "100");
  }
  if (api === "google-generative-ai" && !url.searchParams.has("pageSize")) {
    url.searchParams.set("pageSize", "100");
  }
  return url;
}

/**
 * Given the page just fetched, return the URL of the next page, or null when the
 * listing is exhausted or the API has no cursor pagination (OpenAI-style lists).
 */
export function nextModelsPageUrl(currentUrl: URL, api: string, payload: unknown): URL | null {
  if (!isRecord(payload)) return null;

  if (api === "anthropic-messages") {
    const lastId = cleanString(payload.last_id);
    if (payload.has_more === true && lastId) {
      const next = new URL(currentUrl);
      next.searchParams.set("after_id", lastId);
      return next;
    }
    return null;
  }

  if (api === "google-generative-ai") {
    const token = cleanString(payload.nextPageToken);
    if (token) {
      const next = new URL(currentUrl);
      next.searchParams.set("pageToken", token);
      return next;
    }
    return null;
  }

  return null;
}
