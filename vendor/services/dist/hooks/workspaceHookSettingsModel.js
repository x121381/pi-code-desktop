import { dirname } from "node:path";
import { resolveWorkspaceHookEntries, } from "@zcode/shared/workspace-hook-discovery";
function isHookType(value) {
    return value === "command" || value === "process";
}
function getCustomHookFields(hook) {
    const { type: _type, command: _command, args: _args, async: _async, enabled: _enabled, shell: _shell, statusMessage: _statusMessage, timeout: _timeout, timeoutMs: _timeoutMs, ...custom } = hook;
    return Object.keys(custom).length > 0 ? custom : undefined;
}
function resolveWritableDeclarationEnabled(hook) {
    const configured = hook.configuredState;
    if (!configured)
        return hook.enabled;
    return hook.enabled === configured.configuredEnabled
        ? configured.declarationEnabled
        : hook.enabled;
}
function getWritableHook(hook) {
    const common = {
        ...hook.custom,
        type: hook.type,
        command: hook.command,
        enabled: resolveWritableDeclarationEnabled(hook),
        ...(hook.statusMessage ? { statusMessage: hook.statusMessage } : {}),
    };
    if (hook.type === "command") {
        return {
            ...common,
            ...(hook.async ? { async: true } : {}),
            ...(hook.shell ? { shell: hook.shell } : {}),
            ...(hook.timeout ? { timeout: hook.timeout } : {}),
        };
    }
    return {
        ...common,
        ...(hook.args && hook.args.length > 0 ? { args: hook.args } : {}),
        ...(hook.timeout ? { timeoutMs: hook.timeout * 1000 } : {}),
    };
}
function getRawHook(source, entry) {
    const hook = source.hooks.events?.[entry.event]?.[entry.matcherIndex]?.hooks[entry.hookIndex];
    if (!hook)
        throw new Error(`Workspace Hook provenance is incomplete for ${entry.reviewItemId}`);
    return hook;
}
function toConfiguredState(entry, sourcePath) {
    return {
        sourceRootEnabled: entry.sourceRootEnabled,
        declarationEnabled: entry.declarationEnabled,
        runtimeHooksEnabled: entry.runtimeHooksEnabled,
        configuredEnabled: entry.configuredEnabled,
        sourcePath,
    };
}
function toHook(input) {
    const raw = getRawHook(input.source, input.entry);
    const configuredState = toConfiguredState(input.entry, input.source.canonicalPath);
    const workspaceHook = input.workspaceHook
        ? {
            ...configuredState,
            reviewItemId: input.entry.reviewItemId,
            sourceFileIndex: input.entry.sourceFileIndex,
            ...input.workspaceHook,
        }
        : undefined;
    return {
        id: input.id,
        event: input.entry.event,
        matcher: input.entry.matcher ?? undefined,
        type: input.entry.type,
        command: input.entry.command,
        ...(input.entry.type === "process" ? { args: [...(input.entry.args ?? [])] } : {}),
        ...(input.entry.type === "command" && input.entry.async !== undefined
            ? { async: input.entry.async }
            : {}),
        ...(input.entry.type === "command" && input.entry.shell !== undefined
            ? { shell: input.entry.shell }
            : {}),
        ...(input.entry.statusMessage ? { statusMessage: input.entry.statusMessage } : {}),
        timeout: (raw.type === "command" ? raw.timeout : undefined) ??
            (raw.timeoutMs !== undefined ? Math.round(raw.timeoutMs) / 1000 : undefined),
        enabled: input.entry.configuredEnabled,
        editable: input.entry.editable,
        configuredState,
        ...(workspaceHook ? { workspaceHook } : {}),
        custom: getCustomHookFields(raw),
        location: input.location,
    };
}
export function fromProjectSnapshot(input) {
    const snapshot = input.snapshot;
    if (!snapshot)
        return [];
    return snapshot.hooks.map((entry) => {
        const source = input.sources[entry.sourceFileIndex];
        if (!source)
            throw new Error(`Workspace Hook source is missing for ${entry.reviewItemId}`);
        return toHook({
            entry,
            source,
            id: entry.reviewItemId,
            location: {
                source: "zcode",
                scope: "project",
                directoryPath: dirname(source.canonicalPath),
                projectPath: input.workspacePath,
            },
            workspaceHook: {
                workspaceIdentity: input.workspaceIdentity,
                bundleDigest: snapshot.bundleDigest,
                hookDeclarationDigest: entry.hookDeclarationDigest,
                trustState: input.persistentTrustedDigests?.has(entry.hookDeclarationDigest)
                    ? "trusted_persistent"
                    : "pending_trust",
            },
        });
    });
}
export function fromUserZCodeSource(input) {
    if (!input.source)
        return [];
    return resolveWorkspaceHookEntries({
        workspacePath: input.workspacePath,
        sources: [input.source],
        runtimeRoot: input.runtimeRoot,
    }).map((entry, index) => toHook({
        entry,
        source: input.source,
        id: `hook-zcode-user-${index}`,
        location: input.location,
    }));
}
export function fromLegacyHooksConfig(input) {
    const hooks = [];
    let idCounter = 0;
    for (const [eventName, matchers] of Object.entries(input.legacyConfig?.hooks ?? {})) {
        if (!input.isHookEvent(eventName) || !Array.isArray(matchers))
            continue;
        for (const matcher of matchers) {
            for (const hook of matcher.hooks ?? []) {
                if (!isHookType(hook.type) || !hook.command)
                    continue;
                hooks.push({
                    id: `hook-${input.location.source}-${input.location.scope}-${idCounter++}`,
                    event: eventName,
                    matcher: matcher.matcher,
                    type: hook.type,
                    command: hook.command,
                    ...(hook.type === "process" ? { args: hook.args ?? [] } : {}),
                    ...(hook.async !== undefined ? { async: hook.async } : {}),
                    ...(hook.shell !== undefined ? { shell: hook.shell } : {}),
                    ...(hook.statusMessage ? { statusMessage: hook.statusMessage } : {}),
                    timeout: hook.timeout ??
                        (hook.timeoutMs !== undefined ? Math.round(hook.timeoutMs / 1000) : undefined),
                    enabled: false,
                    editable: false,
                    location: input.location,
                });
            }
        }
    }
    return hooks;
}
export function toZCodeHooksEvents(hooks) {
    const events = {};
    for (const hook of hooks) {
        const eventMatchers = events[hook.event] ?? [];
        let matcher = eventMatchers.find((item) => item.matcher === hook.matcher);
        if (!matcher) {
            matcher = {
                ...(hook.matcher ? { matcher: hook.matcher } : {}),
                hooks: [],
            };
            eventMatchers.push(matcher);
            events[hook.event] = eventMatchers;
        }
        matcher.hooks.push(getWritableHook(hook));
    }
    return events;
}
export function resolveNextRootEnabled(existingEnabled, hooks) {
    if (hooks.some((hook) => hook.enabled &&
        (!hook.configuredState || hook.enabled !== hook.configuredState.configuredEnabled))) {
        return true;
    }
    return existingEnabled;
}
//# sourceMappingURL=workspaceHookSettingsModel.js.map