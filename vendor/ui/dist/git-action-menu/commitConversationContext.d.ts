import type { GitCommitMessageConversationContext } from "@zcode/shared";
interface GitCommitConversationMessageSource {
    role: "user" | "assistant";
    content?: string | null;
    mailboxMessage?: {
        content?: string | null;
    } | null;
    parts?: readonly {
        type: string;
        content?: string | null;
    }[] | null;
    syntheticTimeline?: unknown;
    uiTimeline?: unknown;
}
export declare function buildGitCommitMessageConversationContext(params: {
    sessionId?: string | null;
    messages: readonly GitCommitConversationMessageSource[];
}): GitCommitMessageConversationContext | null;
export {};
//# sourceMappingURL=commitConversationContext.d.ts.map