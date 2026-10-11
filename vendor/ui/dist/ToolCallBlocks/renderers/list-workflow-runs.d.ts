import type { ToolCallBlockRenderContext } from "../shared.js";
/**
 * ListWorkflowRuns 的聊天卡。
 *
 * 折叠行：kindLabel + 计数（单复数独立 key 的既有惯例）。展开：行式列表
 * ［状态点词 | label mono | 短时间 | tokens］，本会话 run 加边框小签，possiblyInterrupted
 * 行尾给警示标注——「可能已中断」是读面标注不是状态改写，卡片上同样只标注。
 */
export declare function ListWorkflowRunsToolCallBlock(context: ToolCallBlockRenderContext): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=list-workflow-runs.d.ts.map