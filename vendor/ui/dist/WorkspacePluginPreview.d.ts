import { usePluginReferenceCatalog } from "@/hooks/usePluginReferenceCatalog.js";
import type { ComposerMentionPrefill } from "@/store/zcodeSessionStoreTypes.js";
type WorkspacePluginPreviewEntry = ReturnType<typeof usePluginReferenceCatalog>["entries"][number];
export declare function isWorkspacePluginReferenceable(entry: WorkspacePluginPreviewEntry): boolean;
export declare function buildWorkspacePluginMention(entry: WorkspacePluginPreviewEntry): ComposerMentionPrefill;
export declare function WorkspacePluginPreview({ onOpen, onSelectPlugin, workspacePath, workspaceIdentity, remoteSessionId, }: {
    onOpen: () => void;
    onSelectPlugin: (mention: ComposerMentionPrefill) => void;
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=WorkspacePluginPreview.d.ts.map