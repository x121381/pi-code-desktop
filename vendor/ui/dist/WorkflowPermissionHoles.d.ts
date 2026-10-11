import type { ToolCallCreateWorkflowCausalityGraph } from "@zcode/shared/zcode-protocol-v4";
/**
 * 确认窗的留白行（docs/dynamic-workflow/presentation.md「Holes on the timeline」的「The hole station」）：
 * 还开着的留白按源码序排成一行芯片（笔、名字；类型不上界面），后面一句「运行到留白处会暂停，等主代理
 * 补全后继续。」——用户批准的是一个会停下来等代码的 run，这一句要在按下允许之前读到。没有留白时整行缺席。
 * 从 WorkflowPermissionBlock.tsx 拆出（max-lines 门）。
 */
export declare function WorkflowPermissionHoles({ holes, }: {
    holes: NonNullable<ToolCallCreateWorkflowCausalityGraph["holes"]> | undefined;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=WorkflowPermissionHoles.d.ts.map