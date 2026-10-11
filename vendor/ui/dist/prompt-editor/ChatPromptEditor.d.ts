import type { DragEventHandler, MutableRefObject, ReactNode } from "react";
import { type ChatComposerPasteEvent, type LexicalChatInputHandle } from "@/LexicalChatInput.js";
import type { AppSlashCommand } from "@/slashCommandHelpers.js";
export declare function ChatPromptEditor({ workspacePath, workspaceIdentity, taskId, skillCatalogSessionId, initialValue, syncInitialValueOnMount, placeholder, disabled, disabledReason, submitting, submitDisabled, allowSubmitWhenEmpty, enterSubmits, submitLabel, cancelLabel, showMentionButton, showSlashButton, enableWorkspaceFileDrop, enableExternalFileDrop, isDraggingOver, dragAttachmentHint, topContent, inputLeadingContent, leadingActions, attachmentAction, betweenCancelAndSubmitAction, submitControl, inputTestId, submitTestId, cancelTestId, inputApiRef, onModeSwitchContainerChange, triggerPanelContainer, promptHistory, className, shellClassName, avoidIosInputFocusZoom, compactPlaceholder, onChange, onSubmit, onModifiedSubmit, onCancel, onFocus, onWhiteboardMentionSelected, onPaste, onDragOver, onDragLeave, onDrop, excludedSlashCommandNames, appSlashCommands, enableMentionPanel, }: {
    workspacePath: string;
    workspaceIdentity?: string;
    taskId: string | null;
    /** 仅供 Composer Skill catalog；可为草稿的 prewarm Session。 */
    skillCatalogSessionId?: string | null;
    initialValue?: string;
    syncInitialValueOnMount?: boolean;
    placeholder?: string;
    disabled?: boolean;
    disabledReason?: string;
    submitting?: boolean;
    submitDisabled?: boolean;
    allowSubmitWhenEmpty?: boolean;
    enterSubmits?: boolean;
    submitLabel: string;
    cancelLabel?: string;
    showMentionButton?: boolean;
    showSlashButton?: boolean;
    enableWorkspaceFileDrop?: boolean;
    enableExternalFileDrop?: boolean;
    isDraggingOver?: boolean;
    dragAttachmentHint?: string;
    topContent?: ReactNode;
    /** 与输入正文同一行的前置内容；Highspeed 使用紧凑 Fast 标签。 */
    inputLeadingContent?: ReactNode;
    leadingActions?: ReactNode;
    attachmentAction?: {
        label: string;
        onSelect: () => void;
        testId?: string;
        menuItemTestId?: string;
    };
    /** 行内编辑专用：固定插在取消与主提交之间的第二动作。 */
    betweenCancelAndSubmitAction?: ReactNode;
    submitControl?: ReactNode;
    inputTestId?: string;
    submitTestId?: string;
    cancelTestId?: string;
    inputApiRef?: MutableRefObject<LexicalChatInputHandle | null>;
    onModeSwitchContainerChange?: (container: HTMLSpanElement | null) => void;
    triggerPanelContainer?: HTMLElement | null;
    promptHistory?: readonly string[];
    className?: string;
    shellClassName?: string;
    avoidIosInputFocusZoom?: boolean;
    compactPlaceholder?: boolean;
    onChange?: (value: string) => void;
    onSubmit: (value: string) => boolean | void;
    onModifiedSubmit?: (value: string) => boolean | void;
    onCancel?: () => void;
    onFocus?: () => void;
    onWhiteboardMentionSelected?: (boardId: string) => void | Promise<void>;
    onPaste?: (event: ChatComposerPasteEvent) => void;
    onDragOver?: DragEventHandler<HTMLDivElement>;
    onDragLeave?: DragEventHandler<HTMLDivElement>;
    onDrop?: DragEventHandler<HTMLDivElement>;
    excludedSlashCommandNames?: readonly string[];
    /** App 层本地斜杠命令（透传 LexicalChatInput）。 */
    appSlashCommands?: readonly AppSlashCommand[];
    /** mention 面板开关（透传 LexicalChatInput）。 */
    enableMentionPanel?: boolean;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ChatPromptEditor.d.ts.map