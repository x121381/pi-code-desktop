import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const { POST, PUT } = await (async () => {
  try {
    const { createJiti } = await import("jiti");
    return createJiti(import.meta.url, { tsconfigPaths: true }).import("./route.ts");
  } catch {
    return import("./route.ts");
  }
})();

test("GitHub account linking rejects untrusted requests", async () => {
  const headers = {
    host: "localhost:30141",
    origin: "https://attacker.example",
    "sec-fetch-site": "cross-site",
    "content-type": "application/json",
  };
  const untrustedPost = await POST(new Request("http://localhost:30141/api/cloud-chat/github", {
    method: "POST",
    headers,
  }));
  assert.equal(untrustedPost.status, 403);
  assert.deepEqual(await untrustedPost.json(), { error: "Untrusted API request", code: "UNTRUSTED_REQUEST" });

  const untrustedPut = await PUT(new Request("http://localhost:30141/api/cloud-chat/github", {
    method: "PUT",
    headers,
    body: JSON.stringify({ loginId: "abc" }),
  }));
  assert.equal(untrustedPut.status, 403);
});

test("GitHub account linking never returns device or access tokens", async () => {
  const source = await readFile(new URL("./route.ts", import.meta.url), "utf8");
  assert.match(source, /startGitHubDeviceLogin/);
  assert.match(source, /pollGitHubDeviceLogin/);
  assert.match(source, /loginId/);
  assert.match(source, /userCode/);
  assert.doesNotMatch(source, /deviceCode/);
  assert.doesNotMatch(source, /access_token/);
  assert.doesNotMatch(source, /error\.message/);
});
