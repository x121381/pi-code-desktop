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

test("native directory POST rejects untrusted and non-JSON requests", async () => {
  const untrusted = await POST(new Request("http://localhost:30141/api/native-directory", {
    method: "POST",
    headers: {
      host: "localhost:30141",
      origin: "https://attacker.example",
      "sec-fetch-site": "cross-site",
      "content-type": "application/json",
    },
    body: JSON.stringify({ title: "Select folder" }),
  }));
  assert.equal(untrusted.status, 403);

  const wrongType = await POST(new Request("http://localhost:30141/api/native-directory", {
    method: "POST",
    headers: { host: "localhost:30141", "content-type": "text/plain" },
    body: "{}",
  }));
  assert.equal(wrongType.status, 415);
});

test("native directory POST bounds JSON request bodies", async () => {
  const response = await POST(new Request("http://localhost:30141/api/native-directory", {
    method: "POST",
    headers: {
      host: "localhost:30141",
      "content-type": "application/json",
      "content-length": String(8 * 1024),
    },
    body: "{}",
  }));
  assert.equal(response.status, 413);
});

test("native directory route never echoes stderr or command output", async () => {
  const source = await readFile(new URL("./route.ts", import.meta.url), "utf8");
  assert.match(source, /selectNativeDirectory/);
  assert.match(source, /Could not open the system folder dialog/);
  assert.doesNotMatch(source, /error\.message/);
});
