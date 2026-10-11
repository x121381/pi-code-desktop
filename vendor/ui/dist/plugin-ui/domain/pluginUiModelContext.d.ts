import type { PluginUiImageBlock } from "./pluginUiImageBlocks.js";
/**
 * 插件 UI 经 `ui/update-model-context` 附加的下一轮模型上下文。
 * 与代码评论 / 网页元素同构：只存在于 composer 草稿与 prompt 尾块里，不进协议字段；用户可见、可删。
 */
export interface PluginUiModelContext {
    id: string;
    sessionId: string;
    pluginId: string;
    toolCallId: string;
    text: string;
    structuredContent?: unknown;
    /**
     * image 块不进 prompt 尾块，由 composer 转成本条上下文名下的图片附件随下一回合发送；
     * 同一实例再次 updateModelContext 时连同附件一起替换。
     */
    images?: readonly PluginUiImageBlock[];
}
export declare const PLUGIN_UI_MODEL_CONTEXT_BLOCK_TITLE = "# Plugin context:";
/** 单条上下文文本上限；超出截断并追加省略号，避免插件把整页塞进 prompt。 */
export declare const PLUGIN_UI_MODEL_CONTEXT_MAX_CHARS: number;
export declare function buildPromptWithPluginUiContexts(text: string, contexts: readonly PluginUiModelContext[]): string;
export interface ParsedPluginUiContextPrompt {
    visibleContent: string;
    pluginUiContexts: PluginUiModelContext[];
}
/** 只识别 prompt 尾块；与其它四类上下文一样，序列化顺序与解析顺序严格相反。 */
export declare function parsePromptPluginUiContexts(content: string): ParsedPluginUiContextPrompt;
export declare function formatPluginUiContextLabel(context: PluginUiModelContext): string;
//# sourceMappingURL=pluginUiModelContext.d.ts.map