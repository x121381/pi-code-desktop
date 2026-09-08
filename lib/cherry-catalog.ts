import { readFile, writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import bundledModels from "../data/cherry-registry/models.json";
import bundledProviderModels from "../data/cherry-registry/provider-models.json";
import { normalizeModelId } from "./cherry-model-id.ts";
import type { ModelCatalogCost, ModelCatalogEntry, ModelCatalogPreset } from "./model-catalog.ts";
import { userHome } from "./user-home.ts";

export const CHERRY_REGISTRY_SOURCE = "cherry-studio";
export const CHERRY_REGISTRY_URL = "https://github.com/CherryHQ/cherry-studio";
export const CHERRY_REGISTRY_TTL_MS = 6 * 60 * 60 * 1000;
const FETCH_TIMEOUT_MS = 15_000;

const CHERRY_REMOTE_BASES = [
  "https://raw.githubusercontent.com/CherryHQ/cherry-studio/refs/heads/x-files/provider-registry/v1",
  "https://raw.gitcode.com/CherryHQ/cherry-studio/raw/x-files/provider-registry/v1",
];

export interface CherryCatalogIndex {
  entries: ModelCatalogEntry[];
  byExactId: Map<string, ModelCatalogEntry[]>;
  byNormalizedId: Map<string, ModelCatalogEntry[]>;
  byProviderApiId: Map<string, ModelCatalogEntry>;
  byProviderModelId: Map<string, ModelCatalogEntry>;
}

interface CherryCatalogCache {
  index: CherryCatalogIndex;
  expiresAt: number;
  refresh?: Promise<void>;
}

declare global {
  var __piCherryCatalogCache: CherryCatalogCache | undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function optionalNonNegativeNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : undefined;
}

function optionalPositiveNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : undefined;
}

function cherryCost(value: unknown): ModelCatalogCost {
  if (!isRecord(value)) return {};
  const input = isRecord(value.input) ? optionalNonNegativeNumber(value.input.perMillionTokens) : undefined;
  const output = isRecord(value.output) ? optionalNonNegativeNumber(value.output.perMillionTokens) : undefined;
  return { input, output };
}

function cherryInput(capabilities: unknown, inputModalities: unknown): string[] | undefined {
  const input = new Set<string>();
  if (Array.isArray(inputModalities)) {
    for (const entry of inputModalities) {
      const value = String(entry).trim().toLocaleLowerCase();
      if (value === "text" || value === "image") input.add(value);
    }
  }
  if (Array.isArray(capabilities) && capabilities.some((entry) => String(entry) === "image-recognition")) {
    input.add("text");
    input.add("image");
  }
  if (input.size === 0) return undefined;
  if (!input.has("text")) input.add("text");
  return [...input];
}

function cherryReasoning(capabilities: unknown): boolean | undefined {
  if (!Array.isArray(capabilities)) return undefined;
  return capabilities.some((entry) => String(entry) === "reasoning") ? true : undefined;
}

function providerKey(providerId: string, modelId: string): string {
  return `${providerId.trim().toLocaleLowerCase()}::${modelId.trim().toLocaleLowerCase()}`;
}

function entryFromCherryModel(raw: Record<string, unknown>, fallbackProviderId?: string): ModelCatalogEntry | null {
  const id = cleanString(raw.apiModelId) ?? cleanString(raw.id);
  if (!id) return null;
  const providerId = cleanString(raw.providerId) ?? fallbackProviderId ?? cleanString(raw.ownedBy) ?? "cherry";
  const name = cleanString(raw.name) ?? id;
  const entry: ModelCatalogEntry = {
    key: `${providerId}/${id}`,
    providerId,
    providerName: providerId,
    id,
    name,
    cost: cherryCost(raw.pricing),
  };
  const reasoning = cherryReasoning(raw.capabilities);
  if (reasoning) entry.reasoning = true;
  const input = cherryInput(raw.capabilities, raw.inputModalities);
  if (input) entry.input = input;
  const contextWindow = optionalPositiveNumber(raw.contextWindow);
  const maxTokens = optionalPositiveNumber(raw.maxOutputTokens);
  if (contextWindow !== undefined) entry.contextWindow = contextWindow;
  if (maxTokens !== undefined) entry.maxTokens = maxTokens;
  return entry;
}

function mergeOverride(base: ModelCatalogEntry | undefined, override: ModelCatalogEntry): ModelCatalogEntry {
  if (!base) return override;

  const cost = Object.fromEntries(
    Object.entries({
      input: override.cost.input ?? base.cost.input,
      output: override.cost.output ?? base.cost.output,
      cacheRead: override.cost.cacheRead ?? base.cost.cacheRead,
      cacheWrite: override.cost.cacheWrite ?? base.cost.cacheWrite,
    }).filter(([, value]) => value !== undefined),
  ) as ModelCatalogEntry["cost"];

  return {
    ...base,
    ...override,
    name: override.name && override.name !== override.id ? override.name : base.name,
    reasoning: override.reasoning ?? base.reasoning,
    input: override.input ?? base.input,
    contextWindow: override.contextWindow ?? base.contextWindow,
    maxTokens: override.maxTokens ?? base.maxTokens,
    cost,
    key: override.key,
    providerId: override.providerId,
    providerName: override.providerName,
    id: override.id,
  };
}

export function parseCherryRegistry(modelsJson: unknown, providerModelsJson: unknown): CherryCatalogIndex {
  const models = isRecord(modelsJson) && Array.isArray(modelsJson.models) ? modelsJson.models : [];
  const overrides = isRecord(providerModelsJson) && Array.isArray(providerModelsJson.overrides)
    ? providerModelsJson.overrides
    : [];

  const canonicalById = new Map<string, ModelCatalogEntry>();
  const entries: ModelCatalogEntry[] = [];

  for (const raw of models) {
    if (!isRecord(raw)) continue;
    const entry = entryFromCherryModel(raw);
    if (!entry) continue;
    canonicalById.set(entry.id.toLocaleLowerCase(), entry);
    entries.push(entry);
  }

  for (const raw of overrides) {
    if (!isRecord(raw)) continue;
    const apiId = cleanString(raw.apiModelId);
    const modelId = cleanString(raw.modelId);
    const providerId = cleanString(raw.providerId);
    if (!apiId || !providerId) continue;
    const base = (modelId ? canonicalById.get(modelId.toLocaleLowerCase()) : undefined)
      ?? canonicalById.get(apiId.toLocaleLowerCase());
    const overrideEntry = entryFromCherryModel({ ...raw, id: apiId, providerId });
    if (!overrideEntry) continue;
    entries.push(mergeOverride(base, overrideEntry));
  }

  const byExactId = new Map<string, ModelCatalogEntry[]>();
  const byNormalizedId = new Map<string, ModelCatalogEntry[]>();
  const byProviderApiId = new Map<string, ModelCatalogEntry>();
  const byProviderModelId = new Map<string, ModelCatalogEntry>();

  for (const entry of entries) {
    const exactKey = entry.id.toLocaleLowerCase();
    const exact = byExactId.get(exactKey);
    if (exact) exact.push(entry);
    else byExactId.set(exactKey, [entry]);

    for (const normalized of [
      normalizeModelId(entry.id, { keepParameterSize: true }),
      normalizeModelId(entry.id),
    ]) {
      if (!normalized) continue;
      const group = byNormalizedId.get(normalized);
      if (group) {
        if (!group.some((item) => item.key === entry.key)) group.push(entry);
      } else {
        byNormalizedId.set(normalized, [entry]);
      }
    }

    byProviderApiId.set(providerKey(entry.providerId, entry.id), entry);
  }

  for (const raw of overrides) {
    if (!isRecord(raw)) continue;
    const apiId = cleanString(raw.apiModelId);
    const modelId = cleanString(raw.modelId);
    const providerId = cleanString(raw.providerId);
    if (!apiId || !providerId) continue;
    const entry = byProviderApiId.get(providerKey(providerId, apiId));
    if (!entry) continue;
    if (modelId) byProviderModelId.set(providerKey(providerId, modelId), entry);
  }

  return { entries, byExactId, byNormalizedId, byProviderApiId, byProviderModelId };
}

function presetFromEntry(entry: ModelCatalogEntry): ModelCatalogPreset {
  const preset: ModelCatalogPreset = { name: entry.name };
  if (entry.reasoning) preset.reasoning = true;
  if (entry.input) preset.input = [...entry.input];
  if (entry.contextWindow !== undefined) preset.contextWindow = entry.contextWindow;
  if (entry.maxTokens !== undefined) preset.maxTokens = entry.maxTokens;
  if (entry.cost.input !== undefined || entry.cost.output !== undefined) {
    preset.cost = { ...entry.cost };
  }
  return preset;
}

function pickPreferred(entries: readonly ModelCatalogEntry[], providerHint: string): ModelCatalogEntry {
  const hint = providerHint.trim().toLocaleLowerCase().replace(/[^a-z0-9]/g, "");
  if (hint) {
    const matched = entries.find((entry) =>
      entry.providerId.toLocaleLowerCase().replace(/[^a-z0-9]/g, "") === hint
      || entry.providerName.toLocaleLowerCase().replace(/[^a-z0-9]/g, "") === hint
    );
    if (matched) return matched;
  }
  return entries[0]!;
}

export function lookupCherryPreset(
  index: CherryCatalogIndex,
  query: string,
  providerHint = "",
): { preset: ModelCatalogPreset; entry: ModelCatalogEntry } | null {
  const raw = query.trim();
  if (!raw) return null;
  const bareId = raw.includes("/") ? raw.slice(raw.lastIndexOf("/") + 1) : raw;
  const provider = providerHint.trim();

  if (provider) {
    const byApi = index.byProviderApiId.get(providerKey(provider, bareId))
      ?? index.byProviderApiId.get(providerKey(provider, raw));
    if (byApi) return { preset: presetFromEntry(byApi), entry: byApi };
    const byModel = index.byProviderModelId.get(providerKey(provider, bareId));
    if (byModel) return { preset: presetFromEntry(byModel), entry: byModel };
  }

  const exact = index.byExactId.get(bareId.toLocaleLowerCase())
    ?? index.byExactId.get(raw.toLocaleLowerCase());
  if (exact?.length) {
    const entry = pickPreferred(exact, provider);
    return { preset: presetFromEntry(entry), entry };
  }

  for (const normalized of [
    normalizeModelId(bareId, { keepParameterSize: true }),
    normalizeModelId(bareId),
    normalizeModelId(raw, { keepParameterSize: true }),
    normalizeModelId(raw),
  ]) {
    if (!normalized) continue;
    const group = index.byNormalizedId.get(normalized);
    if (!group?.length) continue;
    const entry = pickPreferred(group, provider);
    return { preset: presetFromEntry(entry), entry };
  }

  return null;
}

function cacheDir(): string {
  return join(userHome(), ".pi", "agent", "cherry-registry");
}

async function readJsonFile(path: string): Promise<unknown | null> {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch {
    return null;
  }
}

async function loadJsonPair(directory: string): Promise<{ models: unknown; overrides: unknown } | null> {
  const models = await readJsonFile(join(directory, "models.json"));
  const overrides = await readJsonFile(join(directory, "provider-models.json"));
  if (!models || !overrides) return null;
  return { models, overrides };
}

async function fetchRemoteJson(fileName: string): Promise<unknown> {
  let lastError: Error | undefined;
  for (const base of CHERRY_REMOTE_BASES) {
    try {
      const response = await fetch(`${base}/${fileName}`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
      if (!response.ok) throw new Error(`${fileName} HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }
  throw lastError ?? new Error(`Failed to fetch ${fileName}`);
}

async function writeCache(models: unknown, overrides: unknown): Promise<void> {
  const directory = cacheDir();
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, "models.json"), `${JSON.stringify(models)}\n`);
  await writeFile(join(directory, "provider-models.json"), `${JSON.stringify(overrides)}\n`);
  await writeFile(join(directory, "fetched-at.json"), `${JSON.stringify({ fetchedAt: Date.now() })}\n`);
}

async function cacheAgeMs(): Promise<number | null> {
  const meta = await readJsonFile(join(cacheDir(), "fetched-at.json"));
  if (!isRecord(meta) || typeof meta.fetchedAt !== "number") return null;
  return Date.now() - meta.fetchedAt;
}

async function refreshCherryCatalog(cache: CherryCatalogCache): Promise<void> {
  try {
    const [models, overrides] = await Promise.all([
      fetchRemoteJson("models.json"),
      fetchRemoteJson("provider-models.json"),
    ]);
    if (!isRecord(models) || !Array.isArray(models.models) || models.models.length === 0) return;
    cache.index = parseCherryRegistry(models, overrides);
    cache.expiresAt = Date.now() + CHERRY_REGISTRY_TTL_MS;
    await writeCache(models, overrides).catch(() => undefined);
  } finally {
    cache.refresh = undefined;
  }
}

export async function loadCherryCatalog(): Promise<CherryCatalogIndex> {
  let cache = globalThis.__piCherryCatalogCache;
  if (!cache) {
    const cached = await loadJsonPair(cacheDir());
    const age = await cacheAgeMs();
    const index = cached
      ? parseCherryRegistry(cached.models, cached.overrides)
      : parseCherryRegistry(bundledModels, bundledProviderModels);
    cache = globalThis.__piCherryCatalogCache = {
      index,
      expiresAt: age !== null ? Date.now() + Math.max(0, CHERRY_REGISTRY_TTL_MS - age) : 0,
    };
  }

  if (cache.expiresAt <= Date.now() && !cache.refresh) {
    cache.refresh = refreshCherryCatalog(cache).catch(() => undefined);
  }
  return cache.index;
}
