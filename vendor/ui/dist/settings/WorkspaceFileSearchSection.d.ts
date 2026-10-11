interface WorkspaceFileSearchSectionProps {
    workspacePath?: string | null;
    workspaceIdentity?: string;
}
/**
 * 工作区文件搜索忽略规则（.zcodeignore）编辑页。
 * 规则文件是目录排除的单一真相源：编辑保存即生效（下次扫描读取新内容）；
 * 「从 .gitignore 同步」与「恢复默认规则」是分区操作：只重写各自标记区
 * （gitignore 同步区 / 默认排除段），用户自定义规则区不受影响；结果填入编辑框，
 * 仍需保存才落盘。
 */
export declare function WorkspaceFileSearchSection({ workspacePath, workspaceIdentity, }: WorkspaceFileSearchSectionProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=WorkspaceFileSearchSection.d.ts.map