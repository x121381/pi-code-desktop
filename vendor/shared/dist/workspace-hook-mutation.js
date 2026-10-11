import { open, mkdir, readFile, rename, rm } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { createWorkspaceHookDeclarationDigest } from "./workspace-hook-digest.js";
import { workspaceHooksConfigSchema, } from "./workspace-hook-config.js";
export class WorkspaceHookMutationError extends Error {
    code;
    constructor(code, message, options) {
        super(message, options);
        this.code = code;
        this.name = "WorkspaceHookMutationError";
    }
}
/**
 * Workspace Hook settings writes must never expose a partially-written config to Runtime watchers.
 * The temp file is written in the destination directory, flushed, closed, then atomically renamed.
 */
export async function atomicWriteWorkspaceHookConfig(filePath, value, options = {}) {
    const directory = dirname(filePath);
    await mkdir(directory, { recursive: true });
    const tempPath = resolve(directory, `.${basename(filePath)}.${process.pid}.${Date.now()}.${Math.random().toString(16).slice(2)}.tmp`);
    let handle;
    try {
        handle = await open(tempPath, "wx", 0o600);
        await handle.writeFile(`${JSON.stringify(value, null, 2)}\n`, "utf8");
        await handle.sync();
        await handle.close();
        handle = undefined;
        await options.beforeRename?.();
        await rename(tempPath, filePath);
    }
    catch (error) {
        await handle?.close().catch(() => undefined);
        await rm(tempPath, { force: true }).catch(() => undefined);
        throw error;
    }
}
export async function writeWorkspaceHookConfiguredToggle(input) {
    const configPath = resolve(input.configPath);
    const entry = input.snapshot.hooks.find((item) => item.reviewItemId === input.reviewItemId);
    const source = entry ? input.snapshot.sourceFiles[entry.sourceFileIndex] : undefined;
    if (!entry ||
        !entry.editable ||
        !source?.editable ||
        source.configFileKind !== ".zcode/config.json" ||
        resolve(source.canonicalPath) !== configPath) {
        throw mismatch("Workspace Hook toggle target is not the current editable project config");
    }
    let raw;
    try {
        raw = JSON.parse(await readFile(configPath, "utf8"));
    }
    catch (error) {
        // 此处是 readFile/JSON.parse 失败，不能报成 config_write_failed：
        // 用户据此反复重试「写入」而真实原因是配置读不出来或不是合法 JSON。
        throw new WorkspaceHookMutationError("workspace_hooks_config_unreadable", "Workspace Hook config could not be read", { cause: error });
    }
    if (!isRecord(raw))
        throw mismatch("Workspace Hook config root is not an object");
    const parsedHooks = workspaceHooksConfigSchema.safeParse(raw.hooks);
    if (!parsedHooks.success)
        throw mismatch("Workspace Hook config no longer matches its schema");
    const rawHooks = raw.hooks;
    if (!isRecord(rawHooks))
        throw mismatch("Workspace Hook config has no hooks object");
    const events = rawHooks.events;
    if (!isRecord(events))
        throw mismatch("Workspace Hook config has no events object");
    const matchers = events[entry.event];
    if (!Array.isArray(matchers))
        throw mismatch("Workspace Hook event no longer exists");
    const matcher = matchers[entry.matcherIndex];
    if (!isRecord(matcher) || !Array.isArray(matcher.hooks)) {
        throw mismatch("Workspace Hook matcher no longer exists");
    }
    const rawDeclaration = matcher.hooks[entry.hookIndex];
    if (!isRecord(rawDeclaration))
        throw mismatch("Workspace Hook declaration no longer exists");
    const parsedDeclaration = getParsedDeclaration(parsedHooks.data.events?.[entry.event]?.[entry.matcherIndex]?.hooks[entry.hookIndex]);
    if (!parsedDeclaration)
        throw mismatch("Workspace Hook declaration no longer matches its schema");
    // 此处刻意把 entry 自身的 resolvedTimeoutMs / resolvedMaxOutputBytes 回填为 digest 的
    // "default"，目的是校验「磁盘上的声明与 review 时所见一致」——即 source/command/event/
    // matcher/hookIndex 等声明本体字段在 review 之后没有被第三方改动。
    // 已知边界：当仅 root 级默认值（hooks.timeoutMs / hooks.maxOutputBytes）在磁盘上变化时，
    // entry.resolvedTimeoutMs 仍是 review 时解析到的旧值，回填后重算出的 digest 必然等于
    // entry.hookDeclarationDigest，因此本守卫不会捕获 root default 的变化（尽管
    // resolvedTimeoutMs 参与 digest 恰恰是为了让 root 变化能触发「声明变更→重新 review」）。
    // Admission 侧不受影响：hook 执行评估使用的是当前 snapshot，不依赖这里的 digest 比较，
    // 不存在提权风险。
    const currentDigest = createWorkspaceHookDeclarationDigest({
        sourceRelativePath: entry.sourceRelativePath,
        sourceDiscoveryOrder: source.discoveryOrder,
        event: entry.event,
        matcher: parsedHooks.data.events?.[entry.event]?.[entry.matcherIndex]?.matcher ?? null,
        matcherIndex: entry.matcherIndex,
        hookIndex: entry.hookIndex,
        hook: parsedDeclaration,
        defaultTimeoutMs: entry.resolvedTimeoutMs,
        resolvedMaxOutputBytes: entry.resolvedMaxOutputBytes,
    });
    if (currentDigest !== entry.hookDeclarationDigest) {
        throw mismatch("Workspace Hook declaration changed after review");
    }
    rawDeclaration.enabled = input.enabled;
    await atomicWriteWorkspaceHookConfig(configPath, raw, input.writeOptions);
}
function getParsedDeclaration(value) {
    if (!value || typeof value !== "object")
        return undefined;
    return value;
}
function mismatch(message) {
    return new WorkspaceHookMutationError("workspace_hooks_snapshot_mismatch", message);
}
function isRecord(value) {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
//# sourceMappingURL=workspace-hook-mutation.js.map