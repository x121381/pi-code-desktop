import { z } from "zod";
export declare const WORKSPACE_HOOK_DIGEST_SCHEMA_VERSION: 1;
export declare const DEFAULT_WORKSPACE_HOOK_TIMEOUT_MS = 60000;
export declare const DEFAULT_WORKSPACE_HOOK_MAX_OUTPUT_BYTES = 32768;
export declare const WORKSPACE_HOOK_EVENT_NAMES: readonly ["SessionStart", "UserPromptSubmit", "PreToolUse", "PermissionRequest", "PostToolUse", "PostToolUseFailure", "Stop"];
export type WorkspaceHookEventName = (typeof WORKSPACE_HOOK_EVENT_NAMES)[number];
export type WorkspaceHookConfigFileKind = "zcode.json" | ".zcode/config.json" | "explicit";
export declare const workspaceHookProcessConfigSchema: z.ZodObject<{
    type: z.ZodLiteral<"process">;
    command: z.ZodString;
    enabled: z.ZodOptional<z.ZodBoolean>;
    args: z.ZodOptional<z.ZodArray<z.ZodString>>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
    statusMessage: z.ZodOptional<z.ZodString>;
}, z.core.$loose>;
export declare const workspaceHookCommandConfigSchema: z.ZodObject<{
    type: z.ZodLiteral<"command">;
    command: z.ZodString;
    enabled: z.ZodOptional<z.ZodBoolean>;
    async: z.ZodOptional<z.ZodBoolean>;
    shell: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<true>, z.ZodString]>>;
    timeout: z.ZodOptional<z.ZodNumber>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
    statusMessage: z.ZodOptional<z.ZodString>;
}, z.core.$loose>;
export declare const workspaceHookMatcherConfigSchema: z.ZodObject<{
    matcher: z.ZodOptional<z.ZodString>;
    hooks: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"process">;
        command: z.ZodString;
        enabled: z.ZodOptional<z.ZodBoolean>;
        args: z.ZodOptional<z.ZodArray<z.ZodString>>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        statusMessage: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>, z.ZodObject<{
        type: z.ZodLiteral<"command">;
        command: z.ZodString;
        enabled: z.ZodOptional<z.ZodBoolean>;
        async: z.ZodOptional<z.ZodBoolean>;
        shell: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<true>, z.ZodString]>>;
        timeout: z.ZodOptional<z.ZodNumber>;
        timeoutMs: z.ZodOptional<z.ZodNumber>;
        statusMessage: z.ZodOptional<z.ZodString>;
    }, z.core.$loose>], "type">>;
}, z.core.$strict>;
export declare const workspaceHooksConfigSchema: z.ZodObject<{
    enabled: z.ZodOptional<z.ZodBoolean>;
    timeoutMs: z.ZodOptional<z.ZodNumber>;
    maxOutputBytes: z.ZodOptional<z.ZodNumber>;
    events: z.ZodOptional<z.ZodObject<{
        SessionStart: z.ZodOptional<z.ZodArray<z.ZodObject<{
            matcher: z.ZodOptional<z.ZodString>;
            hooks: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                type: z.ZodLiteral<"process">;
                command: z.ZodString;
                enabled: z.ZodOptional<z.ZodBoolean>;
                args: z.ZodOptional<z.ZodArray<z.ZodString>>;
                timeoutMs: z.ZodOptional<z.ZodNumber>;
                statusMessage: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"command">;
                command: z.ZodString;
                enabled: z.ZodOptional<z.ZodBoolean>;
                async: z.ZodOptional<z.ZodBoolean>;
                shell: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<true>, z.ZodString]>>;
                timeout: z.ZodOptional<z.ZodNumber>;
                timeoutMs: z.ZodOptional<z.ZodNumber>;
                statusMessage: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>], "type">>;
        }, z.core.$strict>>>;
        UserPromptSubmit: z.ZodOptional<z.ZodArray<z.ZodObject<{
            matcher: z.ZodOptional<z.ZodString>;
            hooks: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                type: z.ZodLiteral<"process">;
                command: z.ZodString;
                enabled: z.ZodOptional<z.ZodBoolean>;
                args: z.ZodOptional<z.ZodArray<z.ZodString>>;
                timeoutMs: z.ZodOptional<z.ZodNumber>;
                statusMessage: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"command">;
                command: z.ZodString;
                enabled: z.ZodOptional<z.ZodBoolean>;
                async: z.ZodOptional<z.ZodBoolean>;
                shell: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<true>, z.ZodString]>>;
                timeout: z.ZodOptional<z.ZodNumber>;
                timeoutMs: z.ZodOptional<z.ZodNumber>;
                statusMessage: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>], "type">>;
        }, z.core.$strict>>>;
        PreToolUse: z.ZodOptional<z.ZodArray<z.ZodObject<{
            matcher: z.ZodOptional<z.ZodString>;
            hooks: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                type: z.ZodLiteral<"process">;
                command: z.ZodString;
                enabled: z.ZodOptional<z.ZodBoolean>;
                args: z.ZodOptional<z.ZodArray<z.ZodString>>;
                timeoutMs: z.ZodOptional<z.ZodNumber>;
                statusMessage: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"command">;
                command: z.ZodString;
                enabled: z.ZodOptional<z.ZodBoolean>;
                async: z.ZodOptional<z.ZodBoolean>;
                shell: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<true>, z.ZodString]>>;
                timeout: z.ZodOptional<z.ZodNumber>;
                timeoutMs: z.ZodOptional<z.ZodNumber>;
                statusMessage: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>], "type">>;
        }, z.core.$strict>>>;
        PermissionRequest: z.ZodOptional<z.ZodArray<z.ZodObject<{
            matcher: z.ZodOptional<z.ZodString>;
            hooks: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                type: z.ZodLiteral<"process">;
                command: z.ZodString;
                enabled: z.ZodOptional<z.ZodBoolean>;
                args: z.ZodOptional<z.ZodArray<z.ZodString>>;
                timeoutMs: z.ZodOptional<z.ZodNumber>;
                statusMessage: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"command">;
                command: z.ZodString;
                enabled: z.ZodOptional<z.ZodBoolean>;
                async: z.ZodOptional<z.ZodBoolean>;
                shell: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<true>, z.ZodString]>>;
                timeout: z.ZodOptional<z.ZodNumber>;
                timeoutMs: z.ZodOptional<z.ZodNumber>;
                statusMessage: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>], "type">>;
        }, z.core.$strict>>>;
        PostToolUse: z.ZodOptional<z.ZodArray<z.ZodObject<{
            matcher: z.ZodOptional<z.ZodString>;
            hooks: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                type: z.ZodLiteral<"process">;
                command: z.ZodString;
                enabled: z.ZodOptional<z.ZodBoolean>;
                args: z.ZodOptional<z.ZodArray<z.ZodString>>;
                timeoutMs: z.ZodOptional<z.ZodNumber>;
                statusMessage: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"command">;
                command: z.ZodString;
                enabled: z.ZodOptional<z.ZodBoolean>;
                async: z.ZodOptional<z.ZodBoolean>;
                shell: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<true>, z.ZodString]>>;
                timeout: z.ZodOptional<z.ZodNumber>;
                timeoutMs: z.ZodOptional<z.ZodNumber>;
                statusMessage: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>], "type">>;
        }, z.core.$strict>>>;
        PostToolUseFailure: z.ZodOptional<z.ZodArray<z.ZodObject<{
            matcher: z.ZodOptional<z.ZodString>;
            hooks: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                type: z.ZodLiteral<"process">;
                command: z.ZodString;
                enabled: z.ZodOptional<z.ZodBoolean>;
                args: z.ZodOptional<z.ZodArray<z.ZodString>>;
                timeoutMs: z.ZodOptional<z.ZodNumber>;
                statusMessage: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"command">;
                command: z.ZodString;
                enabled: z.ZodOptional<z.ZodBoolean>;
                async: z.ZodOptional<z.ZodBoolean>;
                shell: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<true>, z.ZodString]>>;
                timeout: z.ZodOptional<z.ZodNumber>;
                timeoutMs: z.ZodOptional<z.ZodNumber>;
                statusMessage: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>], "type">>;
        }, z.core.$strict>>>;
        Stop: z.ZodOptional<z.ZodArray<z.ZodObject<{
            matcher: z.ZodOptional<z.ZodString>;
            hooks: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
                type: z.ZodLiteral<"process">;
                command: z.ZodString;
                enabled: z.ZodOptional<z.ZodBoolean>;
                args: z.ZodOptional<z.ZodArray<z.ZodString>>;
                timeoutMs: z.ZodOptional<z.ZodNumber>;
                statusMessage: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>, z.ZodObject<{
                type: z.ZodLiteral<"command">;
                command: z.ZodString;
                enabled: z.ZodOptional<z.ZodBoolean>;
                async: z.ZodOptional<z.ZodBoolean>;
                shell: z.ZodOptional<z.ZodUnion<readonly [z.ZodLiteral<true>, z.ZodString]>>;
                timeout: z.ZodOptional<z.ZodNumber>;
                timeoutMs: z.ZodOptional<z.ZodNumber>;
                statusMessage: z.ZodOptional<z.ZodString>;
            }, z.core.$loose>], "type">>;
        }, z.core.$strict>>>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export type WorkspaceHookDefinition = z.infer<typeof workspaceHookCommandConfigSchema> | z.infer<typeof workspaceHookProcessConfigSchema>;
export type WorkspaceHooksConfig = z.infer<typeof workspaceHooksConfigSchema>;
export interface WorkspaceHookSourceInput {
    canonicalPath: string;
    baseDir: string;
    discoveryOrder: number;
    configFileKind: WorkspaceHookConfigFileKind;
    explicitProjectConfig: boolean;
    editable: boolean;
    hooks: WorkspaceHooksConfig;
}
export interface WorkspaceHookRuntimeRoot {
    enabled: boolean;
    timeoutMs: number;
    maxOutputBytes: number;
}
export interface WorkspaceHookConfigPathRef {
    path: string;
    explicitProjectConfig: boolean;
}
export interface WorkspaceHookSourceReadError {
    path: string;
    error: unknown;
}
export declare function resolveWorkspaceHookTimeoutMs(hook: Pick<WorkspaceHookDefinition, "type" | "timeoutMs"> & {
    timeout?: number;
}, defaultTimeoutMs: number): number;
export declare function resolveWorkspaceHookMaxOutputBytes(maxOutputBytes: number): number;
/** Mirrors config-merger's hooks root semantics without materializing any callback. */
export declare function resolveWorkspaceHookRuntimeRoot(roots: readonly (Partial<Pick<WorkspaceHooksConfig, "enabled" | "timeoutMs" | "maxOutputBytes">> | undefined)[]): WorkspaceHookRuntimeRoot;
export declare function resolveWorkspaceHookConfiguredGates(input: {
    sourceEnabled?: boolean;
    declarationEnabled?: boolean;
    runtimeHooksEnabled: boolean;
}): {
    sourceRootEnabled: boolean;
    declarationEnabled: boolean;
    runtimeHooksEnabled: boolean;
    configuredEnabled: boolean;
};
export declare function discoverWorkspaceHookConfigPaths(input: {
    workingDirectory: string;
    explicitProjectConfigPath?: string;
}): WorkspaceHookConfigPathRef[];
export declare function createWorkspaceHookSourceInput(input: {
    path: string;
    workingDirectory: string;
    hooks: WorkspaceHooksConfig;
    discoveryOrder: number;
    explicitProjectConfig?: boolean;
}): WorkspaceHookSourceInput;
export declare function readWorkspaceHookProjectSources(input: {
    workingDirectory: string;
    explicitProjectConfigPath?: string;
}): Promise<{
    sources: WorkspaceHookSourceInput[];
    errors: WorkspaceHookSourceReadError[];
}>;
//# sourceMappingURL=workspace-hook-config.d.ts.map