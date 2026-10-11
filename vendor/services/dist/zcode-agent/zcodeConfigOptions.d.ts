import type { ZCodeConfigOption, ModelSelection, ZCodeSessionMode, ZCodeSessionSettingsState, ZCodeSessionStateSnapshot, ZCodeTaskModeInfo } from "@zcode/shared";
export declare const MODEL_CONFIG_ID = "model";
export declare const MODE_CONFIG_ID = "mode";
export declare const THOUGHT_LEVEL_CONFIG_ID = "thought_level";
export declare function formatModelPickerValue(ref: ModelSelection | undefined): string;
export declare function formatTaskMetaModelSelectionFromSnapshot(snapshot: Pick<ZCodeSessionStateSnapshot, "messages" | "settings">): string;
export declare function normalizeAvailableZCodeMode(mode: ZCodeSessionMode): string;
export declare function getZCodeAgentAvailableModes(): ZCodeTaskModeInfo[];
export declare function settingsToConfigOptions(settings: ZCodeSessionSettingsState): ZCodeConfigOption[];
//# sourceMappingURL=zcodeConfigOptions.d.ts.map