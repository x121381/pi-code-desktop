export { readWorkflowKindMessageId } from "@/ToolCallBlocks/renderers/createWorkflowInput.js";
import type { ToolCallBlockRenderContext } from "../shared.js";
/**
 * 聊天区的 CreateWorkflow / AmendWorkflow 工具卡。
 *
 * 编写中使用不可展开的 ToolLayout，行下常驻草稿阶段线（站随脚本流式写出）；待确认使用可展开脚本的 ToolLayout；编不过是编译反馈行
 * （「工作流草稿 · 第 n 稿 · n 处待修正 · 未运行」）——不是失败，什么都没跑。
 * v4 已关联 run 的上方行由 WorkflowToolSummary 承载。本组件保留旧宿主的运行卡渲染。
 *
 * AmendWorkflow 行走**同一个**渲染器（display kind 同为 `create_workflow`，图、草稿笔与诊断卡只有一份
 * 实现），只换修订词汇，并在卡体多一行「调整自 run X」——按工具名判，不看 family。
 */
export declare function CreateWorkflowToolCallBlock(context: ToolCallBlockRenderContext): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=create-workflow.d.ts.map