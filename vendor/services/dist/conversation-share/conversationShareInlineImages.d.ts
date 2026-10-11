import type { ConversationShareCapabilities } from "@zcode/shared";
import type { ConversationRow } from "@zcode/shared/zcode-protocol-v4";
import type { ConversationShareFailureIssue } from "./conversationShare.js";
/** 内嵌图片转为既有 artifact；预检和发布使用同一份确定性转换，不新增文件读取通道。 */
export declare function materializeConversationShareInlineImages(sourceRows: readonly ConversationRow[], capabilities: ConversationShareCapabilities, turnOrdinals: ReadonlyMap<string, number>): {
    rows: ConversationRow[];
    bytesBySourceRef: Map<string, Uint8Array>;
    warnings: ConversationShareFailureIssue[];
};
//# sourceMappingURL=conversationShareInlineImages.d.ts.map