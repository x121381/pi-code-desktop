import { type WorkflowRunSettingsDraft } from "./workflowRunSettings.js";
/** Allow 应答的 `content`：只含改过的字段；`null` = 回到默认（会话模型 / 默认并发）。 */
export interface WorkflowAskSettingsContent {
    subagent_model?: string | null;
    max_concurrency?: number | null;
}
/**
 * 起点：入参里的值。模型缺席即会话模型；上界缺席即默认并发（「没有自己的界」在步进器上就是那个数），
 * 默认也未知则为 null（步进器留空，敲一个数才算设了界）。
 */
export declare function initialWorkflowAskSettingsDraft(input: unknown, defaultConcurrency: number | undefined): WorkflowRunSettingsDraft;
/**
 * 出口：改过的字段 → 应答 content；什么都没改即 undefined（Allow 照旧只带 optionId）。规则全是弹层的：
 * 只改思考档也算改了模型，上界等于默认并发发 `null`（高于默认是一个真的数）。
 */
export declare function workflowAskSettingsContent(initial: WorkflowRunSettingsDraft, draft: WorkflowRunSettingsDraft, defaultConcurrency: number | undefined): WorkflowAskSettingsContent | undefined;
/** 哪一行改了（改了的那一行加粗并带「原为 …」）。 */
export declare function workflowAskSettingsChangedLines(initial: WorkflowRunSettingsDraft, draft: WorkflowRunSettingsDraft, defaultConcurrency: number | undefined): {
    model: boolean;
    bound: boolean;
};
//# sourceMappingURL=workflowAskSettings.d.ts.map