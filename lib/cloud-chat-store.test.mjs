import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url, { tsconfigPaths: true });
const {
  applyCloudChatPatch,
  clearCloudChatDestination,
  redactCloudChatStore,
  updateCloudChatStore,
} = await jiti.import("./cloud-chat-store.ts");

test("redacts tokens, passwords, and webhook secrets from status payloads", () => {
  const status = redactCloudChatStore({
    version: 1,
    github: { token: "ghp_secret", public: true },
    webdav: { url: "https://dav.example/remote.php/webdav/", username: "alice", password: "pw" },
    feishu: { mode: "webhook", webhookUrl: "https://open.feishu.cn/hook/secret" },
  });
  assert.deepEqual(status.github, { configured: true, public: true, authMode: "token" });
  assert.deepEqual(status.webdav, {
    configured: true,
    url: "https://dav.example/remote.php/webdav/",
    username: "alice",
  });
  assert.deepEqual(status.feishu, { configured: true, mode: "webhook" });
  assert.equal(JSON.stringify(status).includes("ghp_secret"), false);
  assert.equal(JSON.stringify(status).includes("pw"), false);
  assert.equal(JSON.stringify(status).includes("hook/secret"), false);
});

test("blank secret fields keep the previously stored value", () => {
  const next = applyCloudChatPatch(
    { version: 1, github: { token: "kept", public: false } },
    { github: { public: true } },
  );
  assert.equal(next.github.token, "kept");
  assert.equal(next.github.public, true);
});

test("stores credentials privately and never writes secrets into the status", async (t) => {
  const dir = await mkdtemp(join(tmpdir(), "pi-cloud-chat-"));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const path = join(dir, "cloud-chat.json");
  const status = await updateCloudChatStore({
    github: { token: "ghp_secret", public: false },
  }, path);
  assert.equal(status.github.configured, true);
  assert.equal(JSON.stringify(status).includes("ghp_secret"), false);
  const saved = JSON.parse(await readFile(path, "utf8"));
  assert.equal(saved.github.token, "ghp_secret");
  const cleared = await clearCloudChatDestination("github", path);
  assert.equal(cleared.github.configured, false);
});
