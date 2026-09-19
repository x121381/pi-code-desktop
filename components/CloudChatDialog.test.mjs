import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("./CloudChatDialog.tsx", import.meta.url), "utf8");
const panel = await readFile(new URL("./CloudAccountPanel.tsx", import.meta.url), "utf8");

test("cloud dialog keeps credentials on the server and sanitizes published links", () => {
  assert.match(source, /`\/api\/sessions\/\$\{encodeURIComponent\(sessionId\)\}\/cloud`/);
  assert.match(source, /from "@\/lib\/cloud-chat-ui"/);
  assert.match(source, /setResultUrl\(safePublishedCloudUrl\(data\.url\)\)/);
  assert.match(source, /import type \{ CloudChatStatus, CloudDestination \} from "@\/lib\/cloud-chat-store"/);
  assert.doesNotMatch(source, /from "@\/lib\/cloud-chat"/);
  assert.doesNotMatch(source, /^import \{[^}]*\} from "@\/lib\/cloud-chat-store"/m);
});

test("cloud dialog covers GitHub, WebDAV, and Feishu destinations", () => {
  assert.match(panel, /CLOUD_ACCOUNT_PROVIDERS/);
  assert.match(panel, /cloud\.githubConnect/);
  assert.match(panel, /cloud\.githubToken/);
  assert.match(panel, /cloud\.webdavConnect/);
  assert.match(panel, /cloud\.webdavUrl/);
  assert.match(panel, /cloud\.feishuConnect/);
  assert.match(panel, /cloud\.feishuWebhook/);
  assert.match(panel, /cloud\.feishuBot/);
  assert.match(source, /setPublished\(true\)/);
});

test("GitHub account linking stays on the server and never shows device codes from storage", () => {
  assert.match(panel, /fetch\("\/api\/cloud-chat\/github"/);
  assert.match(panel, /JSON\.stringify\(\{ loginId: githubDevice\.loginId \}\)/);
  assert.doesNotMatch(panel, /device_code/);
  assert.doesNotMatch(panel, /access_token/);
});

test("WebDAV and Feishu account linking stay on the server", () => {
  assert.match(panel, /fetch\("\/api\/cloud-chat\/webdav"/);
  assert.match(panel, /fetch\("\/api\/cloud-chat\/feishu"/);
  assert.match(panel, /JSON\.stringify\(\{ loginId: webdavDevice\.loginId \}\)/);
  assert.doesNotMatch(panel, /appPassword/);
  assert.doesNotMatch(panel, /tenant_access_token/);
});

test("brand icons start account linking without a custom URL first", () => {
  assert.match(panel, /className=\{`cloud-account-icon/);
  assert.match(panel, /NUTSTORE_DAV_URL/);
  assert.match(panel, /if \(next === "github"\) void connectGitHub\(\);/);
  assert.match(panel, /if \(next === "nutstore"\) \{/);
  assert.match(panel, /cloud\.nextcloudInstance/);
  assert.match(panel, /drive123Unavailable/);
  assert.match(panel, /baiduUnavailable/);
  assert.match(panel, /aliyunUnavailable/);
  assert.match(panel, /githubAdvanced/);
  assert.match(panel, /webdavAdvanced/);
});
