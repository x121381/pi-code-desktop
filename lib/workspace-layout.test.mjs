import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_WORKSPACE_LAYOUT,
  filesShareSlot,
  hitTestDockSlot,
  movePaneToSlot,
  panesInSlot,
  parseWorkspaceLayout,
} from "./workspace-layout.ts";

test("default layout keeps chat in the center and files with preview on the right", () => {
  assert.deepEqual(DEFAULT_WORKSPACE_LAYOUT, {
    chat: "center",
    preview: "right",
    files: "right",
  });
  assert.equal(filesShareSlot(DEFAULT_WORKSPACE_LAYOUT), true);
  assert.deepEqual(panesInSlot(DEFAULT_WORKSPACE_LAYOUT, "right"), ["preview", "files"]);
});

test("dragging preview left leaves chat centered and files on the right", () => {
  const next = movePaneToSlot(DEFAULT_WORKSPACE_LAYOUT, "preview", "left");
  assert.deepEqual(next, { chat: "center", preview: "left", files: "right" });
  assert.equal(filesShareSlot(next), false);
});

test("dragging chat to the bottom keeps files and preview together", () => {
  const next = movePaneToSlot(DEFAULT_WORKSPACE_LAYOUT, "chat", "bottom");
  assert.deepEqual(next, { chat: "bottom", preview: "right", files: "right" });
  assert.deepEqual(panesInSlot(next, "center"), []);
});

test("invalid persisted layouts fall back to the default docks", () => {
  assert.deepEqual(parseWorkspaceLayout(null), DEFAULT_WORKSPACE_LAYOUT);
  assert.deepEqual(
    parseWorkspaceLayout({ chat: "up", preview: "right", files: "right" }),
    DEFAULT_WORKSPACE_LAYOUT,
  );
});

test("dock hit testing prefers bottom, then left or right edges", () => {
  const bounds = { left: 0, right: 1000, top: 0, bottom: 800, width: 1000, height: 800 };
  assert.equal(hitTestDockSlot(20, 400, bounds), "left");
  assert.equal(hitTestDockSlot(980, 400, bounds), "right");
  assert.equal(hitTestDockSlot(500, 760, bounds), "bottom");
  assert.equal(hitTestDockSlot(500, 400, bounds), "center");
});
