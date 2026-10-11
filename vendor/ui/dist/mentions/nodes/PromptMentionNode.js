import { $applyNodeReplacement, TextNode, } from "lexical";
import { resolveFileDisplayDescriptor } from "../../lib/fileDisplay.js";
import { getPromptMentionVariantClassName, PROMPT_MENTION_BASE_CLASS_NAME, } from "../../mentions/mentionChip.js";
import { normalizePromptMentionDisplayLabel } from "../../mentions/promptMentionLabel.js";
import { decoratePromptMention } from "../../mentions/nodes/promptMentionDecoration.js";
export * from "../../mentions/nodes/mentionIconDom.js";
function displayLabel(payload) {
    const label = normalizePromptMentionDisplayLabel(payload.category, payload.label, payload.value);
    return payload.category === "files"
        ? resolveFileDisplayDescriptor(payload.data?.path ?? payload.data?.relativePath ?? payload.value).fileName || label
        : label;
}
export class PromptMentionNode extends TextNode {
    __category;
    __data;
    __description;
    __markdown;
    __mentionId;
    __value;
    static getType() {
        return "prompt-mention";
    }
    static clone(node) {
        return new PromptMentionNode({
            id: node.__mentionId,
            category: node.__category,
            label: node.__text,
            value: node.__value,
            markdown: node.__markdown,
            description: node.__description,
            data: node.__data,
        }, node.__key);
    }
    static importJSON(serializedNode) {
        const node = $createPromptMentionNode({
            id: serializedNode.mentionId,
            category: serializedNode.category,
            label: serializedNode.text,
            value: serializedNode.value,
            markdown: serializedNode.markdown,
            description: serializedNode.description,
            data: serializedNode.data,
        });
        node.setFormat(serializedNode.format);
        node.setDetail(serializedNode.detail);
        node.setMode(serializedNode.mode);
        node.setStyle(serializedNode.style);
        return node;
    }
    constructor(payload, key) {
        super(displayLabel(payload), key);
        this.__mentionId = payload.id;
        this.__category = payload.category;
        this.__value = payload.value;
        this.__markdown = payload.markdown;
        this.__description = payload.description ?? "";
        this.__data = payload.data;
    }
    createDOM(config) {
        const dom = super.createDOM(config);
        const variantClassName = getPromptMentionVariantClassName(this.__category);
        dom.className = `prompt-mention ${PROMPT_MENTION_BASE_CLASS_NAME} ${variantClassName}`;
        dom.setAttribute("data-mention-category", this.__category);
        dom.setAttribute("data-mention-id", this.__mentionId);
        dom.setAttribute("spellcheck", "false");
        // 根因：TextNode 的 firstChild 链必须通向展示文字，不能被图标截断。
        // 保留 super 创建的文本 DOM，图标只作为不参与选区的 CSS 装饰。
        decoratePromptMention(dom, this.__category, this.__value, this.__data);
        return dom;
    }
    updateDOM(prevNode, dom, config) {
        const shouldUpdate = super.updateDOM(prevNode, dom, config);
        if (prevNode.__category !== this.__category) {
            const variantClassName = getPromptMentionVariantClassName(this.__category);
            dom.className = `prompt-mention ${PROMPT_MENTION_BASE_CLASS_NAME} ${variantClassName}`;
            dom.setAttribute("data-mention-category", this.__category);
        }
        if (prevNode.__mentionId !== this.__mentionId) {
            dom.setAttribute("data-mention-id", this.__mentionId);
        }
        if (prevNode.__text !== this.__text ||
            prevNode.__category !== this.__category ||
            prevNode.__value !== this.__value ||
            prevNode.__data?.path !== this.__data?.path ||
            prevNode.__data?.relativePath !== this.__data?.relativePath ||
            prevNode.__data?.kind !== this.__data?.kind ||
            prevNode.__data?.scope !== this.__data?.scope ||
            prevNode.__data?.icon !== this.__data?.icon) {
            decoratePromptMention(dom, this.__category, this.__value, this.__data);
        }
        return shouldUpdate;
    }
    exportJSON() {
        return {
            ...super.exportJSON(),
            type: "prompt-mention",
            version: 1,
            mentionId: this.__mentionId,
            category: this.__category,
            value: this.__value,
            markdown: this.__markdown,
            description: this.__description,
            data: this.__data,
        };
    }
    getMarkdown() {
        // 编辑器 offset 必须使用展示文字；canonical 仅供发送和剪贴板序列化。
        return this.getLatest().__markdown;
    }
    isTextEntity() {
        return true;
    }
    canInsertTextBefore() {
        return false;
    }
    canInsertTextAfter() {
        return false;
    }
    getMention() {
        return {
            id: this.__mentionId,
            category: this.__category,
            label: this.__text,
            value: this.__value,
            markdown: this.__markdown,
            description: this.__description,
            data: this.__data,
        };
    }
}
export function $createPromptMentionNode(payload) {
    const node = new PromptMentionNode(payload);
    node.setMode("token");
    return $applyNodeReplacement(node);
}
export function $isPromptMentionNode(node) {
    return node instanceof PromptMentionNode;
}
//# sourceMappingURL=PromptMentionNode.js.map