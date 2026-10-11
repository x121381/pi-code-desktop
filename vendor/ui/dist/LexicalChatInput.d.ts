import { type EditorState, type LexicalEditor } from "lexical";
import type { AppSlashCommand } from "./slashCommandHelpers.js";
import type { MentionItemData } from "@/mentions/mentionTypes.js";
import type { ComposerMentionPrefill } from "@/store/zcodeSessionStoreTypes.js";
/** 旧 useChatComposer 已删；粘贴事件收口为最小结构类型（ClipboardEvent 结构兼容）。 */
export interface ChatComposerPasteEvent {
    clipboardData: DataTransfer | null;
    preventDefault: () => void;
    stopPropagation?: () => void;
}
export interface LexicalChatInputHandle {
    clear: () => void;
    focus: () => void;
    getEditorState: () => EditorState;
    getMarkdown: () => string;
    getText: () => string;
    appendText: (text: string) => void;
    appendFileMention: (label: string, value: string, markdown: string, data?: MentionItemData, trailingText?: string) => void;
    prependMentionIfMissing: (mention: ComposerMentionPrefill) => boolean;
    setMention: (mention: ComposerMentionPrefill, trailingText?: string) => void;
    insertMention: (mention: ComposerMentionPrefill, selectionState?: EditorState) => void;
    setText: (text: string) => void;
    setTextWithPluginMentions: (text: string) => void;
    setEditorStateJson: (editorStateJson: string) => void;
    setSkillMention: (skillName: string, markdown?: string, trailingText?: string) => void;
    setSlashCommandMention: (commandName: string, markdown?: string, trailingText?: string) => void;
}
interface LexicalEnterSubmitOptions {
    allowSubmitWhenEmpty?: boolean;
    ctrlKey?: boolean;
    enterSubmits: boolean;
    isComposing?: boolean;
    metaKey?: boolean;
    shiftKey?: boolean;
    text: string;
}
interface LexicalModifiedEnterSubmitOptions {
    allowSubmitWhenEmpty?: boolean;
    ctrlKey?: boolean;
    isComposing?: boolean;
    metaKey?: boolean;
    modifiedEnterSubmits: boolean;
    shiftKey?: boolean;
    text: string;
}
export type LexicalSubmitResult = boolean | void;
interface LeadingChineseSlashAliasInputOptions {
    data: string | null;
    inputType: string;
    isAtEditorStart: boolean;
    isComposing?: boolean;
}
export declare function shouldSubmitLexicalEnter({ allowSubmitWhenEmpty, ctrlKey, enterSubmits, isComposing, metaKey, shiftKey, text, }: LexicalEnterSubmitOptions): boolean;
export declare function shouldSubmitLexicalModifiedEnter({ allowSubmitWhenEmpty, ctrlKey, isComposing, metaKey, modifiedEnterSubmits, shiftKey, text, }: LexicalModifiedEnterSubmitOptions): boolean;
export declare function shouldResetLexicalEditorAfterSubmit(result: LexicalSubmitResult): boolean;
export declare function shouldNormalizeLeadingChineseSlashAliasInput({ data, inputType, isAtEditorStart, isComposing, }: LeadingChineseSlashAliasInputOptions): boolean;
export declare function replaceEditorWithMention(editor: LexicalEditor, mention: ComposerMentionPrefill, trailingText?: string): void;
/**
 * 在草稿开头插入结构化 mention，同时保留已有 Lexical 节点和段落。
 *
 * 不能通过 getMarkdown → setMention 重建：setMention 是替换型预填，会把旧 mention
 * 序列化后作为普通 TextNode 放回编辑器，导致已有 Plugin / 文件 / Skill chip 降级。
 */
export declare function prependEditorMentionIfMissing(editor: LexicalEditor, mention: ComposerMentionPrefill): boolean;
/** 暴露 focus / clear / getText 给外部 */
export declare function insertEditorMention(editor: LexicalEditor, mention: ComposerMentionPrefill, selectionState?: EditorState): void;
interface LexicalChatInputProps {
    placeholder?: string;
    disabled?: boolean;
    submitDisabled?: boolean;
    allowSubmitWhenEmpty?: boolean;
    enterSubmits?: boolean;
    onSubmit: (text: string) => LexicalSubmitResult;
    onModifiedSubmit?: (text: string) => LexicalSubmitResult;
    onChange?: (text: string) => void;
    onFocus?: () => void;
    triggerPanelContainer?: HTMLElement | null;
    workspacePath: string;
    workspaceIdentity?: string;
    taskId: string | null;
    /** 仅影响 Skill 引用目录；草稿可使用 prewarm Session runtime。 */
    skillCatalogSessionId?: string | null;
    inputTestId?: string;
    editorApiRef?: React.MutableRefObject<LexicalChatInputHandle | null>;
    promptHistory?: readonly string[];
    avoidIosInputFocusZoom?: boolean;
    compactPlaceholder?: boolean;
    onWhiteboardMentionSelected?: (boardId: string) => void | Promise<void>;
    onPaste?: (event: ChatComposerPasteEvent) => void;
    excludedSlashCommandNames?: readonly string[];
    /** App 层本地斜杠命令（如 `/side`），选中即执行 UI 行为，不发送。 */
    appSlashCommands?: readonly AppSlashCommand[];
    /** mention（@/#）面板开关。v4 数据面未就绪时显式关闭，入口保留。 */
    enableMentionPanel?: boolean;
}
export declare function LexicalChatInput({ placeholder, disabled, submitDisabled, allowSubmitWhenEmpty, enterSubmits, onSubmit, onModifiedSubmit, onChange, onFocus, triggerPanelContainer, workspacePath, workspaceIdentity, taskId, skillCatalogSessionId, inputTestId, editorApiRef, promptHistory, avoidIosInputFocusZoom, compactPlaceholder, onWhiteboardMentionSelected, onPaste, excludedSlashCommandNames, appSlashCommands, enableMentionPanel, }: LexicalChatInputProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=LexicalChatInput.d.ts.map