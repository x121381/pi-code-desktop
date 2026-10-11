/**
 * GetWorkflowRun 工具卡的**子代理花名册**（情势截面的另一半，阶段轨与健康行在
 * get-workflow-run-situation.tsx）。
 *
 * 一行的读法与模型面
 * （apps/zcode-cli/packages/core/src/tool/handlers/get-workflow-run-format-roster.ts）同一句话：
 * 「谁 · 在哪 · 什么相位 · 在哪个阶段 · 正在做什么 · 花了多少 token」，其中「正在做什么」
 * 按相位分叉——在跑的说它的进度与最后一个工具，在等的说等什么、还要等多久，停驻的说等哪个
 * 问题。这正是这张卡存在的理由：一眼看出谁卡住了。
 *
 * 载荷是**扁平行**（没有 `currentAsk` 嵌套），所以「有没有一次在飞的 ask」由那几个读数是否
 * 在场推出来；缺席一律不画，绝不用 0 顶替不知道。
 */
import type { ToolCallGetWorkflowRunDisplay } from "@zcode/shared/zcode-protocol-v4";
type WorkflowRunSubagentView = NonNullable<ToolCallGetWorkflowRunDisplay["subagents"]>[number];
export declare function WorkflowRunSubagentRoster({ subagents, generatedAt, }: {
    subagents: readonly WorkflowRunSubagentView[];
    generatedAt: number | undefined;
}): import("react/jsx-runtime").JSX.Element | null;
export {};
//# sourceMappingURL=get-workflow-run-roster.d.ts.map