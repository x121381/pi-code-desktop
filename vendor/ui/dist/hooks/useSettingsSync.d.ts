import type { SettingsSyncCategory, SettingsSyncSelection } from "@zcode/shared";
import type { SettingsSyncUiState } from "@/settings-sync/types.js";
/** 首启自动检测与设置页手动重开对“空 discovery”的处理不同。 */
type LoadDiscoveryIntent = "firstRun" | "manual";
export declare function useSettingsSync(params: {
    workspacePath?: string;
    workspaceIdentity?: string;
}): {
    state: SettingsSyncUiState;
    selectedCount: number;
    taskProgress: number;
    actions: {
        close: () => void;
        reopen: () => void;
        reloadDiscovery: (intent?: LoadDiscoveryIntent) => Promise<void>;
        toggleSelection: (key: string) => void;
        setAgentSelection: (agent: string, checked: boolean) => void;
        setCategorySelectionAllAgents: (category: SettingsSyncCategory, checked: boolean) => void;
        startImport: () => Promise<void>;
        startImportWithAdditionalSelections: (additionalSelections?: SettingsSyncSelection[], options?: {
            includeCurrentSelections?: boolean;
        }) => Promise<void>;
        finish: () => void;
    };
};
export {};
//# sourceMappingURL=useSettingsSync.d.ts.map