import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const { POST } = await (async () => {
  try {
    const { createJiti } = await import("jiti");
    return createJiti(import.meta.url, { tsconfigPaths: true }).import("./route.ts");
  } catch {
    return import("./route.ts");
  }
})();

test("Feishu account linking rejects untrusted requests", async () => {
  const untrusted = await POST(new Request("http://localhost:30141/api/cloud-chat/feishu", {
    method: "POST",
    headers: {
      host: "localhost:30141",
      origin: "https://attacker.example",
      "sec-fetch-site": "cross-site",
      "content-type": "application/json",
    },
    body: JSON.stringify({ mode: "webhook", webhookUrl: "https://open.feishu.cn/open-apis/bot/v2/hook/secret" }),
  }));
  assert.equal(untrusted.status, 403);
  assert.deepEqual(await untrusted.json(), { error: "Untrusted API request", code: "UNTRUSTED_REQUEST" });
});

test("Feishu account linking never echoes app secrets or webhook URLs", async () => {
  const source = await readFile(new URL("./route.ts", import.meta.url), "utf8");
  assert.match(source, /connectFeishuAccount/);
  assert.doesNotMatch(source, /error\.message/);
  assert.doesNotMatch(source, /tenant_access_token/);
});
