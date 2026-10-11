import type { OpenPluginUiSideTabRequest } from "@/plugin-ui/contract.js";
export interface PluginUiLauncherItemsProps {
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    /** 正式会话 id；草稿态为 null，此时不显示入口（面板是会话级，第一版不支持草稿）。 */
    sessionId: string | null;
    onOpenPluginUi: (request: OpenPluginUiSideTabRequest) => void;
    /** 菜单复用标准菜单项；空白页继续使用入口按钮样式。 */
    variant?: "launcher" | "menu";
    itemClassName?: string;
}
export declare function buildPluginUiLauncherItemId(pluginId: string, surfaceId: string): string;
/**
 * "打开标签页"里的插件面板入口，与内建项共用列表/网格。
 * 旧分组容器会占据一个网格单元，导致插件全部挤在同一列；使用 Fragment 让按钮直接参与父级布局。
 */
export declare function PluginUiLauncherItems(props: PluginUiLauncherItemsProps): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=PluginUiLauncherItems.d.ts.map