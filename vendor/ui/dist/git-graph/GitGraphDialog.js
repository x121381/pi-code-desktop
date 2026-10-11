import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../components/ui/button.js";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, } from "../components/ui/dialog.js";
import { toast } from "../components/ui/toast.js";
import { GitGraphPane } from "../git-graph/GitGraphPane.js";
import { useServices } from "../hooks/useServices.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { getErrorMessage } from "../lib/errorMessage.js";
import { logger } from "../logger.js";
import { AlertCircleIcon, LoaderIcon, XIcon } from "lucide-react";
const GIT_GRAPH_PAGE_SIZE = 50;
export function GitGraphDialog({ open, workspacePath, onOpenChange }) {
    const { gitService } = useServices();
    const { intl } = useZCodeIntl();
    const [loading, setLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [commits, setCommits] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [selectedCommitHash, setSelectedCommitHash] = useState(null);
    const loadingMoreRef = useRef(false);
    const resetGraphState = useCallback(() => {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
        loadingMoreRef.current = false;
        setErrorMessage(null);
    }, []);
    const loadInitialCommits = useCallback(async () => {
        setLoading(true);
        setLoadingMore(false);
        setRefreshing(false);
        loadingMoreRef.current = false;
        setErrorMessage(null);
        setCommits([]);
        setHasMore(false);
        setSelectedCommitHash(null);
        try {
            const result = await gitService.getCommitGraph({
                workspacePath,
                maxCount: GIT_GRAPH_PAGE_SIZE,
                skip: 0,
            });
            setCommits(result.commits);
            setHasMore(result.hasMore);
            setSelectedCommitHash(result.commits[0]?.hash ?? null);
        }
        catch (error) {
            const message = getErrorMessage(error);
            logger.warn("[GitGraphDialog] 读取 Git Graph 失败", {
                workspacePath,
                error: message,
            });
            setErrorMessage(intl.formatMessage({ id: "gitGraph.error.requestFailed" }, { error: message }));
        }
        finally {
            setLoading(false);
        }
    }, [gitService, intl, workspacePath]);
    useEffect(() => {
        if (!open) {
            return;
        }
        void loadInitialCommits();
    }, [loadInitialCommits, open]);
    const refreshCommits = useCallback(async () => {
        if (loading || loadingMore || refreshing) {
            return;
        }
        setRefreshing(true);
        setErrorMessage(null);
        try {
            const result = await gitService.getCommitGraph({
                workspacePath,
                maxCount: GIT_GRAPH_PAGE_SIZE,
                skip: 0,
            });
            setCommits(result.commits);
            setHasMore(result.hasMore);
            setSelectedCommitHash(result.commits[0]?.hash ?? null);
        }
        catch (error) {
            const message = getErrorMessage(error);
            logger.warn("[GitGraphDialog] 刷新 Git Graph 失败", {
                workspacePath,
                error: message,
            });
            toast(intl.formatMessage({ id: "gitGraph.refreshFailed" }, { error: message }));
        }
        finally {
            setRefreshing(false);
        }
    }, [gitService, intl, loading, loadingMore, refreshing, workspacePath]);
    const loadMoreCommits = useCallback(async () => {
        if (loading || loadingMore || refreshing || loadingMoreRef.current || !hasMore) {
            return;
        }
        loadingMoreRef.current = true;
        setLoadingMore(true);
        setErrorMessage(null);
        try {
            const result = await gitService.getCommitGraph({
                workspacePath,
                maxCount: GIT_GRAPH_PAGE_SIZE,
                skip: commits.length,
            });
            setCommits((currentCommits) => [...currentCommits, ...result.commits]);
            setHasMore(result.hasMore);
        }
        catch (error) {
            const message = getErrorMessage(error);
            logger.warn("[GitGraphDialog] 读取更多 Git Graph 失败", {
                workspacePath,
                loadedCommitCount: commits.length,
                error: message,
            });
            setErrorMessage(intl.formatMessage({ id: "gitGraph.error.requestFailed" }, { error: message }));
        }
        finally {
            loadingMoreRef.current = false;
            setLoadingMore(false);
        }
    }, [commits.length, gitService, hasMore, intl, loading, loadingMore, refreshing, workspacePath]);
    return (_jsx(Dialog, { open: open, onOpenChange: (nextOpen) => {
            if (!nextOpen) {
                resetGraphState();
            }
            onOpenChange(nextOpen);
        }, children: _jsxs(DialogContent, { showCloseButton: false, className: "h-[min(78vh,720px)] max-w-5xl gap-0 overflow-hidden rounded-2xl p-0", children: [_jsxs(DialogHeader, { className: "sr-only", children: [_jsx(DialogTitle, { children: intl.formatMessage({ id: "gitGraph.title" }) }), _jsx(DialogDescription, { children: intl.formatMessage({ id: "gitGraph.dialogDescription" }) })] }), _jsx(DialogClose, { asChild: true, children: _jsx(Button, { type: "button", variant: "ghost", size: "icon-sm", "aria-label": intl.formatMessage({ id: "common.close" }), className: "absolute right-2 top-2 z-30 bg-background/80 text-foreground-subtle hover:bg-hover hover:text-foreground [app-region:no-drag]", children: _jsx(XIcon, { className: "size-3.5" }) }) }), loading ? (_jsx("div", { className: "flex h-full items-center justify-center bg-background text-foreground-subtle", children: _jsx(LoaderIcon, { className: "size-5 animate-spin" }) })) : errorMessage ? (_jsx("div", { className: "flex h-full items-center justify-center bg-background p-6", children: _jsx("div", { className: "max-w-md rounded-xl border border-border bg-card p-4 text-ui-base text-foreground", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(AlertCircleIcon, { className: "mt-0.5 size-4 shrink-0 text-warning" }), _jsx("p", { className: "break-words text-foreground-subtle", children: errorMessage })] }) }) })) : (_jsx(GitGraphPane, { commits: commits, hasMore: hasMore, loadingMore: loadingMore, refreshing: refreshing, selectedCommitHash: selectedCommitHash, onSelectCommit: setSelectedCommitHash, onLoadMore: loadMoreCommits, onRefresh: refreshCommits }))] }) }));
}
//# sourceMappingURL=GitGraphDialog.js.map