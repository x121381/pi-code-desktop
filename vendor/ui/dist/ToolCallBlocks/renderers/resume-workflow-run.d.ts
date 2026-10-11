import type { ToolCallBlockRenderContext } from "../shared.js";
/**
 * ResumeWorkflowRun 的聊天卡。
 *
 * 两态：
 * - **run 已联接**（宿主按 display.runId 联接 workflowRuns 投影，`workflowRunCardJoin` 的
 *   byRunId 表）→ 复用 CreateWorkflow 的紧凑可点卡（`WorkflowRunCompactCard`），标签换
 *   「工作流实例已恢复」，状态点词/步数实时驱动，整卡点击打开侧栏 run 视图——tab 身份
 *   runId 键，与原始 create 卡打开的是同一个 tab。
 * - **未联接**（display 缺席的老会话 / 失败路径 / 投影尚未就绪）→ ToolLayout 折叠卡：
 *   runId（mono）+「后台运行中」状态点词（run 状态词汇表 running 档）+ 展开的本地化续跑
 *   说明；无 display 时有界纯文本面板，绝不 raw JSON dump。
 */
export declare function ResumeWorkflowRunToolCallBlock(context: ToolCallBlockRenderContext): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=resume-workflow-run.d.ts.map