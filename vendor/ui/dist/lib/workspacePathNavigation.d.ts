import type { MessageFileLinkTarget } from "@/components/ai-elements/message.js";
export interface WorkspacePathOpenRequest extends MessageFileLinkTarget {
    serviceScope?: "workspace" | "base-local";
}
export declare function selectWorkspacePathFileService<T>(target: WorkspacePathOpenRequest, workspaceFileService: T, baseFileService: T): T;
export declare function shouldFallbackWorkspacePathToCodeViewer(target: WorkspacePathOpenRequest): boolean;
export declare function requestWorkspacePathOpen(target: WorkspacePathOpenRequest): void;
export declare function addWorkspacePathOpenRequestListener(listener: (target: WorkspacePathOpenRequest) => void): () => void;
//# sourceMappingURL=workspacePathNavigation.d.ts.map