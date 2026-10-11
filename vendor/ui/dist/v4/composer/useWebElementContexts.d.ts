import { type WebElementContextComposerAttachment } from "@/lib/webElementContext.js";
export interface UseWebElementContextsOptions {
    workspacePath: string;
    workspaceIdentity?: string;
    listenAddToChatEvents?: boolean;
    scopeId?: string | null;
}
export interface UseWebElementContextsResult {
    contexts: readonly WebElementContextComposerAttachment[];
    hasContexts: boolean;
    removeContext: (id: string) => void;
    clearContexts: () => void;
}
export declare function useWebElementContexts({ workspacePath, workspaceIdentity, listenAddToChatEvents, scopeId, }: UseWebElementContextsOptions): UseWebElementContextsResult;
//# sourceMappingURL=useWebElementContexts.d.ts.map