import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const source = await readFile(new URL("./SessionSidebar.tsx", import.meta.url), "utf8");
const sessionItemSource = source.slice(source.indexOf("function SessionItem("));

test("only Shift+click bypasses session deletion confirmation", () => {
  // Deleting without Shift must always route through the confirmation step.
  // The handler moved inline into the row's menu item, so match the guard
  // itself rather than a named function, and tolerate either brace style.
  assert.match(
    sessionItemSource,
    /if \(e\.shiftKey\)\s*\{?\s*void performDelete\(\);\s*\}?\s*else\s*\{?\s*setConfirmDelete\(true\);/,
  );
});

test("does not register row-level session deletion shortcuts", () => {
  assert.doesNotMatch(sessionItemSource, /const handleKeyDown/);
  assert.doesNotMatch(sessionItemSource, /onKeyDown=\{handleKeyDown\}/);
  assert.doesNotMatch(sessionItemSource, /tabIndex=\{0\}/);
});

test("streams running sessions and reconnects after visibility or network changes", () => {
  assert.match(source, /new EventSource\("\/api\/agent\/running\/events"\)/);
  assert.match(source, /document\.addEventListener\("visibilitychange", onVisible\)/);
  assert.match(source, /window\.addEventListener\("online", connect\)/);
  assert.match(source, /source\?\.close\(\)/);
});

test("re-adding a removed project clears only its sidebar marker", () => {
  assert.match(source, /const activateProject = useCallback\(\(cwd: string\) =>/);
  assert.match(source, /if \(!previous\.has\(projectRoot\)\) return previous;/);
  assert.match(source, /next\.delete\(projectRoot\);/);
  assert.match(source, /onSelectCwd=\{activateProject\}/);
});

test("offers a direct no-project chat action in the empty state", () => {
  assert.match(source, /onClick=\{\(\) => void handleNoProject\(\)\}/);
  assert.match(source, /t\("sidebar\.continueWithoutProject"\)/);
  assert.match(source, /onSelectNoProject=\{\(cwd\) =>/);
});

test("keeps no-project sessions out of project and worktree behavior", () => {
  assert.match(source, /projectSessions = noProjectCwd[\s\S]*!isNoProjectCwd\(session\.cwd\)/);
  assert.match(source, /if \(!selectedCwd \|\| !noProjectCwdLoaded \|\| isNoProjectCwd\(selectedCwd\)\)/);
  assert.match(source, /onCwdChange\?\.\(selectedCwd, projectRootFor\(selectedCwd\), noProjectMode\)/);
  assert.match(source, /\(noProjectSessions\.length > 0 \|\| noProjectMode\) && renderNoProjectGroup\(\)/);
});
