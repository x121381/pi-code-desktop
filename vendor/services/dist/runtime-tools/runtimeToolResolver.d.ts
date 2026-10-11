import { type RuntimeToolId } from "@zcode/shared";
export declare function prependPathEntries(currentPath: string | undefined, entries: readonly string[]): string;
export declare function appendPathEntries(currentPath: string | undefined, entries: readonly string[]): string;
export declare function findRuntimeToolBinary(toolId: RuntimeToolId, env?: NodeJS.ProcessEnv): string | null;
export declare function buildRuntimeToolEnvPatch(toolIds: readonly RuntimeToolId[], baseEnv?: NodeJS.ProcessEnv): Record<string, string>;
//# sourceMappingURL=runtimeToolResolver.d.ts.map