export interface V4UserInputGoalQueryDisplay {
    leadingText: string;
    commandText: string;
    trailingText: string;
}
/**
 * 只解析发送入口会消费的 goal query；普通正文和携带附件的同名文本保持原样。
 * 原因：用户消息展示不能仅凭包含 `/goal` 就重猜 command intent，否则上下文 prompt
 * 在隐藏附加块后会被误画成 goal 控制命令。
 */
export declare function parseV4UserInputGoalQuery(text: string, attachments?: readonly unknown[], contextAttachmentCount?: number): V4UserInputGoalQueryDisplay | null;
export declare const ConversationUserInputContent: import("react").MemoExoticComponent<({ text, attachments, contextAttachmentCount, }: {
    text: string;
    attachments?: readonly unknown[];
    contextAttachmentCount?: number;
}) => import("react/jsx-runtime").JSX.Element>;
//# sourceMappingURL=ConversationUserInputContent.d.ts.map