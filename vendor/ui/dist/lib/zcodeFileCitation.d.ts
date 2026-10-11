export type ZCodeFileCitationPreviewKind = "docx" | "xlsx" | "pptx" | "pdf" | "video" | "audio";
export interface ZCodeFileCitation {
    artifactKind?: string;
    end: number;
    path: string;
    purpose?: string;
    raw: string;
    start: number;
}
export interface ZCodeFileCitationDirective {
    artifactKind?: string;
    end: number;
    path?: string;
    purpose?: string;
    raw: string;
    start: number;
}
export interface ZCodeFileCitationProjection {
    visibleText: string;
}
export declare function extractZCodeFileCitationDirectives(content: string): ZCodeFileCitationDirective[];
export declare function extractZCodeFileCitations(content: string): ZCodeFileCitation[];
/**
 * 仅在流式尾部隐藏未闭合 citation。完整 citation 继续交给 remark 插件投影为正文链接，
 * 卡片是否生成仍由终态 row gate 决定。异常模型输出若已换行继续正文，则保留原文，避免
 * 一个缺失 `}` 的指令把后续回答全部吞掉；代码块中的协议样例也不参与隐藏。
 */
export declare function projectZCodeFileCitations(content: string, options: {
    streaming: boolean;
}): ZCodeFileCitationProjection;
export declare function resolveZCodeFileCitationPreviewKind(params: {
    artifactKind?: string;
    path: string;
}): ZCodeFileCitationPreviewKind | null;
//# sourceMappingURL=zcodeFileCitation.d.ts.map