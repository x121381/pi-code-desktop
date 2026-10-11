import type { ToolCallEvalWorkflowSnippetDisplay } from "@zcode/shared/zcode-protocol-v4";
/** handler 的 response 面向模型，含重复耗时/日志；只解包已知格式，未知/截断内容保留。 */
export declare function snippetResponse(display: ToolCallEvalWorkflowSnippetDisplay): string | undefined;
export declare function snippetValue(value: string): {
    code: string;
    language: string;
};
//# sourceMappingURL=workflow-snippet-presentation.d.ts.map