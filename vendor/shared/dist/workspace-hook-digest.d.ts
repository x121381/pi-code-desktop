import { WORKSPACE_HOOK_DIGEST_SCHEMA_VERSION, type WorkspaceHookConfigFileKind, type WorkspaceHookDefinition, type WorkspaceHookEventName, type WorkspaceHookRuntimeRoot, type WorkspaceHookSourceInput } from "./workspace-hook-config.js";
export interface CanonicalWorkspaceHookEntryData {
    reviewItemId: string;
    event: WorkspaceHookEventName;
    matcherIndex: number;
    hookIndex: number;
    sourceFileIndex: number;
    sourceRelativePath: string;
    matcher: string | null;
    type: "command" | "process";
    command: string;
    args?: string[];
    async?: boolean;
    shell?: true | string;
    resolvedTimeoutMs: number;
    resolvedMaxOutputBytes: number;
    statusMessage?: string;
    sourceRootEnabled: boolean;
    declarationEnabled: boolean;
    runtimeHooksEnabled: boolean;
    configuredEnabled: boolean;
    editable: boolean;
    declarationDigestAlgorithm: "sha256";
    hookDeclarationDigest: string;
}
export interface WorkspaceHookBundleSnapshotData {
    schemaVersion: typeof WORKSPACE_HOOK_DIGEST_SCHEMA_VERSION;
    workspaceIdentity: string;
    discoveredAt: string;
    sourceFiles: Array<{
        canonicalPath: string;
        baseDir: string;
        discoveryOrder: number;
        configFileKind: WorkspaceHookConfigFileKind;
        explicitProjectConfig: boolean;
        editable: boolean;
        hooksRoot: {
            enabled?: boolean;
            timeoutMs?: number;
            maxOutputBytes?: number;
        };
    }>;
    hooks: CanonicalWorkspaceHookEntryData[];
    digestAlgorithm: "sha256";
    bundleDigest: string;
}
export declare function resolveWorkspaceHookEntries(input: {
    workspacePath: string;
    sources: readonly WorkspaceHookSourceInput[];
    runtimeRoot: WorkspaceHookRuntimeRoot;
}): CanonicalWorkspaceHookEntryData[];
export declare function buildWorkspaceHookBundleSnapshot(input: {
    workspaceIdentity: string;
    workspacePath: string;
    sources: readonly WorkspaceHookSourceInput[];
    runtimeRoot: WorkspaceHookRuntimeRoot;
    discoveredAt?: string;
}): WorkspaceHookBundleSnapshotData | undefined;
export declare function createWorkspaceHookDeclarationDigest(input: {
    sourceRelativePath: string;
    sourceDiscoveryOrder: number;
    event: WorkspaceHookEventName;
    matcher: string | null;
    matcherIndex: number;
    hookIndex: number;
    hook: WorkspaceHookDefinition;
    defaultTimeoutMs: number;
    resolvedMaxOutputBytes: number;
}): string;
//# sourceMappingURL=workspace-hook-digest.d.ts.map