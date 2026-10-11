import { type PptxElementReference } from "@/lib/pptxElementReference.js";
export declare function usePptxElementReferences(options: {
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    listenAddToChatEvents?: boolean;
    scopeId?: string | null;
}): {
    references: readonly PptxElementReference[];
    hasReferences: boolean;
    removeReference: (id: string) => void;
    clearReferences: () => void;
};
//# sourceMappingURL=usePptxElementReferences.d.ts.map