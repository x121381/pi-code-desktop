import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChannelMentionContent } from "../v4/ChannelMentionContent.js";
import { ConversationUserInputEpilogue } from "../v4/ConversationUserInputEpilogue.js";
import { ConversationUserInputBody } from "../v4/ConversationUserInputBody.js";
import { ConversationUserInputContent } from "../v4/ConversationUserInputContent.js";
/** 正式消息和准备态共用完整正文渲染；状态由消息来源行展示。 */
export function ConversationUserInputBubble({ text, contentParts, rowId, attachments, contextAttachmentCount, epilogue, }) {
    if (!text.trim() && epilogue === undefined)
        return null;
    return (_jsxs("div", { "data-v4-user-input-bubble": "true", className: "flex max-w-full flex-col gap-2 rounded-xl rounded-tr-xs border border-border bg-surface px-4 py-3 text-ui-base text-foreground @min-[624px]/conversation:max-w-xl", children: [text.trim() ? (_jsx(ConversationUserInputBody, { contentText: text, rowId: rowId, children: contentParts?.some((part) => part.type === "channelMention") ? (_jsx(ChannelMentionContent, { parts: contentParts, text: text })) : (_jsx(ConversationUserInputContent, { text: text, attachments: attachments, contextAttachmentCount: contextAttachmentCount })) })) : null, epilogue === undefined ? null : _jsx(ConversationUserInputEpilogue, { text: epilogue })] }));
}
//# sourceMappingURL=ConversationUserInputBubble.js.map