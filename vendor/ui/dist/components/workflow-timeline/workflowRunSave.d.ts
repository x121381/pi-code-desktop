import type { ZCodeSavedWorkflowScope } from "@zcode/shared";
export declare const SAVED_WORKFLOW_NAME_MAX_CHARS = 64;
export declare function isValidSavedWorkflowNameText(name: string): boolean;
/**
 * 落点预览。项目档写相对路径（用户在自己的仓库里看到的就是它），全局档写 `~` 开头的家目录路径
 * ——那是 **agent 机器**的家目录，远程项目因此根本不给全局档这个选项。
 */
export declare function savedWorkflowPathPreview(scope: ZCodeSavedWorkflowScope, name: string): string;
export interface WorkflowSaveDraft {
    name: string;
    scope: ZCodeSavedWorkflowScope;
    description: string;
}
/**
 * 弹层打开那一刻的草稿。
 *
 * 名字只在 run 名**本身**就满足文件名规则时预填：run 名是模型用用户的语言起的标签
 * （「PR 分层评审 · 安全 / 性能 / 架构」），把它塞进名字框只会得到一个必然报错的值。
 * 说明则反过来预填 run 名——它正是「这个工作流是做什么的」的一句话，而中枢的卡片上要的就是这句。
 */
export declare function initialWorkflowSaveDraft(input: {
    runName?: string;
    scope?: ZCodeSavedWorkflowScope;
}): WorkflowSaveDraft;
/**
 * 「让 ZCode 帮我提炼保存」发出去的那条用户消息（docs/dynamic-workflow/transcript-and-notifications.md
 * 「The message the lead sends」）。与中枢的「提升为全局」同一条先例：GUI 写、自动发、用户不再确认。
 *
 * 三件事必须在消息里：**提炼**而不是照抄（否则这条路径与「直接保存」没有分别）、用户已经填好的
 * 那几个字段、以及 `run_id`——它是这次 run 与模型另起名字存下的那份定义之间**仅有的**持久联系
 * （launch.md「`SaveWorkflow`」）。脚本不进消息：模型手上就有发起这次 run 的调用。
 */
export declare function buildWorkflowSaveRequestPrompt(input: {
    locale: string;
    runId: string;
    runName?: string;
    name: string;
    scope: ZCodeSavedWorkflowScope;
    description: string;
}): string;
//# sourceMappingURL=workflowRunSave.d.ts.map