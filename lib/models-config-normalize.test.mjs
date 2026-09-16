import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url, { tsconfigPaths: true });
const { normalizeModelsConfig, normalizeModelForConfig } = await jiti.import("./models-config-normalize.ts");

test("normalizeModelsConfig drops models with empty or whitespace-only ids", () => {
  const result = normalizeModelsConfig({
    providers: {
      "new-provider": {
        models: [
          { id: "" },
          { id: "   " },
          { id: "gpt-4" },
        ],
      },
    },
  });
  const ids = result.providers["new-provider"].models.map((m) => m.id);
  assert.deepEqual(ids, ["gpt-4"]);
});

test("normalizeModelsConfig always fills all four cost fields, defaulting missing ones to 0", () => {
  const result = normalizeModelsConfig({
    providers: {
      openai: {
        models: [
          { id: "gpt-4", cost: { input: 3 } },
          { id: "gpt-3.5" },
        ],
      },
    },
  });
  const [gpt4, gpt35] = result.providers.openai.models;
  assert.deepEqual(gpt4.cost, { input: 3, output: 0, cacheRead: 0, cacheWrite: 0 });
  assert.deepEqual(gpt35.cost, { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 });
});

test("normalizeModelsConfig ignores negative or non-numeric cost values", () => {
  const result = normalizeModelsConfig({
    providers: {
      openai: {
        models: [{ id: "gpt-4", cost: { input: -5, output: "bad", cacheRead: NaN, cacheWrite: 2 } }],
      },
    },
  });
  assert.deepEqual(result.providers.openai.models[0].cost, { input: 0, output: 0, cacheRead: 0, cacheWrite: 2 });
});

test("normalizeModelsConfig preserves the provider's original model id verbatim", () => {
  const result = normalizeModelsConfig({
    providers: {
      anthropic: {
        models: [{ id: "claude-sonnet-4-5-20250929" }],
      },
    },
  });
  assert.equal(result.providers.anthropic.models[0].id, "claude-sonnet-4-5-20250929");
});

test("normalizeModelsConfig deduplicates models by id within a provider, keeping the first", () => {
  const result = normalizeModelsConfig({
    providers: {
      openai: {
        models: [
          { id: "gpt-4", name: "first" },
          { id: "gpt-4", name: "second" },
        ],
      },
    },
  });
  assert.equal(result.providers.openai.models.length, 1);
  assert.equal(result.providers.openai.models[0].name, "first");
});

test("normalizeModelsConfig trims provider names and drops blank-named providers", () => {
  const result = normalizeModelsConfig({
    providers: {
      "  openai  ": { models: [{ id: "gpt-4" }] },
      "   ": { models: [{ id: "gpt-4" }] },
    },
  });
  assert.deepEqual(Object.keys(result.providers), ["openai"]);
});

test("normalizeModelsConfig restricts input modalities to text/image and dedupes them", () => {
  const result = normalizeModelsConfig({
    providers: {
      openai: {
        models: [{ id: "gpt-4o", input: ["text", "TEXT", "image", "audio", 42] }],
      },
    },
  });
  assert.deepEqual(result.providers.openai.models[0].input, ["text", "image"]);
});

test("normalizeModelsConfig tolerates a non-object payload and returns an empty provider map", () => {
  assert.deepEqual(normalizeModelsConfig(null).providers, {});
  assert.deepEqual(normalizeModelsConfig("nope").providers, {});
  assert.deepEqual(normalizeModelsConfig(undefined).providers, {});
});

test("normalizeModelForConfig returns null for a discovered model with a blank id", () => {
  assert.equal(normalizeModelForConfig({ id: "" }), null);
  assert.equal(normalizeModelForConfig({ id: "   " }), null);
  assert.equal(normalizeModelForConfig(null), null);
});

test("normalizeModelForConfig normalizes a single discovered model the same way as the batch path", () => {
  const model = normalizeModelForConfig({ id: " gpt-4o ", cost: { input: 2.5 } });
  assert.equal(model.id, "gpt-4o");
  assert.deepEqual(model.cost, { input: 2.5, output: 0, cacheRead: 0, cacheWrite: 0 });
});
