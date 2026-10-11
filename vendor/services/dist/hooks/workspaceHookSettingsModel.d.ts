import type { Hook, HookEvent, SettingsDirectoryLocation } from "@zcode/shared";
import { type WorkspaceHookBundleSnapshotData, type WorkspaceHookRuntimeRoot, type WorkspaceHookSourceInput, type WorkspaceHooksConfig } from "@zcode/shared/workspace-hook-discovery";
export interface LegacyHookDefinition {
    type?: "command" | "process" | string;
    command?: string;
    args?: string[];
    async?: boolean;
    enabled?: boolean;
    shell?: true | string;
    statusMessage?: string;
    timeout?: number;
    timeoutMs?: number;
    [key: string]: unknown;
}
interface LegacyHookMatcher {
    matcher?: string;
    hooks?: LegacyHookDefinition[];
}
export interface LegacyHooksConfig {
    hooks?: Partial<Record<string, LegacyHookMatcher[]>>;
    [key: string]: unknown;
}
export declare function fromProjectSnapshot(input: {
    sources: WorkspaceHookSourceInput[];
    snapshot: WorkspaceHookBundleSnapshotData | undefined;
    workspaceIdentity: string;
    workspacePath: string;
    persistentTrustedDigests?: ReadonlySet<string>;
}): Hook[];
export declare function fromUserZCodeSource(input: {
    source: WorkspaceHookSourceInput | undefined;
    runtimeRoot: WorkspaceHookRuntimeRoot;
    workspacePath: string;
    location: SettingsDirectoryLocation;
}): Hook[];
export declare function fromLegacyHooksConfig(input: {
    legacyConfig: LegacyHooksConfig | null;
    location: SettingsDirectoryLocation;
    isHookEvent: (value: string) => value is HookEvent;
}): Hook[];
export declare function toZCodeHooksEvents(hooks: Hook[]): WorkspaceHooksConfig["events"];
export declare function resolveNextRootEnabled(existingEnabled: boolean | undefined, hooks: Hook[]): boolean | undefined;
export {};
//# sourceMappingURL=workspaceHookSettingsModel.d.ts.map