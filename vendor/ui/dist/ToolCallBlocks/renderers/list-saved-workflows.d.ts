import type { ToolCallBlockRenderContext } from "../shared.js";
interface SavedWorkflowEntry {
    name: string;
    description: string | undefined;
    whenToUse: string | undefined;
    scope: string | undefined;
    path: string | undefined;
    argNames: string[];
}
interface InvalidSavedWorkflowEntry {
    path: string;
    reason: string | undefined;
}
interface ListSavedWorkflowsResult {
    workflows: SavedWorkflowEntry[];
    invalid: InvalidSavedWorkflowEntry[];
}
/**
 * 结果读取顺序：**display 通道优先**——v4 wire 上 output.text
 * 是 formatModelContent 的 XML 风格投影，下面的 JSON 探针对它永不命中（会掉进
 * raw 兜底卡）；legacy JSON 探针保留，兜老会话与非 v4 宿主。一个都读不出来就交回
 * fallback——空列表与「读不懂」必须可分辨，不能把解析失败画成「这个项目里没有工作流」。
 */
export declare function readListSavedWorkflowsResult(toolCall: ToolCallBlockRenderContext["toolCallNode"]["toolCall"]): ListSavedWorkflowsResult | null;
/**
 * ListSavedWorkflows 的聊天卡。
 *
 * 为什么值得一个专用 renderer：这个工具名没登记在 shared 的已知工具表里，通用路径是
 * `FallbackToolCallBlock`，而它的默认 display model 没有 inlinePreview，于是会把
 * `JSON.stringify(toolCall)` 整包摊进聊天区——对这个工具正好是最坏情况，因为那包 JSON
 * 就是全部工作流的 description / whenToUse / args 声明。
 *
 * 卡片只回答「有哪些、干什么用」；脚本本体本来就不在结果里（spec：一次列举不该把 20 段脚本
 * 灌进上下文）。坏文件单独一行——它们是**刻意可见**的，不静默跳过。
 */
export declare function ListSavedWorkflowsToolCallBlock(context: ToolCallBlockRenderContext): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=list-saved-workflows.d.ts.map