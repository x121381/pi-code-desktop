import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url, { tsconfigPaths: true });
const { buildNativeDirectoryCommand, selectNativeDirectory } = await jiti.import("./native-directory-dialog.ts");

test("Windows uses the system FolderBrowserDialog", () => {
  const spec = buildNativeDirectoryCommand("win32", {
    title: "Choose session storage folder",
    defaultPath: "C:\\Users\\example",
  });
  assert.match(spec.command, /powershell\.exe$/i);
  assert.ok(spec.args.includes("-STA"));
  assert.match(spec.args.at(-1) ?? "", /FolderBrowserDialog/);
  assert.equal(spec.env.PI_FOLDER_TITLE, "Choose session storage folder");
});

test("macOS and Linux use the system folder chooser", () => {
  const mac = buildNativeDirectoryCommand("darwin", { title: "Select folder" });
  assert.equal(mac.command, "/usr/bin/osascript");
  assert.match(mac.args.join("\n"), /choose folder/);

  const linux = buildNativeDirectoryCommand("linux", { title: "Select folder", defaultPath: "/home/user" });
  assert.equal(linux.command, "zenity");
  assert.ok(linux.args.includes("--directory"));
});

test("empty dialog output is treated as cancellation", async () => {
  const path = await selectNativeDirectory({ title: "Select folder" }, {
    platform: "linux",
    run: async () => "",
  });
  assert.equal(path, null);
});
