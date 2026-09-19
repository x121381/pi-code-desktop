import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const appShellSource = await readFile(new URL("./AppShell.tsx", import.meta.url), "utf8");
const nativeThemeSource = await readFile(new URL("../app/native-theme.css", import.meta.url), "utf8");

test("terminal and files use a shared non-overlapping toggle group", () => {
  assert.match(appShellSource, /className="right-panel-toggle-group"/);
  assert.match(nativeThemeSource, /\.right-panel-toggle-group\s*\{[\s\S]*?display:\s*flex;[\s\S]*?gap:\s*4px;/);

  const finalButtonRule = nativeThemeSource.lastIndexOf(".right-panel-toggle-button {");
  assert.notEqual(finalButtonRule, -1);
  const finalButtonBlock = nativeThemeSource.slice(finalButtonRule, nativeThemeSource.indexOf("}", finalButtonRule) + 1);
  assert.match(finalButtonBlock, /position:\s*relative;/);
  assert.doesNotMatch(finalButtonBlock, /position:\s*fixed;/);
});

test("every visible close path tears down the terminal panel", () => {
  assert.match(appShellSource, /const closeRightPanel = useCallback\(\(\) => \{\s*setRightPanelOpen\(false\);\s*setTerminalOpen\(false\);/);
  assert.match(appShellSource, /className={`right-panel-overlay-backdrop[\s\S]*?onClick=\{closeRightPanel\}/);
  assert.match(appShellSource, /<TerminalPanel[\s\S]*?onClose=\{closeRightPanel\}/);
});

test("switching between terminal and files cannot leave both modes active", () => {
  assert.match(appShellSource, /if \(rightPanelOpen && terminalOpen\) \{\s*closeRightPanel\(\);/);
  assert.match(appShellSource, /setTerminalOpen\(true\);\s*setRightPanelOpen\(true\);/);
  assert.match(appShellSource, /const handleRightPanelToggle = useCallback[\s\S]*?setTerminalOpen\(false\);\s*setRightPanelOpen\(true\);/);
});

test("terminal icon stays in the top bar on web and desktop", () => {
  assert.match(appShellSource, /app-topbar-actions[\s\S]*handleTerminalToggle/);
  assert.match(appShellSource, /translate\("terminal\.webOnly"\)/);
  assert.match(appShellSource, /<rect x="3" y="4" width="18" height="16" rx="2" \/>/);
  const terminalToggle = appShellSource.slice(
    appShellSource.indexOf("const handleTerminalToggle"),
    appShellSource.indexOf("const handlePaneDrop"),
  );
  assert.match(terminalToggle, /if \(!desktopMode\) \{/);
  assert.doesNotMatch(appShellSource, /desktopMode && \(\s*<button[\s\S]*handleTerminalToggle/);
});

test("chat preview and files dock from title-bar handles", () => {
  assert.match(appShellSource, /<PaneDockHandle[\s\S]*pane="chat"/);
  assert.match(appShellSource, /<PaneDockHandle[\s\S]*pane="preview"/);
  assert.match(appShellSource, /<PaneDockHandle[\s\S]*pane="files"/);
  assert.match(appShellSource, /ref=\{workspaceRef\}/);
  assert.match(appShellSource, /<DockDropOverlay/);
  assert.match(appShellSource, /layout: workspaceLayout/);
});
