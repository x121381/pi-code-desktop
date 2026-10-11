import type { ZCodePersistedFileChange } from "@zcode/shared";
import type { CodeViewerSource } from "@/lib/codeViewer.js";
import type { CodeViewerWorkspaceScope } from "@/lib/codeViewerWorkspaceScope.js";
export declare function buildChangeSummaryDiffViewerSource({ patch, path, snapshot, relativePath, workspacePath, workspaceIdentity, workspaceRemoteSessionId, }: {
    patch?: string;
    path?: string;
    snapshot: ZCodePersistedFileChange["snapshots"][number] | undefined;
    relativePath: string;
} & CodeViewerWorkspaceScope): CodeViewerSource | undefined;
export declare function buildChangeSummaryFilePreviewSource(input: {
    path: string;
    relativePath: string;
    workspacePath: string;
} & CodeViewerWorkspaceScope): CodeViewerSource;
export declare function openChangeSummaryDiffViewer(source: CodeViewerSource | undefined, onOpenCodeViewer: ((source: CodeViewerSource) => void) | undefined): boolean;
//# sourceMappingURL=messageChangeSummaryPreview.d.ts.map