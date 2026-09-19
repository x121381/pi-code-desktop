import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("pane handles drag from title bars without floating windows", async () => {
  const source = await readFile(new URL("./PaneDock.tsx", import.meta.url), "utf8");
  assert.match(source, /className="pane-dock-handle"/);
  assert.match(source, /data-pane=\{pane\}/);
  assert.match(source, /dock-drop-zone/);
  assert.match(source, /onDrop/);
  assert.doesNotMatch(source, /createPortal/);
});
