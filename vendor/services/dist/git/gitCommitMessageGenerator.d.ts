import type { GitCommitMessageConversationContext, GitDiffResult, GitFileChange, Locale, ZCodeWorkspaceGenerateTextParams } from "@zcode/shared";
import type { ServiceLogger } from "#src/logger/serviceLogger.js";
export interface GitCommitMessageCurrentModelProvider {
    readCurrentModel(params: {
        workspacePath: string;
        workspaceIdentity?: string;
    }): Promise<ZCodeWorkspaceGenerateTextParams["selection"] | null>;
}
export interface GitCommitMessageTextGenerator {
    generateText(params: {
        workspacePath: string;
        workspaceIdentity?: string;
        selection: ZCodeWorkspaceGenerateTextParams["selection"];
        prompt: string;
        querySource: string;
    }): Promise<{
        text: string;
        selection: ZCodeWorkspaceGenerateTextParams["selection"];
    }>;
}
export interface GitCommitMessageGeneratorOptions {
    currentModelProvider: GitCommitMessageCurrentModelProvider;
    textGenerator: GitCommitMessageTextGenerator;
    logger?: ServiceLogger;
}
export declare class GitCommitMessageGenerationError extends Error {
    readonly reason: "model-unavailable" | "request-failed" | "invalid-output";
    readonly detail?: string | undefined;
    constructor(message: string, reason: "model-unavailable" | "request-failed" | "invalid-output", detail?: string | undefined);
}
export declare class GitCommitMessageGenerator {
    private readonly options;
    constructor(options: GitCommitMessageGeneratorOptions);
    generate(params: {
        workspacePath: string;
        workspaceIdentity?: string;
        branchName: string | null;
        locale?: Locale;
        files: readonly GitFileChange[];
        diffs: readonly GitDiffResult[];
        conversationContext?: GitCommitMessageConversationContext;
    }): Promise<{
        message: string;
        providerId: string;
        model: string;
    }>;
    private resolveCurrentModel;
    private complete;
}
//# sourceMappingURL=gitCommitMessageGenerator.d.ts.map