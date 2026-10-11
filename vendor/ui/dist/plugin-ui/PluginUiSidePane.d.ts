import { type PluginUiSidePaneTab } from "@/plugin-ui/contract.js";
type Props = {
    tab: PluginUiSidePaneTab;
    onOpenBrowserUrl?: (url: string) => void;
    /** 页面请求回到 inline 时宿主关闭本 tab。 */
    onCloseTab?: (tabId: string) => void;
};
/** 模块组装入口：将只读会话适配器与纯视图连接。 */
export declare const PluginUiSidePane: import("react").MemoExoticComponent<(props: Props) => import("react/jsx-runtime").JSX.Element | null>;
export {};
//# sourceMappingURL=PluginUiSidePane.d.ts.map