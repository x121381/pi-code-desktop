import type { Hook } from "@zcode/shared";
import type { IHooksService } from "@zcode/services";
export declare function useWorkspaceHookInlineTrust(input: {
    workspacePath?: string | null;
    workspaceIdentity?: string;
    hooksService?: IHooksService;
    rpcReady?: boolean;
}): {
    activeReviewInteractionId: string | undefined;
    trustActionAvailable: boolean;
    trustingHookId: string | null;
    trustHook: (hook: Hook) => Promise<void>;
};
//# sourceMappingURL=useWorkspaceHookInlineTrust.d.ts.map