import { type AssistantFilePathResolveOptions } from "@/lib/assistantFileReferences.js";
export type AssistantCodeCommentPriority = 0 | 1 | 2 | 3;
export interface AssistantCodeComment {
    body: string;
    endLine?: number;
    file: string;
    priority?: AssistantCodeCommentPriority;
    sourceEnd: number;
    sourceStart: number;
    startLine?: number;
    title: string;
}
export interface AssistantCodeCommentCard extends AssistantCodeComment {
    displayPath: string;
    id: string;
    path: string;
}
export interface AssistantCodeCommentProjection {
    comments: AssistantCodeComment[];
    visibleText: string;
}
export declare function extractAssistantCodeComments(content: string): AssistantCodeComment[];
export declare function projectAssistantCodeComments(content: string, options: {
    streaming: boolean;
}): AssistantCodeCommentProjection;
export declare function buildAssistantCodeCommentCards(content: string, workspacePath: string, limit?: number, options?: AssistantFilePathResolveOptions): AssistantCodeCommentCard[];
//# sourceMappingURL=assistantCodeComment.d.ts.map