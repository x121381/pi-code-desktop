import type { ChannelContentPart } from "@zcode/shared";
/** 正式消息和准备态共用完整正文渲染；状态由消息来源行展示。 */
export declare function ConversationUserInputBubble({ text, contentParts, rowId, attachments, contextAttachmentCount, epilogue, }: {
    text: string;
    contentParts?: readonly ChannelContentPart[];
    rowId: string | number;
    attachments?: readonly unknown[];
    contextAttachmentCount?: number;
    epilogue?: string;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=ConversationUserInputBubble.d.ts.map