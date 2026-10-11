import type { Ignore } from "ignore";
import type { ServiceLogger } from "../logger/serviceLogger.js";
/**
 * workspace 文件搜索忽略的单一真相源。
 *
 * `.zcodeignore`（workspace root，gitignore 语法）是搜索索引的唯一规则文件：
 * 自动创建暂时停用：文件不存在时仅在内存中使用 root `.gitignore` + 默认排除规则；
 * 之后 `.gitignore` 的变化不再影响搜索，用户通过设置页编辑或「从 .gitignore 重新同步」。
 *
 * 规则解析交给 `ignore` npm 包（gitignore spec 2.22 参考实现，ESLint 同款）：
 * 后声明覆盖、`!` 反选（含父目录排除后子文件无法恢复的 git 原生约束）、anchored/basename、
 * `**` 跨层、目录后缀 `/`、字符类与转义。禁止在本仓库手写 gitignore 解析。
 */
export declare const WORKSPACE_FILE_SEARCH_IGNORE_FILE_NAME = ".zcodeignore";
type WorkspaceFileIgnoreLogger = Pick<ServiceLogger, "info" | "warn">;
export type WorkspaceFileSearchIgnoreRulesSource = "file" | "template" | "created-from-gitignore" | "created-from-template" | "fallback-gitignore" | "fallback-builtin";
export interface WorkspaceFileSearchIgnoreRules {
    matcher: Ignore;
    source: WorkspaceFileSearchIgnoreRulesSource;
}
export interface WorkspaceFileSearchIgnoreContent {
    content: string;
    /** file：.zcodeignore 已存在；template：尚未创建，content 是保存后将落盘的初始内容预览。 */
    source: "file" | "template";
}
/**
 * 分区标记（按行精确匹配，删除标记会让对应按钮退化为整体重建）：
 * 「从 .gitignore 同步」只重写 SYNC 标记之上的内容；
 * 「恢复默认规则」只重写两个标记之间的默认排除段；
 * DEFAULTS 标记之下的自定义规则区，任何按钮都不会改动。
 */
export declare const WORKSPACE_FILE_SEARCH_IGNORE_SYNC_MARKER = "# ===== \u2191 \u4EE5\u4E0A\u540C\u6B65\u81EA .gitignore\uFF08\u300C\u4ECE .gitignore \u540C\u6B65\u300D\u53EA\u91CD\u5199\u4EE5\u4E0A\u90E8\u5206\uFF09=====";
export declare const WORKSPACE_FILE_SEARCH_IGNORE_DEFAULTS_MARKER = "# ----- \u2191 \u4EE5\u4E0A\u4E3A ZCode \u9ED8\u8BA4\u6392\u9664\u89C4\u5219\uFF08\u81EA\u5B9A\u4E49\u89C4\u5219\u8BF7\u5199\u5728\u672C\u884C\u4E0B\u65B9\uFF0C\u4E0D\u4F1A\u88AB\u540C\u6B65/\u6062\u590D\u6539\u52A8\uFF09-----";
/**
 * 构建 `.zcodeignore` 初始内容：.gitignore 规则拷贝 + 双标记分区（默认排除段 / 自定义区）。
 * 附加默认段是行为兼容要求：.gitignore 未声明 node_modules 等目录的仓库若仅严格拷贝，
 * 依赖目录会被整棵放开扫描（再次出现全仓扫描的性能问题）；默认段随文件
 * 交给用户编辑，删除即放开，维持"单一真相源、无代码级并集"的承诺。
 * 默认段写入前先对 gitignore 区做规则去重（见 buildBuiltinDefaultsSection）。
 */
export declare function buildWorkspaceFileSearchIgnoreTemplate(gitignoreContent: string | null): string;
/**
 * 「从 .gitignore 同步」：只重写 SYNC 标记之上的内容为当前 .gitignore，
 * 默认排除段与自定义区原样保留（用户对默认段的删改不受影响）。
 * 标记缺失时退化为整体初始内容重建（无法结构化定位分区）。
 */
export declare function syncWorkspaceFileSearchIgnoreFromGitignore(currentContent: string, gitignoreContent: string | null): string;
/**
 * 「恢复默认规则」：只重置默认排除段为内置清单，gitignore 区与自定义区原样保留。
 * 标记缺失时退化为整体初始内容重建。
 */
export declare function resetWorkspaceFileSearchIgnoreDefaults(currentContent: string, gitignoreContent: string | null): string;
/**
 * 扫描前加载 `.zcodeignore` 规则；自动创建暂时注释停用：
 * 文件不存在 → 内存使用 .gitignore + 默认排除规则，不落盘；
 * 读取失败（权限等）→ 内存使用 .gitignore 内容 → 再失败用内置默认规则。
 * 任何降级只 warn 一次，绝不让 @ 面板因规则文件不可用而扫描失败。
 */
export declare function loadWorkspaceFileSearchIgnoreRules(rootPath: string, logger?: WorkspaceFileIgnoreLogger): Promise<WorkspaceFileSearchIgnoreRules>;
/**
 * 判定相对路径是否被忽略。目录必须传带尾斜杠的路径（gitignore dirOnly 规则只匹配目录），
 * relativePath 由调用方保证为 posix 分隔符（fileService 的 normalizeRelativePath 已转换）。
 */
export declare function isWorkspaceFileSearchPathIgnored(rules: WorkspaceFileSearchIgnoreRules, relativePath: string, type: "file" | "directory"): boolean;
/** 设置页读取：文件不存在时返回初始内容预览（source: template），不落盘。 */
export declare function readWorkspaceFileSearchIgnore(rootPath: string): Promise<WorkspaceFileSearchIgnoreContent>;
export type WorkspaceFileSearchIgnoreTransform = "sync-gitignore" | "reset-defaults";
/**
 * 设置页分区操作（返回新内容填充编辑框，保存才落盘）：
 * sync-gitignore 只重写 gitignore 同步区；reset-defaults 只重置默认排除段；
 * 两者都保留标记之外的用户内容，详见各纯函数的契约。
 */
export declare function transformWorkspaceFileSearchIgnore(rootPath: string, transform: WorkspaceFileSearchIgnoreTransform): Promise<{
    content: string;
}>;
/** 设置页保存：原子写整个文件，下次扫描读取即为新内容。 */
export declare function writeWorkspaceFileSearchIgnore(rootPath: string, content: string): Promise<void>;
export {};
//# sourceMappingURL=workspaceFileIgnore.d.ts.map