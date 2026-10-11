import type { SettingsSyncCategory, SettingsSyncDiscoveryResult } from "@zcode/shared";
/**
 * Onboarding 代理设置：与 MCP 平级的可勾选分类列表（当前仅模型供应商）；每类下为各 Agent。
 */
export declare function SettingsSyncSelectionStep(props: {
    discovery: SettingsSyncDiscoveryResult;
    selectedKeys: string[];
    onToggleSelection: (key: string) => void;
    onSetCategorySelectionAllAgents: (category: SettingsSyncCategory, checked: boolean) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SettingsSyncSelectionStep.d.ts.map