import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);
const { parseCherryRegistry, lookupCherryPreset } = await jiti.import("./cherry-catalog.ts");
const { normalizeModelId } = await jiti.import("./cherry-model-id.ts");

const registry = parseCherryRegistry(
  {
    models: [
      {
        id: "claude-sonnet-4-5",
        name: "Claude Sonnet 4.5",
        ownedBy: "anthropic",
        capabilities: ["reasoning", "image-recognition"],
        inputModalities: ["text", "image"],
        contextWindow: 200_000,
        maxOutputTokens: 64_000,
        pricing: {
          input: { currency: "USD", perMillionTokens: 3 },
          output: { currency: "USD", perMillionTokens: 15 },
        },
      },
    ],
  },
  {
    overrides: [
      {
        providerId: "gateway",
        apiModelId: "us.anthropic.claude-sonnet-4-5-v1:0",
        modelId: "claude-sonnet-4-5",
        name: "Claude Sonnet via Gateway",
        pricing: {
          input: { currency: "USD", perMillionTokens: 3.5 },
          output: { currency: "USD", perMillionTokens: 16 },
        },
      },
    ],
  },
);

test("normalizes aggregator, Bedrock, variant, quantization, and date model IDs", () => {
  assert.equal(normalizeModelId("openai-gpt-5-thinking-2025-08-07"), "gpt-5");
  assert.equal(normalizeModelId("us.anthropic.claude-sonnet-4-5-v1:0"), "claude-sonnet-4-5");
  assert.equal(normalizeModelId("qwen2.5:7b", { keepParameterSize: true }), "qwen2-5-7b");
});

test("maps Cherry model metadata to Pi custom-model fields", () => {
  const match = lookupCherryPreset(registry, "claude-sonnet-4-5", "anthropic");
  assert.ok(match);
  assert.deepEqual(match.preset, {
    name: "Claude Sonnet 4.5",
    reasoning: true,
    input: ["text", "image"],
    contextWindow: 200_000,
    maxTokens: 64_000,
    cost: { input: 3, output: 15 },
  });
});

test("prefers provider-specific Cherry overrides and pricing", () => {
  const match = lookupCherryPreset(
    registry,
    "us.anthropic.claude-sonnet-4-5-v1:0",
    "gateway",
  );
  assert.ok(match);
  assert.equal(match.entry.providerId, "gateway");
  assert.equal(match.preset.name, "Claude Sonnet via Gateway");
  assert.deepEqual(match.preset.cost, { input: 3.5, output: 16 });
  assert.equal(match.preset.contextWindow, 200_000);
});
