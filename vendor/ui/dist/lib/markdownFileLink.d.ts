interface ParsedMarkdownFileLink {
    path: string;
    lineNumber: number | null;
    columnNumber: number | null;
}
export interface MarkdownFileLinkResolveOptions {
    /** 当前 workspace Host 报告的用户 Home；Renderer 不自行读取本机 Home。 */
    homePath?: string;
}
export declare function normalizeWorkspaceRelativeFilePath(relativePath: string): string | null;
export declare function parseMarkdownFileLinkTarget(href: string): ParsedMarkdownFileLink;
export declare function resolveMarkdownFileLink(workspacePath: string | undefined, href: string, options?: MarkdownFileLinkResolveOptions): ParsedMarkdownFileLink | null;
export {};
//# sourceMappingURL=markdownFileLink.d.ts.map