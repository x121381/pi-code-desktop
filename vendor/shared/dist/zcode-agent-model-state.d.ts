import type { ZCodeSessionMode, ZCodeSessionSettingsState } from "./zcode-protocol/index.js";
import type { ZCodeConfigOption, ZCodeTaskModeInfo } from "./zcode-task-types-core.js";
export declare function normalizeAvailableZCodeMode(mode: ZCodeSessionMode): string;
export declare function getZCodeAgentModeSelectOptions(): NonNullable<ZCodeConfigOption["options"]>;
export declare function getZCodeAgentAvailableModes(): ZCodeTaskModeInfo[];
export declare function zcodeSessionSettingsToZCodeConfigOptions(settings: ZCodeSessionSettingsState): ZCodeConfigOption[];
//# sourceMappingURL=zcode-agent-model-state.d.ts.map