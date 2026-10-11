export interface WorkspaceFileSearchEntry {
    name: string;
    path: string;
    relativePath: string;
    type: "file" | "directory";
}
export interface WorkspaceFileSearchDecision {
    include: boolean;
    traverse: boolean;
}
export interface WorkspaceFileSearchFilterContext {
    /**
     * `.zcodeignore` 规则加载成功时为 true：目录排除的单一真相源是规则文件，
     * 内置目录黑名单退役（用户从文件里删掉 node_modules/ 就应恢复搜索），
     * 仅文件级规则（.env/二进制后缀）与隐藏目录语义继续叠加。
     * fail-open（规则文件完全不可用）时为 false/缺省，黑名单照旧兜底。
     */
    ignoreRulesActive: boolean;
}
/**
 * Workspace 文件索引只依赖这个最终过滤器，不关心规则来自内置列表、配置文件还是设置页面。
 * 后续自定义规则应注入另一份完整实现来替换默认实现，而不是与默认黑名单强制求并集。
 */
export interface WorkspaceFileSearchFilter {
    evaluate(entry: WorkspaceFileSearchEntry, context?: WorkspaceFileSearchFilterContext): WorkspaceFileSearchDecision;
}
export declare const defaultWorkspaceFileSearchFilter: WorkspaceFileSearchFilter;
//# sourceMappingURL=workspaceFileMentionFilter.d.ts.map