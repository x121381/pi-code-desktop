import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("starting another blank task remounts the composer even in the same cwd", async () => {
  const source = await readFile(new URL("./AppShell.tsx", import.meta.url), "utf8");
  const start = source.indexOf("const handleNewSession = useCallback");
  const end = source.indexOf("// Global keyboard shortcuts", start);
  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  const handler = source.slice(start, end);
  assert.match(handler, /clearDraft\(`new:\$\{cwd\}`\)/);
  assert.match(handler, /setSessionKey\(\(key\) => key \+ 1\)/);
});

test("switching sessions immediately clears parent-owned session UI", async () => {
  const source = await readFile(new URL("./AppShell.tsx", import.meta.url), "utf8");
  const start = source.indexOf("const handleSelectSession = useCallback");
  const end = source.indexOf("const handleNewSession = useCallback", start);
  assert.notEqual(start, -1);
  assert.notEqual(end, -1);
  const handler = source.slice(start, end);
  assert.match(handler, /setBranchTree\(\[\]\)/);
  assert.match(handler, /setBranchActiveLeafId\(null\)/);
  assert.match(handler, /branchLeafChangeFnRef\.current = null/);
  assert.match(handler, /setSessionStats\(null\)/);
  assert.match(handler, /setContextUsage\(null\)/);
  assert.match(handler, /setActiveTopPanel\(null\)/);
});

test("desktop-only workspace and health behavior is gated before use", async () => {
  const source = await readFile(new URL("./AppShell.tsx", import.meta.url), "utf8");
  assert.match(source, /desktopMode \? getPrefJson<PersistedWorkspace>/);
  assert.match(source, /useDesktopConnection\(desktopMode\)/);
  assert.match(source, /if \(!desktopMode \|\| !workspaceHydrated\) return/);
});

test("no-project mode disables project-scoped shell features", async () => {
  const source = await readFile(new URL("./AppShell.tsx", import.meta.url), "utf8");
  assert.match(source, /const projectTrustCwd = noProjectMode \? null/);
  assert.match(source, /setSkillsConfigOpen\(false\)/);
  assert.match(source, /setPluginsConfigOpen\(false\)/);
  assert.match(source, /projectScopeAvailable=\{!noProjectMode\}/);
  assert.match(source, /disabled=\{noProjectMode\}/);
  assert.match(source, /if \(noProjectMode\) return;[\s\S]*setFileTabs/);
});

test("no-project mode is clearly identified in the workspace chrome", async () => {
  const source = await readFile(new URL("./AppShell.tsx", import.meta.url), "utf8");
  assert.match(source, /workspaceLabel = noProjectMode \? translate\("sidebar\.noProject"\)/);
  assert.match(source, /topBarSubtitle = noProjectMode \? translate\("sidebar\.noProjectHint"\)/);
  assert.match(source, /onNoProjectModeChange=\{setNoProjectMode\}/);
});

test("global new-session shortcut requests the sidebar-owned chooser", async () => {
  const source = await readFile(new URL("./AppShell.tsx", import.meta.url), "utf8");
  assert.match(source, /onNewSession: \(\) => setNewSessionRequestKey\(\(key\) => key \+ 1\)/);
  assert.match(source, /newSessionRequestKey=\{newSessionRequestKey\}/);
  assert.doesNotMatch(source, /onNewSession: \(cwd: string\) => handleNewSession/);
});

test("composer project picker can leave a selected project for ordinary chat", async () => {
  const source = await readFile(new URL("./AppShell.tsx", import.meta.url), "utf8");
  assert.match(source, /selectNoProjectCwd/);
  assert.match(source, /handleLeaveProjectFromComposer/);
  assert.match(source, /onLeaveProject=\{noProjectMode \? undefined : \(\) => void handleLeaveProjectFromComposer\(\)\}/);
  assert.match(source, /noProjectMode=\{noProjectMode\}/);
  assert.match(source, /projectOptions=\{availableProjectRoots\}/);
});

test("the more menu can open the cloud chat dialog for a saved session", async () => {
  const source = await readFile(new URL("./AppShell.tsx", import.meta.url), "utf8");
  assert.match(source, /setCloudChatOpen\(true\)/);
  assert.match(source, /translate\("cloud\.share"\)/);
  assert.match(source, /sessionId=\{selectedSession\?\.id \?\? null\}/);
});
