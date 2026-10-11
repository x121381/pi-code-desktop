import type { PluginSandboxHandle } from "@zcode/shared/mcp-apps";
import type { PluginUiHostPhase } from "../app/pluginUiHostController.js";
export interface PluginUiCardProps {
    pageKey: string;
    handle: PluginSandboxHandle | null;
    phase: PluginUiHostPhase;
    height: number;
    prefersBorder: boolean;
    error: string | null;
    /** 侧栏模式撑满容器；内联模式按 height 固定。 */
    fill?: boolean;
    loadingLabel: string;
    errorLabel: string;
    /** 错误态的"重新加载"；缺省不显示按钮。 */
    retryLabel?: string;
    onRetry?: () => void;
    onWidthChange?: (width: number) => void;
}
/** 卡片只注册布局锚点；活 webview 由窗口页面管理器持有。 */
export declare function PluginUiCard(props: PluginUiCardProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=PluginUiCard.d.ts.map