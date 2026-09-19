import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";
import { readFile } from "node:fs/promises";

const jiti = createJiti(import.meta.url, {
  jsx: { runtime: "automatic" },
  tsconfigPaths: true,
});
const { selectNoProjectCwd, selectVisibleProjects, shouldShowProjectFilter } = await jiti.import("./ProjectPicker.tsx");

const many = Array.from({ length: 12 }, (_, i) => `/work/project-${i}`);

test("caps the unfiltered list but offers a filter once projects exceed the cap", () => {
  assert.equal(shouldShowProjectFilter(many.slice(0, 7)), false);
  assert.equal(shouldShowProjectFilter(many), true);
  assert.equal(selectVisibleProjects(many, null, "").length, 7);
});

test("filtering searches the whole list, not just the capped rows", () => {
  // project-9 sits past the cap, so this is the regression that made every
  // project beyond the 7th unreachable when the filter box was dropped.
  assert.deepEqual(selectVisibleProjects(many, null, "project-9"), ["/work/project-9"]);
  assert.ok(!selectVisibleProjects(many, null, "").includes("/work/project-9"));
});

test("filtering is case-insensitive, trimmed, and returns every match", () => {
  assert.deepEqual(selectVisibleProjects(["/work/Alpha", "/work/beta"], null, "  ALP "), ["/work/Alpha"]);
  // project-1, project-10 and project-11 all match, and all three are returned
  // even though only project-1 is inside the cap.
  assert.deepEqual(
    selectVisibleProjects(many, null, "project-1"),
    ["/work/project-1", "/work/project-10", "/work/project-11"],
  );
  assert.deepEqual(selectVisibleProjects(many, null, "nothing"), []);
});

test("the selected project stays visible even when it falls outside the cap", () => {
  const visible = selectVisibleProjects(many, "/work/project-11", "");
  assert.equal(visible.length, 7);
  assert.ok(visible.includes("/work/project-11"));
});

test("a selected project already inside the cap is not duplicated", () => {
  const visible = selectVisibleProjects(many, "/work/project-2", "");
  assert.equal(visible.filter((p) => p === "/work/project-2").length, 1);
  assert.equal(visible.length, 7);
});

test("no-project chats resolve their stable cwd from the dedicated API", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async (input) => {
    assert.equal(input, "/api/no-project-cwd");
    return new Response(JSON.stringify({ cwd: "/app/workspace" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };
  assert.equal(await selectNoProjectCwd(), "/app/workspace");
});

test("no-project cwd resolution rejects invalid API responses", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  globalThis.fetch = async () => new Response(JSON.stringify({ error: "unavailable" }), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  });
  await assert.rejects(selectNoProjectCwd(), /unavailable/);
});

test("project-only panel mode can hide the no-project choice", async () => {
  const source = await readFile(new URL("./ProjectPicker.tsx", import.meta.url), "utf8");
  assert.match(source, /variant\?: "block" \| "inline" \| "panel"/);
  assert.match(source, /showNoProjectOption = true/);
  assert.match(source, /\{showNoProjectOption && \(/);
  assert.match(source, /open=\{isPanel \|\| dropdownOpen\}/);
});

test("clicking the already-selected project can leave project conversation", async () => {
  const source = await readFile(new URL("./ProjectPicker.tsx", import.meta.url), "utf8");
  assert.match(source, /onDeselectProject\?: \(\) => void/);
  assert.match(source, /canLeaveProject = isSelected && Boolean\(onDeselectProject\)/);
  assert.match(source, /if \(canLeaveProject\) \{\s*onDeselectProject\?\.\(\);/);
  assert.match(source, /sidebar\.leaveProjectChat/);
});
