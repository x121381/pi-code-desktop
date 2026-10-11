import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { GitGraph, GitMergeIcon, RefreshCwIcon } from "lucide-react";
import { useCallback, useMemo, useState, } from "react";
import { cn } from "@/components/lib/utils.js";
import { Button } from "@/components/ui/button.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { GitGraphCommitDetail } from "./GitGraphCommitDetail.js";
import { formatCommitTime, getRefIcon, getShortHash, } from "./GitGraphDisplay.js";
import { layoutGitGraph, } from "./layout.js";
const laneStrokeClasses = [
    "stroke-git-descendant",
    "stroke-git-renamed",
    "stroke-git-added",
    "stroke-git-modified",
];
const laneFillClasses = [
    "fill-git-descendant",
    "fill-git-renamed",
    "fill-git-added",
    "fill-git-modified",
];
const NODE_RADIUS = 4;
const SELECTED_NODE_RADIUS = 4.25;
const SELECTED_RING_RADIUS = 5.5;
const LOAD_MORE_SCROLL_THRESHOLD_PX = 96;
// 单泳道图形宽度比 Graph 表头短，保留最小列宽避免表头被挤压。
const GRAPH_COLUMN_MIN_WIDTH_PX = 56;
function getLaneStrokeClass(laneIndex) {
    return laneStrokeClasses[laneIndex % laneStrokeClasses.length];
}
function getLaneFillClass(laneIndex) {
    return laneFillClasses[laneIndex % laneFillClasses.length];
}
function getTableColumnStyle() {
    return {
        gridTemplateColumns: "minmax(260px,1fr) 128px 112px 84px",
    };
}
function isPathRelated(path, hash) {
    return Boolean(hash && path.relatedHashes.includes(hash));
}
export function GitGraphPane({ commits, hasMore = false, loadingMore = false, refreshing = false, selectedCommitHash, onSelectCommit, onLoadMore, onRefresh, }) {
    const { intl, locale } = useZCodeIntl();
    const [hoveredCommitHash, setHoveredCommitHash] = useState(null);
    const [expandedCommitHash, setExpandedCommitHash] = useState(null);
    const layout = useMemo(() => layoutGitGraph(commits), [commits]);
    const highlightedHash = hoveredCommitHash;
    const tableColumnStyle = getTableColumnStyle();
    const graphColumnWidth = Math.max(layout.width + 12, GRAPH_COLUMN_MIN_WIDTH_PX);
    const expandedCommit = commits.find((commit) => commit.hash === expandedCommitHash) ?? null;
    const handleGraphScroll = useCallback((event) => {
        if (!hasMore || loadingMore || !onLoadMore) {
            return;
        }
        const target = event.currentTarget;
        const distanceToBottom = target.scrollHeight - target.scrollTop - target.clientHeight;
        if (distanceToBottom <= LOAD_MORE_SCROLL_THRESHOLD_PX) {
            onLoadMore();
        }
    }, [hasMore, loadingMore, onLoadMore]);
    return (_jsxs("section", { className: "flex h-full min-h-0 flex-col bg-background text-foreground", children: [_jsx("div", { className: "border-b border-border bg-surface/40 px-3 py-2", children: _jsxs("div", { className: "flex min-w-0 items-center justify-between gap-3", children: [_jsx("div", { className: "min-w-0", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(GitGraph, { className: "size-3.5 text-foreground" }), _jsx("h2", { className: "truncate text-ui-base font-medium", children: intl.formatMessage({ id: "gitGraph.title" }) })] }) }), onRefresh ? (_jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", disabled: refreshing, "aria-label": intl.formatMessage({ id: "gitGraph.refresh" }), title: intl.formatMessage({ id: "gitGraph.refresh" }), className: "mr-8 text-foreground-subtle hover:text-foreground", onClick: onRefresh, children: _jsx(RefreshCwIcon, { className: cn("size-3.5", refreshing && "animate-spin") }) })) : null] }) }), commits.length === 0 ? (_jsx("div", { className: "flex min-h-0 flex-1 items-center justify-center p-6", children: _jsxs("div", { className: "max-w-sm text-center", children: [_jsx(GitGraph, { className: "mx-auto size-8 text-foreground-subtlest" }), _jsx("p", { className: "mt-3 text-ui-base font-medium text-foreground", children: intl.formatMessage({ id: "gitGraph.empty.title" }) }), _jsx("p", { className: "mt-1 text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "gitGraph.empty.description" }) })] }) })) : (_jsx("div", { className: "min-h-0 flex-1 overflow-auto", onScroll: handleGraphScroll, children: _jsx("div", { className: "min-h-0 overflow-auto", children: _jsxs("div", { className: "grid min-w-[760px]", style: {
                            gridTemplateColumns: `minmax(${GRAPH_COLUMN_MIN_WIDTH_PX}px, ${layout.width + 12}px) minmax(0, 1fr)`,
                        }, children: [_jsx("div", { className: "border-b border-r border-border bg-surface/60 px-3 py-2 text-ui-base font-medium text-foreground-subtle", children: intl.formatMessage({ id: "gitGraph.column.graph" }) }), _jsxs("div", { className: "grid border-b border-border bg-surface/60 text-ui-base font-medium text-foreground-subtle", style: tableColumnStyle, children: [_jsx("div", { className: "border-r border-border px-3 py-2", children: intl.formatMessage({ id: "gitGraph.column.description" }) }), _jsx("div", { className: "border-r border-border px-3 py-2", children: intl.formatMessage({ id: "gitGraph.column.date" }) }), _jsx("div", { className: "border-r border-border px-3 py-2", children: intl.formatMessage({ id: "gitGraph.column.author" }) }), _jsx("div", { className: "px-3 py-2", children: intl.formatMessage({ id: "gitGraph.column.commit" }) })] }), _jsx("div", { className: "relative border-r border-border bg-background-alt/35", style: { height: layout.height + layout.rowHeight }, children: _jsxs("svg", { className: "absolute inset-0 overflow-visible", width: graphColumnWidth, height: layout.height + layout.rowHeight, viewBox: `0 0 ${graphColumnWidth} ${layout.height + layout.rowHeight}`, role: "img", "aria-label": intl.formatMessage({ id: "gitGraph.graphAriaLabel" }), children: [layout.paths.map((path) => (_jsx("path", { d: path.path, className: cn("fill-none stroke-[2] opacity-55 transition-opacity", getLaneStrokeClass(path.laneIndex), highlightedHash &&
                                                !isPathRelated(path, highlightedHash) &&
                                                "opacity-30", isPathRelated(path, highlightedHash) && "opacity-100") }, path.id))), layout.rows.map((row) => {
                                            const isSelected = row.commit.hash === selectedCommitHash;
                                            const isHovered = row.commit.hash === hoveredCommitHash;
                                            return (_jsxs("g", { children: [_jsx("circle", { cx: row.x, cy: row.y, r: isSelected ? SELECTED_NODE_RADIUS : NODE_RADIUS, className: cn("stroke-background stroke-[2] transition-all", getLaneFillClass(row.laneIndex), highlightedHash && !isSelected && !isHovered && "opacity-80") }), isSelected ? (_jsx("circle", { cx: row.x, cy: row.y, r: SELECTED_RING_RADIUS, className: cn("fill-none stroke-[1] opacity-85", getLaneStrokeClass(row.laneIndex)) })) : null] }, row.commit.hash));
                                        })] }) }), _jsxs("div", { className: "min-w-0", children: [layout.rows.map((row) => {
                                        const isSelected = row.commit.hash === selectedCommitHash;
                                        const isHovered = row.commit.hash === hoveredCommitHash;
                                        const commitTime = formatCommitTime(row.commit.authoredAtMs, locale);
                                        return (_jsxs("button", { type: "button", className: cn("grid w-full min-w-0 items-center border-y border-transparent text-left transition-colors", "hover:bg-hover focus-visible:bg-hover focus-visible:outline-none", isSelected && "border-b-border bg-selected", isSelected && row.rowIndex > 0 && "border-t-border", isHovered && !isSelected && "bg-surface-hover"), style: { ...tableColumnStyle, height: layout.rowHeight }, onClick: () => {
                                                onSelectCommit(row.commit.hash);
                                                setExpandedCommitHash((currentHash) => currentHash === row.commit.hash ? null : row.commit.hash);
                                            }, onMouseEnter: () => setHoveredCommitHash(row.commit.hash), onMouseLeave: () => setHoveredCommitHash(null), children: [_jsx("span", { className: "min-w-0 px-3", children: _jsxs("span", { className: "flex min-w-0 items-center gap-2", children: [row.commit.refs.length > 0 ? (_jsx("span", { className: "flex min-w-0 shrink-0 items-center gap-1 overflow-hidden", children: row.commit.refs.slice(0, 4).map((ref) => (_jsxs("span", { className: cn("inline-flex h-5 min-w-0 items-center gap-1 rounded-md border border-border bg-surface px-1.5 text-ui-base text-foreground-subtle", ref.kind === "head" &&
                                                                        "border-git-descendant bg-selected text-foreground", ref.kind === "tag" && "border-git-added"), children: [getRefIcon(ref, "size-2.5"), _jsx("span", { className: "max-w-32 truncate", children: ref.name })] }, `${row.commit.hash}:${ref.name}`))) })) : null, _jsx("span", { className: "truncate text-ui-base text-foreground", children: row.commit.subject || getShortHash(row.commit.hash) }), row.commit.parents.length > 1 ? (_jsx(GitMergeIcon, { className: "size-3 shrink-0 text-git-renamed" })) : null] }) }), _jsx("span", { className: cn("truncate border-l border-transparent px-3 text-ui-base text-foreground-subtle", isSelected && "border-border"), children: commitTime }), _jsx("span", { className: cn("truncate border-l border-transparent px-3 text-ui-base font-medium text-foreground-subtle", isSelected && "border-border"), children: row.commit.authorName }), _jsx("span", { className: cn("truncate border-l border-transparent px-3 font-mono text-ui-base text-foreground-subtle", isSelected && "border-border"), children: getShortHash(row.commit.hash) })] }, row.commit.hash));
                                    }), hasMore && onLoadMore ? (_jsxs("div", { className: "flex h-10 items-center border-b border-border px-3", children: [_jsx(Button, { type: "button", variant: "outline", size: "sm", disabled: loadingMore, className: "h-7 w-full text-ui-base sm:hidden", onClick: onLoadMore, children: loadingMore
                                                    ? intl.formatMessage({ id: "gitGraph.loadMore.loading" })
                                                    : intl.formatMessage({ id: "gitGraph.loadMore" }) }), _jsx("button", { type: "button", disabled: loadingMore, className: "hidden w-full rounded-md px-2 py-1 text-ui-base text-foreground-subtle transition-colors hover:bg-hover hover:text-foreground disabled:cursor-default disabled:opacity-60 sm:block", onClick: onLoadMore, children: loadingMore
                                                    ? intl.formatMessage({ id: "gitGraph.loadMore.loading" })
                                                    : intl.formatMessage({ id: "gitGraph.loadMore" }) })] })) : null] })] }) }) })), expandedCommit ? _jsx(GitGraphCommitDetail, { commit: expandedCommit }) : null] }));
}
//# sourceMappingURL=GitGraphPane.js.map