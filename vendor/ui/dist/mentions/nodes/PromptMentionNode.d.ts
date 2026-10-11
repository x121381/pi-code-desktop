import { type EditorConfig, type LexicalNode, type NodeKey, type SerializedTextNode, TextNode } from "lexical";
import type { MentionCategory, MentionItemData } from "@/mentions/mentionTypes.js";
export * from "@/mentions/nodes/mentionIconDom.js";
export interface PromptMentionPayload {
    id: string;
    category: MentionCategory;
    label: string;
    value: string;
    markdown: string;
    description?: string;
    data?: MentionItemData;
}
type SerializedPromptMentionNode = SerializedTextNode & {
    category: MentionCategory;
    data?: MentionItemData;
    description?: string;
    mentionId: string;
    markdown: string;
    type: "prompt-mention";
    value: string;
    version: 1;
};
export declare class PromptMentionNode extends TextNode {
    __category: MentionCategory;
    __data?: MentionItemData;
    __description: string;
    __markdown: string;
    __mentionId: string;
    __value: string;
    static getType(): string;
    static clone(node: PromptMentionNode): PromptMentionNode;
    static importJSON(serializedNode: SerializedPromptMentionNode): PromptMentionNode;
    constructor(payload: PromptMentionPayload, key?: NodeKey);
    createDOM(config: EditorConfig): HTMLElement;
    updateDOM(prevNode: PromptMentionNode, dom: HTMLElement, config: EditorConfig): boolean;
    exportJSON(): SerializedPromptMentionNode;
    getMarkdown(): string;
    isTextEntity(): true;
    canInsertTextBefore(): false;
    canInsertTextAfter(): false;
    getMention(): PromptMentionPayload;
}
export declare function $createPromptMentionNode(payload: PromptMentionPayload): PromptMentionNode;
export declare function $isPromptMentionNode(node: LexicalNode | null | undefined): node is PromptMentionNode;
//# sourceMappingURL=PromptMentionNode.d.ts.map