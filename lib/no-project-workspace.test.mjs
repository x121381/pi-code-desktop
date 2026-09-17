import assert from "node:assert/strict";
import test from "node:test";
import {
  getNoProjectWorkspaceCwd,
  isNoProjectWorkspace,
  normalizeWorkspaceCwd,
} from "./no-project-workspace.ts";

test("no-project workspace comparison normalizes Windows path syntax", () => {
  assert.equal(
    isNoProjectWorkspace("C:\\Users\\Pi\\.pi\\agent\\workspace\\", "c:/users/pi/.pi/agent/workspace"),
    true,
  );
  assert.equal(isNoProjectWorkspace("C:\\work\\project", "C:\\work\\workspace"), false);
});

test("no-project workspace comparison preserves POSIX case sensitivity", () => {
  assert.equal(isNoProjectWorkspace("/home/pi/workspace/", "/home/pi/workspace"), true);
  assert.equal(isNoProjectWorkspace("/home/Pi/workspace", "/home/pi/workspace"), false);
  assert.equal(isNoProjectWorkspace(null, "/home/pi/workspace"), false);
});

test("no-project workspace cwd uses the agent directory path style", () => {
  assert.equal(getNoProjectWorkspaceCwd("C:\\Users\\Pi\\.pi\\agent\\"), "C:\\Users\\Pi\\.pi\\agent\\workspace");
  assert.equal(getNoProjectWorkspaceCwd("/home/pi/.pi/agent/"), "/home/pi/.pi/agent/workspace");
  assert.equal(normalizeWorkspaceCwd("/home/pi//.pi/agent/workspace/"), "/home/pi/.pi/agent/workspace");
});
