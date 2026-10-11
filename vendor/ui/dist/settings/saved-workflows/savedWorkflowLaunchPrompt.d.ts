/** 「在对话里修订」：只预填、不自动发送——用户接着写要改什么。 */
export declare function buildSavedWorkflowRevisePrompt(input: {
    name: string;
    path: string;
    locale: string;
    scope?: "project" | "global";
}): string;
/** 空态 / 顶栏「通过对话创建」：预填一个开头。 */
export declare function buildSavedWorkflowCreatePrompt(locale: string, scope?: "project" | "global"): string;
/**
 * 「提升为全局」：把项目档概括成全局档的完整指令（自动发送，不是预填开头）。
 *
 * 只给名字与路径，模型自己读文件。清单是用户裁定的：读 → 找仓库特有引用 → 抽成 args 或中性
 * 表述 → 保持因果结构 → SaveWorkflow(scope: "global"，名字可改) → 总结；天然绑定项目时可以说不。
 * 明说「不要改动原文件」：两份并存、用户自删是既定边界（不变式 9）。
 */
export declare function buildSavedWorkflowPromotePrompt(input: {
    name: string;
    path: string;
    locale: string;
}): string;
//# sourceMappingURL=savedWorkflowLaunchPrompt.d.ts.map