import type { ToolCallBlockRenderContext } from "../shared.js";
/** SaveWorkflow 归一化入参里的一条 args 声明。 */
export interface WorkflowArgDeclaration {
    name: string;
    type: string | undefined;
    description: string | undefined;
    required: boolean;
    /** `default` 是否在场——`default: false` 与「没有默认值」必须可分辨。 */
    hasDefault: boolean;
    defaultValue: unknown;
}
/**
 * SaveWorkflow 的归一化入参（可复用工作流 spec 的「SaveWorkflow 的归一化形状」）：
 * `{name, description, whenToUse?, args?, script, path, overwrite, scope}`。
 *
 * `path` / `overwrite` / `scope` 是解析阶段算出来的事实，不是模型说的——确认窗展示的是
 * 「将要发生的事实」。这个 gate 没有 display 载荷，入参就是全部内容。
 */
interface SaveWorkflowInput {
    name: string | undefined;
    description: string | undefined;
    whenToUse: string | undefined;
    path: string | undefined;
    scope: string | undefined;
    /** 另一档已有同名时的遮蔽事实（解析阶段算出，走入参通道，理由同 path / overwrite）。 */
    shadowing: "hides_global" | "hidden_by_project" | undefined;
    overwrite: boolean;
    script: string | undefined;
    args: WorkflowArgDeclaration[];
}
export declare function readSaveWorkflowInput(input: unknown): SaveWorkflowInput;
export declare function SaveWorkflowOverwriteBadge({ label }: {
    label: string;
}): import("react/jsx-runtime").JSX.Element;
/**
 * SaveWorkflow 的聊天卡：刻意紧凑——名字、覆盖标记、说明。
 *
 * 完整内容（落点、args 声明表、脚本）归确认窗：那才是用户做决定的地方，而这张卡是决定
 * 之后的一行记录。
 */
export declare function SaveWorkflowToolCallBlock(context: ToolCallBlockRenderContext): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=save-workflow.d.ts.map