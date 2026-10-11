import type { ToolCallBlockRenderContext } from "../shared.js";
interface ListModelsEntryView {
    id: string;
    providerId: string;
    modelId: string;
    providerLabel: string | undefined;
    reasoningLevels: string[];
    defaultReasoningLevel: string | undefined;
    contextWindow: number | undefined;
    disabledReason: string | undefined;
}
interface ListModelsResult {
    current: string | undefined;
    models: ListModelsEntryView[];
    truncated: boolean;
}
/**
 * 结果读取顺序与 list-saved-workflows 同一条：**display 通道优先**（`list_models` kind——
 * v4 wire 上 output.text 是 formatModelContent 的 `<models>` 投影，下面的 JSON 探针对它永不
 * 命中，正是今天掉进 raw 兜底卡的根因）；legacy JSON 探针兜老会话与非 v4 宿主。一个都读不
 * 出来就回 null——「这台机器没有模型」与「读不懂这次结果」必须可分辨。
 */
export declare function readListModelsResult(toolCall: ToolCallBlockRenderContext["toolCallNode"]["toolCall"]): ListModelsResult | null;
/**
 * 上下文窗口的读法：千位以下原样，百万以下取整到 K，再往上到 M 且只在有小数时留一位
 * （`1M` / `1.5M`）。这一列是给人扫一眼比大小的，不是给人核对精确 token 数的。
 */
export declare function formatContextWindow(contextWindow: number): string;
/**
 * ListModels 的聊天卡。
 *
 * 为什么值得一个专用 renderer：这个工具名不在 shared 的已知工具表里，通用路径是
 * `FallbackToolCallBlock`，它会把模型面的 `<models>` 文本原样摊开——那段文本每行都以
 * providerId 开头（可能是 UUID 等长标识），「当前」藏在行尾方括号里。
 *
 * 卡只回答三件事：有哪些、来自哪里、哪个是当前。每行的档位表与规范 id 归 tooltip；
 * providerId 一个字符都不上屏。
 */
export declare function ListModelsToolCallBlock(context: ToolCallBlockRenderContext): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=list-models.d.ts.map