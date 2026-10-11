import { useEffect, useMemo, useState } from "react";
import { useServices } from "@/hooks/useServices.js";
import { buildFileMentionMarkdown } from "@/mentions/mentionMarkdown.js";
import { WORKSPACE_FILE_SEARCH_DISPLAY_CAP } from "@zcode/shared/workspaceFileSearch";
import { getMentionGroupLimitForQuery } from "@/mentions/mentionSearch.js";
function mapWorkspaceFileToMentionItem(entry) {
    return {
        id: `file:${entry.relativePath}`,
        category: "files",
        label: entry.name,
        description: entry.relativePath,
        value: entry.relativePath,
        // 文件 mention 的标准转译格式需要保持 `[filename](path)`，
        // 之前这里误把整条 relativePath 当成链接文本，导致发送后回显和复制内容都退化成“长路径做标题”。
        // 这里恢复为只用 basename 做 label，路径只放在链接目标里，和输入框 node 样式保持一致。
        markdown: buildFileMentionMarkdown(entry.relativePath, entry.name, entry.type),
        keywords: [entry.relativePath, entry.path],
        data: {
            kind: entry.type,
            path: entry.path,
            relativePath: entry.relativePath,
        },
    };
}
function normalizeRefreshQuery(query) {
    return query.trim().toLowerCase();
}
export function useFileMentionProvider(workspacePath, workspaceIdentity, query, enabled, emptyText, title, defaultPreviewLimit) {
    const { fileService } = useServices();
    const limit = getMentionGroupLimitForQuery(query, defaultPreviewLimit) ?? WORKSPACE_FILE_SEARCH_DISPLAY_CAP;
    // 连接实例也属于作用域：相同路径的远程重连不能接纳旧 Host 的查询结果。
    const scope = useMemo(() => ({
        error: null,
        lastMissQuery: null,
    }), [fileService, workspacePath, workspaceIdentity, enabled]);
    const [result, setResult] = useState(null);
    useEffect(() => {
        // 错误态等待面板/工作区/连接生命周期重置，避免 query 变化触发失败重试循环。
        if (!enabled || scope.error)
            return;
        let active = true;
        setResult({ scope, query, limit, entries: [], loading: true, error: null });
        const params = { rootPath: workspacePath, workspaceIdentity, query, limit };
        const search = async () => {
            try {
                let entries = await fileService.searchWorkspaceFiles(params);
                if (!active)
                    return;
                const normalizedQuery = normalizeRefreshQuery(query);
                if (entries.length === 0 && normalizedQuery && scope.lastMissQuery !== normalizedQuery) {
                    scope.lastMissQuery = normalizedQuery;
                    // 无命中补扫必须绕过 Host TTL，否则外部新文件在缓存有效期内永远不可见。
                    entries = await fileService.searchWorkspaceFiles({ ...params, refresh: true });
                    if (!active)
                        return;
                }
                setResult({ scope, query, limit, entries, loading: false, error: null });
            }
            catch (error) {
                if (!active)
                    return;
                scope.error = error instanceof Error ? error : new Error(String(error));
                setResult({ scope, query, limit, entries: [], loading: false, error: scope.error });
            }
        };
        void search();
        // 查询、工作区、连接或面板生命周期变化都使已发出的异步响应失效。
        return () => {
            active = false;
        };
    }, [enabled, fileService, workspacePath, workspaceIdentity, query, limit, scope]);
    const current = enabled && result?.scope === scope && result.query === query && result.limit === limit;
    const items = useMemo(() => (current ? result.entries.map(mapWorkspaceFileToMentionItem) : []), [current, result]);
    return {
        items,
        loading: enabled && !scope.error && (!current || result.loading),
        error: enabled ? scope.error : null,
        emptyText,
        title,
    };
}
//# sourceMappingURL=fileMentionProvider.js.map