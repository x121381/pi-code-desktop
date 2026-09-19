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
  assert.match(source, /showNoProjectOption=\{false\}/);
});

test("keeps no-project sessions out of project and worktree behavior", () => {
  assert.match(source, /projectSessions = noProjectCwd[\s\S]*!isNoProjectCwd\(session\.cwd\)/);
  assert.match(source, /if \(!selectedCwd \|\| !noProjectCwdLoaded \|\| isNoProjectCwd\(selectedCwd\)\)/);
  assert.match(source, /onCwdChange\?\.\(selectedCwd, projectRootFor\(selectedCwd\), noProjectMode\)/);
  assert.match(source, /\(noProjectSessions\.length > 0 \|\| noProjectMode\) && renderNoProjectGroup\(\)/);
});

test("top new session opens a chooser without requiring an active cwd", () => {
  assert.match(source, /className="sidebar-header-row sidebar-new-row"[\s\S]*onClick=\{openNewSessionChooser\}/);
  assert.doesNotMatch(source, /className="sidebar-header-row sidebar-new-row"[\s\S]{0,300}disabled=\{!selectedCwd\}/);
  assert.match(source, /sessionChooserMode === "choose"[\s\S]*sidebar\.normalChat[\s\S]*sidebar\.projectChat/);
});

test("normal chat resolves the no-project cwd before resetting the session", () => {
  const start = source.indexOf("const handleNormalChat = useCallback");
  const end = source.indexOf("const openNewSessionChooser", start);
  const handler = source.slice(start, end);
  assert.ok(handler.indexOf("await selectNoProjectCwd(controller.signal)") < handler.indexOf("activateNoProject(cwd)"));
  assert.match(handler, /sessionChooserGenerationRef\.current !== generation/);
  assert.match(handler, /new AbortController\(\)/);
  assert.match(handler, /controller\.signal\.aborted/);
});

test("project chat hides no-project and creates only after folder selection", () => {
  assert.match(source, /variant="panel"[\s\S]*showNoProjectOption=\{false\}/);
  assert.match(source, /onSelectCwd=\{\(cwd\) => \{[\s\S]*handleNewSession\(cwd\)/);
  assert.match(source, /onClick=\{\(\) => handleNewSession\(group\.projectRoot\)\}/);
});

test("clicking the selected project leaves project chat for normal chat", () => {
  assert.match(
    source,
    /onDeselectProject=\{sessionChooserMode === "project" \? \(\) => \{[\s\S]*handleNormalChat\(\)/,
  );
  assert.match(source, /sessionChooserMode === "project"[\s\S]*sidebar\.normalChat[\s\S]*sidebar\.leaveProjectChatHint/);
  assert.doesNotMatch(source, /if \(isActive && !noProjectMode\) \{\s*void handleNormalChat\(\);/);
});

test("chooser cancellation invalidates pending selection without resetting shell state", () => {
  const start = source.indexOf("const closeSessionChooser = useCallback");
  const end = source.indexOf("const handleNoProject", start);
  const closeHandler = source.slice(start, end);
  assert.match(closeHandler, /sessionChooserGenerationRef\.current \+= 1/);
  assert.match(closeHandler, /noProjectRequestRef\.current\?\.abort\(\)/);
  assert.match(closeHandler, /setNoProjectBusy\(false\)/);
  assert.match(closeHandler, /setSessionChooserMode\(null\)/);
  assert.doesNotMatch(closeHandler, /activateNoProject|activateProject|handleNewSession/);
});

test("chooser is viewport-modal, owns Escape, and manages keyboard focus", () => {
  assert.match(source, /sessionChooserMode && createPortal\(/);
  assert.match(source, /document\.body/);
  assert.match(source, /ref=\{sessionChooserRef\}[\s\S]*role="dialog"[\s\S]*aria-modal="true"/);
  assert.match(source, /event\.stopImmediatePropagation\(\)/);
  assert.match(source, /window\.addEventListener\("keydown", handleKeyDown, true\)/);
  assert.match(source, /event\.key !== "Tab"/);
  assert.match(source, /sessionChooserPreviousFocusRef\.current[\s\S]*previous\?\.focus\(\)/);
});
