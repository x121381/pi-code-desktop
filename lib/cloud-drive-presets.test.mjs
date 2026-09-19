import assert from "node:assert/strict";
import test from "node:test";
import {
  CLOUD_ACCOUNT_UNAVAILABLE_PROVIDERS,
  NUTSTORE_DAV_URL,
  isUnavailableCloudProvider,
  nutstoreFolderUrl,
} from "./cloud-drive-presets.ts";

test("Nutstore uses the official WebDAV folder and does not ask for a custom URL", () => {
  assert.equal(nutstoreFolderUrl(), "https://dav.jianguoyun.com/dav/");
  assert.equal(NUTSTORE_DAV_URL.startsWith("https://"), true);
});

test("123, Baidu, and Aliyun stay unavailable without fake OAuth", () => {
  assert.deepEqual([...CLOUD_ACCOUNT_UNAVAILABLE_PROVIDERS], ["drive123", "baidu", "aliyun"]);
  assert.equal(isUnavailableCloudProvider("baidu"), true);
  assert.equal(isUnavailableCloudProvider("github"), false);
});
