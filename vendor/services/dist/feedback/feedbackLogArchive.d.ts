export interface FeedbackLogSource {
    directory: string;
    archivePrefix: string;
    exitLogsOnly?: boolean;
    /** 只收集根目录下列出的文件名；用于允许单文件进入归档的配置入口。 */
    includeFileNames?: readonly string[];
    /** 默认只收集本地当天修改的文件；配置文件可关闭该限制。 */
    onlyCurrentDay?: boolean;
    /** 配置文件使用结构化安全投影，避免把插件自定义敏感项上传。 */
    contentPolicy?: "diagnostic" | "cli-config";
}
/** 反馈上传唯一归档入口：白名单来源、有界读取、无法安全解码时禁止原文兜底。 */
export declare function createFeedbackDiagnosticArchive(options: {
    sources: readonly FeedbackLogSource[];
    outputRootDir: string;
    now?: () => Date;
    maxTotalBytes?: number;
    onProgress?: (event: {
        processedBytes: number;
        totalBytes: number;
    }) => void;
}): Promise<{
    path: string;
    size: number;
}>;
//# sourceMappingURL=feedbackLogArchive.d.ts.map