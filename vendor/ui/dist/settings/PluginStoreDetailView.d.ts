import { type ReactNode } from "react";
import { type PluginStoreActions } from "@/settings/PluginStoreCard.js";
import { type StorePluginItem } from "@/settings/pluginStoreListing.js";
import type { PluginDescribeEntry } from "@/store/pluginManagementStore.js";
type ExamplePromptDocumentIcon = "documents" | "pdf" | "spreadsheets";
export declare function resolveExamplePromptDocumentIcon(prompt: string): ExamplePromptDocumentIcon;
export declare function PluginStoreDetailView({ item, actions, describeEntry, onRetryDescribe, onUsePrompt, advanced, }: {
    item: StorePluginItem;
    actions: PluginStoreActions;
    describeEntry?: PluginDescribeEntry;
    onRetryDescribe: () => void;
    /** 试用：标准新建任务并预填 canonical Plugin 引用 + 示例提示词（不自动发送）；未安装时先引导安装。 */
    onUsePrompt: (item: StorePluginItem, prompt: string) => void;
    /** 高级折叠区（rootPath/Hook 明细/配置项），仅已安装且有运行时信息时由父级注入。 */
    advanced?: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
/** 高级折叠区外壳：详情页底部的「更多详情」，内容由父级注入（rootPath/Hook 明细/配置）。 */
export declare function PluginStoreAdvancedSection({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=PluginStoreDetailView.d.ts.map