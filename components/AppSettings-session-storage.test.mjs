import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("session storage settings use the server-owned migration API", async () => {
  const source = await readFile(new URL("./AppSettings.tsx", import.meta.url), "utf8");

  assert.match(source, /fetch\("\/api\/session-storage", \{ cache: "no-store"/);
  assert.match(source, /fetch\("\/api\/session-storage", \{[\s\S]*method: "POST"/);
  assert.match(source, /body: JSON\.stringify\(\{ targetRoot \}\)/);
  assert.doesNotMatch(source, /body: JSON\.stringify\(\{[^}]*cwd/);
  assert.doesNotMatch(source, /relaunchAppNative/);
});

test("storage selection is confirmed before migration and remains read-only when managed", async () => {
  const source = await readFile(new URL("./AppSettings.tsx", import.meta.url), "utf8");

  assert.match(source, /value=\{sessionStorageTarget \?\? sessionStorage\?\.activeRoot \?\? ""\}\s*readOnly/);
  assert.match(source, /sessionStorage\.readOnly[\s\S]*sessionStorageChoose/);
  assert.match(source, /sessionStorageConfirmTitle/);
  assert.match(source, /onClick=\{\(\) => void migrateSessionStorage\(\)\}/);
  assert.match(source, /sessionStorage\.defaultRoot/);
  assert.match(source, /role="region"[\s\S]*aria-labelledby="session-storage-confirm-title"/);
  assert.doesNotMatch(source, /role="alertdialog"/);
});

test("changing storage location opens the system folder dialog immediately", async () => {
  const source = await readFile(new URL("./AppSettings.tsx", import.meta.url), "utf8");
  assert.match(source, /onClick=\{\(\) => void chooseSessionStorage\(\)\}/);
  assert.match(source, /selectDirectoryNative\(\{/);
  assert.doesNotMatch(source, /DirectoryPicker/);
  assert.doesNotMatch(source, /sessionStoragePickerOpen/);
});

test("language is chosen from an in-app dropdown, not a native select", async () => {
  const source = await readFile(new URL("./AppSettings.tsx", import.meta.url), "utf8");
  const languageStart = source.indexOf("function LanguageSelect");
  const languageEnd = source.indexOf("function ChoiceButton");
  const language = source.slice(languageStart, languageEnd);
  assert.match(language, /role="listbox"/);
  assert.match(language, /appSettings.languageSystem/);
  assert.match(language, /createPortal/);
  assert.match(language, /zIndex: 1400/);
  assert.doesNotMatch(language, /<select/);
  assert.doesNotMatch(language, /ChoiceButton/);
});

test("settings modal traps focus and restores the previous control", async () => {
  const source = await readFile(new URL("./AppSettings.tsx", import.meta.url), "utf8");

  assert.match(source, /ref=\{dialogRef\}[\s\S]*role="dialog"[\s\S]*tabIndex=\{-1\}/);
  assert.match(source, /previousFocusRef\.current = document\.activeElement/);
  assert.match(source, /previousFocusRef\.current\?\.focus\(\)/);
  assert.match(source, /event\.key !== "Tab"/);
  assert.match(source, /window\.addEventListener\("keydown", handleKeyDown, true\)/);
});

test("native directory selection accepts a purpose-specific title", async () => {
  const source = await readFile(new URL("../lib/desktop-native.ts", import.meta.url), "utf8");

  assert.match(source, /export type SelectDirectoryOptions/);
  assert.match(source, /defaultPathOrOptions\?: string \| SelectDirectoryOptions/);
  assert.match(source, /title: options\.title \?\? "Select project folder"/);
  assert.match(source, /fetch\("\/api\/native-directory"/);
});
