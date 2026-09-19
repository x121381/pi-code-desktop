import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { userHome } from "@/lib/user-home";

const DIALOG_TIMEOUT_MS = 5 * 60 * 1000;
const MAX_TITLE_CHARS = 80;
const MAX_PATH_CHARS = 4096;

export class NativeDirectoryDialogError extends Error {
  constructor(
    public readonly code: "DIALOG_UNAVAILABLE" | "DIALOG_FAILED" | "DIALOG_TIMEOUT",
    public readonly status = 501,
  ) {
    super(code);
    this.name = "NativeDirectoryDialogError";
  }
}

export interface NativeDirectoryDialogOptions {
  defaultPath?: string;
  title?: string;
}

export interface NativeDirectoryCommand {
  command: string;
  args: string[];
  env: NodeJS.ProcessEnv;
  stdin?: string;
}

function sanitizeTitle(value: string | undefined): string {
  const cleaned = (value ?? "").replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();
  return cleaned.slice(0, MAX_TITLE_CHARS) || "Select folder";
}

function sanitizePath(value: string | undefined): string {
  const cleaned = (value ?? "").replace(/\0/g, "").trim().slice(0, MAX_PATH_CHARS);
  if (!cleaned) return userHome();
  return existsSync(cleaned) ? cleaned : userHome();
}

const POWERSHELL_SCRIPT = `
Add-Type -AssemblyName System.Windows.Forms | Out-Null
[void][System.Windows.Forms.Application]::EnableVisualStyles()
$dialog = New-Object System.Windows.Forms.FolderBrowserDialog
$dialog.Description = $env:PI_FOLDER_TITLE
$dialog.SelectedPath = $env:PI_FOLDER_DEFAULT
$dialog.ShowNewFolderButton = $true
$result = $dialog.ShowDialog()
if ($result -eq [System.Windows.Forms.DialogResult]::OK -and $dialog.SelectedPath) {
  [Console]::Out.Write($dialog.SelectedPath)
}
`.trim();

export function buildNativeDirectoryCommand(
  platform: NodeJS.Platform,
  options: NativeDirectoryDialogOptions = {},
): NativeDirectoryCommand {
  const title = sanitizeTitle(options.title);
  const defaultPath = sanitizePath(options.defaultPath);
  const env = {
    ...process.env,
    PI_FOLDER_TITLE: title,
    PI_FOLDER_DEFAULT: defaultPath,
  };

  if (platform === "win32") {
    const systemRoot = process.env.SystemRoot || "C:\\Windows";
    return {
      command: `${systemRoot}\\System32\\WindowsPowerShell\\v1.0\\powershell.exe`,
      args: ["-STA", "-NoProfile", "-ExecutionPolicy", "Bypass", "-Command", POWERSHELL_SCRIPT],
      env,
    };
  }

  if (platform === "darwin") {
    return {
      command: "/usr/bin/osascript",
      args: [
        "-e",
        'set theFolder to choose folder with prompt (system attribute "PI_FOLDER_TITLE") default location (POSIX file (system attribute "PI_FOLDER_DEFAULT"))',
        "-e",
        "POSIX path of theFolder",
      ],
      env,
    };
  }

  return {
    command: "zenity",
    args: ["--file-selection", "--directory", `--title=${title}`, `--filename=${defaultPath}`],
    env,
  };
}

function runCommand(spec: NativeDirectoryCommand, timeoutMs = DIALOG_TIMEOUT_MS): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn(spec.command, spec.args, {
      env: spec.env,
      windowsHide: false,
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    let settled = false;

    const timer = setTimeout(() => {
      child.kill();
      finish(new NativeDirectoryDialogError("DIALOG_TIMEOUT", 504));
    }, timeoutMs);

    const finish = (error?: Error, value = "") => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      if (error) reject(error);
      else resolve(value);
    };

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", (error) => {
      const code = (error as NodeJS.ErrnoException).code;
      finish(new NativeDirectoryDialogError(code === "ENOENT" ? "DIALOG_UNAVAILABLE" : "DIALOG_FAILED", code === "ENOENT" ? 501 : 500));
    });
    child.on("close", (status) => {
      const path = stdout.replace(/\r?\n/g, "").trim();
      if (path) {
        finish(undefined, path);
        return;
      }
      if (status === 0) {
        finish(undefined, "");
        return;
      }
      const cancelled = /cancel/i.test(stderr);
      if (cancelled || status === 1) {
        finish(undefined, "");
        return;
      }
      finish(new NativeDirectoryDialogError("DIALOG_FAILED", 500));
    });

    if (spec.stdin) {
      child.stdin.write(spec.stdin);
    }
    child.stdin.end();
  });
}

export async function selectNativeDirectory(
  options: NativeDirectoryDialogOptions = {},
  runtime: {
    platform?: NodeJS.Platform;
    run?: (spec: NativeDirectoryCommand) => Promise<string>;
  } = {},
): Promise<string | null> {
  const platform = runtime.platform ?? process.platform;
  const spec = buildNativeDirectoryCommand(platform, options);
  const run = runtime.run ?? ((command) => runCommand(command));
  const selected = (await run(spec)).trim();
  return selected || null;
}
