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

const { GET, POST } = await loadSubject("./route.ts");

test("session storage POST rejects untrusted and non-JSON requests before migrating", async () => {
  const untrusted = await POST(new Request("http://localhost:30141/api/session-storage", {
    method: "POST",
    headers: {
      host: "localhost:30141",
      origin: "https://attacker.example",
      "sec-fetch-site": "cross-site",
      "content-type": "application/json",
    },
    body: JSON.stringify({ targetRoot: "C:\\\\stolen" }),
  }));
  assert.equal(untrusted.status, 403);
  assert.deepEqual(await untrusted.json(), { error: "Untrusted API request", code: "UNTRUSTED_REQUEST" });

  const wrongType = await POST(new Request("http://localhost:30141/api/session-storage", {
    method: "POST",
    headers: { host: "localhost:30141", "content-type": "text/plain" },
    body: JSON.stringify({ targetRoot: "C:\\\\stolen" }),
  }));
  assert.equal(wrongType.status, 415);
  assert.deepEqual(await wrongType.json(), {
    error: "Content-Type must be application/json",
    code: "INVALID_CONTENT_TYPE",
  });
});

test("session storage POST bounds JSON request bodies", async () => {
  const response = await POST(new Request("http://localhost:30141/api/session-storage", {
    method: "POST",
    headers: {
      host: "localhost:30141",
      "content-type": "application/json",
      "content-length": String(32 * 1024),
    },
    body: "{}",
  }));
  assert.equal(response.status, 413);
  assert.deepEqual(await response.json(), { error: "Request body was too large", code: "REQUEST_TOO_LARGE" });
});

test("session storage GET rejects cross-site requests", async () => {
  const untrusted = await GET(new Request("http://localhost:30141/api/session-storage", {
    method: "GET",
    headers: {
      host: "localhost:30141",
      origin: "https://attacker.example",
      "sec-fetch-site": "cross-site",
    },
  }));
  assert.equal(untrusted.status, 403);
  assert.deepEqual(await untrusted.json(), { error: "Untrusted API request", code: "UNTRUSTED_REQUEST" });
});
