import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable max-lines -- Treemapping 需要在同一视图里组合活动树、矩形布局和详情区；等交互稳定后再拆分子组件。 */
import { useCallback, useMemo, useState } from "react";
import { FolderIcon, Loader2Icon } from "lucide-react";
import { cn } from "./components/lib/utils.js";
import { FileDisplayInline, FileDisplayIcon, resolveFileDisplayDescriptor, } from "./lib/fileDisplay.js";
import { useZCodeIntl } from "./i18n/IntlProvider.js";
import { buildTreemappingActivityModel, } from "./lib/treemappingActivity.js";
import { getPathLeaf } from "./lib/path.js";
import { logger } from "./logger.js";
import { useTreemappingConversationMessage } from "./v4/useTreemappingConversationMessage.js";
const VIEWED_ONLY_WEIGHT = 6;
const MIN_CHANGE_WEIGHT = 14;
const ROOT_PATH = ".";
const DIRECTORY_BASIS_SCALE = 64;
const DIRECTORY_HEIGHT_SCALE = 34;
const FILE_BASIS_SCALE = 52;
const FILE_HEIGHT_SCALE = 24;
function createDirectory(path) {
    return {
        type: "directory",
        path,
        views: 0,
        lastTouchedAt: 0,
        events: [],
        children: [],
    };
}
function getNodePathParts(path) {
    return path.replace(/\\/g, "/").split("/").filter(Boolean);
}
function findChildDirectory(directory, path) {
    const child = directory.children.find((node) => node.type === "directory" && node.path === path);
    return child ?? null;
}
function ensureDirectory(root, directoryPath) {
    if (!directoryPath || directoryPath === ROOT_PATH) {
        return root;
    }
    let current = root;
    const parts = getNodePathParts(directoryPath);
    let accumulatedPath = "";
    for (const part of parts) {
        accumulatedPath = accumulatedPath ? `${accumulatedPath}/${part}` : part;
        const existing = findChildDirectory(current, accumulatedPath);
        if (existing) {
            current = existing;
            continue;
        }
        const next = createDirectory(accumulatedPath);
        current.children.push(next);
        current = next;
    }
    return current;
}
function getParentPath(path) {
    const slashIndex = path.lastIndexOf("/");
    return slashIndex > 0 ? path.slice(0, slashIndex) : ROOT_PATH;
}
function buildTree(model, workspaceLabel) {
    const root = createDirectory(workspaceLabel || ROOT_PATH);
    const directoryByPath = new Map([[ROOT_PATH, root]]);
    for (const directoryActivity of model.directories) {
        const directory = ensureDirectory(root, directoryActivity.path);
        directoryByPath.set(directoryActivity.path, directory);
        directory.views += directoryActivity.views;
        directory.lastTouchedAt = Math.max(directory.lastTouchedAt, directoryActivity.lastTouchedAt);
        directory.events.push(...directoryActivity.events);
    }
    for (const file of model.files) {
        const parentDirectory = ensureDirectory(root, getParentPath(file.path));
        parentDirectory.children.push({
            ...file,
            type: "file",
        });
    }
    sortTree(root);
    return root;
}
function sortTree(node) {
    node.children.sort((left, right) => {
        if (left.type !== right.type) {
            return left.type === "directory" ? -1 : 1;
        }
        const leftDiff = summarizeNode(left).added + summarizeNode(left).removed;
        const rightDiff = summarizeNode(right).added + summarizeNode(right).removed;
        if (leftDiff !== rightDiff) {
            return rightDiff - leftDiff;
        }
        return left.path.localeCompare(right.path);
    });
    for (const child of node.children) {
        if (child.type === "directory") {
            sortTree(child);
        }
    }
}
function summarizeNode(node) {
    if (node.type === "file") {
        return {
            added: node.added,
            removed: node.removed,
            views: node.views,
            files: 1,
            written: node.kind === "written" ? 1 : 0,
            modified: node.kind === "modified" ? 1 : 0,
            deleted: node.kind === "deleted" ? 1 : 0,
            pending: node.pendingToolCallIds.length,
        };
    }
    return node.children.reduce((summary, child) => {
        const childSummary = summarizeNode(child);
        return {
            added: summary.added + childSummary.added,
            removed: summary.removed + childSummary.removed,
            views: summary.views + childSummary.views,
            files: summary.files + childSummary.files,
            written: summary.written + childSummary.written,
            modified: summary.modified + childSummary.modified,
            deleted: summary.deleted + childSummary.deleted,
            pending: summary.pending + childSummary.pending,
        };
    }, {
        added: 0,
        removed: 0,
        views: node.views,
        files: 0,
        written: 0,
        modified: 0,
        deleted: 0,
        pending: 0,
    });
}
function getDiffCount(summary) {
    return summary.added + summary.removed;
}
function getFileWeight(node) {
    const diffCount = node.added + node.removed;
    if (diffCount > 0) {
        return Math.max(diffCount, MIN_CHANGE_WEIGHT);
    }
    return node.kind === "viewed" ? VIEWED_ONLY_WEIGHT : MIN_CHANGE_WEIGHT;
}
function getDirectoryWeight(node) {
    const summary = summarizeNode(node);
    const diffCount = getDiffCount(summary);
    if (diffCount > 0) {
        return Math.max(diffCount, MIN_CHANGE_WEIGHT);
    }
    return summary.views > 0 ? VIEWED_ONLY_WEIGHT : MIN_CHANGE_WEIGHT;
}
function getAreaSideWeight(weight) {
    return Math.sqrt(Math.max(weight, 1));
}
function clampSize(value, min, max) {
    return Math.min(Math.max(value, min), max);
}
function findNode(node, path) {
    if (node.path === path) {
        return node;
    }
    if (node.type === "file") {
        return null;
    }
    for (const child of node.children) {
        const match = findNode(child, path);
        if (match) {
            return match;
        }
    }
    return null;
}
function findFirstFile(node) {
    if (node.type === "file") {
        return node;
    }
    for (const child of node.children) {
        const file = findFirstFile(child);
        if (file) {
            return file;
        }
    }
    return null;
}
function getFileTone(kind) {
    if (kind === "written") {
        return "border-success/50 bg-success/15 text-foreground";
    }
    if (kind === "modified") {
        return "border-warning/50 bg-warning/20 text-foreground";
    }
    if (kind === "deleted") {
        return "border-destructive/60 bg-destructive/15 text-foreground";
    }
    return "border-file-node-foreground/45 bg-file-node text-foreground";
}
function getChangeLabel(kind, formatMessage) {
    return formatMessage(`treemapping.change.${kind}`);
}
function getEventActionLabel(action, formatMessage) {
    if (action === "write") {
        return getChangeLabel("written", formatMessage);
    }
    if (action === "modify") {
        return getChangeLabel("modified", formatMessage);
    }
    if (action === "delete") {
        return getChangeLabel("deleted", formatMessage);
    }
    return getChangeLabel("viewed", formatMessage);
}
export function TreemappingPane({ activeTaskId, workspacePath, workspaceIdentity, source, }) {
    const { intl } = useZCodeIntl();
    const [selectedPath, setSelectedPath] = useState(null);
    // store 收尾：消息源从旧 zcodeSessionStore 迁 v4 conversation 投影 rows。
    // 旧 source.kind === "message"（按 legacy messageId 锚定某条消息）的入口随旧
    // ChatView 一起删除，这里统一取最后一个 assistant 轮的活动。
    const message = useTreemappingConversationMessage({
        sessionId: activeTaskId,
        workspacePath,
        workspaceIdentity,
    });
    const model = useMemo(() => buildTreemappingActivityModel(message, workspacePath), [message, workspacePath]);
    const tree = useMemo(() => buildTree(model, getPathLeaf(workspacePath) || workspacePath), [model, workspacePath]);
    const selectedNode = (selectedPath ? findNode(tree, selectedPath) : null) ?? findFirstFile(tree) ?? tree;
    const handleSelectPath = useCallback((path) => {
        logger.debug("[TreemappingPane] select node", {
            activeTaskId,
            path,
            previousPath: selectedNode.path,
            sourceKind: source.kind,
        });
        setSelectedPath(path);
    }, [activeTaskId, selectedNode.path, source.kind]);
    const summary = summarizeNode(tree);
    const selectedSummary = summarizeNode(selectedNode);
    const isLive = source.kind === "current" || Boolean(message?.streaming);
    const formatMessage = (id) => intl.formatMessage({ id });
    return (_jsxs("div", { className: "flex h-full min-h-0 flex-col bg-background text-foreground", children: [_jsxs("div", { className: "border-b border-border px-4 py-3", children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("h2", { className: "truncate text-ui-base font-medium", children: intl.formatMessage({ id: "treemapping.title" }) }), _jsx("p", { className: "truncate text-ui-base text-foreground-subtle", children: source.kind === "current"
                                            ? intl.formatMessage({ id: "treemapping.scope.current" })
                                            : intl.formatMessage({ id: "treemapping.scope.turn" }, {
                                                turn: String(source.turnIndex !== undefined ? source.turnIndex + 1 : ""),
                                            }) })] }), _jsx("span", { className: "rounded-full border border-border px-2 py-0.5 text-ui-base text-foreground-subtle", children: intl.formatMessage({
                                    id: isLive ? "treemapping.badge.live" : "treemapping.badge.snapshot",
                                }) })] }), _jsxs("div", { className: "mt-3 grid grid-cols-3 gap-2 text-ui-base", children: [_jsx(SummaryCell, { label: intl.formatMessage({ id: "treemapping.summary.files" }), value: summary.files }), _jsx(SummaryCell, { label: intl.formatMessage({ id: "treemapping.summary.diff" }), value: _jsx(DiffCount, { added: summary.added, removed: summary.removed }) }), _jsx(SummaryCell, { label: intl.formatMessage({ id: "treemapping.summary.views" }), value: summary.views })] })] }), _jsx("div", { className: "min-h-0 flex-1 overflow-auto p-3", children: summary.files === 0 ? (_jsx(EmptyState, { runningWithoutPathCount: model.runningWithoutPathCount })) : (_jsx(DirectoryBox, { node: tree, depth: 0, selectedPath: selectedNode.path, onSelect: handleSelectPath, formatMessage: formatMessage })) }), _jsxs("div", { className: "border-t border-border bg-card px-3 py-2", children: [_jsxs("div", { className: "flex min-w-0 items-center justify-between gap-3", children: [_jsx("div", { className: "min-w-0 flex-1 overflow-hidden", children: selectedNode.type === "file" ? (_jsx(FileDisplayInline, { path: selectedNode.path, options: {
                                        showFilePath: true,
                                        className: "inline-flex min-w-0 max-w-full items-center gap-1.5",
                                        fileNameClassName: "truncate text-ui-base font-medium text-foreground",
                                        filePathClassName: "truncate text-ui-base text-foreground-subtlest",
                                    } })) : (_jsxs("span", { className: "inline-flex min-w-0 max-w-full items-center gap-1.5", children: [_jsx(FolderIcon, { className: "size-3.5 shrink-0 text-foreground-subtle" }), _jsx("span", { className: "truncate font-mono text-ui-base font-medium text-foreground", children: selectedNode.path })] })) }), _jsx(DiffCount, { added: selectedSummary.added, removed: selectedSummary.removed, className: "shrink-0 text-ui-base" })] }), _jsxs("div", { className: "mt-1 flex flex-wrap gap-x-3 gap-y-1 text-ui-base text-foreground-subtle", children: [_jsxs("span", { children: [_jsxs("span", { className: "text-foreground-subtlest", children: [intl.formatMessage({ id: "treemapping.summary.views" }), ":"] }), " ", _jsx("span", { className: "font-mono text-foreground-subtle", children: selectedSummary.views })] }), selectedNode.type === "file" ? (_jsx("span", { className: "text-foreground-subtle", children: getChangeLabel(selectedNode.kind, formatMessage) })) : (_jsxs("span", { children: [_jsxs("span", { className: "text-foreground-subtlest", children: [intl.formatMessage({ id: "treemapping.summary.files" }), ":"] }), " ", _jsx("span", { className: "font-mono text-foreground-subtle", children: selectedSummary.files })] }))] }), selectedNode.type === "file" && selectedNode.events.length > 0 ? (_jsx("div", { className: "mt-2 max-h-24 overflow-auto rounded-lg border border-border bg-background/50", children: selectedNode.events.slice(-4).map((event, index) => (_jsxs("div", { className: cn("flex min-h-8 min-w-0 items-center justify-between gap-3 px-2 py-1.5 text-ui-base", index > 0 && "border-t border-border/60"), children: [_jsx("span", { className: "flex min-w-0 items-center gap-1.5", children: _jsx("span", { className: "min-w-0 truncate font-medium text-foreground", children: getEventActionLabel(event.action, formatMessage) }) }), _jsx(DiffCount, { added: event.added, removed: event.removed, className: "shrink-0" })] }, `${event.toolCallId}-${event.action}-${index}`))) })) : null] })] }));
}
function SummaryCell({ label, value }) {
    return (_jsxs("div", { className: "min-w-0 rounded-lg border border-border bg-card px-3 py-2", children: [_jsx("div", { className: "truncate text-ui-base text-foreground-subtle", children: label }), _jsx("div", { className: "mt-1 truncate font-mono text-ui-base font-medium text-foreground", children: value })] }));
}
function DiffCount({ added, removed, className, }) {
    return (_jsxs("span", { className: cn("inline-flex items-baseline gap-1 font-mono tabular-nums", className), children: [_jsxs("span", { className: added > 0 ? "text-diff-added" : "text-foreground-subtlest", children: ["+", added] }), _jsxs("span", { className: removed > 0 ? "text-diff-removed" : "text-foreground-subtlest", children: ["-", removed] })] }));
}
function EmptyState({ runningWithoutPathCount }) {
    const { intl } = useZCodeIntl();
    return (_jsxs("div", { className: "flex h-full min-h-0 w-full flex-1 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border px-4 text-center", children: [runningWithoutPathCount > 0 ? (_jsx(Loader2Icon, { className: "size-4 animate-spin text-foreground-subtle" })) : null, _jsx("div", { className: "text-ui-base font-medium", children: intl.formatMessage({ id: "treemapping.empty.title" }) }), _jsx("div", { className: "max-w-64 text-ui-base leading-5 text-foreground-subtle", children: runningWithoutPathCount > 0
                    ? intl.formatMessage({ id: "treemapping.empty.running" }, { count: String(runningWithoutPathCount) })
                    : intl.formatMessage({ id: "treemapping.empty.description" }) })] }));
}
function DirectoryBox({ node, depth, selectedPath, onSelect, formatMessage, }) {
    const summary = summarizeNode(node);
    const weight = getDirectoryWeight(node);
    const style = {
        // 目录本身没有状态色，但面积要反映子树聚合 diff。
        // 之前宽度按 weight 线性增长，视觉比例几乎只看宽度；这里用 sqrt(weight) 同时影响宽高，
        // 让矩形面积更接近活动权重，而不是把大改动目录挤成长条。
        flexGrow: weight,
        flexBasis: depth === 0
            ? undefined
            : `${clampSize(getAreaSideWeight(weight) * DIRECTORY_BASIS_SCALE, 160, 360)}px`,
        minHeight: depth === 0
            ? undefined
            : `${clampSize(getAreaSideWeight(weight) * DIRECTORY_HEIGHT_SCALE, 96, 220)}px`,
    };
    return (_jsxs("section", { style: style, className: cn(
        // CSS 的 :hover 会同时命中所有祖先目录，子文件 hover 时父目录也会变色。
        // 目录容器只表达层级和选中态，悬停反馈留给当前文件块，避免父级被子级 hover 牵连。
        "flex min-w-0 flex-col rounded-lg border-2 border-border p-2 transition-colors duration-150", depth > 0 && "flex-1", selectedPath === node.path && "!border-primary"), onClick: (event) => {
            event.stopPropagation();
            onSelect(node.path);
        }, children: [_jsxs("div", { className: "mb-2 flex min-w-0 items-center justify-between gap-2 text-ui-base", children: [_jsxs("span", { className: "flex min-w-0 items-center gap-1.5 font-medium", children: [_jsx(FolderIcon, { className: "size-3.5 shrink-0 text-foreground-subtle" }), _jsx("span", { className: "truncate font-mono", children: depth === 0 ? node.path : getPathLeaf(node.path) })] }), _jsxs("span", { className: "inline-flex shrink-0 items-baseline gap-1.5 text-foreground-subtle", children: [_jsx(DiffCount, { added: summary.added, removed: summary.removed }), node.views > 0 ? _jsxs("span", { className: "font-mono", children: ["\u00B7 ", node.views, "v"] }) : null] })] }), _jsx("div", { className: "flex min-h-20 flex-1 flex-wrap content-stretch items-stretch gap-2", children: node.children.map((child) => child.type === "directory" ? (_jsx(DirectoryBox, { node: child, depth: depth + 1, selectedPath: selectedPath, onSelect: onSelect, formatMessage: formatMessage }, child.path)) : (_jsx(FileBox, { node: child, selected: selectedPath === child.path, onSelect: onSelect, formatMessage: formatMessage }, child.path))) })] }));
}
function FileBox({ node, selected, onSelect, formatMessage, }) {
    const diffCount = node.added + node.removed;
    const weight = getFileWeight(node);
    const recentlyTouched = Date.now() - node.lastTouchedAt < 2000;
    const descriptor = resolveFileDisplayDescriptor(node.path);
    const style = {
        flexGrow: weight,
        flexBasis: `${clampSize(getAreaSideWeight(weight) * FILE_BASIS_SCALE, 88, 260)}px`,
        // 文件叶子用 sqrt(weight) 同时影响宽高，避免 diff 大小只体现在横向占比上。
        // 实际高度仍由父级 stretch 分配，这里只提供面积权重的下限信号。
        minHeight: `${clampSize(getAreaSideWeight(weight) * FILE_HEIGHT_SCALE, 58, 156)}px`,
    };
    return (_jsxs("button", { type: "button", title: `${node.path} · +${node.added}/-${node.removed} · ${node.views} views`, "aria-pressed": selected, "data-selected": selected ? "true" : undefined, style: style, className: cn("relative min-w-20 flex-1 self-stretch rounded-md border-2 p-2 text-left text-ui-base transition-colors duration-150 hover:border-primary/60 focus-visible:border-primary focus-visible:outline-none", "animate-in fade-in zoom-in-95", getFileTone(node.kind), 
        // 最近触达高亮之前使用 ring（box-shadow），点击后的 focus reset 会把它清掉；
        // 改为边框色后，近期触达、hover、选中都走同一种视觉语言。
        recentlyTouched && !selected && "border-primary/60", 
        // 点击后文件块本身会获得 focus，而全局 focus reset 会用 !important 清掉
        // outline/box-shadow；Tailwind ring 也是 box-shadow，所以选中态不能继续依赖 ring。
        selected && "!border-primary"), onClick: (event) => {
            event.stopPropagation();
            onSelect(node.path);
        }, children: [node.pendingToolCallIds.length > 0 ? (_jsx("span", { className: "absolute right-2 top-2 size-2 animate-pulse rounded-full bg-current opacity-80" })) : null, _jsxs("span", { className: "flex h-full min-h-0 flex-col justify-between gap-2", children: [_jsxs("span", { className: "flex min-w-0 flex-col gap-0.5 pr-3 leading-5", children: [_jsxs("span", { className: "flex min-w-0 items-center gap-1.5", children: [_jsx(FileDisplayIcon, { src: descriptor.fileIconSrc, size: 14, className: "size-3.5 shrink-0 opacity-90" }), _jsx("span", { className: cn("truncate font-mono font-medium", node.kind === "deleted" && "line-through"), children: descriptor.fileName })] }), descriptor.filePath ? (_jsx("span", { className: "truncate font-mono text-ui-base text-foreground-subtle opacity-90", children: descriptor.filePath })) : null] }), _jsxs("span", { className: "space-y-0.5 leading-5", children: [_jsx("span", { className: "block truncate", children: getChangeLabel(node.kind, formatMessage) }), _jsx("span", { className: "block truncate opacity-85", children: diffCount > 0 ? (_jsx(DiffCount, { added: node.added, removed: node.removed })) : (_jsxs("span", { className: "font-mono", children: [node.views, " views"] })) })] })] })] }));
}
//# sourceMappingURL=TreemappingPane.js.map