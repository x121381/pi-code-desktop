import { type ChannelContentPart, type BotGroupInputSource } from "@zcode/shared";
/** 只渲染可信消息节点；复制出的 @name 普通文本不能恢复平台身份。 */
export declare function ChannelMentionContent({ parts, text, }: {
    parts?: readonly ChannelContentPart[];
    text: string;
}): import("react/jsx-runtime").JSX.Element;
/** 合批队列按原发送者与正文顺序投影，不能把末条的节点套到整批文本上。 */
export declare function BotChannelMessageContent({ source, text, }: {
    source?: BotGroupInputSource;
    text: string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ChannelMentionContent.d.ts.map