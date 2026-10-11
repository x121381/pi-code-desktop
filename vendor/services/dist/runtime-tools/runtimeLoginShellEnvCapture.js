import { execFileSync, spawn } from "node:child_process";
import { accessSync, constants } from "node:fs";
import { prependPathEntries } from "./runtimeToolResolver.js";
const LOGIN_ENV_CAPTURE_PREFIX = "__ZCODE_LOGIN_ENV_START__";
const LOGIN_ENV_CAPTURE_SUFFIX = "__ZCODE_LOGIN_ENV_END__";
const DEFAULT_POSIX_BOOTSTRAP_PATH = process.platform === "darwin"
    ? "/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin"
    : "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin";
let cachedLoginShellEnvSnapshot;
function isExecutableFile(path) {
    try {
        accessSync(path, constants.X_OK);
        return true;
    }
    catch {
        return false;
    }
}
function resolveShellPathForLoginEnv(baseEnv) {
    const candidates = [baseEnv.SHELL, "/bin/zsh", "/bin/bash", "/bin/sh"];
    for (const candidate of candidates) {
        if (candidate && isExecutableFile(candidate)) {
            return candidate;
        }
    }
    return null;
}
export function buildShellBootstrapPath(currentPath) {
    return prependPathEntries(currentPath, DEFAULT_POSIX_BOOTSTRAP_PATH.split(":"));
}
function buildLoginShellArgs(shellPath) {
    const command = `printf '%s\\0' '${LOGIN_ENV_CAPTURE_PREFIX}'; env -0; printf '%s\\0' '${LOGIN_ENV_CAPTURE_SUFFIX}'`;
    return shellPath.endsWith("/zsh") || shellPath.endsWith("/bash")
        ? ["-ilc", command]
        : ["-lc", command];
}
function buildLoginShellExecutionOptions(baseEnv) {
    return {
        encoding: "utf8",
        windowsHide: true,
        timeout: 4_000,
        maxBuffer: 2 * 1024 * 1024,
        env: {
            ...baseEnv,
            // GUI / remote service 进程的 PATH 往往不经过 login shell 初始化。
            // 给探测 shell 一个最小系统 PATH，再由 profile 回放用户自己的命令路径。
            PATH: buildShellBootstrapPath(baseEnv.PATH),
            TERM: "dumb",
            CI: "1",
        },
    };
}
function killLoginShellProcessTree(child) {
    if (process.platform !== "win32" && child.pid) {
        try {
            process.kill(-child.pid, "SIGKILL");
            return;
        }
        catch {
            // 进程可能已在 close 前退出；继续尝试直接 kill，避免留下采集后代。
        }
    }
    try {
        child.kill("SIGKILL");
    }
    catch {
        // 超时与自然退出可能竞争，进程已经不存在时无需额外处理。
    }
}
const executeLoginShell = (shellPath, shellArgs, options) => new Promise((resolve, reject) => {
    const child = spawn(shellPath, shellArgs, {
        env: options.env,
        windowsHide: options.windowsHide,
        stdio: ["ignore", "pipe", "pipe"],
        // login profile 可能启动继承 stdout/stderr 的后代进程；只 kill shell 会让
        // execFile 一直等 pipe close。POSIX 下独立进程组才能在 deadline 时完整终止采集树。
        detached: process.platform !== "win32",
    });
    let stdout = "";
    let outputBytes = 0;
    let settled = false;
    const killProcessTree = () => {
        killLoginShellProcessTree(child);
        child.stdout.destroy();
        child.stderr.destroy();
    };
    const handleAbort = () => {
        killProcessTree();
        settle(new Error(`login shell environment capture timed out after ${options.timeout}ms`));
    };
    const settle = (error) => {
        if (settled)
            return;
        settled = true;
        options.signal?.removeEventListener("abort", handleAbort);
        if (error)
            reject(error);
        else
            resolve(stdout);
    };
    const appendOutput = (chunk, includeInStdout) => {
        const text = typeof chunk === "string" ? chunk : chunk.toString("utf8");
        outputBytes += Buffer.byteLength(text);
        if (outputBytes > options.maxBuffer) {
            killProcessTree();
            settle(new Error(`login shell environment capture exceeded ${options.maxBuffer} bytes`));
        }
        else if (includeInStdout) {
            stdout += text;
        }
    };
    child.stdout.on("data", (chunk) => appendOutput(chunk, true));
    child.stderr.on("data", (chunk) => appendOutput(chunk, false));
    child.once("error", (error) => settle(error));
    child.once("close", (code, signal) => {
        if (code === 0)
            settle();
        else {
            settle(new Error(`login shell environment capture exited with code ${code ?? "null"}, signal ${signal ?? "none"}`));
        }
    });
    options.signal?.addEventListener("abort", handleAbort, { once: true });
    if (options.signal?.aborted)
        handleAbort();
});
function extractCapturedEnvSnapshot(rawOutput) {
    const startMarker = `${LOGIN_ENV_CAPTURE_PREFIX}\0`;
    const endMarker = `${LOGIN_ENV_CAPTURE_SUFFIX}\0`;
    const startIndex = rawOutput.lastIndexOf(startMarker);
    const endIndex = rawOutput.lastIndexOf(endMarker);
    if (startIndex < 0 || endIndex <= startIndex)
        return null;
    return parseNullSeparatedEnvSnapshot(rawOutput.slice(startIndex + startMarker.length, endIndex));
}
function parseNullSeparatedEnvSnapshot(rawOutput) {
    const result = {};
    for (const entry of rawOutput.split("\0")) {
        if (!entry)
            continue;
        const separatorIndex = entry.indexOf("=");
        if (separatorIndex <= 0)
            continue;
        const key = entry.slice(0, separatorIndex).trim();
        if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(key))
            continue;
        result[key] = entry.slice(separatorIndex + 1);
    }
    return result;
}
export async function captureLoginShellEnvSnapshot(options = {}) {
    const baseEnv = options.baseEnv ?? process.env;
    const platform = options.platform ?? process.platform;
    if (platform === "win32" || baseEnv.VITEST)
        return null;
    const shellPath = options.shellPath === undefined ? resolveShellPathForLoginEnv(baseEnv) : options.shellPath;
    if (!shellPath)
        return null;
    const timeoutMs = options.timeoutMs ?? 4_000;
    const abortController = new AbortController();
    let deadlineTimer = null;
    try {
        const executionPromise = (options.executeShell ?? executeLoginShell)(shellPath, buildLoginShellArgs(shellPath), {
            ...buildLoginShellExecutionOptions(baseEnv),
            timeout: timeoutMs,
            signal: abortController.signal,
        });
        // Node execFile 的 timeout 仍会等待所有继承 pipe 的后代关闭。
        // 外层 deadline 独立结算 API；默认 executor 同时通过 AbortSignal 杀完整 POSIX 进程组。
        const deadlinePromise = new Promise((_resolve, reject) => {
            deadlineTimer = setTimeout(() => {
                abortController.abort();
                reject(new Error(`login shell environment capture timed out after ${timeoutMs}ms`));
            }, timeoutMs);
        });
        const output = await Promise.race([executionPromise, deadlinePromise]);
        return extractCapturedEnvSnapshot(output);
    }
    catch {
        return null;
    }
    finally {
        if (deadlineTimer)
            clearTimeout(deadlineTimer);
    }
}
export function captureLoginShellEnvSnapshotSync(baseEnv) {
    if (cachedLoginShellEnvSnapshot !== undefined)
        return cachedLoginShellEnvSnapshot;
    if (process.platform === "win32" || process.env.VITEST) {
        cachedLoginShellEnvSnapshot = null;
        return cachedLoginShellEnvSnapshot;
    }
    const shellPath = resolveShellPathForLoginEnv(baseEnv);
    if (!shellPath) {
        cachedLoginShellEnvSnapshot = null;
        return cachedLoginShellEnvSnapshot;
    }
    try {
        // 兼容非 Desktop 的同步 createLocalServices 入口。这里即使走兼容 fallback 也只采集一次完整 snapshot。
        const output = execFileSync(shellPath, buildLoginShellArgs(shellPath), buildLoginShellExecutionOptions(baseEnv));
        cachedLoginShellEnvSnapshot = extractCapturedEnvSnapshot(output);
    }
    catch {
        cachedLoginShellEnvSnapshot = null;
    }
    return cachedLoginShellEnvSnapshot;
}
//# sourceMappingURL=runtimeLoginShellEnvCapture.js.map