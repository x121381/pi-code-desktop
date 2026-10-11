export interface SubagentMarkdownMigrationResult {
    migrated: string[];
    failures: Array<{
        path: string;
        error: unknown;
    }>;
}
/** 共享原子导入边界：JSON 的旧字段只在这里解释，完成落盘后 reader 只读当前字段。 */
export declare function migrateSubagentStateFile(path: string): Promise<void>;
/** 调用方只传所属环境的用户 agents 根目录；项目/插件不得进入自动写入入口。 */
export declare function migrateUserSubagentMarkdown(userRoot: string): Promise<SubagentMarkdownMigrationResult>;
//# sourceMappingURL=subagentMarkdownMigration.d.ts.map