export interface DiscoveredModel {
  id: string;
  name?: string;
  reasoning?: boolean;
  input?: string[];
  contextWindow?: number;
  maxTokens?: number;
  cost?: { input?: number; output?: number; cacheRead?: number; cacheWrite?: number };
}

export const MAX_DISCOVERY_RESPONSE_BYTES = 2 * 1024 * 1024;
export const MAX_DISCOVERY_REDIRECTS = 3;

export type ModelDiscoveryErrorCode =
  | "UPSTREAM_AUTH_FAILED"
  | "UPSTREAM_RATE_LIMITED"
  | "UPSTREAM_UNAVAILABLE"
  | "UPSTREAM_HTTP_ERROR"
  | "UPSTREAM_TIMEOUT"
  | "UPSTREAM_REDIRECT_BLOCKED"
  | "UPSTREAM_TOO_MANY_REDIRECTS"
  | "UPSTREAM_CHALLENGE"
  | "UPSTREAM_NOT_JSON"
  | "UPSTREAM_INVALID_JSON"
  | "UPSTREAM_RESPONSE_TOO_LARGE";

const DISCOVERY_ERROR_MESSAGES: Record<ModelDiscoveryErrorCode, string> = {
  UPSTREAM_AUTH_FAILED: "Upstream authentication failed",
  UPSTREAM_RATE_LIMITED: "Upstream rate limit exceeded",
  UPSTREAM_UNAVAILABLE: "Upstream service is unavailable",
  UPSTREAM_HTTP_ERROR: "Upstream model request failed",
  UPSTREAM_TIMEOUT: "Upstream model request timed out",
  UPSTREAM_REDIRECT_BLOCKED: "Upstream redirect was blocked",
  UPSTREAM_TOO_MANY_REDIRECTS: "Upstream returned too many redirects",
  UPSTREAM_CHALLENGE: "Upstream returned an HTML security challenge",
  UPSTREAM_NOT_JSON: "Upstream model response was not JSON",
  UPSTREAM_INVALID_JSON: "Upstream model response contained invalid JSON",
  UPSTREAM_RESPONSE_TOO_LARGE: "Upstream model response was too large",
};

export class ModelDiscoveryError extends Error {
  readonly code: ModelDiscoveryErrorCode;

  constructor(code: ModelDiscoveryErrorCode) {
    super(DISCOVERY_ERROR_MESSAGES[code]);
    this.name = "ModelDiscoveryError";
    this.code = code;
  }
}

interface FetchDiscoveryJsonOptions {
  headers: Headers;
  timeoutMs: number;
  maxBytes: number;
  maxRedirects?: number;
  fetchImpl?: typeof fetch;
}

interface DiscoveryJsonResult {
  payload: unknown;
  bytesRead: number;
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
  if ((url.protocol !== "http:" && url.protocol !== "https:") || url.username || url.password) {
    throw new TypeError("Base URL must use HTTP(S) without credentials");
  }
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

function isJsonMediaType(response: Response): boolean {
  const mediaType = response.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
  return mediaType === "application/json"
    || Boolean(mediaType?.startsWith("application/") && mediaType.endsWith("+json"));
}

function isHtmlOrChallenge(response: Response): boolean {
  const mediaType = response.headers.get("content-type")?.split(";", 1)[0]?.trim().toLowerCase();
  return mediaType === "text/html"
    || mediaType === "application/xhtml+xml"
    || response.headers.get("cf-mitigated")?.toLowerCase() === "challenge";
}

function errorForStatus(response: Response): ModelDiscoveryError {
  if (isHtmlOrChallenge(response)) return new ModelDiscoveryError("UPSTREAM_CHALLENGE");
  if (response.status === 401 || response.status === 403) {
    return new ModelDiscoveryError("UPSTREAM_AUTH_FAILED");
  }
  if (response.status === 429) return new ModelDiscoveryError("UPSTREAM_RATE_LIMITED");
  if (response.status >= 500) return new ModelDiscoveryError("UPSTREAM_UNAVAILABLE");
  return new ModelDiscoveryError("UPSTREAM_HTTP_ERROR");
}

async function cancelBody(response: Response): Promise<void> {
  await response.body?.cancel().catch(() => undefined);
}

async function readResponseBytes(response: Response, maxBytes: number): Promise<Uint8Array> {
  const contentLength = response.headers.get("content-length");
  if (contentLength && /^\d+$/.test(contentLength) && Number(contentLength) > maxBytes) {
    await cancelBody(response);
    throw new ModelDiscoveryError("UPSTREAM_RESPONSE_TOO_LARGE");
  }

  const reader = response.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (size + value.byteLength > maxBytes) {
        await reader.cancel().catch(() => undefined);
        throw new ModelDiscoveryError("UPSTREAM_RESPONSE_TOO_LARGE");
      }
      chunks.push(value);
      size += value.byteLength;
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

function validateRedirect(current: URL, location: string): URL {
  let next: URL;
  try {
    next = new URL(location, current);
  } catch {
    throw new ModelDiscoveryError("UPSTREAM_REDIRECT_BLOCKED");
  }
  if (
    next.origin !== current.origin
    || (next.protocol !== "http:" && next.protocol !== "https:")
    || next.username
    || next.password
  ) {
    throw new ModelDiscoveryError("UPSTREAM_REDIRECT_BLOCKED");
  }
  return next;
}

function isRedirectStatus(status: number): boolean {
  return status === 301 || status === 302 || status === 303 || status === 307 || status === 308;
}

export async function fetchDiscoveryJson(
  initialUrl: URL,
  options: FetchDiscoveryJsonOptions,
): Promise<DiscoveryJsonResult> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const maxRedirects = options.maxRedirects ?? MAX_DISCOVERY_REDIRECTS;
  const signal = AbortSignal.timeout(options.timeoutMs);
  let url = new URL(initialUrl);

  try {
    for (let redirects = 0; ; redirects += 1) {
      const response = await fetchImpl(url, {
        cache: "no-store",
        headers: options.headers,
        redirect: "manual",
        signal,
      });

      if (isRedirectStatus(response.status)) {
        const location = response.headers.get("location");
        await cancelBody(response);
        if (!location) throw new ModelDiscoveryError("UPSTREAM_REDIRECT_BLOCKED");
        if (redirects >= maxRedirects) {
          throw new ModelDiscoveryError("UPSTREAM_TOO_MANY_REDIRECTS");
        }
        url = validateRedirect(url, location);
        continue;
      }

      if (!response.ok) {
        const error = errorForStatus(response);
        await cancelBody(response);
        throw error;
      }
      if (isHtmlOrChallenge(response)) {
        await cancelBody(response);
        throw new ModelDiscoveryError("UPSTREAM_CHALLENGE");
      }
      if (!isJsonMediaType(response)) {
        await cancelBody(response);
        throw new ModelDiscoveryError("UPSTREAM_NOT_JSON");
      }

      const bytes = await readResponseBytes(response, options.maxBytes);
      const text = new TextDecoder().decode(bytes);
      if (/^\s*(?:<!doctype\s+html|<html\b)/i.test(text)) {
        throw new ModelDiscoveryError("UPSTREAM_CHALLENGE");
      }
      try {
        return { payload: JSON.parse(text) as unknown, bytesRead: bytes.byteLength };
      } catch {
        throw new ModelDiscoveryError("UPSTREAM_INVALID_JSON");
      }
    }
  } catch (error) {
    if (error instanceof ModelDiscoveryError) throw error;
    if (
      (error instanceof DOMException && (error.name === "TimeoutError" || error.name === "AbortError"))
      || (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError"))
    ) {
      throw new ModelDiscoveryError("UPSTREAM_TIMEOUT");
    }
    throw new ModelDiscoveryError("UPSTREAM_HTTP_ERROR");
  }
}

export function discoveryEndpointForDisplay(endpoint: URL): string {
  const display = new URL(endpoint);
  display.username = "";
  display.password = "";
  display.search = "";
  display.hash = "";
  return display.toString();
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
