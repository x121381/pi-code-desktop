export type V4VisibleSlashCommand = {
    kind: "compact";
    displayText: string;
} | {
    kind: "planShortcut";
    task: string;
    displayText: string;
} | {
    kind: "unsupportedPlanShortcut";
    task: string;
    displayText: string;
} | {
    kind: "sendGoalCommand";
    objective: string;
    displayText: string;
} | {
    kind: "resumeGoal";
    displayText: string;
} | {
    kind: "emptyGoal";
    displayText: string;
} | {
    kind: "unsupportedGoal";
    action: string;
    displayText: string;
};
export interface V4VisibleSlashCommandParseOptions {
    contextAttachmentCount?: number;
}
export interface SelectionSideSlashCommand {
    command: "side" | "btw";
    text: string;
    displayText: string;
}
export interface SelectionSideSlashCommandParseOptions {
    contextAttachmentCount?: number;
    /** CLI catalog 中已经注册的同名命令；同名 CLI 命令优先，不由 App 消费。 */
    enabledCommandNames?: readonly string[];
}
export declare function parseV4VisibleSlashCommand(content: string, attachments?: readonly unknown[], options?: V4VisibleSlashCommandParseOptions): V4VisibleSlashCommand | null;
/**
 * 解析带首条输入的选择副屏命令。
 *
 * 这是 App 层的完整输入消费门：只接受整条文本，且只在没有附件/结构化上下文时
 * 命中。参数只去除首尾空白，保留正文内部的空格和换行，避免改写用户原文。
 */
export declare function parseSelectionSideSlashCommand(content: string, attachments?: readonly unknown[], options?: SelectionSideSlashCommandParseOptions): SelectionSideSlashCommand | null;
export declare function v4QueuedCommandText(kind: "sendText" | "sendGoalCommand", text: string): string;
export declare function extractV4GoalObjective(text: string): string;
//# sourceMappingURL=slashCommands.d.ts.map