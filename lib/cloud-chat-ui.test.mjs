import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url, { tsconfigPaths: true });
const { cloudChatErrorKey, safePublishedCloudUrl } = await jiti.import("./cloud-chat-ui.ts");

test("maps known publish codes and never echoes unknown values", () => {
  assert.equal(cloudChatErrorKey("MISSING_CREDENTIALS"), "cloud.errorMissingCredentials");
  assert.equal(cloudChatErrorKey("UPSTREAM_HTML_RESPONSE"), "cloud.errorUpstreamHtml");
  assert.equal(cloudChatErrorKey("UPSTREAM_CHALLENGE"), "cloud.errorUpstreamHtml");
  assert.equal(cloudChatErrorKey("GITHUB_DEVICE_EXPIRED"), "cloud.errorGithubExpired");
  assert.equal(cloudChatErrorKey("WEBDAV_LOGIN_UNSUPPORTED"), "cloud.errorWebdavLogin");
  assert.equal(cloudChatErrorKey("WEBDAV_LOGIN_EXPIRED"), "cloud.errorWebdavExpired");
  assert.equal(cloudChatErrorKey("token=secret"), "cloud.error");
});

test("only http(s) URLs without credentials become published links", () => {
  assert.equal(safePublishedCloudUrl("https://gist.github.com/abc"), "https://gist.github.com/abc");
  assert.equal(safePublishedCloudUrl("http://dav.example/remote.php/webdav/chat.md"), "http://dav.example/remote.php/webdav/chat.md");
  assert.equal(safePublishedCloudUrl("javascript:alert(1)"), null);
  assert.equal(safePublishedCloudUrl("https://user:pass@gist.github.com/abc"), null);
  assert.equal(safePublishedCloudUrl("not a url"), null);
  assert.equal(safePublishedCloudUrl(""), null);
});
