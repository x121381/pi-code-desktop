import type { WorkspaceTabState } from "@/store/tabStore.js";
export declare function getPluginWorkspaceKey(tab: WorkspaceTabState): string;
export declare function isPluginScopeWorkspaceConnected(tab: WorkspaceTabState): boolean;
export declare function PluginScopeMenu({ align, disabled, includeUser, selectedScopeKey, triggerIconTestId, triggerTestId, userOptionTestId, workspaceOptionTestIdPrefix, workspaceOptions, workspaceTabs, onScopeKeyChange, }: {
    align?: "start" | "center" | "end";
    disabled?: boolean;
    includeUser?: boolean;
    selectedScopeKey: string;
    triggerIconTestId?: string;
    triggerTestId?: string;
    userOptionTestId?: string;
    workspaceOptionTestIdPrefix?: string;
    workspaceOptions?: Array<{
        key: string;
        label: string;
        remote?: boolean;
    }>;
    workspaceTabs?: WorkspaceTabState[];
    onScopeKeyChange: (scopeKey: string) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=PluginScopeMenu.d.ts.map