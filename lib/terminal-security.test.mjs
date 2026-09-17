import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const routeSource = await readFile(new URL("../app/api/desktop/terminal-authorization/route.ts", import.meta.url), "utf8");
const nativeSource = await readFile(new URL("./desktop-native.ts", import.meta.url), "utf8");
const rustSource = await readFile(new URL("../src-tauri/src/lib.rs", import.meta.url), "utf8");
const panelSource = await readFile(new URL("../components/TerminalPanel.tsx", import.meta.url), "utf8");

test("terminal cwd authorization is validated server-side and expires quickly", () => {
  assert.match(routeSource, /isDesktopApiRequestAllowed\(request\)/);
  assert.match(routeSource, /await isCwdAllowed\(requestedCwd\)/);
  assert.match(routeSource, /realpathSync\.native\(requestedCwd\)/);
  assert.match(routeSource, /AUTHORIZATION_TTL_SECONDS = 30/);
  assert.match(routeSource, /createHmac\("sha256", secret\)/);
});

test("native terminal creation requires the server authorization ticket", () => {
  assert.match(nativeSource, /\/api\/desktop\/terminal-authorization/);
  assert.match(nativeSource, /expiresAt: authorization\.expiresAt/);
  assert.match(rustSource, /verify_terminal_authorization\(&terminal_token\.0, &cwd, expires_at, &authorization\)/);
  assert.match(rustSource, /expires_at > now\.saturating_add\(60\)/);
  assert.match(rustSource, /mac\.verify_slice\(&signature\)/);
});

test("terminal sessions are removed after exit and isolated on panel cleanup", () => {
  assert.match(rustSource, /active\.remove\(&event_id\)/);
  assert.match(rustSource, /cleanup_terminal_sessions\(&sessions\)/);
  assert.match(panelSource, /if \(id\) void killTerminal\(id\)/);
  assert.doesNotMatch(panelSource, /cleanupTerminals/);
});
