import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
// ============================================================
// 脚本 transcript 的一个条目
// ============================================================
// 日志簿的一行：左边 28px 的种类瓦片（失败泛红、运行泛琥珀），中间两行——动词 + 对象、然后
// 结果行（`exit 1` 红、`41 files`、耗时、字节、replayed 芯片）——右边时间标尺（`+1:12`，跑着的
// 说 now）。收起的命令下面露出输出的尾巴（peek）；展开是完整面板。Read 只有摘要行，文件芯片开
// 代码查看器看**现在**的文件。状态以 journal 为准，活投影只叠 `cached`。
import { memo, useCallback, useMemo, useState, } from "react";
import { ChevronRightIcon, FileIcon, GitBranchIcon, SearchIcon, SquareTerminalIcon, TerminalIcon, } from "lucide-react";
import { cn } from "../components/lib/utils.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { resolveFileDisplayDescriptor } from "../lib/fileDisplay.js";
import { ReadFileChip } from "../ToolCallBlocks/renderers/read.js";
import { WorkspaceCardBody } from "../app-shell/WorkflowWorkspaceCardBody.js";
import { WorkspacePeek } from "../app-shell/WorkflowWorkspacePeek.js";
import { formatAgo, formatOffset, rememberedOpen, setRememberedOpen, } from "../app-shell/workflowWorkspaceLogbook.js";
import { formatWorkspaceBytes, formatWorkspaceDuration, isTimeoutError, workspaceCardStatus, } from "../app-shell/workflowWorkspaceTranscript.js";
const KIND_ICON = {
    read: _jsx(FileIcon, { className: "size-3.5" }),
    search: _jsx(SearchIcon, { className: "size-3.5" }),
    git: _jsx(GitBranchIcon, { className: "size-3.5" }),
    terminal: _jsx(SquareTerminalIcon, { className: "size-3.5" }),
    step: _jsx(TerminalIcon, { className: "size-3.5" }),
};
const CODE_CLASS = "truncate font-mono text-[12.5px] text-foreground";
function readSummaryOf(path, workspacePath) {
    const absolute = path.startsWith("/") || /^[A-Za-z]:[\\/]/.test(path) ? path : `${workspacePath}/${path}`;
    const descriptor = resolveFileDisplayDescriptor(absolute);
    return {
        path: absolute,
        fileName: descriptor.fileName,
        filePath: descriptor.filePath,
        fileIconSrc: descriptor.fileIconSrc,
        entryType: "file",
    };
}
/** 结果行的零件之间放一颗小点。 */
function joined(parts) {
    const out = [];
    parts.forEach((part, index) => {
        if (part === null || part === undefined)
            return;
        if (out.length > 0) {
            out.push(_jsx("span", { "aria-hidden": true, className: "size-[3px] shrink-0 rounded-full bg-foreground-subtlest opacity-70" }, `sep-${index}`));
        }
        out.push(_jsx("span", { children: part }, index));
    });
    return out;
}
export const WorkflowWorkspaceCard = memo(function WorkflowWorkspaceCard({ card, enterDelayMs, landed = false, now, onOpenCodeViewer, origin, run, runId, sessionId, workspacePath, }) {
    const { intl } = useZCodeIntl();
    const format = intl.formatMessage.bind(intl);
    const { node, kind } = card;
    const { status, replayed } = workspaceCardStatus(node, run);
    const isRunning = status === "running";
    const exitCode = node.summary?.exitCode;
    const failed = status === "failed" || (exitCode !== undefined && exitCode !== 0);
    const durationMs = Math.max(0, node.updatedAt - node.createdAt);
    // Read 只有摘要行；其余可展开（running 的命令也可展开看命令行）。展开态按卡记忆。
    const expandable = kind !== "read";
    const persistKey = `${sessionId}:${runId}:${card.key}`;
    const [open, setOpen] = useState(() => rememberedOpen(persistKey));
    const toggle = useCallback(() => {
        setOpen((previous) => {
            setRememberedOpen(persistKey, !previous);
            return !previous;
        });
    }, [persistKey]);
    const onClick = useCallback((event) => {
        // 正文与 peek 里的点击（选文本、Copy、文件芯片）不折叠。
        if (event.target.closest("[data-ws-body],button,a") !== null)
            return;
        toggle();
    }, [toggle]);
    const onKeyDown = useCallback((event) => {
        if (event.target !== event.currentTarget)
            return;
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggle();
        }
    }, [toggle]);
    const readSummary = useMemo(() => (kind === "read" ? readSummaryOf(card.primary, workspacePath) : null), [card.primary, kind, workspacePath]);
    const openRead = useCallback(() => {
        if (readSummary === null || onOpenCodeViewer === undefined)
            return;
        onOpenCodeViewer({ type: "file", title: readSummary.fileName, path: readSummary.path });
    }, [onOpenCodeViewer, readSummary]);
    // 第一行：动词 + 对象。
    const verb = kind === "read"
        ? format({ id: "chat.toolCall.workflow.script.verb.read" })
        : kind === "search"
            ? format({ id: "chat.toolCall.workflow.script.verb.searched" })
            : kind === "git"
                ? "git"
                : kind === "terminal"
                    ? format({
                        id: isRunning ? "chat.toolCall.execute.running" : "chat.toolCall.execute.ran",
                    })
                    : format({ id: "chat.toolCall.workflow.script.kind.step" });
    const object = kind === "read" && readSummary !== null ? (_jsx("span", { className: "inline-flex h-5 min-w-0 max-w-full items-center rounded-[5px] border border-border bg-card px-1.5 text-ui-sm [&_button]:text-foreground [&_span]:text-foreground", children: _jsx(ReadFileChip, { summary: readSummary, clickable: onOpenCodeViewer !== undefined, onClick: openRead }) })) : kind === "search" ? (_jsxs("span", { className: "flex min-w-0 items-baseline gap-1.5 truncate", children: [_jsx("code", { className: CODE_CLASS, children: card.primary }), card.secondary === undefined ? null : (_jsxs(_Fragment, { children: [_jsx("span", { className: "text-foreground-subtlest", children: format({ id: "chat.toolCall.workflow.script.search.in" }) }), _jsx("code", { className: CODE_CLASS, children: card.secondary })] }))] })) : kind === "git" ? (_jsx("code", { className: CODE_CLASS, children: card.primary.replace(/^git /, "") })) : kind === "terminal" ? (_jsx("code", { className: CODE_CLASS, children: card.command ?? card.primary })) : (_jsx("span", { className: "truncate text-foreground", children: card.primary }));
    // 第二行：结果。状态词换值时新词进场。
    const statusWord = status === "failed"
        ? isTimeoutError(node.error)
            ? format({ id: "chat.toolCall.workflow.script.status.timedOut" })
            : (node.error?.code ?? format({ id: "chat.toolCall.workflow.graph.status.failed" }))
        : exitCode !== undefined
            ? format({ id: "chat.toolCall.workflow.script.status.exit" }, { code: String(exitCode) })
            : undefined;
    const statusNode = statusWord === undefined ? null : (_jsx("span", { className: cn("wf-swap font-semibold", failed ? "text-destructive" : "text-success"), "data-failed": failed ? "true" : undefined, "data-testid": "workflow-workspace-status", title: status === "failed"
            ? (node.error?.message ?? node.error?.code)
            : failed
                ? card.command
                : undefined, children: statusWord }, statusWord));
    const replayedNode = replayed ? (_jsx("span", { className: "inline-flex h-4 items-center rounded-[4px] border border-dashed border-border px-1 text-[10.5px] leading-none text-foreground-subtlest", "data-testid": "workflow-workspace-replayed", title: format({ id: "chat.toolCall.workflow.script.status.replayedHint" }), children: format({ id: "chat.toolCall.workflow.script.status.replayed" }) })) : null;
    const bytes = node.summary?.resultBytes;
    const count = node.summary?.resultCount;
    const countNode = count === undefined ? null : (_jsx("b", { className: "font-medium text-foreground-subtle", children: format({
            id: card.op === "grep"
                ? "chat.toolCall.workflow.script.result.matches"
                : "chat.toolCall.workflow.script.result.files",
        }, { count: String(count) }) }));
    const resultParts = isRunning
        ? [
            format({ id: "chat.toolCall.workflow.script.startedAgo" }, { ago: formatAgo(now - node.createdAt) }),
        ]
        : status === "failed"
            ? [statusNode, formatWorkspaceDuration(durationMs)]
            : kind === "read"
                ? [
                    _jsx("span", { className: "truncate font-mono", children: card.primary }, "path"),
                    bytes === undefined ? null : formatWorkspaceBytes(bytes),
                    replayedNode,
                ]
                : kind === "search"
                    ? [countNode, formatWorkspaceDuration(durationMs), replayedNode]
                    : kind === "terminal"
                        ? [
                            statusNode,
                            formatWorkspaceDuration(durationMs),
                            formatWorkspaceBytes(node.summary?.stdoutBytes ?? bytes ?? 0),
                            replayedNode,
                        ]
                        : [
                            countNode,
                            bytes === undefined ? null : formatWorkspaceBytes(bytes),
                            formatWorkspaceDuration(durationMs),
                            replayedNode,
                        ];
    if (node.inputTruncated) {
        resultParts.push(_jsx("span", { title: format({ id: "chat.toolCall.workflow.script.args.truncated" }), children: "\u2026" }));
    }
    const style = enterDelayMs === undefined || enterDelayMs <= 0
        ? {}
        : { animationDelay: `${enterDelayMs}ms`, animationFillMode: "backwards" };
    return (_jsxs("div", { "aria-expanded": expandable ? open : undefined, className: cn("wf-ws-entry wf-arrive group/ws grid grid-cols-[28px_minmax(0,1fr)_auto] items-start gap-x-3 rounded-[9px] px-2 pb-2.5 pt-[9px] outline-none", expandable &&
            "cursor-pointer hover:bg-surface focus-visible:ring-2 focus-visible:ring-ring/40", landed && "wf-ws-landed"), "data-card-key": card.key, "data-open": open ? "true" : undefined, "data-ordinal": node.ordinal, "data-phase-id": card.phase?.id, "data-site-id": node.siteId, "data-status": status, "data-testid": "workflow-workspace-card", onClick: expandable ? onClick : undefined, onKeyDown: expandable ? onKeyDown : undefined, role: expandable ? "button" : undefined, style: style, tabIndex: expandable ? 0 : undefined, children: [_jsx("span", { "aria-hidden": true, className: cn("mt-px flex size-7 items-center justify-center rounded-[7px] bg-surface text-foreground-subtle transition-colors", failed &&
                    "bg-[color-mix(in_oklab,var(--color-destructive)_10%,transparent)] text-destructive", isRunning && "bg-[color-mix(in_oklab,var(--color-warning)_12%,transparent)] text-warning"), children: KIND_ICON[kind] }), _jsxs("div", { className: "flex min-w-0 flex-col gap-1", children: [_jsxs("div", { className: "flex min-w-0 items-baseline gap-1.5 text-ui-base leading-[18px]", children: [_jsx("span", { className: cn("shrink-0 font-medium text-foreground-subtle", isRunning && "wf-ws-shine"), children: verb }), object, expandable ? (_jsx(ChevronRightIcon, { className: cn("ml-0.5 size-3.5 shrink-0 self-center text-foreground-subtlest opacity-0 transition-[opacity,transform] duration-[160ms] group-hover/ws:opacity-100 group-focus-visible/ws:opacity-100", open && "rotate-90 opacity-100") })) : null] }), _jsx("div", { className: "flex flex-wrap items-center gap-1.5 text-ui-sm leading-4 text-foreground-subtlest", "data-testid": "workflow-workspace-result", children: joined(resultParts) }), kind === "terminal" && !open && status === "completed" ? (_jsx(WorkspacePeek, { node: node, runId: runId, sessionId: sessionId })) : null, expandable && open ? (_jsx(WorkspaceCardBody, { card: card, runId: runId, sessionId: sessionId })) : null] }), _jsx("span", { className: "flex items-center gap-1.5 whitespace-nowrap font-mono text-ui-xs leading-[18px] tabular-nums text-foreground-subtlest", "data-testid": "workflow-workspace-when", children: isRunning ? (_jsxs(_Fragment, { children: [_jsx("span", { "aria-hidden": true, className: "wf-lamp-running size-1.5 rounded-full bg-warning" }), format({ id: "chat.toolCall.workflow.script.now" })] })) : origin === undefined ? null : (formatOffset(node.createdAt - origin)) })] }));
});
//# sourceMappingURL=WorkflowWorkspaceCard.js.map