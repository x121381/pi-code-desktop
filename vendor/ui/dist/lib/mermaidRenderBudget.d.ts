export declare const MERMAID_AUTO_RENDER_MAX_SOURCE_CHARS = 20000;
export declare const MERMAID_AUTO_RENDER_MAX_LINES = 600;
export declare const MERMAID_AUTO_RENDER_MAX_COMPLEXITY_SCORE = 1500;
export type MermaidDocumentVisibilityState = "visible" | "hidden" | "prerender" | "unloaded" | "unknown";
export type MermaidAutoRenderSkipReason = "document-hidden" | "source-too-large" | "line-count-too-large" | "complexity-too-large";
export interface MermaidAutoRenderMetrics {
    sourceChars: number;
    lineCount: number;
    edgeLikeTokenCount: number;
    nodeLikeTokenCount: number;
    complexityScore: number;
}
export type MermaidAutoRenderDecision = {
    shouldRender: true;
    metrics: MermaidAutoRenderMetrics;
} | {
    shouldRender: false;
    reason: MermaidAutoRenderSkipReason;
    metrics: MermaidAutoRenderMetrics;
};
interface MermaidAutoRenderOptions {
    documentVisibilityState?: MermaidDocumentVisibilityState;
    maxSourceChars?: number;
    maxLines?: number;
    maxComplexityScore?: number;
}
export declare function getCurrentMermaidDocumentVisibility(): MermaidDocumentVisibilityState;
export declare function resolveMermaidAutoRenderDecision(source: string, options?: MermaidAutoRenderOptions): MermaidAutoRenderDecision;
export {};
//# sourceMappingURL=mermaidRenderBudget.d.ts.map