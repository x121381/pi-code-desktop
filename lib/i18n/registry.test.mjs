import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);
const {
  getLocalePlugin,
  getSupportedLocales,
  registerLocale,
  resolveBrowserLocale,
  resolveLocalePreference,
  getLocaleDirection,
} = await jiti.import("./registry.ts");
const { enLocale } = await jiti.import("./messages/en.ts");
const localePackages = await Promise.all(["zh-CN", "zh-TW", "ja", "ko", "es"].map((id) => jiti.import(`./messages/${id}.ts`)));

test("uses exact browser matches, then base language matches, and falls back to English", () => {
  assert.equal(resolveBrowserLocale(["zh-CN", "en-US"]), "zh-CN");
  assert.equal(resolveBrowserLocale(["zh-TW", "zh-CN"]), "zh-TW");
  assert.equal(resolveBrowserLocale(["zh-HK", "en-US"]), "zh-TW");
  assert.equal(resolveBrowserLocale(["ja-JP", "en-US"]), "ja");
  assert.equal(resolveBrowserLocale(["en-US", "zh-CN"]), "en");
  assert.equal(resolveBrowserLocale(["fr-FR", "zh-CN"]), "zh-CN");
  assert.equal(resolveBrowserLocale(["fr-FR"]), "en");
  assert.equal(resolveBrowserLocale([]), "en");
});

test("uses persisted locale preferences and system browser resolution", () => {
  assert.equal(resolveLocalePreference("ja", ["en-US"]), "ja");
  assert.equal(resolveLocalePreference("missing", ["ko-KR"]), "ko");
  assert.equal(resolveLocalePreference("system", ["es-MX"]), "es");
  assert.equal(resolveLocalePreference(null, ["zh-TW"]), "zh-TW");
});

test("returns built-in registered locales in stable order", () => {
  assert.deepEqual(getSupportedLocales(), ["en", "zh-CN", "zh-TW", "ja", "ko", "es"]);
  assert.equal(getLocalePlugin("en").id, "en");
  assert.equal(getLocalePlugin("missing"), undefined);
  assert.equal(getLocaleDirection("en"), "ltr");
  registerLocale({ id: "rtl-test", label: "RTL", direction: "rtl", messages: {} });
  assert.equal(getLocaleDirection("rtl-test"), "rtl");
});

test("every built-in locale has the complete English key set", () => {
  const englishKeys = Object.keys(enLocale.messages).sort();
  for (const loadedModule of localePackages) {
    const locale = Object.values(loadedModule)[0];
    assert.deepEqual(Object.keys(locale.messages).sort(), englishKeys, `${locale.id} message keys differ from English`);
  }
});

test("allows a new locale plugin and rejects duplicate ids", () => {
  registerLocale({ id: "test", label: "Test", messages: { "common.ok": "OK" } });
  assert.equal(getLocalePlugin("test")?.label, "Test");
  assert.throws(() => registerLocale({ id: "test", label: "Again", messages: {} }));
});
