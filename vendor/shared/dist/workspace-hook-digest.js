import { createHash } from "node:crypto";
import { basename, relative, resolve } from "node:path";
import { WORKSPACE_HOOK_DIGEST_SCHEMA_VERSION, WORKSPACE_HOOK_EVENT_NAMES, resolveWorkspaceHookConfiguredGates, resolveWorkspaceHookTimeoutMs, } from "./workspace-hook-config.js";
export function resolveWorkspaceHookEntries(input) {
    const entries = [];
    for (const [sourceFileIndex, source] of input.sources.entries()) {
        const sourceRelativePath = normalizeRelativeSourcePath(input.workspacePath, source.canonicalPath);
        for (const event of WORKSPACE_HOOK_EVENT_NAMES) {
            for (const [matcherIndex, matcher] of (source.hooks.events?.[event] ?? []).entries()) {
                for (const [hookIndex, hook] of matcher.hooks.entries()) {
                    const gates = resolveWorkspaceHookConfiguredGates({
                        sourceEnabled: source.hooks.enabled,
                        declarationEnabled: hook.enabled,
                        runtimeHooksEnabled: input.runtimeRoot.enabled,
                    });
                    const resolvedTimeoutMs = resolveWorkspaceHookTimeoutMs(hook, input.runtimeRoot.timeoutMs);
                    const common = {
                        reviewItemId: `workspace-hook-${sourceFileIndex}-${event}-${matcherIndex}-${hookIndex}`,
                        event,
                        matcherIndex,
                        hookIndex,
                        sourceFileIndex,
                        sourceRelativePath,
                        matcher: matcher.matcher ?? null,
                        command: hook.command,
                        resolvedTimeoutMs,
                        resolvedMaxOutputBytes: input.runtimeRoot.maxOutputBytes,
                        ...(hook.statusMessage ? { statusMessage: hook.statusMessage } : {}),
                        ...gates,
                        editable: source.editable,
                        declarationDigestAlgorithm: "sha256",
                        hookDeclarationDigest: createWorkspaceHookDeclarationDigest({
                            sourceRelativePath,
                            sourceDiscoveryOrder: source.discoveryOrder,
                            event,
                            matcher: matcher.matcher ?? null,
                            matcherIndex,
                            hookIndex,
                            hook,
                            defaultTimeoutMs: input.runtimeRoot.timeoutMs,
                            resolvedMaxOutputBytes: input.runtimeRoot.maxOutputBytes,
                        }),
                    };
                    entries.push(hook.type === "process"
                        ? {
                            ...common,
                            type: "process",
                            ...(hook.args && hook.args.length > 0 ? { args: [...hook.args] } : {}),
                        }
                        : {
                            ...common,
                            type: "command",
                            ...(hook.async === true ? { async: true } : {}),
                            ...(hook.shell !== undefined ? { shell: hook.shell } : {}),
                        });
                }
            }
        }
    }
    return entries;
}
export function buildWorkspaceHookBundleSnapshot(input) {
    const hooks = resolveWorkspaceHookEntries(input);
    if (hooks.length === 0)
        return undefined;
    const sourceFiles = input.sources.map((source) => ({
        canonicalPath: source.canonicalPath,
        baseDir: source.baseDir,
        discoveryOrder: source.discoveryOrder,
        configFileKind: source.configFileKind,
        explicitProjectConfig: source.explicitProjectConfig,
        editable: source.editable,
        hooksRoot: {
            ...(source.hooks.enabled !== undefined ? { enabled: source.hooks.enabled } : {}),
            ...(source.hooks.timeoutMs !== undefined ? { timeoutMs: source.hooks.timeoutMs } : {}),
            ...(source.hooks.maxOutputBytes !== undefined
                ? { maxOutputBytes: source.hooks.maxOutputBytes }
                : {}),
        },
    }));
    const bundlePayload = [
        "workspace-hook-bundle",
        WORKSPACE_HOOK_DIGEST_SCHEMA_VERSION,
        input.sources.map((source) => [
            normalizeRelativeSourcePath(input.workspacePath, source.canonicalPath),
            source.discoveryOrder,
            source.configFileKind,
            source.explicitProjectConfig,
            canonicalOptional(source.hooks.enabled),
            canonicalOptional(source.hooks.timeoutMs),
            canonicalOptional(source.hooks.maxOutputBytes),
        ]),
        hooks.map((hook) => [
            hook.hookDeclarationDigest,
            hook.sourceRootEnabled,
            hook.declarationEnabled,
            hook.runtimeHooksEnabled,
            hook.configuredEnabled,
        ]),
    ];
    return deepFreeze({
        schemaVersion: WORKSPACE_HOOK_DIGEST_SCHEMA_VERSION,
        workspaceIdentity: input.workspaceIdentity,
        discoveredAt: input.discoveredAt ?? new Date().toISOString(),
        sourceFiles,
        hooks,
        digestAlgorithm: "sha256",
        bundleDigest: sha256(bundlePayload),
    });
}
export function createWorkspaceHookDeclarationDigest(input) {
    return sha256(canonicalDeclarationPayload({
        ...input,
        resolvedTimeoutMs: resolveWorkspaceHookTimeoutMs(input.hook, input.defaultTimeoutMs),
    }));
}
function canonicalDeclarationPayload(input) {
    const execution = input.hook.type === "process"
        ? ["process", input.hook.command, [...(input.hook.args ?? [])]]
        : [
            "command",
            input.hook.command,
            input.hook.async === true,
            input.hook.shell === undefined
                ? ["unset"]
                : input.hook.shell === true
                    ? ["true"]
                    : ["string", input.hook.shell],
        ];
    return [
        "workspace-hook-declaration",
        WORKSPACE_HOOK_DIGEST_SCHEMA_VERSION,
        input.sourceRelativePath,
        input.sourceDiscoveryOrder,
        input.event,
        input.matcher,
        input.matcherIndex,
        input.hookIndex,
        execution,
        input.resolvedTimeoutMs,
        input.resolvedMaxOutputBytes,
    ];
}
function normalizeRelativeSourcePath(workspacePath, sourcePath) {
    const value = relative(resolve(workspacePath), resolve(sourcePath)).replaceAll("\\", "/");
    return value || basename(sourcePath);
}
function canonicalOptional(value) {
    return value === undefined ? ["unset"] : ["set", value];
}
function sha256(value) {
    return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}
function deepFreeze(value) {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
        Object.freeze(value);
        for (const nested of Object.values(value))
            deepFreeze(nested);
    }
    return value;
}
//# sourceMappingURL=workspace-hook-digest.js.map