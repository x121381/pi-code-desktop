export interface NormalizedModelCost {
  input: number;
  output: number;
  cacheRead: number;
  cacheWrite: number;
}

export interface NormalizedModel {
  id: string;
  name?: string;
  api?: string;
  reasoning?: boolean;
  thinkingLevelMap?: Record<string, string | null>;
  input?: string[];
  contextWindow?: number;
  maxTokens?: number;
  cost: NormalizedModelCost;
  [key: string]: unknown;
}

export interface NormalizedProvider {
  models?: NormalizedModel[];
  [key: string]: unknown;
}

export interface NormalizedModelsConfig {
  providers: Record<string, NormalizedProvider>;
  [key: string]: unknown;
}

function finiteNonNegative(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 ? value : undefined;
}

function cleanString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function normalizeCost(value: unknown): NormalizedModelCost {
  const source = value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
  return {
    input: finiteNonNegative(source.input) ?? 0,
    output: finiteNonNegative(source.output) ?? 0,
    cacheRead: finiteNonNegative(source.cacheRead) ?? 0,
    cacheWrite: finiteNonNegative(source.cacheWrite) ?? 0,
  };
}

function normalizeModel(value: unknown): NormalizedModel | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const source = value as Record<string, unknown>;
  const id = cleanString(source.id);
  if (!id) return null;

  const model: NormalizedModel = { ...source, id, cost: normalizeCost(source.cost) };
  const name = cleanString(source.name);
  if (name) model.name = name;
  else delete model.name;
  if (Array.isArray(source.input)) {
    const input = [...new Set(source.input.filter((entry): entry is string => typeof entry === "string")
      .map((entry) => entry.trim().toLowerCase())
      .filter((entry) => entry === "text" || entry === "image"))];
    if (input.length) model.input = input;
    else delete model.input;
  }
  return model;
}

export function normalizeModelsConfig(value: unknown): NormalizedModelsConfig {
  const source = value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
  const rawProviders = source.providers && typeof source.providers === "object" && !Array.isArray(source.providers)
    ? source.providers as Record<string, unknown>
    : {};
  const providers: Record<string, NormalizedProvider> = {};

  for (const [rawName, rawProvider] of Object.entries(rawProviders)) {
    const name = rawName.trim();
    if (!name || !rawProvider || typeof rawProvider !== "object" || Array.isArray(rawProvider)) continue;
    const provider = { ...(rawProvider as Record<string, unknown>) } as NormalizedProvider;
    const rawModels = Array.isArray(provider.models) ? provider.models : [];
    const models: NormalizedModel[] = [];
    const seen = new Set<string>();
    for (const rawModel of rawModels) {
      const model = normalizeModel(rawModel);
      if (!model || seen.has(model.id)) continue;
      seen.add(model.id);
      models.push(model);
    }
    provider.models = models.length ? models : undefined;
    providers[name] = provider;
  }

  return { ...source, providers } as NormalizedModelsConfig;
}

export function normalizeModelForConfig(value: unknown): NormalizedModel | null {
  return normalizeModel(value);
}
