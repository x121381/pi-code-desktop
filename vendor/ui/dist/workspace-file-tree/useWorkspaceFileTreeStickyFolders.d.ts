import type { VirtualItem } from "@tanstack/react-virtual";
import type { WorkspaceFileTreeRow } from "@/workspace-file-tree/model.js";
import type { WorkspaceFileTreeStickyFolderItem } from "@/workspace-file-tree/types.js";
export declare function getWorkspaceFileTreeStickyFolders({ rows, virtualItems, scrollOffset, enabled, }: {
    rows: WorkspaceFileTreeRow[];
    virtualItems: VirtualItem[];
    scrollDirection: "forward" | "backward" | null;
    scrollOffset: number;
    enabled?: boolean;
}): WorkspaceFileTreeStickyFolderItem[];
export declare function useWorkspaceFileTreeStickyFolders({ rows, virtualItems, scrollDirection, scrollOffset, enabled, }: {
    rows: WorkspaceFileTreeRow[];
    virtualItems: VirtualItem[];
    scrollDirection: "forward" | "backward" | null;
    scrollOffset: number;
    enabled: boolean;
}): WorkspaceFileTreeStickyFolderItem[];
//# sourceMappingURL=useWorkspaceFileTreeStickyFolders.d.ts.map