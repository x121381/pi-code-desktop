import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("nested directory picker owns Escape and sits above settings", async () => {
  const source = await readFile(new URL("./DirectoryPicker.tsx", import.meta.url), "utf8");
  assert.match(source, /zIndex: 1300/);
  assert.match(source, /stopImmediatePropagation/);
  assert.match(source, /window\.addEventListener\("keydown", handleKeyDown, true\)/);
});
