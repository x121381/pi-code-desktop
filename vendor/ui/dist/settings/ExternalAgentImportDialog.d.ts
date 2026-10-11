import type { SettingsSyncCategory, SettingsSyncDiscoveryResult, SettingsSyncSelection, SettingsSyncImportMode, SettingsSyncSourceScope } from "@zcode/shared";
import type { ISettingsSyncService } from "@zcode/services";
export type ImportResourceCategory = Extract<SettingsSyncCategory, "skills" | "commands" | "plugins" | "mcpServers">;
interface ExternalAgentImportDialogProps {
    open: boolean;
    workspacePath: string | null | undefined;
    workspaceIdentity?: string;
    settingsSyncService: ISettingsSyncService;
    onOpenChange: (open: boolean) => void;
    onImported: () => Promise<void> | void;
}
export declare function buildExternalAgentImportSelections(selectedKeys: string[], targetScope: SettingsSyncSourceScope, importMode: SettingsSyncImportMode): SettingsSyncSelection[];
export declare function SkillsImportDialog(props: ExternalAgentImportDialogProps): import("react/jsx-runtime").JSX.Element;
export declare function CommandsImportDialog(props: ExternalAgentImportDialogProps): import("react/jsx-runtime").JSX.Element;
export declare function PluginsImportDialog(props: ExternalAgentImportDialogProps): import("react/jsx-runtime").JSX.Element;
export declare function McpServersImportDialog(props: ExternalAgentImportDialogProps): import("react/jsx-runtime").JSX.Element;
export interface ExternalAgentImportCategoryState {
    activeScope: SettingsSyncSourceScope;
    discovery: SettingsSyncDiscoveryResult | null;
    error: string | null;
    expandedSourceKeys: string[];
    importMode: SettingsSyncImportMode;
    importTargetScope: SettingsSyncSourceScope;
    loading: boolean;
    selectedCount: number;
    selectedKeys: string[];
    selections: SettingsSyncSelection[];
    totalImportableCount: number;
    loadDiscovery: () => Promise<void>;
    setActiveSourceScope: (scope: SettingsSyncSourceScope) => void;
    setImportMode: (mode: SettingsSyncImportMode) => void;
    setImportTargetScope: (scope: SettingsSyncSourceScope) => void;
    setResourceSelection: (keys: string[], checked: boolean) => void;
    toggleExpanded: (key: string) => void;
    toggleSelection: (key: string) => void;
}
export declare function useExternalAgentImportCategoryState({ category, enabled, settingsSyncService, workspaceIdentity, workspacePath, }: {
    category: ImportResourceCategory;
    enabled: boolean;
    settingsSyncService: ISettingsSyncService;
    workspacePath: string | null | undefined;
    workspaceIdentity?: string;
}): ExternalAgentImportCategoryState;
export declare function ExternalAgentImportSelectionPanel({ category, state, workspacePath, }: {
    category: ImportResourceCategory;
    state: ExternalAgentImportCategoryState;
    workspacePath: string | null | undefined;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ExternalAgentImportDialog.d.ts.map