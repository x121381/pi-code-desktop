import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useDeferredValue, useMemo, useRef, useState } from "react";
import { FolderOpenIcon, Maximize2Icon, Minimize2Icon, RefreshCwIcon, SearchIcon, XIcon, } from "lucide-react";
import { Button } from "./components/ui/button.js";
import { toast } from "./components/ui/toast.js";
import { cn } from "./components/lib/utils.js";
import { useZCodeIntl } from "./i18n/IntlProvider.js";
import { useModelTrajectory } from "./hooks/useModelTrajectory.js";
import { usePlatform } from "./hooks/usePlatform.js";
import { getContainingDirectoryPath } from "./lib/path.js";
import { logger } from "./logger.js";
import { TrajectoryExpansionCommandContext, TrajectoryExpansionRegistryContext, TRAJECTORY_EXPANSION_KINDS, createTrajectoryExpansionCommands, } from "./ModelTrajectoryExpansion.js";
import { ModelTrajectoryExpansionMenu } from "./ModelTrajectoryExpansionMenu.js";
import { buildTrajectorySearchIndex, TrajectorySearchRevealContext, } from "./ModelTrajectorySearch.js";
import { ModelTrajectorySearchBar } from "./ModelTrajectorySearchBar.js";
import { clearTrajectorySearchHighlights } from "./ModelTrajectorySearchHighlight.js";
import { ModelTrajectoryTimeline, resolveTrajectoryTimelineItems, } from "./ModelTrajectoryTimeline.js";
import { EmptyState, summarizeRecords } from "./ModelTrajectoryPaneParts.js";
export function ModelTrajectoryPane({ taskId, title, workspacePath, workspaceIdentity, onClose, }) {
    const { intl } = useZCodeIntl();
    const platform = usePlatform();
    const { loading, data, error, refresh } = useModelTrajectory(workspacePath, taskId, workspaceIdentity);
    const records = data?.records ?? [];
    const sourceFiles = data?.sourceFiles;
    const sourceDirectory = useMemo(() => getModelTrajectorySourceDirectory(sourceFiles), [sourceFiles]);
    const summary = useMemo(() => summarizeRecords(records), [records]);
    const timelineItems = useMemo(() => resolveTrajectoryTimelineItems(records), [records]);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchActiveIndex, setSearchActiveIndex] = useState(0);
    const deferredSearchQuery = useDeferredValue(searchQuery);
    const searchIndex = useMemo(() => buildTrajectorySearchIndex(timelineItems, deferredSearchQuery), [deferredSearchQuery, timelineItems]);
    const resolvedSearchActiveIndex = searchIndex.matches.length === 0
        ? -1
        : Math.min(searchActiveIndex, searchIndex.matches.length - 1);
    const activeSearchMatch = resolvedSearchActiveIndex >= 0
        ? (searchIndex.matches[resolvedSearchActiveIndex] ?? null)
        : null;
    const [expansionCommands, setExpansionCommands] = useState(createTrajectoryExpansionCommands);
    const expansionVersionRef = useRef(0);
    const [expansionOverrides, setExpansionOverrides] = useState(() => new Map());
    const scrollContainerRef = useRef(null);
    const willExpandAll = TRAJECTORY_EXPANSION_KINDS.some((kind) => !expansionCommands[kind].expanded);
    const toggleAllLabel = intl.formatMessage({
        id: willExpandAll ? "modelTrajectory.expandAll" : "modelTrajectory.collapseAll",
    });
    const handleToggleAll = useCallback(() => {
        const expanded = TRAJECTORY_EXPANSION_KINDS.some((kind) => !expansionCommands[kind].expanded);
        expansionVersionRef.current += 1;
        const version = expansionVersionRef.current;
        setExpansionOverrides(new Map());
        setExpansionCommands(Object.fromEntries(TRAJECTORY_EXPANSION_KINDS.map((kind) => [kind, { expanded, version }])));
    }, [expansionCommands]);
    const handleToggleExpansionKind = useCallback((kind) => {
        expansionVersionRef.current += 1;
        const version = expansionVersionRef.current;
        setExpansionCommands((previous) => ({
            ...previous,
            [kind]: { expanded: !previous[kind].expanded, version },
        }));
    }, []);
    const handleSearchQueryChange = useCallback((query) => {
        setSearchQuery(query);
        setSearchActiveIndex(0);
    }, []);
    const handleSearchMove = useCallback((direction) => {
        const count = searchIndex.matches.length;
        if (count === 0)
            return;
        setSearchActiveIndex((current) => {
            const resolved = Math.min(current, count - 1);
            return direction === "next" ? (resolved + 1) % count : (resolved - 1 + count) % count;
        });
    }, [searchIndex.matches.length]);
    const handleCloseSearch = useCallback(() => {
        setSearchOpen(false);
        setSearchQuery("");
        setSearchActiveIndex(0);
        clearTrajectorySearchHighlights();
    }, []);
    const setExpansionOverride = useCallback((key, override) => {
        setExpansionOverrides((previous) => {
            const next = new Map(previous);
            next.set(key, override);
            return next;
        });
    }, []);
    const expansionRegistry = useMemo(() => ({ overrides: expansionOverrides, setOverride: setExpansionOverride }), [expansionOverrides, setExpansionOverride]);
    const handleOpenSourceDirectory = useCallback(async () => {
        if (!sourceDirectory) {
            return;
        }
        try {
            const result = await platform.openInFileManager(sourceDirectory);
            if (result.success) {
                return;
            }
            logger.warn("[ModelTrajectoryPane] 打开调用轨迹目录失败", {
                taskId,
                path: sourceDirectory,
                sourceFiles: sourceFiles ?? [],
                error: result.error ?? "unknown-error",
            });
            toast(intl.formatMessage({ id: "appHeader.openInFileManagerFailed" }));
        }
        catch (openError) {
            logger.warn("[ModelTrajectoryPane] 打开调用轨迹目录失败", {
                taskId,
                path: sourceDirectory,
                sourceFiles: sourceFiles ?? [],
                error: openError instanceof Error ? openError.message : String(openError),
            });
            toast(intl.formatMessage({ id: "appHeader.openInFileManagerFailed" }));
        }
    }, [intl, platform, sourceDirectory, sourceFiles, taskId]);
    return (_jsxs("div", { className: "flex h-full min-h-0 flex-col bg-background", children: [_jsxs("header", { className: "flex shrink-0 flex-col px-3 py-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "min-w-0 flex-1", title: taskId, children: _jsx("span", { className: "block truncate text-ui-base font-medium text-foreground", children: title?.trim() || intl.formatMessage({ id: "modelTrajectory.title" }) }) }), records.length > 0 ? (_jsx(Button, { "data-trajectory-search-trigger": "", type: "button", variant: "ghost", size: "icon-sm", className: "shrink-0 text-foreground", onClick: () => setSearchOpen(true), "aria-label": intl.formatMessage({ id: "modelTrajectory.search" }), title: intl.formatMessage({ id: "modelTrajectory.search" }), children: _jsx(SearchIcon, { className: "size-3.5" }) })) : null, records.length > 0 ? (_jsx(ModelTrajectoryExpansionMenu, { commands: expansionCommands, onToggle: handleToggleExpansionKind, intl: intl })) : null, records.length > 0 ? (_jsx(Button, { "data-trajectory-toggle-all": "", type: "button", variant: "ghost", size: "icon-sm", className: "shrink-0 text-foreground", onClick: handleToggleAll, "aria-label": toggleAllLabel, title: toggleAllLabel, children: willExpandAll ? (_jsx(Maximize2Icon, { className: "size-3.5" })) : (_jsx(Minimize2Icon, { className: "size-3.5" })) })) : null, sourceDirectory ? (_jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", onClick: () => void handleOpenSourceDirectory(), "aria-label": intl.formatMessage({ id: "modelTrajectory.openSourceDirectory" }), title: `${intl.formatMessage({ id: "modelTrajectory.openSourceDirectory" })}: ${sourceDirectory}`, children: _jsx(FolderOpenIcon, { className: "size-4" }) })) : null, _jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", onClick: refresh, "aria-label": intl.formatMessage({ id: "modelTrajectory.refresh" }), title: intl.formatMessage({ id: "modelTrajectory.refresh" }), children: _jsx(RefreshCwIcon, { className: cn("size-4", loading && "animate-spin") }) }), onClose ? (_jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", onClick: onClose, "aria-label": intl.formatMessage({ id: "modelTrajectory.close" }), title: intl.formatMessage({ id: "modelTrajectory.close" }), children: _jsx(XIcon, { className: "size-4" }) })) : null] }), records.length > 0 ? (_jsxs("div", { className: "flex min-w-0 flex-wrap items-center gap-x-1.5 text-ui-xs text-foreground-subtle", children: [_jsx("span", { children: intl.formatMessage({ id: "modelTrajectory.summaryCalls" }, { count: String(records.length) }) }), summary.totalTokens > 0 ? (_jsxs("span", { className: "font-mono", title: intl.formatMessage({ id: "modelTrajectory.summaryTokens" }), children: ["\u00B7 ", summary.totalTokens.toLocaleString(), " tok"] })) : null, summary.models.length > 0 ? (_jsxs("span", { className: "min-w-0 truncate font-mono", children: ["\u00B7 ", summary.models.join(", ")] })) : null] })) : null, searchOpen && records.length > 0 ? (_jsx(ModelTrajectorySearchBar, { query: searchQuery, activeIndex: resolvedSearchActiveIndex, matchCount: searchIndex.matches.length, onQueryChange: handleSearchQueryChange, onMove: handleSearchMove, onClose: handleCloseSearch, intl: intl })) : null] }), _jsx("div", { "data-trajectory-header-divider": "", className: "h-px shrink-0 bg-border" }), _jsxs("div", { ref: scrollContainerRef, className: "min-h-0 flex-1 overflow-x-hidden overflow-y-auto", children: [error ? (_jsx(EmptyState, { tone: "error", text: intl.formatMessage({ id: "modelTrajectory.error" }), detail: error })) : loading && records.length === 0 ? (_jsx(EmptyState, { text: intl.formatMessage({ id: "modelTrajectory.loading" }) })) : records.length === 0 ? (_jsx(EmptyState, { text: intl.formatMessage({ id: "modelTrajectory.empty" }) })) : (_jsx(TrajectoryExpansionCommandContext.Provider, { value: expansionCommands, children: _jsx(TrajectoryExpansionRegistryContext.Provider, { value: expansionRegistry, children: _jsx(TrajectorySearchRevealContext.Provider, { value: activeSearchMatch?.expansionKey ?? null, children: _jsx(ModelTrajectoryTimeline, { items: timelineItems, searchQuery: searchIndex.query, searchMatches: searchIndex.matches, activeSearchMatch: activeSearchMatch, intl: intl, scrollContainerRef: scrollContainerRef }) }) }) })), data?.truncated ? (_jsx("p", { className: "px-3 py-2 text-center text-ui-base text-foreground-subtle", children: intl.formatMessage({ id: "modelTrajectory.truncatedNotice" }) })) : null] })] }));
}
export { resolveTrajectoryInputMessages, resolveTrajectoryTimelineItems, } from "./ModelTrajectoryTimeline.js";
export function getModelTrajectorySourceDirectory(sourceFiles) {
    const sourceFile = sourceFiles?.find((path) => path.trim().length > 0);
    return sourceFile ? getContainingDirectoryPath(sourceFile) : null;
}
//# sourceMappingURL=ModelTrajectoryPane.js.map