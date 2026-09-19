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

const { GET, PUT, DELETE } = await loadSubject("./route.ts");

test("cloud chat GET and PUT reject untrusted requests", async () => {
  const headers = {
    host: "localhost:30141",
    origin: "https://attacker.example",
    "sec-fetch-site": "cross-site",
    "content-type": "application/json",
  };
  const untrustedGet = await GET(new Request("http://localhost:30141/api/cloud-chat", {
    method: "GET",
    headers,
  }));
  assert.equal(untrustedGet.status, 403);
  assert.deepEqual(await untrustedGet.json(), { error: "Untrusted API request", code: "UNTRUSTED_REQUEST" });

  const untrustedPut = await PUT(new Request("http://localhost:30141/api/cloud-chat", {
    method: "PUT",
    headers,
    body: JSON.stringify({ github: { token: "stolen" } }),
  }));
  assert.equal(untrustedPut.status, 403);
});

test("cloud chat PUT bounds JSON request bodies", async () => {
  const response = await PUT(new Request("http://localhost:30141/api/cloud-chat", {
    method: "PUT",
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

test("cloud chat DELETE requires a known destination", async () => {
  const response = await DELETE(new Request("http://localhost:30141/api/cloud-chat?destination=dropbox", {
    method: "DELETE",
    headers: { host: "localhost:30141" },
  }));
  assert.equal(response.status, 400);
  assert.equal((await response.json()).code, "INVALID_DESTINATION");
});

test("cloud chat routes never echo stored tokens", async () => {
  const source = await readFile(new URL("./route.ts", import.meta.url), "utf8");
  assert.match(source, /readCloudChatStatus/);
  assert.match(source, /updateCloudChatStore/);
  assert.match(source, /Could not save cloud chat credentials/);
  assert.doesNotMatch(source, /error\.message/);
  assert.doesNotMatch(source, /NextResponse\.json\(\s*store/);
});
