export declare function splitMarkdownFrontmatter(content: string): {
    body: string;
    frontmatter?: string;
};
export interface ParsedAgentFrontmatter {
    mcpServers: string[] | null | undefined;
    values: Record<string, unknown>;
}
export declare function parseAgentFrontmatter(frontmatter: string): ParsedAgentFrontmatter;
//# sourceMappingURL=subagent-profile-frontmatter.d.ts.map