import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* oxlint-disable eslint(max-lines) -- Share 与 Desktop 共用的只读 Row/turn presentation 需要保持在同一安全边界。
 * 安全边界约束：本文件被匿名公开分享页（packages/web/src/share）直接引用，新增依赖必须考虑
 * 公开页 bundle 体积与无 Desktop 宿主（window.zcode / PlatformProvider / tab store）的运行环境；
 * Desktop 专属能力（如 open-with 子树）一律由消费方经组件注入，不得静态 import。 */
import { createContext, Fragment, memo, useCallback, useContext, useEffect, useMemo, useState, } from "react";
import { ChevronRightIcon, FilePenLineIcon, FileTextIcon, FilesIcon, InfoIcon, MonitorIcon, SearchIcon, SquareTerminalIcon, WrenchIcon, } from "lucide-react";
import { getCompactToolCallStatusMessageId } from "@zcode/shared";
import { MessageResponse } from "../components/ai-elements/message.js";
import { Reasoning, ReasoningContent, ReasoningTrigger, } from "../components/ai-elements/reasoning.js";
import { Collapsible, CollapsibleContent, CollapsibleTrigger, } from "../components/ui/collapsible.js";
import { TooltipProvider } from "../components/ui/tooltip.js";
import { ToolLayout } from "../ToolCallBlocks/ToolLayout.js";
import { ConversationUserInputBody } from "../v4/ConversationUserInputBody.js";
import { ConversationUserInputContent } from "../v4/ConversationUserInputContent.js";
import { PluginReferenceIconProvider } from "../v4/pluginReferenceIconContext.js";
import { buildAssistantWorkRenderItems, } from "../v4/conversationAssistantWorkItems.js";
import { buildConversationTurnRenderUnits, } from "../v4/conversationTurnRenderUnits.js";
import { formatConversationWorkDuration } from "../v4/conversationWorkDuration.js";
import { normalizeConversationShareMarkdown } from "../v4/conversationShareMarkdown.js";
import { resolveToolCallIdentity } from "../lib/toolIdentity.js";
import { DEFAULT_CODE_PREVIEW_SETTINGS, } from "../lib/codePreviewSettings.js";
import { ZCodeIntlProvider, useZCodeIntl } from "../i18n/IntlProvider.js";
import { FileDisplayIcon, resolveFileDisplayDescriptor } from "../lib/fileDisplay.js";
import { formatAttachmentSize } from "../lib/chatAttachmentMetadata.js";
import { isAbsoluteFilePath, joinFilePath } from "../lib/path.js";
/**
 * 只读时间线里 marker 的文案。
 *
 * 这里刻意不复刻实时时间线的全部状态细分（compact 的 started/failed/interrupted、
 * modelChange 的 from→to、goalVerify 的迭代序号）：发布会拦掉运行中的 marker，
 * 而 from→to 需要 model-provider store 才能解析显示名，只读历史里价值很低。
 * 识别不了的类型返回 null，由调用方整行不渲染 —— 绝不回退成打印枚举名。
 */
function resolveReadonlyMarkerLabel(marker, labels) {
    switch (marker.type) {
        case "compact":
            return marker.status === "success" ? labels.markerCompact : null;
        case "modelChange":
            return labels.markerModelChange;
        default:
            return null;
    }
}
const EMPTY_ARTIFACT_URLS = new Map();
const EMPTY_ARTIFACT_NAMES = new Map();
const EMPTY_ARTIFACT_WORKSPACE_RELATIVE_PATHS = new Map();
const EMPTY_ATTACHMENTS = [];
const ArtifactOpenContext = createContext(null);
function resolveImportedArtifactPath(workspacePath, workspaceRelativePath) {
    // 取舍：这里只校验形状（.zcode-share/<dir>/shared-artifacts/<file> 四段），刻意不把
    // 段 2 与导入记录的 shareId 交叉比对。元数据由本端导入服务自写（conversationShareService
    // 落盘时用 sanitizeFileSegment(share_id) 作目录名），自洽；若在 UI 侧比对，就得复制
    // service 层的 sanitize 规则，两边漂移会让合法导入静默丢打开按钮，而收益仅是防住
    // 「指向另一 share 目录」这种一致性噪声——路径仍被限制在 workspace 的
    // .zcode-share/*/shared-artifacts/ 内，无越权读放大。
    const normalizedPath = workspaceRelativePath?.trim();
    if (!normalizedPath || isAbsoluteFilePath(normalizedPath)) {
        return null;
    }
    const segments = normalizedPath.replace(/\\/g, "/").split("/");
    if (segments.length !== 4 ||
        segments.some((segment) => !segment || segment === "." || segment === "..") ||
        segments[0] !== ".zcode-share" ||
        segments[2] !== "shared-artifacts") {
        return null;
    }
    return joinFilePath(workspacePath, segments.join("/"));
}
function UserInputPresentation({ row, artifactUrls, }) {
    const attachments = (row.attachments ?? []).map((attachment) => {
        const artifactId = attachment.ref.split("/").at(-1) ?? "";
        return { attachment, url: artifactUrls.get(artifactId) };
    });
    return (_jsxs("div", { className: "flex flex-col items-end", "data-conversation-share-row-kind": "userInput", children: [attachments.length > 0 ? (_jsx("div", { className: "mb-2 flex max-w-xl flex-wrap justify-end gap-2", "data-v4-user-input-attachments": "true", children: attachments.map(({ attachment, url }) => (_jsxs("a", { href: url, target: url ? "_blank" : undefined, rel: url ? "noopener noreferrer" : undefined, "aria-disabled": url ? undefined : "true", className: "flex min-w-0 items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-ui-sm text-foreground hover:bg-surface-hover", "data-v4-user-input-attachment-pill": "true", children: [_jsx(FileTextIcon, { "aria-hidden": "true", className: "size-4 shrink-0" }), _jsx("span", { className: "min-w-0 max-w-64 truncate", children: attachment.fileName }), _jsx("span", { className: "shrink-0 text-foreground-subtlest", children: formatAttachmentSize(attachment.bytes) })] }, attachment.ref))) })) : null, _jsx("div", { "data-v4-user-input-bubble": "true", className: "flex max-w-xl flex-col gap-2 rounded-xl rounded-tr-xs border border-border bg-surface px-4 py-3 text-ui-base text-foreground", children: _jsx(ConversationUserInputBody, { contentText: row.text, rowId: row.rowId, children: _jsx(ConversationUserInputContent, { text: row.text, attachments: row.attachments ?? EMPTY_ATTACHMENTS }) }) })] }));
}
const AssistantTextPresentation = memo(function AssistantTextPresentation({ row, theme, codePreviewSettings, artifactNames, onOpenExternalUrl, }) {
    const markdown = useMemo(() => normalizeConversationShareMarkdown(row.text, artifactNames), [artifactNames, row.text]);
    return (_jsx("div", { "data-conversation-share-row-kind": "assistantText", className: "group/assistant-row", children: _jsx("div", { "data-conversation-selectable": "true", className: "w-full text-ui-base", children: _jsx(MessageResponse, { streaming: false, theme: theme, codePreviewSettings: codePreviewSettings, renderZCodeFileCitations: false, onOpenExternalUrl: onOpenExternalUrl, children: markdown }) }) }));
});
const ReasoningPresentation = memo(function ReasoningPresentation({ row }) {
    const durationSeconds = row.durationMs === undefined ? undefined : Math.max(1, Math.ceil(row.durationMs / 1000));
    return (_jsx("div", { "data-conversation-share-row-kind": "reasoning", children: _jsxs(Reasoning, { className: "w-full", isStreaming: false, autoCollapseKey: row.state, ...(durationSeconds === undefined ? {} : { duration: durationSeconds }), children: [_jsx(ReasoningTrigger, { streamingText: row.text }), _jsx("div", { "data-conversation-selectable": "true", children: _jsx(ReasoningContent, { children: row.text }) })] }) }));
});
function resolveToolStatusLabel(status, formatMessage) {
    const compactState = status === "inputStreaming" || status === "pendingApproval"
        ? "input-streaming"
        : status === "running"
            ? "input-available"
            : status === "success"
                ? "output-available"
                : "output-error";
    return formatMessage({
        id: getCompactToolCallStatusMessageId(compactState, status === "cancelled" ? "stopped" : undefined),
    });
}
function readToolInputSummary(input, keys) {
    if (!input || typeof input !== "object" || Array.isArray(input))
        return null;
    const record = input;
    for (const key of keys) {
        const value = record[key];
        if (typeof value === "string" && value.trim())
            return value.trim();
    }
    return null;
}
const ToolCallPresentation = memo(function ToolCallPresentation({ row, theme, codePreviewSettings, artifactNames, onOpenExternalUrl, }) {
    const { intl } = useZCodeIntl();
    const output = row.output?.text?.trim();
    const markdown = useMemo(() => (output ? normalizeConversationShareMarkdown(output, artifactNames) : ""), [artifactNames, output]);
    const statusLabel = resolveToolStatusLabel(row.status, intl.formatMessage);
    const identity = useMemo(() => resolveToolCallIdentity({ toolName: row.toolName, kind: row.toolName, input: row.input }), [row.input, row.toolName]);
    const searchSummary = identity.family === "search"
        ? readToolInputSummary(row.input, ["query", "pattern", "prompt"])
        : null;
    const presentation = identity.family === "search"
        ? {
            icon: _jsx(SearchIcon, { className: "size-4 shrink-0", "aria-hidden": "true" }),
            kindLabel: intl.formatMessage({ id: "chat.toolCall.kind.search" }),
            primaryText: searchSummary ?? statusLabel,
        }
        : identity.family === "shell"
            ? {
                icon: _jsx(SquareTerminalIcon, { className: "size-4 shrink-0", "aria-hidden": "true" }),
                kindLabel: intl.formatMessage({ id: "chat.toolCall.kind.terminal" }),
                primaryText: statusLabel,
            }
            : identity.family === "file-read"
                ? {
                    icon: _jsx(FileTextIcon, { className: "size-4 shrink-0", "aria-hidden": "true" }),
                    kindLabel: intl.formatMessage({ id: "chat.toolCall.kind.read" }),
                    primaryText: statusLabel,
                }
                : identity.family === "file-write"
                    ? {
                        icon: _jsx(FilePenLineIcon, { className: "size-4 shrink-0", "aria-hidden": "true" }),
                        kindLabel: intl.formatMessage({ id: "chat.toolCall.kind.edit" }),
                        primaryText: statusLabel,
                    }
                    : {
                        icon: _jsx(WrenchIcon, { className: "size-4 shrink-0", "aria-hidden": "true" }),
                        kindLabel: row.toolName,
                        primaryText: statusLabel,
                    };
    const content = markdown ? (_jsx(MessageResponse, { theme: theme, codePreviewSettings: codePreviewSettings, renderZCodeFileCitations: false, onOpenExternalUrl: onOpenExternalUrl, children: markdown })) : (_jsx("span", { className: "text-ui-sm text-foreground-subtle", children: statusLabel }));
    const isRunning = row.status === "inputStreaming" || row.status === "pendingApproval" || row.status === "running";
    return (_jsx("div", { "data-conversation-share-row-kind": "toolCall", "data-conversation-selectable": "true", children: _jsx(ToolLayout, { toolId: row.toolCallId, icon: presentation.icon, kindLabel: presentation.kindLabel, primaryText: presentation.primaryText, isRunning: isRunning, canToggle: Boolean(markdown), content: content, disableSummaryContentAnimation: true }) }));
});
/** 与正文的 AssistantPreviewCards 对齐：同一套 chat.previewCards.* 副标题词汇。 */
const ARTIFACT_SUBTITLE_MESSAGE_IDS = {
    pdf: "chat.previewCards.pdf",
    docx: "chat.previewCards.docx",
    xlsx: "chat.previewCards.xlsx",
    pptx: "chat.previewCards.pptx",
    md: "chat.previewCards.markdown",
    text: "chat.previewCards.text",
    html: "chat.previewCards.htmlWebsite",
};
const ArtifactPresentation = memo(function ArtifactPresentation({ row, url, previewLabel, }) {
    const { intl } = useZCodeIntl();
    const artifactOpenContext = useContext(ArtifactOpenContext);
    const OpenAction = artifactOpenContext?.openAction;
    // 与 AssistantPreviewCards 保持同一视觉：44px 图标底板 + 真实文件类型图标 + 中粗标题 + 类型副标题。
    const descriptor = resolveFileDisplayDescriptor(row.displayName);
    const subtitleMessageId = ARTIFACT_SUBTITLE_MESSAGE_IDS[row.artifactType];
    const typeLabel = subtitleMessageId
        ? intl.formatMessage({ id: subtitleMessageId })
        : row.artifactType.toUpperCase();
    const localPath = artifactOpenContext && !url
        ? resolveImportedArtifactPath(artifactOpenContext.workspacePath, artifactOpenContext.artifactWorkspaceRelativePaths.get(row.artifactVersionId))
        : null;
    const previewSource = artifactOpenContext && localPath
        ? {
            type: "file",
            title: row.displayName,
            path: localPath,
            workspacePath: artifactOpenContext.workspacePath,
            ...(artifactOpenContext.workspaceIdentity
                ? { workspaceIdentity: artifactOpenContext.workspaceIdentity }
                : {}),
            ...(artifactOpenContext.workspaceRemoteSessionId
                ? { workspaceRemoteSessionId: artifactOpenContext.workspaceRemoteSessionId }
                : {}),
        }
        : null;
    return (_jsx("div", { "data-conversation-share-row-kind": "artifact", className: "py-1", children: _jsxs("div", { className: "flex w-full items-center gap-3 rounded-xl border border-card-border bg-card p-3 pr-4 text-foreground", children: [_jsx("div", { className: "flex size-11 shrink-0 items-center justify-center rounded-md bg-background text-foreground-subtle", children: descriptor ? (_jsx(FileDisplayIcon, { src: descriptor.fileIconSrc, size: 24 })) : (_jsx(FileTextIcon, { className: "size-6", "aria-hidden": "true" })) }), _jsxs("div", { className: "flex min-w-0 flex-1 flex-col gap-1", children: [_jsx("p", { className: "truncate text-ui-base font-medium leading-5", children: row.displayName }), _jsxs("p", { className: "truncate text-ui-base leading-5 text-foreground-subtlest", children: [typeLabel, " \u00B7 ", formatAttachmentSize(row.sizeBytes)] })] }), url ? (_jsx("div", { "data-share-preview-button": "true", className: "flex h-7 shrink-0 items-center overflow-hidden rounded-lg border border-border bg-input transition-all hover:border-border-hover", children: _jsx("button", { type: "button", className: "flex h-7 items-center gap-1 px-2 text-ui-sm text-foreground", onClick: () => window.open(url, "_blank", "noopener,noreferrer"), children: previewLabel }) })) : previewSource && OpenAction ? (_jsx(OpenAction, { target: {
                        type: "file",
                        path: previewSource.path,
                        title: row.displayName,
                        label: row.displayName,
                        previewSource,
                    }, onOpenFileLink: artifactOpenContext?.onOpenFileLink, onOpenCodeViewer: artifactOpenContext?.onOpenCodeViewer })) : null] }) }));
});
function renderReadonlyRow(row, theme, codePreviewSettings, artifactUrls, artifactNames, labels, onOpenExternalUrl) {
    switch (row.kind) {
        case "userInput":
            return _jsx(UserInputPresentation, { row: row, artifactUrls: artifactUrls }, row.rowId);
        case "assistantText":
            return (_jsx(AssistantTextPresentation, { row: row, theme: theme, codePreviewSettings: codePreviewSettings, artifactNames: artifactNames, onOpenExternalUrl: onOpenExternalUrl }, row.rowId));
        case "reasoning":
            return _jsx(ReasoningPresentation, { row: row }, row.rowId);
        case "toolCall":
            return (_jsx(ToolCallPresentation, { row: row, theme: theme, codePreviewSettings: codePreviewSettings, artifactNames: artifactNames, onOpenExternalUrl: onOpenExternalUrl }, row.rowId));
        case "artifact":
            return (_jsx(ArtifactPresentation, { row: row, url: artifactUrls.get(row.artifactVersionId), previewLabel: labels.artifactPreview }, row.rowId));
        case "timelineMarker": {
            // 这里原本直接把 row.marker.type 当文案渲染，于是分享页会出现一条写着
            // 字面量 compact / modelChange / goalVerify 的分割线（发布只剥掉 fork/checkpoint 类）。
            // 改为取本地化文案；识别不了的类型不渲染，不再泄漏枚举名。
            const markerLabel = resolveReadonlyMarkerLabel(row.marker, labels);
            if (!markerLabel)
                return null;
            return (_jsxs("div", { "data-conversation-share-row-kind": "timelineMarker", "data-marker-type": row.marker.type, className: "flex w-full items-center gap-3 px-4 py-2 text-ui-base text-foreground-subtle", children: [_jsx("div", { "aria-hidden": "true", className: "h-px min-w-8 flex-1 bg-border/50" }), _jsx("span", { className: "min-w-0 break-words text-center leading-5", children: markerLabel }), _jsx("div", { "aria-hidden": "true", className: "h-px min-w-8 flex-1 bg-border/50" })] }, row.rowId));
        }
        case "subagent":
        case "hookInvocation":
        case "turnHeader":
            return null;
    }
}
function GroupedToolPresentation({ item, theme, codePreviewSettings, artifactUrls, artifactNames, labels, onOpenExternalUrl, }) {
    const { intl } = useZCodeIntl();
    const rows = item.rows;
    const groupLabel = item.kind === "cuaGroup"
        ? labels.computerUse
        : item.kind === "exploreGroup"
            ? labels.explore
            : item.kind === "executeGroup"
                ? labels.execute
                : labels.changes;
    const groupIcon = item.kind === "cuaGroup" ? (_jsx(MonitorIcon, { className: "size-4 shrink-0", "aria-hidden": "true" })) : item.kind === "executeGroup" ? (_jsx(SquareTerminalIcon, { className: "size-4 shrink-0", "aria-hidden": "true" })) : item.kind === "changesGroup" ? (_jsx(FilesIcon, { className: "size-4 shrink-0", "aria-hidden": "true" })) : (_jsx(SearchIcon, { className: "size-4 shrink-0", "aria-hidden": "true" }));
    const hasRunningRow = rows.some((row) => row.status === "inputStreaming" ||
        row.status === "pendingApproval" ||
        row.status === "running");
    const hasFailedRow = rows.some((row) => row.status === "error" || row.status === "cancelled");
    const groupStatus = hasRunningRow
        ? "running"
        : hasFailedRow
            ? "error"
            : "success";
    const content = (_jsx("div", { className: "flex flex-col gap-4", children: item.kind === "cuaGroup"
            ? item.events.map((event) => event.kind === "tool" ? (_jsx(ToolCallPresentation, { row: event.row, theme: theme, codePreviewSettings: codePreviewSettings, artifactNames: artifactNames, onOpenExternalUrl: onOpenExternalUrl }, event.row.rowId)) : event.kind === "assistantMessage" ? (_jsx(AssistantTextPresentation, { row: event.row, theme: theme, codePreviewSettings: codePreviewSettings, artifactNames: artifactNames, onOpenExternalUrl: onOpenExternalUrl }, event.row.rowId)) : (_jsx(ReasoningPresentation, { row: event.row }, event.row.rowId)))
            : rows.map((row) => renderReadonlyRow(row, theme, codePreviewSettings, artifactUrls, artifactNames, labels, onOpenExternalUrl)) }));
    const statusLabel = resolveToolStatusLabel(groupStatus, intl.formatMessage);
    return (_jsx("div", { "data-conversation-share-work-group": item.kind, "data-conversation-selectable": "true", children: _jsx(ToolLayout, { toolId: item.key, icon: groupIcon, kindLabel: groupLabel, primaryText: statusLabel, isRunning: hasRunningRow, canToggle: rows.length > 0, content: content, disableSummaryContentAnimation: true }) }));
}
function ReadonlyAssistantWorkItems({ rows, stageTailIsRunning, theme, codePreviewSettings, artifactUrls, artifactNames, labels, onOpenExternalUrl, }) {
    const items = useMemo(() => buildAssistantWorkRenderItems(rows, { messageStreamShowReasoning: true }, {
        stageTailIsRunning,
        enableCuaGrouping: true,
        enableExploreGrouping: true,
        enableTerminalGrouping: true,
        enableChangesGrouping: false,
    }), [rows, stageTailIsRunning]);
    return (_jsx("div", { className: "flex flex-col gap-4", "data-conversation-share-work-items": true, children: items.map((item) => {
            if (item.kind === "row") {
                return renderReadonlyRow(item.row, theme, codePreviewSettings, artifactUrls, artifactNames, labels, onOpenExternalUrl);
            }
            if (item.kind === "agentToolCall") {
                return (_jsx(ToolCallPresentation, { row: item.row, theme: theme, codePreviewSettings: codePreviewSettings, artifactNames: artifactNames, onOpenExternalUrl: onOpenExternalUrl }, item.key));
            }
            return (_jsx(GroupedToolPresentation, { item: item, theme: theme, codePreviewSettings: codePreviewSettings, artifactUrls: artifactUrls, artifactNames: artifactNames, labels: labels, onOpenExternalUrl: onOpenExternalUrl }, item.key));
        }) }));
}
function ReadonlyHistoryStatus({ segment, open, labels, locale, }) {
    const { intl } = useZCodeIntl();
    const duration = formatConversationWorkDuration(segment.workStatus?.durationMs, intl, locale);
    const label = segment.workStatus?.state === "interrupted"
        ? intl.formatMessage({ id: "chat.history.stopped" })
        : segment.workStatus?.state === "running"
            ? intl.formatMessage({ id: "chat.history.workingFor" }, { duration: duration ?? "" })
            : duration
                ? intl.formatMessage({ id: "chat.history.workedFor" }, { duration })
                : labels.history;
    return (_jsx("div", { className: "flex w-full border-b border-border/50 pb-2", children: _jsx(CollapsibleTrigger, { asChild: true, children: _jsxs("button", { type: "button", "data-conversation-share-history-trigger": "true", "data-history-open": String(open), className: "group/history-message inline-flex max-w-full items-center gap-2 text-left text-ui-base text-foreground-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-input-border-focused", children: [_jsx("span", { className: "truncate", children: label }), !segment.assistantHistoryDefaultOpen ? (_jsx(ChevronRightIcon, { "aria-hidden": "true", className: `size-4 shrink-0 text-foreground-subtlest opacity-70 transition-transform ${open ? "rotate-90" : "rotate-0"}` })) : null] }) }) }));
}
function ReadonlyCuaGroup({ item, theme, codePreviewSettings, artifactUrls, artifactNames, labels, onOpenExternalUrl, }) {
    return (_jsx(GroupedToolPresentation, { item: item, theme: theme, codePreviewSettings: codePreviewSettings, artifactUrls: artifactUrls, artifactNames: artifactNames, labels: labels, onOpenExternalUrl: onOpenExternalUrl }));
}
function ReadonlySegment({ segment, locale, theme, codePreviewSettings, artifactUrls, artifactNames, labels, onOpenExternalUrl, }) {
    const [historyOpen, setHistoryOpen] = useState(segment.assistantHistoryDefaultOpen);
    useEffect(() => {
        setHistoryOpen(segment.assistantHistoryDefaultOpen);
    }, [segment.assistantHistoryDefaultOpen, segment.key]);
    const hasHistory = segment.flowItems.some((item) => item.kind === "assistantHistory" ||
        (item.kind === "cuaGroup" && item.flowKind === "assistantHistory"));
    const open = segment.assistantHistoryDefaultOpen || historyOpen;
    const firstAssistantFlowItemIndex = segment.flowItems.findIndex((flowItem) => flowItem.kind !== "userInput");
    return (_jsxs(Collapsible, { open: open, onOpenChange: segment.assistantHistoryDefaultOpen ? undefined : setHistoryOpen, className: "history-message flex flex-col [&>*+*:not([data-slot='collapsible-content'])]:mt-5", children: [segment.flowItems.map((item, index) => {
                let content;
                if (item.kind === "userInput") {
                    content = _jsx(UserInputPresentation, { row: item.row, artifactUrls: artifactUrls });
                }
                else if (item.kind === "assistantText") {
                    content = (_jsx(AssistantTextPresentation, { row: item.row, theme: theme, codePreviewSettings: codePreviewSettings, artifactNames: artifactNames, onOpenExternalUrl: onOpenExternalUrl }));
                }
                else if (item.kind === "cuaGroup") {
                    const group = (_jsx(ReadonlyCuaGroup, { item: item, theme: theme, codePreviewSettings: codePreviewSettings, artifactUrls: artifactUrls, artifactNames: artifactNames, labels: labels, onOpenExternalUrl: onOpenExternalUrl }));
                    content =
                        item.flowKind === "assistantHistory" ? (_jsx(CollapsibleContent, { "data-history-open": String(open), children: _jsx("div", { className: "pt-5", children: group }) })) : (_jsx("div", { children: group }));
                }
                else if (item.kind === "assistantHistory") {
                    content = (_jsx(CollapsibleContent, { "data-history-open": String(open), children: _jsx("div", { className: "pt-5", children: _jsx(ReadonlyAssistantWorkItems, { rows: item.rows, stageTailIsRunning: false, theme: theme, codePreviewSettings: codePreviewSettings, artifactUrls: artifactUrls, artifactNames: artifactNames, labels: labels, onOpenExternalUrl: onOpenExternalUrl }) }) }));
                }
                else {
                    content = (_jsx(ReadonlyAssistantWorkItems, { rows: item.rows, stageTailIsRunning: segment.workStatus?.state === "running" && index === segment.flowItems.length - 1, theme: theme, codePreviewSettings: codePreviewSettings, artifactUrls: artifactUrls, artifactNames: artifactNames, labels: labels, onOpenExternalUrl: onOpenExternalUrl }));
                }
                const showHistoryStatus = hasHistory && index === firstAssistantFlowItemIndex;
                return (_jsxs(Fragment, { children: [showHistoryStatus ? (_jsx(ReadonlyHistoryStatus, { segment: segment, open: open, labels: labels, locale: locale })) : null, content] }, `${segment.key}:${item.kind}:${index}`));
            }), hasHistory && segment.flowItems.length === 0 ? (_jsx(ReadonlyHistoryStatus, { segment: segment, open: open, labels: labels, locale: locale })) : null] }));
}
function fallbackWorkSegment(unit) {
    return {
        key: unit.key,
        flowItems: unit.flowItems,
        assistantWorkRows: unit.assistantWorkRows,
        assistantHistoryRows: unit.assistantHistoryRows,
        assistantFollowingRows: unit.assistantFollowingRows,
        assistantHistoryDefaultOpen: unit.assistantHistoryDefaultOpen,
        ...(unit.workStatus ? { workStatus: unit.workStatus } : {}),
    };
}
function ReadonlyTurn({ unit, locale, theme, codePreviewSettings, artifactUrls, artifactNames, labels, onOpenExternalUrl, }) {
    const segments = unit.workSegments?.length ? unit.workSegments : [fallbackWorkSegment(unit)];
    return (_jsxs("section", { "data-conversation-share-turn": unit.turnId, className: "mx-auto flex w-full flex-col gap-5 px-4 pb-5 pt-14 @md/conversation:px-6 [content-visibility:auto] [contain-intrinsic-size:0_420px]", children: [unit.leadingBoundaryRows.map((row) => renderReadonlyRow(row, theme, codePreviewSettings, artifactUrls, artifactNames, labels, onOpenExternalUrl)), _jsxs("div", { className: "group/assistant-turn flex w-full flex-col gap-5", children: [segments.map((segment) => (_jsx(ReadonlySegment, { segment: segment, locale: locale, theme: theme, codePreviewSettings: codePreviewSettings, artifactUrls: artifactUrls, artifactNames: artifactNames, labels: labels, onOpenExternalUrl: onOpenExternalUrl }, segment.key))), unit.browserTurnEndRows.length > 0 ? (_jsx(ReadonlyAssistantWorkItems, { rows: unit.browserTurnEndRows, stageTailIsRunning: false, theme: theme, codePreviewSettings: codePreviewSettings, artifactUrls: artifactUrls, artifactNames: artifactNames, labels: labels, onOpenExternalUrl: onOpenExternalUrl })) : null, unit.assistantTailRows.length > 0 ? (_jsx(ReadonlyAssistantWorkItems, { rows: unit.assistantTailRows, stageTailIsRunning: false, theme: theme, codePreviewSettings: codePreviewSettings, artifactUrls: artifactUrls, artifactNames: artifactNames, labels: labels, onOpenExternalUrl: onOpenExternalUrl })) : null] })] }));
}
export function ConversationShareReadonlyTimeline({ rows, locale = "zh-CN", theme = "system", codePreviewSettings = DEFAULT_CODE_PREVIEW_SETTINGS, artifactUrls = EMPTY_ARTIFACT_URLS, artifactNames = EMPTY_ARTIFACT_NAMES, artifactWorkspaceRelativePaths = EMPTY_ARTIFACT_WORKSPACE_RELATIVE_PATHS, workspacePath, workspaceIdentity, workspaceRemoteSessionId, onOpenFileLink, onOpenCodeViewer, artifactOpenAction, unsupportedRowCount = 0, }) {
    const units = buildConversationTurnRenderUnits(rows);
    const openShareExternalUrl = useCallback((url) => {
        try {
            const parsed = new URL(url);
            if (parsed.protocol !== "http:" && parsed.protocol !== "https:")
                return;
            window.open(parsed.toString(), "_blank", "noopener,noreferrer");
        }
        catch {
            // 外链来自不可信 Markdown；解析失败时保持不可操作，不交给浏览器未知协议。
        }
    }, []);
    const labels = locale === "zh-CN"
        ? {
            history: "思考过程",
            computerUse: "电脑操作",
            explore: "探索",
            execute: "执行",
            changes: "修改",
            artifactPreview: "下载文件",
            markerCompact: "上下文已压缩",
            markerModelChange: "模型已切换",
            unsupportedRows: "部分内容需要更新 ZCode 查看",
        }
        : {
            history: "Reasoning",
            computerUse: "Computer use",
            explore: "Explore",
            execute: "Execute",
            changes: "Changes",
            artifactPreview: "Download file",
            markerCompact: "Context compacted",
            markerModelChange: "Model switched",
            unsupportedRows: "Some content requires a newer version of ZCode",
        };
    const artifactOpenContext = useMemo(() => {
        if (!workspacePath ||
            artifactWorkspaceRelativePaths.size === 0 ||
            (!onOpenFileLink && !onOpenCodeViewer) ||
            !artifactOpenAction) {
            return null;
        }
        return {
            artifactWorkspaceRelativePaths,
            workspacePath,
            openAction: artifactOpenAction,
            ...(workspaceIdentity ? { workspaceIdentity } : {}),
            ...(workspaceRemoteSessionId ? { workspaceRemoteSessionId } : {}),
            ...(onOpenFileLink ? { onOpenFileLink } : {}),
            ...(onOpenCodeViewer ? { onOpenCodeViewer } : {}),
        };
    }, [
        artifactOpenAction,
        artifactWorkspaceRelativePaths,
        onOpenCodeViewer,
        onOpenFileLink,
        workspaceIdentity,
        workspacePath,
        workspaceRemoteSessionId,
    ]);
    return (_jsx(TooltipProvider, { delayDuration: 0, children: _jsx(ZCodeIntlProvider, { initialLocale: locale, children: _jsx(PluginReferenceIconProvider, { value: null, children: _jsx(ArtifactOpenContext.Provider, { value: artifactOpenContext, children: _jsxs("div", { className: "@container/conversation flex flex-col", "data-conversation-share-timeline": true, children: [unsupportedRowCount > 0 ? (_jsxs("div", { "data-conversation-share-unsupported-notice": "true", className: "mx-4 mb-2 flex items-center gap-2 rounded-md border border-border/60 px-3 py-2 text-ui-xs text-foreground-subtle", children: [_jsx(InfoIcon, { "aria-hidden": "true", className: "size-3.5 shrink-0" }), _jsx("span", { className: "min-w-0 break-words", children: labels.unsupportedRows })] })) : null, units.map((unit) => (_jsx(ReadonlyTurn, { unit: unit, locale: locale, theme: theme, codePreviewSettings: codePreviewSettings, artifactUrls: artifactUrls, artifactNames: artifactNames, labels: labels, onOpenExternalUrl: openShareExternalUrl }, unit.key)))] }) }) }) }) }));
}
//# sourceMappingURL=ConversationShareReadonlyTimeline.js.map