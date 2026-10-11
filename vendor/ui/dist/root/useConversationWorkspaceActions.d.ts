import type { IServiceAccessor } from "@zcode/services";
import type { TabStoreState } from "@/store/tabStore.js";
export declare function useConversationWorkspaceActions({ services, addTab, setWorkspaceActionError, }: {
    services: IServiceAccessor;
    addTab: TabStoreState["addTab"];
    setWorkspaceActionError: (error: string | null) => void;
}): {
    handleSelectConversationWorkspace: (path: string) => void;
    handleResolveConversationWorkspace: () => Promise<string>;
    handleEnsureConversationWorkspace: () => Promise<string>;
    handleCreateConversationTask: () => Promise<void>;
};
//# sourceMappingURL=useConversationWorkspaceActions.d.ts.map