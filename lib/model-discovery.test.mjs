import assert from "node:assert/strict";
import test from "node:test";

async function loadSubject(path) {
  try {
    const { createJiti } = await import("jiti");
    return createJiti(import.meta.url, { tsconfigPaths: true }).import(path);
  } catch {
    return import(path);
  }
}

const {
  buildModelsListUrl,
  discoveryEndpointForDisplay,
  fetchDiscoveryJson,
  ModelDiscoveryError,
  nextModelsPageUrl,
  parseDiscoveredModels,
} = await loadSubject("./model-discovery.ts");
const { resolveModelDiscoveryAuth } = await loadSubject("./model-discovery-auth.ts");
const { POST: discoverModels } = await loadSubject("../app/api/models-config/discover/route.ts");

const discoveryOptions = (fetchImpl, maxBytes = 2 * 1024 * 1024) => ({
  headers: new Headers({ Authorization: "Bearer super-secret-key" }),
  timeoutMs: 1_000,
  maxBytes,
  fetchImpl,
});

async function expectDiscoveryError(promise, code) {
  await assert.rejects(promise, (error) => {
    assert.ok(error instanceof ModelDiscoveryError);
    assert.equal(error.code, code);
    assert.doesNotMatch(error.message, /super-secret|cloudflare-secret|x-private/i);
    return true;
  });
}

test("route rejects untrusted and non-JSON requests before processing the body", async () => {
  const untrusted = await discoverModels(new Request("http://localhost:30141/api/models-config/discover", {
    method: "POST",
    headers: {
      host: "localhost:30141",
      origin: "https://attacker.example",
      "sec-fetch-site": "cross-site",
      "content-type": "application/json",
    },
    body: "not-json",
  }));
  assert.equal(untrusted.status, 403);
  assert.deepEqual(await untrusted.json(), { error: "Untrusted API request", code: "UNTRUSTED_REQUEST" });

  const wrongType = await discoverModels(new Request("http://localhost:30141/api/models-config/discover", {
    method: "POST",
    headers: { host: "localhost:30141", "content-type": "text/plain" },
    body: "super-secret-key",
  }));
  assert.equal(wrongType.status, 415);
  assert.deepEqual(await wrongType.json(), {
    error: "Content-Type must be application/json",
    code: "INVALID_CONTENT_TYPE",
  });
});

test("route bounds JSON request bodies", async () => {
  const response = await discoverModels(new Request("http://localhost:30141/api/models-config/discover", {
    method: "POST",
    headers: {
      host: "localhost:30141",
      "content-type": "application/json",
      "content-length": String(300 * 1024),
    },
    body: "{}",
  }));
  assert.equal(response.status, 413);
  assert.deepEqual(await response.json(), { error: "Request body was too large", code: "REQUEST_TOO_LARGE" });
});

test("builds protocol-appropriate model list URLs", () => {
  assert.equal(buildModelsListUrl("https://api.example.com/v1/", "openai-completions").toString(), "https://api.example.com/v1/models");
  assert.equal(buildModelsListUrl("https://api.anthropic.com", "anthropic-messages").toString(), "https://api.anthropic.com/v1/models?limit=100");
  assert.equal(buildModelsListUrl("https://generativelanguage.googleapis.com", "google-generative-ai").toString(), "https://generativelanguage.googleapis.com/v1beta/models?pageSize=100");
  assert.equal(buildModelsListUrl("https://api.example.com/custom/models", "openai-responses").toString(), "https://api.example.com/custom/models");
});

test("rejects non-HTTP Base URLs and URL credentials", () => {
  for (const value of [
    "file:///tmp/models.json",
    "ftp://api.example.com/v1",
    "https://user:password@api.example.com/v1",
  ]) {
    assert.throws(() => buildModelsListUrl(value, "openai-completions"), TypeError);
  }
});

test("removes query parameters and fragments from the displayed endpoint", () => {
  const endpoint = buildModelsListUrl(
    "https://api.example.com/v1?api_key=super-secret-key#private",
    "openai-completions",
  );
  assert.equal(discoveryEndpointForDisplay(endpoint), "https://api.example.com/v1/models");
});

test("strips a pasted inference endpoint before appending /models", () => {
  assert.equal(
    buildModelsListUrl("https://maas-api.example.com/v1/chat/completions", "openai-completions").toString(),
    "https://maas-api.example.com/v1/models",
  );
  assert.equal(
    buildModelsListUrl("https://maas-api.example.com/v1/messages", "anthropic-messages").toString(),
    "https://maas-api.example.com/v1/models?limit=100",
  );
  assert.equal(
    buildModelsListUrl("https://maas-api.example.com/v1/chat/completions/", "openai-completions").toString(),
    "https://maas-api.example.com/v1/models",
  );
});

test("follows cursor pagination only when the API provides a cursor", () => {
  const anthropic = buildModelsListUrl("https://api.anthropic.com", "anthropic-messages");
  assert.equal(
    nextModelsPageUrl(anthropic, "anthropic-messages", { has_more: true, last_id: "model_42" })?.toString(),
    "https://api.anthropic.com/v1/models?limit=100&after_id=model_42",
  );
  assert.equal(nextModelsPageUrl(anthropic, "anthropic-messages", { has_more: false, last_id: "model_42" }), null);
  assert.equal(
    nextModelsPageUrl(anthropic, "google-generative-ai", { nextPageToken: "tok" })?.searchParams.get("pageToken"),
    "tok",
  );
  assert.equal(nextModelsPageUrl(anthropic, "openai-completions", { has_more: true, last_id: "x" }), null);
});

test("returns stable errors for HTML challenges and non-JSON responses", async () => {
  await expectDiscoveryError(fetchDiscoveryJson(
    new URL("https://api.example.com/v1/models"),
    discoveryOptions(async () => new Response("<html>cloudflare-secret challenge</html>", {
      status: 403,
      headers: { "content-type": "text/html", "cf-mitigated": "challenge" },
    })),
  ), "UPSTREAM_CHALLENGE");

  await expectDiscoveryError(fetchDiscoveryJson(
    new URL("https://api.example.com/v1/models"),
    discoveryOptions(async () => new Response("x-private upstream text", {
      headers: { "content-type": "text/plain" },
    })),
  ), "UPSTREAM_NOT_JSON");

  await expectDiscoveryError(fetchDiscoveryJson(
    new URL("https://api.example.com/v1/models"),
    discoveryOptions(async () => new Response("<!doctype html><title>cloudflare-secret</title>", {
      headers: { "content-type": "application/json" },
    })),
  ), "UPSTREAM_CHALLENGE");
});

test("maps timeouts to a stable error", async () => {
  await expectDiscoveryError(fetchDiscoveryJson(
    new URL("https://api.example.com/v1/models"),
    discoveryOptions(async () => {
      throw new DOMException("super-secret timeout detail", "TimeoutError");
    }),
  ), "UPSTREAM_TIMEOUT");
});

test("maps authentication, rate-limit, and server failures without exposing bodies", async () => {
  for (const [status, code] of [
    [401, "UPSTREAM_AUTH_FAILED"],
    [403, "UPSTREAM_AUTH_FAILED"],
    [429, "UPSTREAM_RATE_LIMITED"],
    [503, "UPSTREAM_UNAVAILABLE"],
  ]) {
    await expectDiscoveryError(fetchDiscoveryJson(
      new URL("https://api.example.com/v1/models"),
      discoveryOptions(async () => new Response('{"error":"super-secret-key"}', {
        status,
        headers: { "content-type": "application/json" },
      })),
    ), code);
  }
});

test("enforces the streamed response limit", async () => {
  const body = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode('{"data":'));
      controller.enqueue(new TextEncoder().encode('[{"id":"too-large"}]}'));
      controller.close();
    },
  });
  await expectDiscoveryError(fetchDiscoveryJson(
    new URL("https://api.example.com/v1/models"),
    discoveryOptions(async () => new Response(body, {
      headers: { "content-type": "application/json" },
    }), 8),
  ), "UPSTREAM_RESPONSE_TOO_LARGE");
});

test("follows only bounded same-origin redirects", async () => {
  const visited = [];
  const result = await fetchDiscoveryJson(
    new URL("https://api.example.com/v1/models"),
    discoveryOptions(async (url, init) => {
      visited.push({ url: String(url), authorization: new Headers(init.headers).get("authorization") });
      if (visited.length === 1) {
        return new Response(null, { status: 302, headers: { location: "/v2/models" } });
      }
      return Response.json({ data: [{ id: "model-a" }] });
    }),
  );
  assert.deepEqual(result.payload, { data: [{ id: "model-a" }] });
  assert.deepEqual(visited, [
    { url: "https://api.example.com/v1/models", authorization: "Bearer super-secret-key" },
    { url: "https://api.example.com/v2/models", authorization: "Bearer super-secret-key" },
  ]);

  let requests = 0;
  await expectDiscoveryError(fetchDiscoveryJson(
    new URL("https://api.example.com/v1/models"),
    discoveryOptions(async () => {
      requests += 1;
      return new Response(null, { status: 302, headers: { location: "https://attacker.example/models" } });
    }),
  ), "UPSTREAM_REDIRECT_BLOCKED");
  assert.equal(requests, 1);

  await expectDiscoveryError(fetchDiscoveryJson(
    new URL("https://api.example.com/v1/models"),
    {
      ...discoveryOptions(async () => new Response(null, {
        status: 302,
        headers: { location: "/next" },
      })),
      maxRedirects: 1,
    },
  ), "UPSTREAM_TOO_MANY_REDIRECTS");
});

test("flattens model lists collected across multiple pages", () => {
  assert.deepEqual(
    parseDiscoveredModels([{ data: [{ id: "gpt-5" }] }, { data: [{ id: "claude", display_name: "Claude" }] }]),
    [{ id: "claude", name: "Claude" }, { id: "gpt-5" }],
  );
});

test("parses OpenAI, Anthropic, Google, and string model lists", () => {
  assert.deepEqual(parseDiscoveredModels({ data: [{ id: "gpt-5" }, { id: "claude", display_name: "Claude" }] }), [
    { id: "claude", name: "Claude" },
    { id: "gpt-5" },
  ]);
  assert.deepEqual(parseDiscoveredModels({ models: [{ name: "models/gemini-2.5-pro", displayName: "Gemini 2.5 Pro" }] }), [
    { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
  ]);
  assert.deepEqual(parseDiscoveredModels(["zeta", "alpha", "alpha"]), [
    { id: "alpha" },
    { id: "zeta" },
  ]);
});

test("resolves environment-backed headers without an API key", async () => {
  process.env.PI_WEB_DISCOVERY_TEST_TOKEN = "resolved-token";
  try {
    const auth = await resolveModelDiscoveryAuth("pi-web-header-only-test", {
      baseUrl: "https://example.invalid/v1",
      api: "openai-completions",
      headers: { "X-Discovery-Token": "$PI_WEB_DISCOVERY_TEST_TOKEN" },
    });
    assert.equal(auth.apiKey, undefined);
    assert.deepEqual(auth.headers, { "X-Discovery-Token": "resolved-token" });
  } finally {
    delete process.env.PI_WEB_DISCOVERY_TEST_TOKEN;
  }
});
