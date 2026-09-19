import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function loadSubject(path) {
  try {
    const { createJiti } = await import("jiti");
    return createJiti(import.meta.url, { tsconfigPaths: true }).import(path);
  } catch {
    return import(path);
  }
}

const { POST } = await loadSubject("./route.ts");

test("session cloud publish rejects untrusted and non-JSON requests", async () => {
  const untrusted = await POST(new Request("http://localhost:30141/api/sessions/abc/cloud", {
    method: "POST",
    headers: {
      host: "localhost:30141",
      origin: "https://attacker.example",
      "sec-fetch-site": "cross-site",
      "content-type": "application/json",
    },
    body: JSON.stringify({ destination: "github" }),
  }), { params: Promise.resolve({ id: "abc" }) });
  assert.equal(untrusted.status, 403);

  const wrongType = await POST(new Request("http://localhost:30141/api/sessions/abc/cloud", {
    method: "POST",
    headers: { host: "localhost:30141", "content-type": "text/plain" },
    body: JSON.stringify({ destination: "github" }),
  }), { params: Promise.resolve({ id: "abc" }) });
  assert.equal(wrongType.status, 415);
});

test("session cloud publish bounds JSON request bodies", async () => {
  const response = await POST(new Request("http://localhost:30141/api/sessions/abc/cloud", {
    method: "POST",
    headers: {
      host: "localhost:30141",
      "content-type": "application/json",
      "content-length": String(8 * 1024),
    },
    body: "{}",
  }), { params: Promise.resolve({ id: "abc" }) });
  assert.equal(response.status, 413);
});

test("publish errors return codes without upstream HTML or secrets", async () => {
  const source = await readFile(new URL("./route.ts", import.meta.url), "utf8");
  assert.match(source, /Could not publish this chat/);
  assert.match(source, /error\.code/);
  assert.doesNotMatch(source, /error\.message/);
  assert.doesNotMatch(source, /html_url/);
});
