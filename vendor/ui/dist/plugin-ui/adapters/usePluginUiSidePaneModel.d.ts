import type { PluginUiSidePaneTab, PluginUiSidePaneViewProps } from "@/plugin-ui/contract.js";
import type { PluginUiScopeRef } from "@zcode/shared/mcp-apps";
import { type ReactNode } from "react";
export declare function usePluginUiSidePaneModel({ tab, scopeRef, onOpenBrowserUrl, onCloseTab, }: {
    tab: PluginUiSidePaneTab;
    scopeRef: PluginUiScopeRef;
    onOpenBrowserUrl?: (url: string) => void;
    onCloseTab?: (tabId: string) => void;
}): PluginUiSidePaneViewProps;
/** 侧栏不在 SessionPane 树内，由这个适配器复用原 workspace 的 V4 层与 lease。 */
export declare function PluginUiConversationScope({ tab, children, }: {
    tab: PluginUiSidePaneTab;
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=usePluginUiSidePaneModel.d.ts.map