import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable max-lines -- 闲时任务整页集中维护创建/编辑/History 与 composer 项目、权限、模型工具条，拆分会割裂表单状态。 */
/* 闲时任务创建/编辑整页。composer 范式：页标题 +
   返回行 + 内联保持电脑运行开关 + Settings/History tab + 标题输入 + 大 composer 盒
   （textarea + 工具条：项目/权限｜模型/推理档位）。权限四档默认 build，模型走白名单（D31）。 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { completeNewModelSelection } from "@zcode/provider";
import { FolderOpen } from "lucide-react";
import { TID_OFFPEAK_EDIT_SUBMIT, TID_OFFPEAK_EDIT_VIEW, TID_OFFPEAK_FORM_INSTRUCTIONS, TID_OFFPEAK_FORM_TITLE, ZCODE_AGENT_PROVIDER, } from "@zcode/shared";
import { Button } from "@/components/ui/button.js";
import { ControlHintTooltip } from "@/ControlHintTooltip.js";
import { Input } from "@/components/ui/input.js";
import { toast } from "@/components/ui/toast.js";
import { AUTOMATION_FORM_FIELD_CLASSNAME, AutomationChevronDownIcon, AutomationInfoIcon, AutomationSettingsHistoryTabs, } from "@/settings/AutomationDesignPrimitives.js";
import { AUTOMATION_FORM_INPUT_TYPOGRAPHY_CLASSNAME, AUTOMATION_INSTRUCTIONS_TOOLBAR_TRIGGER_CLASSNAME, AutomationInstructionsComposer, AutomationInstructionsTextarea, AutomationInstructionsToolbar, } from "@/settings/AutomationInstructionsComposer.js";
import { SettingsBreadcrumbReporter } from "@/settings/SettingsHeaderBreadcrumb.js";
import { OffPeakEditActionsMenu } from "@/settings/OffPeakEditActionsMenu.js";
import { OffPeakHistoryTab } from "@/settings/OffPeakHistoryTab.js";
import { AutomationSwitchToggle } from "@/settings/AutomationSwitchToggle.js";
import { cn } from "@/components/lib/utils.js";
import { SETTINGS_FRAME_CONTENT_CLASSNAME } from "@/settings/SettingsPageParts.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { useSettings } from "@/hooks/useSettingService.js";
import { useConfirmDialog } from "@/hooks/useConfirmDialog.js";
import { AUTOMATION_DEFAULT_MODE, buildAutomationModeOption, } from "@/settings/automationAgentConfigOptions.js";
import { ConfigSelect } from "@/chat-input-toolbar/display.js";
import { ChatEmptyWorkspacePreviewMenu } from "@/ChatEmptyState.js";
import { useAutomationProjectOptions } from "@/hooks/useAutomationProjectOptions.js";
import { OFF_PEAK_CREATE_TOOLTIP_CLASSNAME, resolveLocalizedOffPeakCreateTitle, shouldShowOffPeakModelSelectionIssue, } from "@/settings/offPeakUiPresentation.js";
import { ModelConfigSelect } from "@/ModelConfigSelect.js";
import { ThoughtLevelCycleControl } from "@/chat-input-toolbar/ThoughtLevelCycleControl.js";
import { resolveModelThoughtOption } from "@/lib/modelThoughtOption.js";
const MODEL_ITEM_NEVER_LOCKED = () => false;
export function buildOffPeakSubmissionModelSelection(providerId, modelId, displayedReasoningLevel) {
    const reasoningLevel = displayedReasoningLevel?.trim();
    return {
        providerId,
        modelId,
        ...(reasoningLevel ? { options: { reasoningLevel } } : {}),
    };
}
function workspaceBasename(path) {
    return path.replace(/\\/g, "/").split("/").filter(Boolean).pop() ?? path;
}
export function OffPeakEditView({ editing, initialDraft, modelSelectionView, defaultWorkspacePath, defaultWorkspaceIdentity, saving, createBlocked = false, createBlockedTooltip, onBack, onSubmit, onOpenSession, onDelete, onDeleteHistory, onPause, onContinue, showToast = toast, }) {
    const { intl } = useZCodeIntl();
    const { settings, update: updateSettings } = useSettings();
    const confirmDialog = useConfirmDialog();
    const localWorkspaceOptions = useAutomationProjectOptions();
    const preferredLocalWorkspace = localWorkspaceOptions.find((option) => !defaultWorkspaceIdentity && option.workspacePath === defaultWorkspacePath) ?? localWorkspaceOptions[0];
    const [tab, setTab] = useState("settings");
    const fullAccessWarningShownRef = useRef(false);
    const readOnlyRef = useRef(false);
    const titleTouchedRef = useRef(false);
    const thoughtTriggerRef = useRef(null);
    const localizedDefaultCreateTitle = intl.formatMessage({
        id: "offPeak.create.defaultTitle",
    });
    const defaultCreateTitle = initialDraft?.title ?? localizedDefaultCreateTitle;
    const previousLocalizedDefaultTitleRef = useRef(localizedDefaultCreateTitle);
    const [title, setTitle] = useState(editing?.title ?? defaultCreateTitle);
    const [prompt, setPrompt] = useState(editing?.prompt ?? initialDraft?.prompt ?? "");
    const [mode, setMode] = useState(editing?.permissionMode ?? AUTOMATION_DEFAULT_MODE);
    const offPeakProviderId = editing?.modelSelection?.providerId ?? modelSelectionView.providers[0]?.providerId ?? "";
    const allowedModels = useMemo(() => modelSelectionView.providers
        .find((provider) => provider.providerId === offPeakProviderId)
        ?.models.map((candidate) => candidate.modelId) ?? [], [modelSelectionView, offPeakProviderId]);
    const initialModel = editing ? (editing.modelSelection?.modelId ?? "") : (allowedModels[0] ?? "");
    const [model, setModel] = useState(initialModel);
    const [thoughtLevel, setThoughtLevel] = useState(() => editing
        ? editing.modelSelection?.options?.reasoningLevel
        : completeNewModelSelection(modelSelectionView, {
            providerId: offPeakProviderId,
            modelId: initialModel,
        })?.options?.reasoningLevel);
    const handleModelChange = useCallback((value) => {
        setModel(value);
        setThoughtLevel(completeNewModelSelection(modelSelectionView, {
            providerId: offPeakProviderId,
            modelId: value,
        })?.options?.reasoningLevel);
    }, [modelSelectionView, offPeakProviderId]);
    const [createWorkspacePath, setCreateWorkspacePath] = useState(preferredLocalWorkspace?.workspacePath ?? "");
    const modelSelectGroups = useMemo(() => allowedModels.length > 0
        ? [
            {
                key: "off-peak",
                label: "",
                items: allowedModels.map((allowedModel) => ({
                    key: allowedModel,
                    value: allowedModel,
                    name: allowedModel,
                })),
            },
        ]
        : [], [allowedModels]);
    const workspaceMenuTabs = useMemo(() => localWorkspaceOptions.map((option) => ({
        workspacePath: option.workspacePath,
        label: option.label,
    })), [localWorkspaceOptions]);
    useEffect(() => {
        if (editing || localWorkspaceOptions.length === 0)
            return;
        if (localWorkspaceOptions.some((option) => option.workspacePath === createWorkspacePath)) {
            return;
        }
        // 当前项目为远端或本地 tab 已关闭时，回落到仍可用的第一个本地项目。
        setCreateWorkspacePath(preferredLocalWorkspace?.workspacePath ?? "");
        initialRef.current.workspacePath = preferredLocalWorkspace?.workspacePath ?? "";
    }, [createWorkspacePath, editing, localWorkspaceOptions, preferredLocalWorkspace?.workspacePath]);
    // 闲时任务模型和 reasoning 档位只读取 Host 投影的 Built-in Config，
    // 避免 Renderer 按模型名重建第二份模型事实。
    const thoughtLevelOption = useMemo(() => resolveModelThoughtOption({
        modelSelectionView,
        providerId: offPeakProviderId,
        modelId: model,
        currentValue: thoughtLevel,
        formatLevelName: (level) => intl.formatMessage({ id: `offPeak.thought.${level}` }),
    }), [intl, model, modelSelectionView, offPeakProviderId, thoughtLevel]);
    const effectiveThoughtLevel = typeof thoughtLevelOption?.currentValue === "string" &&
        thoughtLevelOption.currentValue.trim().length > 0
        ? thoughtLevelOption.currentValue
        : undefined;
    // 丢弃草稿守卫：
    // 初值快照固定于首渲染，返回时有未保存改动 → 确认弹窗。
    const initialRef = useRef({
        title: editing?.title ?? defaultCreateTitle,
        prompt: editing?.prompt ?? initialDraft?.prompt ?? "",
        mode: editing?.permissionMode ?? AUTOMATION_DEFAULT_MODE,
        model: initialModel,
        thoughtLevel: editing?.modelSelection?.options?.reasoningLevel,
        workspacePath: editing?.workspacePath ?? preferredLocalWorkspace?.workspacePath ?? "",
    });
    useEffect(() => {
        const nextTitle = resolveLocalizedOffPeakCreateTitle({
            currentTitle: title,
            hasInitialTitle: Boolean(initialDraft?.title),
            isEditing: Boolean(editing),
            nextDefaultTitle: localizedDefaultCreateTitle,
            previousDefaultTitle: previousLocalizedDefaultTitleRef.current,
            titleTouched: titleTouchedRef.current,
        });
        previousLocalizedDefaultTitleRef.current = localizedDefaultCreateTitle;
        if (nextTitle === title)
            return;
        setTitle(nextTitle);
        initialRef.current.title = nextTitle;
    }, [editing, initialDraft?.title, localizedDefaultCreateTitle, title]);
    const dirty = title !== initialRef.current.title ||
        prompt !== initialRef.current.prompt ||
        mode !== initialRef.current.mode ||
        model !== initialRef.current.model ||
        thoughtLevel !== initialRef.current.thoughtLevel ||
        (!editing && createWorkspacePath !== initialRef.current.workspacePath);
    const handleBack = useCallback(async () => {
        if (!dirty || readOnlyRef.current) {
            onBack();
            return;
        }
        const confirmed = await confirmDialog({
            title: intl.formatMessage({ id: "offPeak.discard.title" }),
            description: intl.formatMessage({ id: "offPeak.discard.description" }),
            confirmLabel: intl.formatMessage({ id: "offPeak.discard.confirm" }),
            confirmVariant: "destructive",
            showCloseButton: true,
            showKeyboardHints: false,
            presentation: "automation-confirmation",
        });
        if (confirmed)
            onBack();
    }, [confirmDialog, dirty, intl, onBack]);
    const keepAwake = settings?.keepAwakeWhileRunning ?? false;
    // queued/paused 全字段可编辑；running 起锁定编辑、终态只读。
    const readOnly = Boolean(editing && editing.status !== "queued" && editing.status !== "paused");
    readOnlyRef.current = readOnly;
    const workspacePath = editing?.workspacePath ?? createWorkspacePath;
    const canSubmit = title.trim().length > 0 &&
        prompt.trim().length > 0 &&
        Boolean(workspacePath) &&
        Boolean(model) &&
        Boolean(effectiveThoughtLevel) &&
        !saving &&
        !createBlocked &&
        !readOnly;
    const handleSubmit = useCallback(async () => {
        if (!canSubmit)
            return;
        if (mode !== "yolo" && !fullAccessWarningShownRef.current) {
            fullAccessWarningShownRef.current = true;
            // 权限建议是非阻塞提示，使用 warning 会把中性建议渲染成橙色警告。
            // 第一次非 Full access 提交时用 Info 提示，但同一次点击继续创建，不引入二次确认。
            showToast(intl.formatMessage({ id: "offPeak.form.fullAccessHint" }), {
                durationMs: 8000,
                position: "top-center",
                variant: "info",
                dismissible: true,
                dismissLabel: intl.formatMessage({ id: "common.close" }),
            });
        }
        const ok = await onSubmit({
            title: title.trim(),
            prompt: prompt.trim(),
            permissionMode: mode,
            modelSelection: buildOffPeakSubmissionModelSelection(offPeakProviderId, model, effectiveThoughtLevel),
            workspacePath,
            ...(editing?.workspaceIdentity ? { workspaceIdentity: editing.workspaceIdentity } : {}),
        });
        if (ok)
            onBack();
    }, [
        canSubmit,
        editing,
        effectiveThoughtLevel,
        intl,
        mode,
        model,
        offPeakProviderId,
        onBack,
        onSubmit,
        prompt,
        title,
        workspacePath,
    ]);
    // 闲时与定时任务复用同一权限 option，并通过 provider 保持会话权限词表一致。
    const modeOption = useMemo(() => buildAutomationModeOption(mode), [mode]);
    const createSubmitButton = (_jsx(Button, { type: "button", variant: "default", size: "lg", "data-testid": TID_OFFPEAK_EDIT_SUBMIT, disabled: !canSubmit, onClick: () => void handleSubmit(), children: intl.formatMessage({ id: "offPeak.create.submit" }) }));
    return (_jsxs("div", { className: cn(SETTINGS_FRAME_CONTENT_CLASSNAME, "relative flex flex-col gap-6"), "data-testid": TID_OFFPEAK_EDIT_VIEW, children: [_jsx(SettingsBreadcrumbReporter, { items: [
                    {
                        label: editing?.title ?? intl.formatMessage({ id: "offPeak.create.title" }),
                    },
                ], onSectionSelect: () => void handleBack() }), _jsxs("div", { className: "space-y-1.5", children: [_jsx("h1", { "data-testid": "offpeak-edit-title", className: "text-ui-xl font-semibold text-foreground", children: intl.formatMessage({
                            id: editing ? "offPeak.edit.title" : "offPeak.create.title",
                        }) }), _jsx("p", { "data-testid": "offpeak-edit-subtitle", className: "text-ui-base text-foreground-subtle", children: intl.formatMessage({
                            id: editing ? "offPeak.edit.subtitle" : "offPeak.create.subtitle",
                        }) })] }), editing?.modelSelectionIssue && shouldShowOffPeakModelSelectionIssue(editing.status) ? (_jsxs("div", { role: "status", className: "flex items-center gap-2 rounded-[10px] border border-warning/40 bg-warning/10 px-3 py-2 text-ui-base text-warning", children: [_jsx(AutomationInfoIcon, { className: "size-4 shrink-0", "aria-hidden": "true" }), intl.formatMessage({ id: "offPeak.modelSelection.repairRequired" })] })) : null, _jsx("div", { className: "flex min-w-0 flex-wrap items-center gap-4 sm:flex-nowrap", children: _jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [_jsx(AutomationSwitchToggle, { checked: keepAwake, ariaLabel: intl.formatMessage({
                                id: "offPeak.form.keepAwakeLabel",
                            }), onChange: (value) => void updateSettings({ keepAwakeWhileRunning: value }), color: "blue", size: "sm" }), _jsx("span", { className: "text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "offPeak.form.keepAwakeLabel" }) })] }) }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(AutomationSettingsHistoryTabs, { value: tab, settingsLabel: intl.formatMessage({ id: "offPeak.tab.settings" }), historyLabel: intl.formatMessage({ id: "offPeak.tab.history" }), onValueChange: setTab }), tab !== "history" && !editing ? (createBlockedTooltip ? (_jsx(ControlHintTooltip, { title: createBlockedTooltip, side: "top", align: "center", className: OFF_PEAK_CREATE_TOOLTIP_CLASSNAME, children: _jsx("span", { className: "inline-flex", children: createSubmitButton }) })) : (createSubmitButton)) : tab !== "history" && !readOnly ? (_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("button", { type: "button", "data-testid": TID_OFFPEAK_EDIT_SUBMIT, disabled: !canSubmit, onClick: () => void handleSubmit(), className: "inline-flex h-8 items-center rounded-lg border-0 bg-white px-3 text-ui-base font-medium text-black shadow-none outline-none transition-colors hover:bg-white/90 focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-40", children: intl.formatMessage({ id: "offPeak.edit.save" }) }), editing ? (_jsx(OffPeakEditActionsMenu, { task: editing, ...(onPause ? { onPause } : {}), ...(onContinue ? { onContinue } : {}), ...(onDelete ? { onDelete } : {}) })) : null] })) : null] }), editing && tab === "settings" ? (_jsxs("div", { className: "flex min-h-11 items-center gap-3 rounded-[10px] bg-surface px-3 py-3 text-ui-base leading-5 text-foreground-subtle sm:py-0", children: [_jsx("span", { className: "flex size-5 shrink-0 items-center justify-center", "aria-hidden": "true", children: _jsx(AutomationInfoIcon, { className: "size-4", "aria-hidden": "true" }) }), intl.formatMessage({ id: "offPeak.keepAwakeBanner" })] })) : null, tab === "history" ? (_jsx(OffPeakHistoryTab, { task: editing, ...(onOpenSession
                    ? {
                        onOpenSession: (task) => task.sessionId
                            ? onOpenSession({
                                sessionId: task.sessionId,
                                workspacePath: task.workspacePath,
                                ...(task.workspaceIdentity
                                    ? { workspaceIdentity: task.workspaceIdentity }
                                    : {}),
                            })
                            : undefined,
                    }
                    : {}), ...(onDeleteHistory ? { onDelete: onDeleteHistory } : {}) })) : (_jsxs("div", { className: "flex flex-col gap-4", children: [editing?.sessionId ? (_jsxs("div", { className: AUTOMATION_FORM_FIELD_CLASSNAME, children: [_jsxs("div", { className: "flex min-w-0 items-center gap-2 text-ui-base leading-5", children: [_jsx("span", { className: "min-w-0 truncate text-foreground", children: intl.formatMessage({ id: "offPeak.boundSession.label" }, { title: editing.sessionTitle ?? editing.sessionId }) }), onOpenSession ? (_jsx("button", { type: "button", className: "shrink-0 text-foreground-subtle underline-offset-2 hover:underline", onClick: () => onOpenSession({
                                            sessionId: editing.sessionId,
                                            workspacePath: editing.workspacePath,
                                            ...(editing.workspaceIdentity
                                                ? { workspaceIdentity: editing.workspaceIdentity }
                                                : {}),
                                        }), children: intl.formatMessage({ id: "offPeak.goToSession" }) })) : null] }), _jsx("span", { className: "text-ui-base leading-5 text-foreground-subtle", children: intl.formatMessage({ id: "offPeak.boundSession.hint" }) })] })) : null, _jsxs("div", { className: AUTOMATION_FORM_FIELD_CLASSNAME, children: [_jsx("span", { className: "text-ui-base font-normal leading-5 text-foreground-subtle", children: intl.formatMessage({ id: "offPeak.form.titleLabel" }) }), _jsx(Input, { value: title, disabled: readOnly, "data-testid": TID_OFFPEAK_FORM_TITLE, placeholder: intl.formatMessage({
                                    id: "offPeak.form.titlePlaceholder",
                                }), onChange: (event) => {
                                    titleTouchedRef.current = true;
                                    setTitle(event.target.value);
                                }, className: cn("h-9 rounded-lg bg-card px-2 text-foreground hover:bg-surface-hover focus-visible:bg-card", AUTOMATION_FORM_INPUT_TYPOGRAPHY_CLASSNAME) })] }), _jsxs("div", { className: AUTOMATION_FORM_FIELD_CLASSNAME, children: [_jsx("span", { className: "text-ui-base font-normal leading-5 text-foreground-subtle", children: intl.formatMessage({ id: "offPeak.form.instructionsLabel" }) }), _jsxs(AutomationInstructionsComposer, { children: [_jsx(AutomationInstructionsTextarea, { "data-testid": TID_OFFPEAK_FORM_INSTRUCTIONS, value: prompt, disabled: readOnly, placeholder: intl.formatMessage({
                                            id: "offPeak.form.instructionsPlaceholder",
                                        }), onChange: (event) => setPrompt(event.target.value) }), _jsxs(AutomationInstructionsToolbar, { children: [_jsxs("div", { className: "flex min-w-0 flex-wrap items-center gap-0", children: [editing ? (_jsxs("span", { className: "flex h-7 min-w-0 items-center gap-1 rounded-full px-2 text-ui-base font-normal leading-snug text-foreground-subtle", children: [_jsx(FolderOpen, { className: "size-4 shrink-0", "aria-hidden": "true" }), _jsx("span", { className: "max-w-40 truncate", title: workspacePath, children: workspaceBasename(workspacePath) })] })) : workspaceMenuTabs.length > 0 ? (_jsx(ChatEmptyWorkspacePreviewMenu, { workspacePath: workspacePath, workspaceTabs: workspaceMenuTabs, allowConversationWorkspaceSelection: false, onSelectWorkspace: (workspace) => setCreateWorkspacePath(workspace.workspacePath), onSelectConversationWorkspace: () => { }, allowOpenWorkspace: false, allowRemoteWorkspace: false, onOpenFolder: () => { }, onConnectRemote: async () => "", onSelectRemoteProject: async () => { }, onCancelRemoteProject: async (_sessionId) => { }, containerClassName: "contents", triggerClassName: cn(AUTOMATION_INSTRUCTIONS_TOOLBAR_TRIGGER_CLASSNAME, "min-w-0 gap-1 px-2"), triggerIndicator: _jsx("span", { className: "text-foreground-subtle", children: _jsx(AutomationChevronDownIcon, { size: 14, containerSize: 20 }) }) })) : (_jsxs(Button, { type: "button", variant: "ghost", size: "xs", disabled: true, className: cn(AUTOMATION_INSTRUCTIONS_TOOLBAR_TRIGGER_CLASSNAME, "gap-1 px-2 text-foreground-subtlest"), children: [_jsx(FolderOpen, { className: "size-4", "aria-hidden": "true" }), intl.formatMessage({
                                                                id: "automations.form.project.localRequired",
                                                            })] })), _jsx(ConfigSelect, { option: modeOption, provider: ZCODE_AGENT_PROVIDER, onValueChange: setMode, disabled: readOnly, tooltipTitle: intl.formatMessage({
                                                            id: "chat.toolbar.mode.label",
                                                        }), triggerVariant: "ghost", triggerSize: "default", triggerClassName: cn(AUTOMATION_INSTRUCTIONS_TOOLBAR_TRIGGER_CLASSNAME, "w-fit max-w-56 min-w-0 shrink justify-start gap-1 px-2"), labelVisibilityClassName: "inline-flex min-w-0 truncate text-left", restoreFocusSelector: null })] }), _jsxs("div", { className: "flex w-full shrink-0 flex-nowrap items-center justify-end gap-0 sm:w-auto", children: [_jsx(ModelConfigSelect, { modelGroups: modelSelectGroups, normalizedValue: model, triggerLabel: model || intl.formatMessage({ id: "offPeak.form.modelLabel" }), showProviderLevel: false, showManageModelsAction: false, lockReasonMessage: "", isItemLocked: MODEL_ITEM_NEVER_LOCKED, onValueChange: handleModelChange, disabled: readOnly || allowedModels.length === 0, tooltipTitle: intl.formatMessage({
                                                            id: "offPeak.form.modelLabel",
                                                        }), contentSide: "top", contentAlign: "end", focusSelectorOnClose: null, labelVisibilityClassName: "inline-flex min-w-0", triggerClassName: cn(AUTOMATION_INSTRUCTIONS_TOOLBAR_TRIGGER_CLASSNAME, "w-fit max-w-72 min-w-0 shrink justify-between px-2"), triggerLabelClassName: "inline-flex min-w-0 truncate text-left" }), thoughtLevelOption ? (_jsx(ThoughtLevelCycleControl, { intl: intl, option: thoughtLevelOption, provider: ZCODE_AGENT_PROVIDER, disabled: readOnly, triggerRef: thoughtTriggerRef, triggerClassName: AUTOMATION_INSTRUCTIONS_TOOLBAR_TRIGGER_CLASSNAME, interactionMode: "select", restoreFocusSelector: null, labelVisibilityClassName: "inline-flex min-w-0", onValueChange: setThoughtLevel })) : null] })] })] }), _jsxs("div", { className: "mt-1 flex items-start gap-1.5 text-ui-base leading-5 text-foreground-subtle", children: [_jsx("span", { className: "flex size-5 shrink-0 items-center justify-center", "aria-hidden": "true", children: _jsx(AutomationInfoIcon, { className: "size-4" }) }), intl.formatMessage({ id: "offPeak.form.permissionWarning" })] })] })] }))] }));
}
//# sourceMappingURL=OffPeakEditView.js.map