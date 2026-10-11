import type { ZCodeConfigOption, ZCodePlanStep, ZCodeProvider, ZCodeTaskModeInfo } from "@zcode/shared";
interface PlanToolLike {
    title?: string;
    kind?: string;
    input?: unknown;
    output?: unknown;
    raw?: unknown;
}
interface ParsedPlanTool {
    summary: string | null;
    steps: ZCodePlanStep[];
    toolName: string | null;
}
export declare function getModeOptionFromConfigOptions(configOptions: ZCodeConfigOption[]): ZCodeConfigOption | null;
export declare function getCurrentModeIdFromConfigOptions(configOptions: ZCodeConfigOption[]): string | null;
/**
 * Resolve provider-native modeId from semantic modeId.
 * This is the UI counterpart of resolveProviderModeIdFromConfigOptions in service layer.
 *
 * @param configOptions - The config options array
 * @param semanticModeId - The semantic mode ID (e.g., "default", "plan")
 * @returns The provider-native mode ID, or the original semanticModeId if not found
 */
export declare function resolveProviderNativeModeIdFromSemantic(configOptions: ZCodeConfigOption[], semanticModeId: string, provider?: ZCodeProvider): string;
export declare function getAvailableModesFromConfigOptions(configOptions: ZCodeConfigOption[]): ZCodeTaskModeInfo[];
export declare function getModeLabelFromConfigOptions(configOptions: ZCodeConfigOption[], modeId: string | null): string | null;
export declare function getPlanToolPayload(tool: PlanToolLike): ParsedPlanTool | null;
export {};
//# sourceMappingURL=planModeTool.d.ts.map