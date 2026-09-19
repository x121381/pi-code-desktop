import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);
const { modelDiscoveryErrorKey } = await jiti.import("./model-discovery-errors.ts");

test("maps safe model discovery codes to localized UI keys", () => {
  assert.equal(modelDiscoveryErrorKey("UPSTREAM_CHALLENGE"), "models.discoveryErrorChallenge");
  assert.equal(modelDiscoveryErrorKey("UPSTREAM_HTML_RESPONSE"), "models.discoveryErrorHtmlResponse");
  assert.equal(modelDiscoveryErrorKey("UPSTREAM_HTTP_ERROR"), "models.discoveryErrorRequestFailed");
  assert.equal(modelDiscoveryErrorKey("API_KEY_UNAVAILABLE"), "models.discoveryErrorKeyUnavailable");
});

test("uses a localized generic error for unknown or missing codes", () => {
  assert.equal(modelDiscoveryErrorKey("SECRET_UPSTREAM_DETAIL"), "models.discoveryErrorFailed");
  assert.equal(modelDiscoveryErrorKey(undefined), "models.discoveryErrorFailed");
});
