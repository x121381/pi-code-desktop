import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import { TID_CHAT_SEND_BUTTON } from "@zcode/shared";
import { ArrowUpIcon, Hand, XIcon } from "lucide-react";
import { ControlHintTooltip } from "../ControlHintTooltip.js";
import { Button } from "../components/ui/button.js";
import { Spinner } from "../components/ui/spinner.js";
import { cn } from "../components/lib/utils.js";
import { LexicalChatInput, } from "../LexicalChatInput.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { hasWorkspaceFileDragPayload, readWorkspaceFileDragPayload, } from "../lib/workspaceFileDrag.js";
import { appendWorkspaceFileMentionToComposer } from "../lib/workspaceFileComposer.js";
import { usePromptEditorDragState } from "../prompt-editor/usePromptEditorDragState.js";
import { ChatPromptActionMenu } from "../prompt-editor/ChatPromptActionMenu.js";
import { useComposerToolbarFit } from "../prompt-editor/useComposerToolbarFit.js";
function runAfterFrame(callback) {
    if (typeof requestAnimationFrame === "function") {
        requestAnimationFrame(callback);
        return;
    }
    callback();
}
export function ChatPromptEditor({ workspacePath, workspaceIdentity, taskId, skillCatalogSessionId, initialValue, syncInitialValueOnMount = true, placeholder, disabled = false, disabledReason, submitting = false, submitDisabled = false, allowSubmitWhenEmpty = false, enterSubmits = true, submitLabel, cancelLabel, showMentionButton = false, showSlashButton = false, enableWorkspaceFileDrop = false, enableExternalFileDrop = false, isDraggingOver = false, dragAttachmentHint, topContent, inputLeadingContent, leadingActions, attachmentAction, betweenCancelAndSubmitAction, submitControl, inputTestId, submitTestId, cancelTestId, inputApiRef, onModeSwitchContainerChange, triggerPanelContainer, promptHistory, className, shellClassName, avoidIosInputFocusZoom = false, compactPlaceholder = false, onChange, onSubmit, onModifiedSubmit, onCancel, onFocus, onWhiteboardMentionSelected, onPaste, onDragOver, onDragLeave, onDrop, excludedSlashCommandNames, appSlashCommands, enableMentionPanel, }) {
    const { intl } = useZCodeIntl();
    const toolbarRef = useComposerToolbarFit();
    const internalInputApiRef = useRef(null);
    const resolvedInputApiRef = inputApiRef ?? internalInputApiRef;
    const [internalTriggerPanelContainer, setInternalTriggerPanelContainer] = useState(null);
    const resolvedTriggerPanelContainer = triggerPanelContainer ?? internalTriggerPanelContainer;
    const latestTextRef = useRef(initialValue ?? "");
    const hasSyncedInitialValueRef = useRef(false);
    const { externalFileDragging, internalDragging, setExternalFileDragging, setInternalDragging, setWorkspaceFileDragging, workspaceFileDragging, } = usePromptEditorDragState({
        enableExternalFileDrop,
        enableWorkspaceFileDrop,
    });
    const actionMenuTitle = intl.formatMessage({
        id: "chat.composer.actionMenu",
    });
    const workspaceFileDragHint = intl.formatMessage({
        id: "chat.composer.workspaceFileDragHint",
    });
    const hasActionMenu = Boolean(attachmentAction) || showMentionButton || showSlashButton;
    useEffect(() => {
        if (!syncInitialValueOnMount) {
            return;
        }
        if (initialValue === undefined) {
            return;
        }
        if (hasSyncedInitialValueRef.current) {
            return;
        }
        hasSyncedInitialValueRef.current = true;
        latestTextRef.current = initialValue;
        runAfterFrame(() => {
            // task 草稿恢复时外层 input state 已经更新，但 Lexical 内部文本不会自动跟随 props。
            // 同时普通打字也会更新 input prop，必须先比较当前编辑器文本，避免每个字符都程序化重写编辑器。
            if (resolvedInputApiRef.current?.getMarkdown() === initialValue) {
                return;
            }
            resolvedInputApiRef.current?.setText(initialValue);
        });
    }, [initialValue, resolvedInputApiRef, syncInitialValueOnMount]);
    const handleTextChange = useCallback((value) => {
        latestTextRef.current = value;
        onChange?.(value);
    }, [onChange]);
    const handleSubmit = useCallback((event) => {
        event.preventDefault();
        onSubmit(resolvedInputApiRef.current?.getMarkdown() ?? latestTextRef.current);
    }, [onSubmit, resolvedInputApiRef]);
    const handleKeyDown = useCallback((event) => {
        if (event.key !== "Escape" || !onCancel || submitting) {
            return;
        }
        // Dialog 通过 React Portal 挂载时，Esc 关闭弹窗的事件仍会沿组件树
        // 冒泡到行内编辑 form；弹窗已消费这次交互，不能再把消息编辑一并取消。
        if (event.defaultPrevented ||
            (event.target instanceof Element && event.target.closest('[role="dialog"]'))) {
            return;
        }
        // 交互说明：用户消息 edit 是临时编辑态，Esc 应等价于点击取消，方便键盘流快速退出。
        event.preventDefault();
        onCancel();
    }, [onCancel, submitting]);
    const handleEditorSubmit = useCallback(
    // 适配：透传业务层返回值（false = 不 reset 编辑器，草稿保留），
    // 吞掉返回值会让 Enter 路径总是清空。
    (value) => onSubmit(value), [onSubmit]);
    const handleDragOver = useCallback((event) => {
        const hasWorkspaceFilePayload = enableWorkspaceFileDrop && hasWorkspaceFileDragPayload(event.dataTransfer);
        if (hasWorkspaceFilePayload) {
            // 浏览器在 dragover 阶段通常只暴露 dataTransfer.types，不保证能读到 getData 内容。
            // 之前用完整 payload 判断，导致编辑输入框 drop 可用但 hover 状态不亮。
            event.preventDefault();
            event.dataTransfer.dropEffect = "copy";
            setWorkspaceFileDragging(true);
            setInternalDragging(true);
            return;
        }
        if (enableExternalFileDrop && Array.from(event.dataTransfer.types).includes("Files")) {
            setExternalFileDragging(true);
        }
        onDragOver?.(event);
    }, [enableExternalFileDrop, enableWorkspaceFileDrop, onDragOver]);
    const handleDragLeave = useCallback((event) => {
        const nextTarget = event.relatedTarget;
        if (nextTarget instanceof Node && event.currentTarget.contains(nextTarget)) {
            return;
        }
        setInternalDragging(false);
        onDragLeave?.(event);
    }, [onDragLeave]);
    const handleDrop = useCallback((event) => {
        const workspaceFilePayload = enableWorkspaceFileDrop
            ? readWorkspaceFileDragPayload(event.dataTransfer)
            : null;
        if (workspaceFilePayload) {
            // file tree 拖拽不是系统文件，不能走附件分支；
            // 这里统一转换成和 @ 文件一致的 mention，避免 contenteditable 插入纯文本。
            event.preventDefault();
            // 用户消息编辑器嵌套在 ChatView drop target 内；消费后必须停止冒泡，
            // 否则同一条 mention 还会被底部主输入框再次接收。
            event.stopPropagation();
            setInternalDragging(false);
            setWorkspaceFileDragging(false);
            const currentMarkdown = resolvedInputApiRef.current?.getMarkdown() ?? latestTextRef.current;
            appendWorkspaceFileMentionToComposer({
                inputApiRef: resolvedInputApiRef,
                currentMarkdown,
                payload: workspaceFilePayload,
                workspacePath,
                workspaceIdentity,
                onTextChange: handleTextChange,
            });
            return;
        }
        setInternalDragging(false);
        setWorkspaceFileDragging(false);
        setExternalFileDragging(false);
        onDrop?.(event);
    }, [
        enableWorkspaceFileDrop,
        handleTextChange,
        onDrop,
        resolvedInputApiRef,
        workspaceIdentity,
        workspacePath,
    ]);
    // file tree 拖进编辑框时走的是 mention 插入，不是附件上传。
    // 这里单独使用 workspace file 文案，并从拖拽开始事件就点亮可投放状态，避免必须 over 到输入框才有反馈。
    const isWorkspaceFileDropActive = workspaceFileDragging || internalDragging;
    const isExternalFileDropActive = externalFileDragging || isDraggingOver;
    const draggingOverlayHint = isWorkspaceFileDropActive
        ? workspaceFileDragHint
        : isExternalFileDropActive
            ? dragAttachmentHint
            : undefined;
    const editorNode = (_jsx(LexicalChatInput, { placeholder: placeholder, disabled: disabled, submitDisabled: submitDisabled, allowSubmitWhenEmpty: allowSubmitWhenEmpty, enterSubmits: enterSubmits, onSubmit: handleEditorSubmit, onModifiedSubmit: onModifiedSubmit, onChange: handleTextChange, onFocus: onFocus, triggerPanelContainer: resolvedTriggerPanelContainer, workspacePath: workspacePath, workspaceIdentity: workspaceIdentity, taskId: taskId, skillCatalogSessionId: skillCatalogSessionId, inputTestId: inputTestId, editorApiRef: resolvedInputApiRef, promptHistory: promptHistory, avoidIosInputFocusZoom: avoidIosInputFocusZoom, compactPlaceholder: compactPlaceholder, onWhiteboardMentionSelected: onWhiteboardMentionSelected, onPaste: onPaste, excludedSlashCommandNames: excludedSlashCommandNames, appSlashCommands: appSlashCommands, enableMentionPanel: enableMentionPanel }));
    return (_jsxs("form", { onSubmit: handleSubmit, onKeyDown: handleKeyDown, className: cn("relative", className), children: [triggerPanelContainer ? null : (_jsx("div", { ref: setInternalTriggerPanelContainer, className: "absolute inset-x-0 bottom-full z-20" })), _jsxs("div", { onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop, className: cn("relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-input-border bg-input p-3 transition-colors hover:border-input-border-hover focus-within:!border-input-border-focused focus-within:bg-input-focused", (isWorkspaceFileDropActive || isExternalFileDropActive) &&
                    "border-brand bg-input-focused ring-1 ring-brand/30", shellClassName), children: [draggingOverlayHint ? (_jsx("div", { className: "pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-accent/55 backdrop-blur-sm", children: _jsxs("div", { className: "flex items-center gap-2 rounded-full border border-border bg-accent px-4 py-2 text-ui-base text-foreground shadow-sm", children: [_jsx(Hand, { className: "size-4 text-foreground" }), _jsx("span", { children: draggingOverlayHint })] }) })) : null, topContent, inputLeadingContent ? (_jsxs("div", { className: "flex min-w-0 items-start gap-2", children: [_jsx("div", { className: "shrink-0", children: inputLeadingContent }), _jsx("div", { className: "min-w-0 flex-1", children: editorNode })] })) : (editorNode), _jsxs("div", { ref: toolbarRef, className: "group/toolbar flex items-end gap-3", children: [_jsx("div", { className: "flex min-w-0 flex-1 items-center", "data-composer-leading-actions": true, children: _jsxs("div", { className: "flex shrink-0 items-center gap-1", "data-composer-leading-content": true, children: [hasActionMenu ? (_jsx(ChatPromptActionMenu, { actionMenuTitle: actionMenuTitle, excludedSlashCommandNames: excludedSlashCommandNames, attachmentAction: attachmentAction, disabled: disabled, disabledReason: disabledReason, inputApiRef: resolvedInputApiRef, workspacePath: workspacePath, workspaceIdentity: workspaceIdentity, sessionId: taskId, container: resolvedTriggerPanelContainer, showPlugins: enableMentionPanel !== false })) : null, leadingActions, onModeSwitchContainerChange ? (_jsx("span", { ref: onModeSwitchContainerChange, className: "flex shrink-0 items-center" })) : null] }) }), _jsxs("div", { className: "ml-auto flex shrink-0 items-center justify-end gap-1.5", "data-composer-trailing-actions": true, children: [onCancel && cancelLabel ? (_jsx(ControlHintTooltip, { title: cancelLabel, shortcut: "Esc", children: _jsxs(Button, { type: "button", variant: "ghost", size: "icon-lg", onClick: onCancel, disabled: submitting, "data-testid": cancelTestId, "aria-label": cancelLabel, children: [_jsx(XIcon, { className: "size-4" }), _jsx("span", { className: "sr-only", children: cancelLabel })] }) })) : null, betweenCancelAndSubmitAction, submitControl ?? (_jsx(ControlHintTooltip, { title: submitLabel, shortcut: enterSubmits ? "Enter" : undefined, children: _jsxs(Button, { type: "submit", size: "icon-md", disabled: submitDisabled, "data-testid": submitTestId ?? TID_CHAT_SEND_BUTTON, "aria-label": submitLabel, className: "gap-1 rounded-lg bg-brand text-ui-base text-foreground-inverse hover:bg-brand/80", children: [submitting ? _jsx(Spinner, { className: "size-4" }) : _jsx(ArrowUpIcon, { className: "size-4" }), _jsx("span", { className: "sr-only", children: submitLabel })] }) }))] })] })] })] }));
}
//# sourceMappingURL=ChatPromptEditor.js.map