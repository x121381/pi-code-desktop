import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { BotTopicPreparation } from "@/v4/BotTopicPreparation.js";
import { useBotTopicInterruption } from "@/v4/botGroupDeliveryContext.js";
import { ConnectedBotGroupDeliveryAction } from "@/v4/BotGroupDeliveryAction.js";
/* eslint-disable max-lines -- turn group 需要在同一处维护普通 assistant 与后台结果的严格行序，拆分会重复 actions/preview/tail 协议。 */
import { useIsOfficeMode } from "@/hooks/useInterfaceMode.js";
import { Fragment, memo, useCallback, useEffect, useMemo, useState, useSyncExternalStore, } from "react";
import { ChevronRightIcon, EyeIcon } from "lucide-react";
import { TID_CHAT_ASSISTANT_HISTORY_CONTENT, TID_CHAT_ASSISTANT_HISTORY_TRIGGER, TID_CHAT_BACKGROUND_RESULT_TITLE, TID_CHAT_LOADING, TID_V4_ROW, testId, } from "@zcode/shared";
import { ChatLoading } from "@/components/ai-elements/chat-loading.js";
import { ChatApiRetryStatus } from "@/chat-input-toolbar/display.js";
import { cn } from "@/components/lib/utils.js";
import { Button } from "@/components/ui/button.js";
import { Checkbox } from "@/components/ui/checkbox.js";
import { MessageActions } from "@/components/ai-elements/message.js";
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "@/components/ui/collapsible.js";
import { ToolCallBlock } from "@/ToolCallBlocks.js";
import { CronCreateAutomationCard, isCronAutomationCardToolCall, readCronCreateAutomationSummary, } from "@/ToolCallBlocks/renderers/cron-create.js";
import { isOffPeakCreateToolCall, OffPeakCreateTaskCard, readOffPeakCreateTaskSummary, } from "@/ToolCallBlocks/renderers/offpeak-create.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { HighspeedShareDialog } from "@/highspeed/HighspeedShareNoticeCard.js";
import { isHighspeedShareEligible } from "@/highspeed/highspeedShare.js";
import { aggregateHighspeedCardMetrics, getHighspeedTurnByCommandId, getHighspeedTurnVersion, subscribeHighspeedTurns, } from "@/highspeed/highspeedTurnStore.js";
import { useAssistantCodeCommentFeatureEnabled } from "@/AssistantCodeCommentFeatureProvider.js";
import { buildAssistantCodeCommentCards, projectAssistantCodeComments, } from "@/lib/assistantCodeComment.js";
import { useAssistantPreviewCardsForAssistantTextRow } from "@/v4/useAssistantPreviewCardsForRow.js";
import { shouldShowTurnChatLoading } from "@/v4/chatLoadingVisibility.js";
import { buildAssistantWorkRenderItems, ENABLE_CHANGES_TOOL_CALL_GROUPING, ENABLE_CUA_TOOL_CALL_GROUPING, ENABLE_EXPLORE_TOOL_CALL_GROUPING, ENABLE_TERMINAL_TOOL_CALL_GROUPING, } from "@/v4/conversationAssistantWorkItems.js";
import { ConversationAgentToolCallRow } from "@/v4/ConversationAgentToolCallRow.js";
import { ConversationFileSummaryPanel } from "@/v4/ConversationFileSummaryPanel.js";
import { WorkflowNotificationToolRow } from "@/v4/WorkflowNotificationToolRow.js";
import { ConversationWorkflowDigests } from "@/v4/ConversationWorkflowDigests.js";
import { ConversationWorkflowCompletion } from "@/v4/ConversationWorkflowCompletion.js";
import { resolveWorkflowTurnDigests } from "@/v4/workflowTurnDigests.js";
import { resolveWorkflowTurnCompletion } from "@/v4/workflowTurnCompletion.js";
import { ConversationAssistantTextActions } from "@/v4/ConversationRowView.js";
import { readAssistantFeedback } from "@/v4/ConversationRowView.js";
import { isConversationReasoningRowVisible, } from "@/v4/conversationRowContext.js";
import { formatConversationWorkDuration } from "@/v4/conversationWorkDuration.js";
import { ConversationTurnRow, resolveAssistantCopyText } from "@/v4/ConversationTurnRow.js";
import { ConversationHookDetailsAction } from "@/v4/ConversationHookDetailsAction.js";
import { toolCallRowToLegacyNode } from "@/v4/toolCallRowAdapter.js";
const MIN_VISIBLE_API_RETRY_ATTEMPT = 3;
function HighspeedOutputFooter({ generatedLabel, shareLabel, shareAriaLabel, shareEnabled, sharePending, onShare, }) {
    return (_jsxs("div", { "data-highspeed-output-footer": "true", className: "relative flex w-full items-center justify-center py-[18px] opacity-80", children: [_jsx("div", { "aria-hidden": "true", className: "absolute inset-x-0 top-1/2 border-t border-border" }), _jsxs("div", { className: "relative flex items-center gap-2 bg-background px-3", children: [_jsx("span", { className: "text-ui-base text-foreground-subtle", children: generatedLabel }), shareEnabled ? (_jsxs(Button, { type: "button", variant: "ghost", size: "default", className: "h-7 gap-1 rounded-[8px] bg-black/5 px-2 py-1 text-ui-base font-medium leading-5 text-foreground hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10", "data-highspeed-output-share": "true", disabled: sharePending, "aria-label": shareAriaLabel, onClick: onShare, children: [_jsx(EyeIcon, { className: "size-4 text-foreground/85", strokeWidth: 4 / 3, "aria-hidden": "true", "data-highspeed-output-share-icon": "true" }), shareLabel] })) : null] })] }));
}
function toRetryStatus(apiRetry) {
    const attempt = Math.max(1, Math.floor(apiRetry.attempt));
    // v4 maxAttempts 包含首次请求，而展示口径是重试次数；直接展示会把
    // 默认 10 次重试写成 1/11。
    const maxRetries = Math.max(Math.floor(apiRetry.maxAttempts) - 1, attempt);
    return {
        kind: "api_retry",
        attempt,
        maxRetries,
        retryDelayMs: 0,
        errorStatus: null,
        error: apiRetry.reasonCode,
    };
}
function TurnChatLoadingSlot({ apiRetry, eligible, }) {
    const { intl, locale } = useZCodeIntl();
    const retryStatus = useMemo(() => (apiRetry ? toRetryStatus(apiRetry) : null), [apiRetry]);
    // 前两次短暂恢复对用户等价于普通加载；保留 apiRetry 运行态，但只在
    // 第三次重试开始后显示计数。必须在 retry/loading 分支前收敛，否则会留下空 slot，
    // 而不是回退到 ChatLoading。
    const visibleRetryStatus = retryStatus && retryStatus.attempt >= MIN_VISIBLE_API_RETRY_ATTEMPT ? retryStatus : null;
    if (!visibleRetryStatus && !eligible)
        return null;
    return (_jsx("div", { "data-zcode-chat-loading-slot": "true", className: "min-h-5", children: visibleRetryStatus ? (_jsx(ChatApiRetryStatus, { apiRetry: visibleRetryStatus, intl: intl, locale: locale })) : (_jsx(ChatLoading, { loading: true, "data-testid": TID_CHAT_LOADING, size: "sm" })) }));
}
function ConversationExploreGroupRow({ item, context, }) {
    // explore 分组行已经处在 turn 容器的统一边距内，单独再加 px-4
    // 会让同一串工具调用有的内缩、有的不内缩。
    return (_jsx("div", { "data-row-id": item.rowId, "data-conversation-selectable": "true", "data-testid": testId(TID_V4_ROW, String(item.rowId)), children: _jsx(ToolCallBlock, { toolCallNode: item.node, workspacePath: context.workspacePath, theme: context.theme, codePreviewSettings: context.codePreviewSettings, showTodoToolCalls: context.messageStreamShowTodos === true, onOpenCodeViewer: context.onOpenCodeViewer, onOpenFileLink: context.onOpenFileLink, onOpenBrowserUrl: context.onOpenBrowserUrl, onOpenAutomationsMain: context.onOpenAutomationsMain }) }));
}
function ConversationToolGroupRow({ item, context, }) {
    const renderAssistantMessage = useCallback((event) => (_jsx(ConversationTurnRow, { row: event.row, context: context, hideAssistantActions: true, assistantCodeCommentProjectionEnabled: false })), [context]);
    const renderReasoning = useCallback((event) => (_jsx(ConversationTurnRow, { row: event.row, context: context, reasoningContentVariant: "nested" })), [context]);
    const visibleCuaEvents = useMemo(() => item.kind === "cuaGroup"
        ? item.events.filter((event) => event.kind !== "reasoning" ||
            isConversationReasoningRowVisible(event.row.rowId, context))
        : undefined, [context, item]);
    return (_jsx("div", { "data-row-id": item.rowId, "data-conversation-selectable": "true", "data-testid": testId(TID_V4_ROW, String(item.rowId)), children: _jsx(ToolCallBlock, { toolCallNode: item.node, workspacePath: context.workspacePath, theme: context.theme, codePreviewSettings: context.codePreviewSettings, showTodoToolCalls: context.messageStreamShowTodos === true, onOpenCodeViewer: context.onOpenCodeViewer, onOpenFileLink: context.onOpenFileLink, onOpenBrowserUrl: context.onOpenBrowserUrl, onOpenAutomationsMain: context.onOpenAutomationsMain, 
            // history/background 兼容路径只传虚拟父节点时，已被分组投影消费的
            // Assistant message / reasoning 没有交给 renderer，展开后会永久丢失。
            cuaGroupEvents: visibleCuaEvents, renderCuaAssistantMessage: item.kind === "cuaGroup" ? renderAssistantMessage : undefined, renderCuaReasoning: item.kind === "cuaGroup" ? renderReasoning : undefined }) }));
}
function ConversationCuaGroupRow({ item, context, }) {
    const renderAssistantMessage = useCallback((event) => (_jsx(ConversationTurnRow, { row: event.row, context: context, hideAssistantActions: true, assistantCodeCommentProjectionEnabled: false })), [context]);
    const renderReasoning = useCallback((event) => (_jsx(ConversationTurnRow, { row: event.row, context: context, reasoningContentVariant: "nested" })), [context]);
    const visibleCuaEvents = useMemo(() => item.events.filter((event) => event.kind !== "reasoning" || isConversationReasoningRowVisible(event.row.rowId, context)), [context, item.events]);
    return (_jsx("div", { "data-row-id": item.rowId, "data-conversation-selectable": "true", "data-testid": testId(TID_V4_ROW, String(item.rowId)), children: _jsx(ToolCallBlock, { toolCallNode: item.node, workspacePath: context.workspacePath, theme: context.theme, codePreviewSettings: context.codePreviewSettings, showTodoToolCalls: context.messageStreamShowTodos === true, onOpenCodeViewer: context.onOpenCodeViewer, onOpenFileLink: context.onOpenFileLink, onOpenBrowserUrl: context.onOpenBrowserUrl, onOpenAutomationsMain: context.onOpenAutomationsMain, cuaGroupEvents: visibleCuaEvents, renderCuaAssistantMessage: renderAssistantMessage, renderCuaReasoning: renderReasoning }) }));
}
function ConversationAssistantWorkItems({ rows, context, stageTailIsRunning = false, assistantCodeCommentProjectionEnabled = false, historyContainer, }) {
    const showReasoning = context.messageStreamShowReasoning === true;
    const firstReasoningRowId = context.messageStreamFirstReasoningRowId;
    const items = useMemo(() => buildAssistantWorkRenderItems(rows, {
        messageStreamShowReasoning: showReasoning,
        ...(firstReasoningRowId !== undefined
            ? { messageStreamFirstReasoningRowId: firstReasoningRowId }
            : {}),
    }, {
        stageTailIsRunning,
        enableCuaGrouping: ENABLE_CUA_TOOL_CALL_GROUPING,
        enableExploreGrouping: context.toolGroupingExploreEnabled ?? ENABLE_EXPLORE_TOOL_CALL_GROUPING,
        enableTerminalGrouping: context.toolGroupingTerminalEnabled ?? ENABLE_TERMINAL_TOOL_CALL_GROUPING,
        enableChangesGrouping: context.toolGroupingChangesEnabled ?? ENABLE_CHANGES_TOOL_CALL_GROUPING,
    }), [
        context.toolGroupingChangesEnabled,
        context.toolGroupingExploreEnabled,
        context.toolGroupingTerminalEnabled,
        stageTailIsRunning,
        firstReasoningRowId,
        rows,
        showReasoning,
    ]);
    // history 外壳不能在这层投影前创建：当 CUA 消费原 message
    // 或运行中 shell 被延迟分类时，会留下 pt-5 和空的 gap-4 容器。只有确认
    // 内层存在可渲染项后才创建 CollapsibleContent，让外壳与内容一起消失。
    if (items.length === 0) {
        return null;
    }
    // 连续工作项（工具/explore/reasoning）统一 gap-4 组容器（对齐旧版 tool-call-group），
    // 取代继承父级 gap-5/gap-2 + 每行 py-2 的双重且不一致的间距。
    const content = (_jsx("div", { className: "flex flex-col gap-4", children: items.map((item) => item.kind === "row" ? (_jsx(ConversationTurnRow, { row: item.row, context: context, hideAssistantActions: item.row.kind === "assistantText", assistantCodeCommentProjectionEnabled: assistantCodeCommentProjectionEnabled }, item.key)) : item.kind === "agentToolCall" ? (_jsx(ConversationAgentToolCallRow, { item: item, context: context }, item.key)) : item.kind === "exploreGroup" ? (_jsx(ConversationExploreGroupRow, { item: item, context: context }, item.key)) : (_jsx(ConversationToolGroupRow, { item: item, context: context }, item.key))) }));
    if (!historyContainer) {
        return content;
    }
    return (_jsx(CollapsibleContent, { "data-testid": testId(TID_CHAT_ASSISTANT_HISTORY_CONTENT, historyContainer.chunkKey), "data-history-open": String(historyContainer.open), children: _jsx("div", { className: "pt-5", children: content }) }));
}
function resolveCronAutomationTurnCards(rows) {
    let cards = [];
    for (const row of rows) {
        if (row.kind !== "toolCall" || row.status !== "success") {
            continue;
        }
        const normalizedToolName = row.toolName.toLowerCase().replace(/[^a-z0-9]/gu, "");
        if (normalizedToolName === "crondelete") {
            const deletedAutomationId = readCronDeleteAutomationId(row);
            if (deletedAutomationId) {
                // 只累计本轮成功的 Create/Update 会忽略后续 CronDelete，导致已经
                // 撤销的中间结果仍被提升成轮尾成功卡片。
                cards = cards.filter((card) => card.automation.automationId !== deletedAutomationId);
            }
            continue;
        }
        const node = toolCallRowToLegacyNode(row);
        if (!isCronAutomationCardToolCall(node.toolCall)) {
            continue;
        }
        const automation = readCronCreateAutomationSummary(node.toolCall);
        if (!automation) {
            continue;
        }
        if (automation.automationId) {
            cards = cards.filter((card) => card.automation.automationId !== automation.automationId);
        }
        cards.push({
            rowId: row.rowId,
            toolCallId: row.toolCallId,
            automation,
        });
    }
    return cards;
}
// 只收本轮 status==="success" 的 OffPeakCreate；同 id 重复输出保留最新一次。
// 刻意不复用 resolveCronAutomationTurnCards——那套带 CronDelete 撤销过滤语义，闲时无对应工具。
function resolveOffPeakTurnCards(rows) {
    let cards = [];
    for (const row of rows) {
        if (row.kind !== "toolCall" || row.status !== "success") {
            continue;
        }
        const node = toolCallRowToLegacyNode(row);
        if (!isOffPeakCreateToolCall(node.toolCall)) {
            continue;
        }
        const task = readOffPeakCreateTaskSummary(node.toolCall);
        if (!task) {
            continue;
        }
        if (task.offPeakTaskId) {
            cards = cards.filter((card) => card.task.offPeakTaskId !== task.offPeakTaskId);
        }
        cards.push({
            rowId: row.rowId,
            toolCallId: row.toolCallId,
            task,
        });
    }
    return cards;
}
function parseJsonRecord(value) {
    let candidate = value;
    if (typeof candidate === "string") {
        try {
            candidate = JSON.parse(candidate);
        }
        catch {
            return null;
        }
    }
    return typeof candidate === "object" && candidate !== null && !Array.isArray(candidate)
        ? candidate
        : null;
}
function readCronDeleteAutomationId(row) {
    for (const candidate of [row.output?.text, row.input, row.inputText]) {
        const record = parseJsonRecord(candidate);
        const id = record?.id;
        if (typeof id === "string" && id.trim()) {
            return id.trim();
        }
    }
    return undefined;
}
function CronAutomationTurnCards({ cards, context, }) {
    if (cards.length === 0) {
        return null;
    }
    return (_jsx("div", { className: "flex flex-col gap-3", children: cards.map((card) => (_jsx(CronCreateAutomationCard, { automation: card.automation, onOpenAutomationsMain: context.onOpenAutomationsMain }, `${card.rowId}:${card.toolCallId}`))) }));
}
function OffPeakTurnCards({ cards, context, }) {
    if (cards.length === 0) {
        return null;
    }
    return (_jsx("div", { className: "flex flex-col gap-3", children: cards.map((card) => (_jsx(OffPeakCreateTaskCard, { task: card.task, onOpenAutomationsMain: context.onOpenAutomationsMain }, `${card.rowId}:${card.toolCallId}`))) }));
}
function AssistantHistoryStatus({ segment, open, highspeed, highspeedMeta, sourceCommandIds, }) {
    const { intl, locale } = useZCodeIntl();
    const topicInterrupted = useBotTopicInterruption(sourceCommandIds);
    const durationLabel = formatConversationWorkDuration(segment.workStatus?.durationMs, intl, locale);
    const savedDurationLabel = segment.workStatus?.state === "completed" &&
        highspeedMeta?.savedDurationMs !== undefined &&
        highspeedMeta.savedDurationMs > 0
        ? formatConversationWorkDuration(highspeedMeta.savedDurationMs, intl, locale)
        : null;
    const label = segment.workStatus?.state === "interrupted"
        ? intl.formatMessage({
            id: topicInterrupted ? "chat.history.topicInterrupted" : "chat.history.stopped",
        })
        : segment.workStatus?.state === "running"
            ? intl.formatMessage({ id: "chat.history.workingFor" }, { duration: durationLabel ?? "" })
            : durationLabel
                ? intl.formatMessage({ id: "chat.history.workedFor" }, { duration: durationLabel })
                : intl.formatMessage({ id: "chat.history.worked" });
    return (_jsxs("div", { className: cn("flex w-full flex-wrap items-center justify-between gap-2 border-b", highspeed ? "border-icon-purple/30 pb-3 pl-1" : "border-[var(--color-border)]/50 pb-2"), children: [_jsx(CollapsibleTrigger, { asChild: true, children: _jsxs("button", { type: "button", "data-testid": testId(TID_CHAT_ASSISTANT_HISTORY_TRIGGER, segment.key), "data-history-open": String(open), className: "group/history-message inline-flex max-w-full items-center gap-2 text-left text-ui-base text-foreground-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-input-border-focused)]", children: [_jsx("span", { className: cn("truncate", highspeed && "font-medium leading-5 text-icon-purple"), "data-highspeed-duration": highspeed ? "true" : undefined, children: label }), !segment.assistantHistoryDefaultOpen ? (_jsx(ChevronRightIcon, { "aria-hidden": true, className: cn("size-4 shrink-0 text-[var(--color-foreground-subtlest)] opacity-70 transition-transform", open ? "rotate-90" : "rotate-0") })) : null] }) }), highspeed ? (_jsxs("div", { className: "ml-auto flex shrink-0 items-center gap-2 text-icon-purple", children: [savedDurationLabel ? (_jsx("span", { className: "text-ui-sm font-medium leading-4", "data-highspeed-saved-duration": "true", children: intl.formatMessage({ id: "chat.highspeed.savedDuration" }, { duration: savedDurationLabel }) })) : null, _jsx("span", { className: "rounded-full bg-hover px-2 py-0.5 text-ui-sm leading-4", "data-highspeed-status-tag": "true", children: intl.formatMessage({ id: "chat.highspeed.statusTag" }) })] })) : null] }));
}
function ConversationWorkSegmentFlow({ segment, sourceCommandIds, context, onFork, onRetry, onEdit, editWorkspaceRewindAvailability, assistantCopyText, assistantPreviewCards, assistantPreviewCardsAutoOpenKey, assistantCodeCommentCards, assistantCodeCommentProjectionEnabled, canForkLatestAssistant, canRetryLatestAssistant, highspeed, highspeedMeta, shareSelectionToggle, shareSelectionRowId, }) {
    const [historyOpen, setHistoryOpen] = useState(segment.assistantHistoryDefaultOpen);
    useEffect(() => {
        setHistoryOpen(segment.assistantHistoryDefaultOpen);
    }, [segment.assistantHistoryDefaultOpen, segment.key]);
    const shouldShowHistoryStatus = segment.workStatus !== undefined;
    const firstAssistantFlowItemIndex = segment.flowItems.findIndex((item) => item.kind !== "userInput");
    let historyChunkIndex = 0;
    const open = segment.assistantHistoryDefaultOpen ? true : historyOpen;
    return (_jsxs(Collapsible, { open: open, onOpenChange: segment.assistantHistoryDefaultOpen ? undefined : setHistoryOpen, 
        // 外层 flex gap 不属于 Radix 测量的 content 高度，收起到 0 后会在
        // display:none 的最后一帧再少 20px。普通兄弟用外边距保持原盒模型，history
        // 的间距则放进动画层。
        className: "history-message flex flex-col [&>*+*:not([data-slot='collapsible-content'])]:mt-5", children: [segment.flowItems.map((item, index) => {
                const stageTailIsRunning = segment.workStatus?.state === "running" &&
                    index === segment.flowItems.length - 1 &&
                    (item.kind === "assistantHistory" || item.kind === "assistantWork");
                const showHistoryStatus = shouldShowHistoryStatus && index === firstAssistantFlowItemIndex;
                const itemKey = item.kind === "userInput" || item.kind === "assistantText"
                    ? `${item.kind}:${item.row.rowId}`
                    : `${item.kind}:${item.rows[0]?.rowId ?? index}`;
                let content;
                if (item.kind === "userInput") {
                    const userRow = (_jsx(ConversationTurnRow, { row: item.row, context: context, onEdit: item.row.actions?.canEdit === true ? onEdit : undefined, editWorkspaceRewindAvailability: editWorkspaceRewindAvailability }));
                    content =
                        shareSelectionToggle && item.row.rowId === shareSelectionRowId ? (_jsxs("div", { className: "relative", children: [shareSelectionToggle, userRow] })) : (userRow);
                }
                else if (item.kind === "cuaGroup") {
                    const group = _jsx(ConversationCuaGroupRow, { item: item, context: context });
                    if (item.flowKind === "assistantHistory") {
                        const chunkKey = historyChunkIndex === 0 ? segment.key : `${segment.key}:chunk-${historyChunkIndex}`;
                        historyChunkIndex += 1;
                        content = (_jsx(CollapsibleContent, { "data-testid": testId(TID_CHAT_ASSISTANT_HISTORY_CONTENT, chunkKey), "data-history-open": String(open), children: _jsx("div", { className: "pt-5", children: group }) }));
                    }
                    else {
                        content = group;
                    }
                }
                else if (item.kind === "assistantHistory") {
                    const chunkKey = historyChunkIndex === 0 ? segment.key : `${segment.key}:chunk-${historyChunkIndex}`;
                    historyChunkIndex += 1;
                    content = (_jsx(ConversationAssistantWorkItems, { rows: item.rows, context: context, stageTailIsRunning: stageTailIsRunning, assistantCodeCommentProjectionEnabled: assistantCodeCommentProjectionEnabled, historyContainer: { chunkKey, open } }));
                }
                else if (item.kind === "assistantText") {
                    content = (_jsx(ConversationTurnRow, { row: item.row, context: context, onFork: item.latest && canForkLatestAssistant ? onFork : undefined, onRetry: item.latest && canRetryLatestAssistant ? onRetry : undefined, hideAssistantActions: !item.latest, deferAssistantActions: item.latest, assistantCopyText: item.latest ? assistantCopyText : undefined, assistantPreviewCards: item.latest ? assistantPreviewCards : undefined, assistantPreviewCardsAutoOpenKey: item.latest ? assistantPreviewCardsAutoOpenKey : undefined, assistantCodeCommentCards: item.latest ? assistantCodeCommentCards : undefined, assistantCodeCommentProjectionEnabled: assistantCodeCommentProjectionEnabled }));
                }
                else {
                    content = (_jsx(ConversationAssistantWorkItems, { rows: item.rows, context: context, stageTailIsRunning: stageTailIsRunning, assistantCodeCommentProjectionEnabled: assistantCodeCommentProjectionEnabled }));
                }
                return (_jsxs(Fragment, { children: [showHistoryStatus ? (_jsx(AssistantHistoryStatus, { segment: segment, open: open, highspeed: highspeed, highspeedMeta: highspeedMeta, sourceCommandIds: sourceCommandIds })) : null, content] }, itemKey));
            }), shouldShowHistoryStatus && firstAssistantFlowItemIndex < 0 ? (_jsx(AssistantHistoryStatus, { segment: segment, sourceCommandIds: sourceCommandIds, open: open, highspeed: highspeed, highspeedMeta: highspeedMeta })) : null] }));
}
function ConversationTurnFlow({ unit, apiRetry, context, onFork, onRetry, onEdit, editWorkspaceRewindAvailability, assistantCopyText, assistantCodeCommentCards, assistantCodeCommentProjectionEnabled, assistantPreviewCardsAutoOpenKey, highspeed, highspeedMeta, shareSelectionToggle, shareSelectionRowId, }) {
    // 产品语义：可见正文或工具不代表主轮已经结束；ChatLoading 跟随最后一轮
    // running 生命周期，但等待用户回答/授权时由交互 UI 独占进度反馈。
    const showLoading = shouldShowTurnChatLoading({
        blockedByActiveWork: context.chatLoadingBlockedByActiveWork === true,
        blockedByInteraction: context.chatLoadingBlockedByInteraction === true,
        isLastTurn: unit.isLastTurn,
        isRunning: unit.isRunning,
        rows: unit.assistantWorkRows,
    });
    const assistantPreviewCards = useAssistantPreviewCardsForAssistantTextRow({
        row: unit.latestAssistantTextRow,
        assistantTextRows: unit.assistantTextRows,
        latestAssistantTextRow: unit.latestAssistantTextRow,
        workspacePath: context.workspacePath,
        workspaceHomePath: context.workspaceHomePath,
        compactForRemoteControl: context.compactForRemoteControl,
        fileChangesTarget: unit.header?.entityId
            ? { rowId: unit.header.rowId, entityId: unit.header.entityId }
            : null,
        fileChangesState: unit.header?.fileChanges?.state,
        fetchFileChanges: context.fetchFileChanges,
    });
    if (unit.timelineOnly) {
        return (_jsxs("div", { className: "flex flex-col gap-2", children: [_jsx(ConversationAssistantWorkItems, { rows: unit.assistantWorkRows, context: context, stageTailIsRunning: unit.isRunning, assistantCodeCommentProjectionEnabled: assistantCodeCommentProjectionEnabled }), _jsx(TurnChatLoadingSlot, { apiRetry: apiRetry, eligible: showLoading })] }));
    }
    const projectedWorkSegments = unit.workSegments ?? [];
    const workSegments = projectedWorkSegments.length > 0
        ? projectedWorkSegments.length === 1
            ? [
                {
                    ...projectedWorkSegments[0],
                    // 兼容仍直接构造/覆写旧 render unit 的调用方；真实 guide 多段不走这个分支。
                    assistantHistoryDefaultOpen: unit.assistantHistoryDefaultOpen,
                },
            ]
            : projectedWorkSegments
        : [
            {
                key: unit.key,
                flowItems: unit.flowItems,
                assistantWorkRows: unit.assistantWorkRows,
                assistantHistoryRows: unit.assistantHistoryRows,
                assistantFollowingRows: unit.assistantFollowingRows,
                assistantHistoryDefaultOpen: unit.assistantHistoryDefaultOpen,
                ...(unit.workStatus ? { workStatus: unit.workStatus } : {}),
            },
        ];
    if (workSegments.every((segment) => segment.flowItems.length === 0 && segment.workStatus === undefined) &&
        !showLoading) {
        return null;
    }
    const latestAssistantTextRow = unit.latestAssistantTextRow;
    const canRetryLatestAssistant = latestAssistantTextRow?.actions?.canRetry === true;
    const canForkLatestAssistant = latestAssistantTextRow?.actions?.canFork === true;
    // 即使恢复了 guide 的 row 全序，也不能让所有 history chunk 共享同一个
    // Collapsible。accepted guide 现在由 CLI workSegments 定界，每段组件自行维护折叠状态。
    return (_jsxs("div", { className: "flex flex-col gap-5", children: [workSegments.map((segment) => (_jsx(ConversationWorkSegmentFlow, { segment: segment, sourceCommandIds: [
                    ...segment.flowItems.flatMap((item) => item.kind === "userInput" && item.row.sourceCommandId
                        ? [item.row.sourceCommandId]
                        : []),
                    ...(segment === workSegments[0] && unit.header?.sourceCommandId
                        ? [unit.header.sourceCommandId]
                        : []),
                ], context: context, onFork: onFork, onRetry: onRetry, onEdit: onEdit, editWorkspaceRewindAvailability: editWorkspaceRewindAvailability, assistantCopyText: assistantCopyText, assistantPreviewCards: assistantPreviewCards, assistantPreviewCardsAutoOpenKey: assistantPreviewCardsAutoOpenKey, assistantCodeCommentCards: assistantCodeCommentCards, assistantCodeCommentProjectionEnabled: assistantCodeCommentProjectionEnabled, canForkLatestAssistant: canForkLatestAssistant, canRetryLatestAssistant: canRetryLatestAssistant, highspeed: highspeed, highspeedMeta: highspeedMeta, shareSelectionToggle: shareSelectionToggle, shareSelectionRowId: shareSelectionRowId }, segment.key))), _jsx(TurnChatLoadingSlot, { apiRetry: apiRetry, eligible: showLoading })] }));
}
/**
 * 能撑起「后台结果头」这套渲染的来源白名单。
 *
 * 这里刻意仍是白名单而不是直接信任 schema：`originMeta` 在 userInputRow 上是 optional，
 * 跨版本仍可能出现第四个取值，而没见过的来源拿不到合适的标题语义，退回普通 assistant
 * 分支比谎报一个标题好。
 *
 * workflow run 的 `backgroundSource` 是 `"workflow"`（CLI 侧
 * `background-tasks.ts` 在 CreateWorkflow 终态上报，title 由 `workflowTaskSubject` 铸造），
 * 原本落在白名单外，于是一条 run 跑完之后那一轮**既没有标题、也退化成按工时折叠的普通
 * assistant 段落**——后台结果分组整个消失。标题不需要本地化：它由 CLI 权威给出，
 * bash / subagent 同样直接透传。
 */
const BACKGROUND_RESULT_TITLE_SOURCES = new Set([
    "bash",
    "subagent",
    "workflow",
]);
function resolveBackgroundResultTitle(unit) {
    if (unit.header?.origin !== "backgroundResult")
        return undefined;
    const originMeta = unit.header.originMeta;
    if (!originMeta?.workId.trim() || !originMeta.title.trim())
        return undefined;
    if (!BACKGROUND_RESULT_TITLE_SOURCES.has(originMeta.backgroundSource)) {
        return undefined;
    }
    return originMeta.title.trim();
}
/**
 * 该轮是否以 workflow 通知卡（ToolLayout 行）开头。
 *
 * 用于两处：`ConversationBackgroundResultWork` 决定渲染通知行还是裸标题行；轮容器决定是否
 * 去掉轮顶 `pt-14`。后台结果轮没有可见的 user 行，通知卡就是轮内第一个节点——若照常保留
 * 轮顶 padding，卡片上方会叠出 56px + 上一轮 pb-5 共约 76px 的空白，用户判为多余。
 */
function resolveWorkflowNotification(unit) {
    if (unit.header?.origin !== "backgroundResult")
        return undefined;
    const originMeta = unit.header.originMeta;
    return originMeta?.backgroundSource === "workflow" ? originMeta.workflowNotification : undefined;
}
function ConversationBackgroundResultWork({ unit, apiRetry, context, onFork, onRetry, title, assistantCopyText, assistantCodeCommentCards, assistantCodeCommentProjectionEnabled, assistantPreviewCardsAutoOpenKey, }) {
    const hasHistory = unit.assistantHistoryRows.length > 0;
    const hasFollowing = unit.assistantFollowingRows.length > 0;
    const showLoading = shouldShowTurnChatLoading({
        blockedByActiveWork: context.chatLoadingBlockedByActiveWork === true,
        blockedByInteraction: context.chatLoadingBlockedByInteraction === true,
        isLastTurn: unit.isLastTurn,
        isRunning: unit.isRunning,
        rows: unit.assistantWorkRows,
    });
    const latestAssistantTextRow = unit.latestAssistantTextRow;
    const assistantPreviewCards = useAssistantPreviewCardsForAssistantTextRow({
        row: latestAssistantTextRow,
        assistantTextRows: unit.assistantTextRows,
        latestAssistantTextRow,
        workspacePath: context.workspacePath,
        workspaceHomePath: context.workspaceHomePath,
        compactForRemoteControl: context.compactForRemoteControl,
        fileChangesTarget: unit.header?.entityId
            ? { rowId: unit.header.rowId, entityId: unit.header.entityId }
            : null,
        fileChangesState: unit.header?.fileChanges?.state,
        fetchFileChanges: context.fetchFileChanges,
    });
    // 后台结果已经由独立唤醒轮总结过；复用普通 assistant 的工时折叠
    // 会显示不准确的分段耗时，并让一段短总结产生没有意义的收起状态。
    //
    // workflow run 的 workflow 通知带结构化载荷时改渲染既有工具卡语法的通知行（替换裸标题行）；
    // 载荷缺席（批量轮、旧 transcript、bash/subagent）→ 原样退回标题行。
    const workflowNotification = resolveWorkflowNotification(unit);
    const workflowRunId = unit.header?.originMeta?.workId;
    // 打开 run 详情：宿主注入 onOpenWorkflowRun + 联查到 toolCallId 才可点；冷恢复查不到时
    // 展开体内不渲染链接。toolCallId 走投影/journal 联查表，与 CreateWorkflow 工具卡同一条打开路径。
    const workflowRunSummary = workflowNotification && workflowRunId
        ? context.workflowRunByRunId?.get(workflowRunId)
        : undefined;
    const openWorkflowRun = workflowNotification &&
        workflowRunId &&
        context.onOpenWorkflowRun &&
        context.sessionId &&
        workflowRunSummary?.toolCallId
        ? () => context.onOpenWorkflowRun?.({
            parentSessionId: context.sessionId,
            toolCallId: workflowRunSummary.toolCallId,
            runId: workflowRunId,
            workflowName: title,
        })
        : undefined;
    const workflowPendingQids = workflowNotification && workflowRunId
        ? context.workflowRunPendingQuestionsByRunId?.get(workflowRunId)
        : undefined;
    // 产物 chip → 全尺寸查看 tab。门比 `openWorkflowRun` 松一格：产物 tab 只需要
    // (parentSessionId, runId, artifactId)，**不需要** toolCallId——它不画因果图，也就不必
    // 回到那条 CreateWorkflow 工具行。冷恢复后联查不到 toolCallId 的通知行因此仍能开产物。
    const openWorkflowArtifact = workflowNotification && workflowRunId && context.onOpenWorkflowArtifact && context.sessionId
        ? (artifactId) => {
            // 载荷里那一枚的 `contentType`（终态通知才有产物清单）：宿主据它决定 html 产物
            // 直接开浏览器 tab 还是开产物 tab，所以这里带得到就带上。载荷刻意不带 `sourcePath`
            // （状态帧体积），宿主缺席时自己查 journal 补。
            const contentType = workflowNotification.kind === "terminal"
                ? workflowNotification.artifacts?.find((candidate) => candidate.id === artifactId)
                    ?.contentType
                : undefined;
            context.onOpenWorkflowArtifact?.({
                parentSessionId: context.sessionId,
                runId: workflowRunId,
                artifactId,
                ...(contentType === undefined ? {} : { contentType }),
            });
        }
        : undefined;
    return (_jsxs("div", { className: "flex flex-col gap-5", children: [workflowNotification ? (_jsx(WorkflowNotificationToolRow, { notification: workflowNotification, runName: title, testIdKey: unit.key, theme: context.theme, onOpenRun: openWorkflowRun, onOpenArtifact: openWorkflowArtifact, pendingQids: workflowPendingQids, 
                // 留白行的三态（docs/dynamic-workflow/transcript-and-notifications.md「The hole row's live state」）：
                // run 在活投影里就递它的留白表（可能为空 = 已补全 / 没记录），不在场即 undefined → 中性词。
                holes: workflowRunSummary?.run === undefined ? undefined : (workflowRunSummary.run.holes ?? []) })) : (_jsx("div", { className: "flex w-full border-b border-[var(--color-border)]/50 pb-2", children: _jsx("div", { "data-testid": testId(TID_CHAT_BACKGROUND_RESULT_TITLE, unit.key), className: "min-w-0 whitespace-pre-wrap break-words text-left text-ui-base text-[var(--color-foreground-subtle)]", children: title }) })), hasHistory ? (_jsx("div", { className: "flex flex-col gap-2", children: _jsx(ConversationAssistantWorkItems, { rows: unit.assistantHistoryRows, context: context, assistantCodeCommentProjectionEnabled: assistantCodeCommentProjectionEnabled }) })) : null, latestAssistantTextRow ? (_jsx(ConversationTurnRow, { row: latestAssistantTextRow, context: context, onFork: latestAssistantTextRow.actions?.canFork === true ? onFork : undefined, onRetry: latestAssistantTextRow.actions?.canRetry === true ? onRetry : undefined, deferAssistantActions: true, assistantCopyText: assistantCopyText, assistantPreviewCards: assistantPreviewCards, assistantPreviewCardsAutoOpenKey: assistantPreviewCardsAutoOpenKey, assistantCodeCommentCards: assistantCodeCommentCards, assistantCodeCommentProjectionEnabled: assistantCodeCommentProjectionEnabled }, `${latestAssistantTextRow.rowId}:${latestAssistantTextRow.entityId ?? ""}`)) : null, hasFollowing ? (_jsx(ConversationAssistantWorkItems, { rows: unit.assistantFollowingRows, context: context, assistantCodeCommentProjectionEnabled: assistantCodeCommentProjectionEnabled })) : null, _jsx(TurnChatLoadingSlot, { apiRetry: apiRetry, eligible: showLoading })] }));
}
function ConversationTurnGroupImpl({ unit, nowMs = Date.now(), apiRetry = null, context, onFork, onRetry, onFeedbackChange, onEdit, shareSelection, }) {
    const isOfficeMode = useIsOfficeMode();
    const { intl } = useZCodeIntl();
    const visibleUserRows = useMemo(() => unit.visibleUserInputs, [unit.visibleUserInputs]);
    useSyncExternalStore(subscribeHighspeedTurns, getHighspeedTurnVersion, getHighspeedTurnVersion);
    const sourceCommandId = unit.header?.sourceCommandId ?? visibleUserRows[0]?.sourceCommandId;
    const highspeedTurn = getHighspeedTurnByCommandId(sourceCommandId);
    // Bug 根因：历史标识过去只依赖 Renderer 内存；卡过期或冷恢复后记录不可用，
    // 即使 transcript 已持久化 highspeed metadata，也会把 accelerated output 渲染成普通工时。
    const isHighspeed = highspeedTurn !== null || visibleUserRows.some((row) => row.highspeed);
    const highspeedExpiresAt = Math.max(highspeedTurn?.card.expiresAt ?? Number.NEGATIVE_INFINITY, ...visibleUserRows.flatMap((row) => (row.highspeed ? [row.highspeed.expiresAt] : [])));
    // Bug 根因：紫色流光过去只看“本轮曾使用 Highspeed”，卡过期后 metadata 仍会保留，
    // 导致 fallback 阶段仍在执行的 Tool 被永久染成紫色。运行态样式必须同时服从卡片有效期。
    const showHighspeedAnimatedGradient = isHighspeed && unit.isRunning && highspeedExpiresAt > nowMs;
    // 完成态统计即使因 replayable 事件先到，也必须等整轮停止生成后才能进入 UI。
    const highspeedMeta = unit.isRunning
        ? undefined
        : visibleUserRows.find((row) => row.highspeed)?.highspeed;
    const highspeedShareTarget = useMemo(() => {
        let target = null;
        if (highspeedTurn?.metrics &&
            highspeedTurn.metricsPersistedAt !== undefined &&
            highspeedTurn.metrics.regularTps > 0 &&
            highspeedTurn.metrics.highspeedTps !== undefined &&
            highspeedTurn.metrics.highspeedTps > 0) {
            target = {
                cardId: highspeedTurn.card.cardId,
                metrics: aggregateHighspeedCardMetrics(highspeedTurn.card.cardId),
            };
        }
        else if (unit.highspeedOutputFooterTarget) {
            target = unit.highspeedOutputFooterTarget;
        }
        else if (highspeedMeta?.outputTokens !== undefined &&
            highspeedMeta.outputTokens > 0 &&
            highspeedMeta.highspeedTps !== undefined &&
            highspeedMeta.highspeedTps > 0 &&
            highspeedMeta.regularTps !== undefined &&
            highspeedMeta.regularTps > 0) {
            // Bug 原因：冷恢复后 Renderer 内存记录为空，但 transcript 已持久化完整分享统计；
            // 只依赖 highspeedTurn 会让可见的历史分享按钮永久 disabled。
            target = {
                cardId: highspeedMeta.cardId,
                metrics: {
                    outputTokens: highspeedMeta.outputTokens,
                    // 分享接口不要求 durationMs；缺失时仅让本地耗时降级为 0，不阻塞分享。
                    durationMs: highspeedMeta.durationMs ?? 0,
                    regularTps: highspeedMeta.regularTps,
                    highspeedTps: highspeedMeta.highspeedTps,
                    ...(highspeedMeta.savedDurationMs !== undefined
                        ? { savedDurationMs: highspeedMeta.savedDurationMs }
                        : {}),
                },
            };
        }
        // 卡片和历史标识继续保留，但不超过 1.2x 或缺少完整耗时数据时不提供分享入口。
        return target && isHighspeedShareEligible(target.metrics) ? target : null;
    }, [highspeedMeta, highspeedTurn, unit.highspeedOutputFooterTarget]);
    const [highspeedShareDialogOpen, setHighspeedShareDialogOpen] = useState(false);
    const firstReasoningRowId = useMemo(() => unit.assistantWorkRows.find((row) => row.kind === "reasoning")?.rowId, [unit.assistantWorkRows]);
    const assistantRowContext = useMemo(() => ({
        ...context,
        ...(firstReasoningRowId !== undefined
            ? { messageStreamFirstReasoningRowId: firstReasoningRowId }
            : {}),
    }), [context, firstReasoningRowId]);
    const latestAssistantTextRow = unit.latestAssistantTextRow;
    const assistantPreviewPptxAutoOpenTarget = context.assistantPreviewPptxAutoOpenTarget;
    const codeCommentCardsEnabled = useAssistantCodeCommentFeatureEnabled();
    const assistantCodeCommentProjectionEnabled = codeCommentCardsEnabled &&
        (unit.isRunning ||
            latestAssistantTextRow?.state === "complete" ||
            latestAssistantTextRow?.state === "interrupted");
    const assistantRawCopyText = useMemo(() => resolveAssistantCopyText(unit), [unit.assistantTextRows, unit.assistantWorkRows, unit.latestAssistantTextRow]);
    const assistantFileSummaryText = useMemo(() => unit.assistantTextRows.map((row) => row.text).join("\n\n"), [unit.assistantTextRows]);
    const assistantCopyText = useMemo(() => assistantCodeCommentProjectionEnabled && assistantRawCopyText !== undefined
        ? projectAssistantCodeComments(assistantRawCopyText, {
            streaming: unit.isRunning,
        }).visibleText
        : assistantRawCopyText, [assistantRawCopyText, assistantCodeCommentProjectionEnabled, unit.isRunning]);
    const assistantCodeCommentCards = useMemo(() => codeCommentCardsEnabled &&
        assistantRawCopyText !== undefined &&
        // 卡片与 zcode-file-citation 的预览卡片保持一致：流式期间只投影正文，
        // 只有终态 row 才生成卡片，避免运行中卡片先出现又因模型续写而回滚。
        (latestAssistantTextRow?.state === "complete" ||
            latestAssistantTextRow?.state === "interrupted")
        ? buildAssistantCodeCommentCards(assistantRawCopyText, context.workspacePath, 50, {
            homePath: context.workspaceHomePath,
        })
        : [], [
        assistantRawCopyText,
        codeCommentCardsEnabled,
        context.workspaceHomePath,
        context.workspacePath,
        latestAssistantTextRow?.state,
    ]);
    const cronAutomationTurnCards = useMemo(() => (unit.isRunning ? [] : resolveCronAutomationTurnCards(unit.assistantWorkRows)), [unit.assistantWorkRows, unit.isRunning]);
    // 上方已是工具摘要；下方运行卡在联接到 run 后立即显示，不能再等主代理回复结束。
    // 依赖联接表保持实时更新，并由解析器按 runId 去重。直接启动轮
    // 的 run 卡也从这里出：那一轮没有用户气泡、没有助手内容，run 卡就是它的全部呈现。
    const workflowRunByToolCallId = context.workflowRunByToolCallId;
    const workflowRunByRunId = context.workflowRunByRunId;
    const workflowGraphByToolCallId = context.workflowGraphByToolCallId;
    const workflowFillGraphByRunId = context.workflowFillGraphByRunId;
    const workflowTurnDigests = useMemo(() => resolveWorkflowTurnDigests(unit, {
        byToolCallId: workflowRunByToolCallId,
        byRunId: workflowRunByRunId,
        graphByToolCallId: workflowGraphByToolCallId,
        fillGraphByRunId: workflowFillGraphByRunId,
    }), [
        unit,
        workflowFillGraphByRunId,
        workflowGraphByToolCallId,
        workflowRunByRunId,
        workflowRunByToolCallId,
    ]);
    // 完成卡：主代理消化 completed 通知的那一轮，轮尾落卡。
    // 同一条门（轮结束）；联接只认 byRunId——通知轮里没有 CreateWorkflow 行可按 toolCallId 联。
    const workflowTurnCompletion = useMemo(() => unit.isRunning
        ? undefined
        : resolveWorkflowTurnCompletion(unit.header, { byRunId: workflowRunByRunId }), [unit.header, unit.isRunning, workflowRunByRunId]);
    const offPeakTurnCards = useMemo(() => (unit.isRunning ? [] : resolveOffPeakTurnCards(unit.assistantWorkRows)), [unit.assistantWorkRows, unit.isRunning]);
    const canRenderAssistantActions = !unit.timelineOnly &&
        latestAssistantTextRow?.state === "complete" &&
        assistantCopyText !== undefined;
    // runtime turnId 与产品轮次 ID 不同；用 CLI 行上的命令归因关联投递，包含被裁剪输入的 header。
    const deliverySourceCommandIds = [
        ...(unit.header?.sourceCommandId ? [unit.header.sourceCommandId] : []),
        ...unit.visibleUserInputs.flatMap((row) => (row.sourceCommandId ? [row.sourceCommandId] : [])),
    ];
    const hasHookActions = 
    // Hook action 与 copy/feedback/fork 共用 turn eligibility；
    // timelineOnly 维护 turn（compact/modelChange marker 轮）即使带历史遗留的
    // didExecute=true Hook row 也不得露出图标，否则 /compact 轮会凭 SessionStart
    // Hook 误挂出一个不可解释的操作栏。
    !unit.timelineOnly &&
        !unit.isRunning &&
        unit.hookInvocations.some((row) => row.executions.some((execution) => execution.didExecute));
    const canRetryLatestAssistant = latestAssistantTextRow?.actions?.canRetry === true;
    const canForkLatestAssistant = latestAssistantTextRow?.actions?.canFork === true;
    const backgroundResultTitle = resolveBackgroundResultTitle(unit);
    const showHighspeedOutputFooter = unit.showHighspeedOutputFooter === true && isHighspeed && !unit.timelineOnly && !unit.isRunning;
    const hasAssistantWorkContent = unit.timelineOnly
        ? unit.assistantWorkRows.length > 0
        : unit.assistantWorkRows.length > 0 ||
            unit.workSegments?.some((segment) => segment.workStatus?.state === "running") === true ||
            unit.workStatus?.state === "running";
    const hasAssistantTurnContent = hasAssistantWorkContent ||
        Boolean(unit.header?.fileChanges) ||
        canRenderAssistantActions ||
        hasHookActions ||
        showHighspeedOutputFooter ||
        workflowTurnDigests.length > 0;
    const editWorkspaceRewindAvailability = useMemo(() => {
        const fileChanges = unit.header?.fileChanges;
        if (!fileChanges || fileChanges.files <= 0)
            return { enabled: false, reason: "noFiles" };
        if (fileChanges.state === "reverted")
            return { enabled: false, reason: "reverted" };
        if (unit.isRunning)
            return { enabled: false, reason: "running" };
        if (unit.header?.actions?.canRewindFiles !== true) {
            return { enabled: false, reason: "unavailable" };
        }
        return { enabled: true, reason: "available" };
    }, [unit.header?.actions?.canRewindFiles, unit.header?.fileChanges, unit.isRunning]);
    // workflow 通知卡开头的轮去掉轮顶 padding：卡片只贴上一轮 pb-5 的常规流内间距。
    const startsWithWorkflowNotificationCard = backgroundResultTitle !== undefined && resolveWorkflowNotification(unit) !== undefined;
    // 同一条规则的另外两个来源：中枢直接启动轮与「配置」的设置轮（docs/dynamic-workflow/presentation.md
    // 「The run card」）。它们的用户行是写给模型的规范句，conversationTurnRenderUnits 会裁掉，
    // 卡 / 「已调整设置」那一行于是成了轮内第一个节点。
    //
    // Bug 根因：`pt-14` 是给用户气泡留的呼吸，判据却一直是「有没有轮」而不是「有没有气泡」；
    // 没有气泡时这 56px 叠上一轮的 pb-5，在行上方堆出约 76px 空白（设置轮总落在对话中段，最显眼）。
    const startsWithoutUserBubble = startsWithWorkflowNotificationCard || unit.workflowLaunch !== undefined;
    const shareSelectionRows = shareSelection
        ? unit.visibleUserInputs.filter((row) => row.origin === "realUser" && shareSelection.eligibleRowIds.has(row.rowId))
        : [];
    // 一个 turn 可以有多条 realUser 输入（steer/排队消息），而这里只渲染一个
    // turn 级 checkbox。用 every() 折叠成布尔值会让部分选中显示为"未选中"，
    // 用户看到未选中却点一下让计数跳 2。半选必须显式呈现为 indeterminate。
    const shareSelectionSelectedCount = shareSelection
        ? shareSelectionRows.filter((row) => shareSelection.selectedRowIds.has(row.rowId)).length
        : 0;
    const shareSelectionChecked = shareSelection === undefined || shareSelectionRows.length === 0
        ? false
        : shareSelectionSelectedCount === shareSelectionRows.length
            ? true
            : shareSelectionSelectedCount === 0
                ? false
                : "indeterminate";
    const shareSelectionToggle = shareSelectionRows.length > 0 ? (_jsx("div", { "data-conversation-share-turn-toggle": "true", "data-conversation-share-turn-toggle-state": shareSelectionChecked === true
            ? "selected"
            : shareSelectionChecked === "indeterminate"
                ? "partial"
                : "unselected", className: "absolute left-0 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center", children: _jsx("label", { className: "flex size-8 cursor-pointer items-center justify-center", children: _jsx(Checkbox, { checked: shareSelectionChecked, "aria-label": shareSelectionRows[0]?.text ||
                    intl.formatMessage({ id: "conversationShare.partial.panelLabel" }), onCheckedChange: (checked) => {
                    if (!shareSelection)
                        return;
                    // Radix 从 indeterminate 点击后给出 true，半选状态因此会补齐整个 turn。
                    if (checked === true) {
                        for (const row of shareSelectionRows) {
                            if (!shareSelection.selectedRowIds.has(row.rowId))
                                shareSelection.onToggle(row.rowId);
                        }
                    }
                    else if (checked === false) {
                        for (const row of shareSelectionRows) {
                            if (shareSelection.selectedRowIds.has(row.rowId))
                                shareSelection.onToggle(row.rowId);
                        }
                    }
                }, checkIconStrokeWidth: 1.33, className: "size-4 rounded-sm border-foreground bg-transparent data-[state=checked]:border-foreground data-[state=checked]:bg-foreground data-[state=checked]:text-background data-[state=indeterminate]:border-foreground data-[state=indeterminate]:bg-foreground data-[state=indeterminate]:text-background" }) }) })) : null;
    return (_jsxs("section", { "data-turn-id": unit.turnId, "data-turn-key": unit.key, "data-highspeed-gradient": showHighspeedAnimatedGradient ? "true" : undefined, className: cn("relative mx-auto flex w-full flex-col gap-5 px-4 @md/conversation:px-6 pb-5", startsWithoutUserBubble ? "pt-0" : "pt-14", showHighspeedAnimatedGradient && "highspeed-animated-gradient-text"), children: [unit.leadingBoundaryRows.map((row) => (_jsx(ConversationTurnRow, { row: row, context: context }, `${row.rowId}:${row.entityId ?? ""}`))), hasAssistantTurnContent ? (_jsxs("div", { className: "group/assistant-turn flex w-full flex-col gap-5", children: [backgroundResultTitle ? (_jsxs(_Fragment, { children: [visibleUserRows.map((row) => shareSelectionToggle && row.rowId === shareSelectionRows[0]?.rowId ? (_jsxs("div", { className: "relative", children: [shareSelectionToggle, _jsx(ConversationTurnRow, { row: row, context: context, onEdit: row.actions?.canEdit === true ? onEdit : undefined, editWorkspaceRewindAvailability: editWorkspaceRewindAvailability })] }, `${row.rowId}:${row.entityId ?? ""}`)) : (_jsx(ConversationTurnRow, { row: row, context: context, onEdit: row.actions?.canEdit === true ? onEdit : undefined, editWorkspaceRewindAvailability: editWorkspaceRewindAvailability }, `${row.rowId}:${row.entityId ?? ""}`))), _jsx(ConversationBackgroundResultWork, { unit: unit, apiRetry: apiRetry, context: assistantRowContext, onFork: canForkLatestAssistant ? onFork : undefined, onRetry: onRetry, title: backgroundResultTitle, assistantCopyText: assistantCopyText, assistantCodeCommentCards: assistantCodeCommentCards, assistantCodeCommentProjectionEnabled: assistantCodeCommentProjectionEnabled, assistantPreviewCardsAutoOpenKey: assistantPreviewPptxAutoOpenTarget?.turnId === unit.turnId
                                    ? assistantPreviewPptxAutoOpenTarget.key
                                    : undefined })] })) : (_jsx(ConversationTurnFlow, { unit: unit, apiRetry: apiRetry, context: assistantRowContext, onFork: canForkLatestAssistant ? onFork : undefined, onRetry: onRetry, onEdit: onEdit, editWorkspaceRewindAvailability: editWorkspaceRewindAvailability, shareSelectionToggle: shareSelectionToggle, shareSelectionRowId: shareSelectionRows[0]?.rowId, assistantCopyText: assistantCopyText, assistantCodeCommentCards: assistantCodeCommentCards, assistantCodeCommentProjectionEnabled: assistantCodeCommentProjectionEnabled, highspeed: isHighspeed, highspeedMeta: highspeedMeta, assistantPreviewCardsAutoOpenKey: assistantPreviewPptxAutoOpenTarget?.turnId === unit.turnId
                            ? assistantPreviewPptxAutoOpenTarget.key
                            : undefined })), workflowTurnCompletion === undefined ? null : (_jsx(ConversationWorkflowCompletion, { completion: workflowTurnCompletion, context: context, turnKey: unit.key })), _jsx(ConversationWorkflowDigests, { context: context, digests: workflowTurnDigests, turnKey: unit.key }), _jsx(CronAutomationTurnCards, { cards: cronAutomationTurnCards, context: context }), _jsx(OffPeakTurnCards, { cards: offPeakTurnCards, context: context }), !isOfficeMode && unit.header?.fileChanges ? (_jsx(ConversationFileSummaryPanel, { header: unit.header, context: context, assistantText: assistantFileSummaryText })) : null, unit.browserTurnEndRows.length > 0 ? (_jsx(ConversationAssistantWorkItems, { rows: unit.browserTurnEndRows, context: assistantRowContext, assistantCodeCommentProjectionEnabled: assistantCodeCommentProjectionEnabled })) : null, canRenderAssistantActions && latestAssistantTextRow ? (_jsx(ConversationAssistantTextActions, { rowId: latestAssistantTextRow.rowId, entityId: latestAssistantTextRow.entityId, text: assistantCopyText, createdAt: latestAssistantTextRow.createdAt, compactForRemoteControl: context.compactForRemoteControl, feedback: readAssistantFeedback(latestAssistantTextRow), sessionId: context.sessionId, onFork: canForkLatestAssistant ? onFork : undefined, onRetry: canRetryLatestAssistant ? onRetry : undefined, onFeedbackChange: onFeedbackChange, hookInvocations: unit.hookInvocations, turnId: unit.turnId, sourceCommandIds: deliverySourceCommandIds, className: cn("flex items-center gap-1", context.compactForRemoteControl
                            ? "opacity-100"
                            : "opacity-0 transition-opacity group-hover/assistant-turn:opacity-100 focus-within:opacity-100 has-[[data-bot-group-delivery]]:opacity-100") })) : (hasHookActions || !unit.isRunning) && !canRenderAssistantActions ? (_jsxs(MessageActions, { className: cn(context.compactForRemoteControl
                            ? "opacity-100"
                            : "opacity-0 transition-opacity group-hover/assistant-turn:opacity-100 focus-within:opacity-100 has-[[data-bot-group-delivery]]:opacity-100"), children: [hasHookActions ? (_jsx(ConversationHookDetailsAction, { rows: unit.hookInvocations, turnId: unit.turnId })) : null, _jsx(ConnectedBotGroupDeliveryAction, { turnId: unit.turnId, sourceCommandIds: deliverySourceCommandIds })] })) : null, showHighspeedOutputFooter ? (_jsx(HighspeedOutputFooter, { generatedLabel: intl.formatMessage({ id: "chat.highspeed.generatedBy" }), shareLabel: intl.formatMessage({ id: "chat.highspeed.viewAction" }), shareAriaLabel: intl.formatMessage({ id: "chat.highspeed.share" }), shareEnabled: highspeedShareTarget !== null, sharePending: false, onShare: () => setHighspeedShareDialogOpen(true) })) : null, highspeedShareTarget ? (_jsx(HighspeedShareDialog, { metrics: highspeedShareTarget.metrics, open: highspeedShareDialogOpen, onOpenChange: setHighspeedShareDialogOpen })) : null, unit.assistantTailRows.length > 0 ? (_jsx(ConversationAssistantWorkItems, { rows: unit.assistantTailRows, context: assistantRowContext, assistantCodeCommentProjectionEnabled: assistantCodeCommentProjectionEnabled })) : null] })) : (_jsx(ConversationTurnFlow, { unit: unit, apiRetry: apiRetry, context: assistantRowContext, onEdit: onEdit, editWorkspaceRewindAvailability: editWorkspaceRewindAvailability, shareSelectionToggle: shareSelectionToggle, shareSelectionRowId: shareSelectionRows[0]?.rowId, assistantCopyText: assistantCopyText, assistantCodeCommentCards: assistantCodeCommentCards, assistantCodeCommentProjectionEnabled: assistantCodeCommentProjectionEnabled, highspeed: isHighspeed, highspeedMeta: highspeedMeta })), unit.topicPreparations?.length ? (_jsx(BotTopicPreparation, { items: unit.topicPreparations })) : null] }));
}
export const ConversationTurnGroup = memo(ConversationTurnGroupImpl);
//# sourceMappingURL=ConversationTurnGroup.js.map