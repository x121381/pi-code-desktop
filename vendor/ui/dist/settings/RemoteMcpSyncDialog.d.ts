import type { McpSyncCandidate, McpSyncExportResult, McpSyncRemoteStatus, RemoteTarget } from "@zcode/shared";
import type { IMcpSyncService } from "@zcode/services";
export interface RemoteMcpSyncRow {
    candidate: McpSyncCandidate;
    exists: boolean;
}
interface RemoteMcpSyncDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    localMcpSyncService: IMcpSyncService;
    remoteMcpSyncService: IMcpSyncService;
    remoteTarget: RemoteTarget;
    workspacePath: string;
    localWorkspacePath?: string;
    onSynced: () => Promise<void> | void;
}
export declare function buildRemoteMcpSyncRows(candidates: readonly McpSyncCandidate[], statuses: readonly McpSyncRemoteStatus[]): RemoteMcpSyncRow[];
export declare function resolveDefaultRemoteMcpSyncSelection(rows: readonly RemoteMcpSyncRow[]): Set<string>;
export declare function filterRemoteMcpSyncRows(rows: readonly RemoteMcpSyncRow[], showExistingRemoteMcp: boolean): RemoteMcpSyncRow[];
export declare function buildRemoteMcpSyncImportParams(params: {
    exported: McpSyncExportResult;
    localHomeDir: string;
    localWorkspacePath?: string;
    remoteWorkspacePath: string;
}): Parameters<IMcpSyncService["importMcpServers"]>[0];
export declare function RemoteMcpSyncTitle(): import("react/jsx-runtime").JSX.Element;
export declare function RemoteMcpSyncExistingFilterCheckbox({ checked, onCheckedChange, }: {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function RemoteMcpSyncTargetRow({ targetLabel, showExistingRemoteMcp, showExistingFilter, onShowExistingRemoteMcpChange, }: {
    targetLabel: string;
    showExistingRemoteMcp: boolean;
    showExistingFilter: boolean;
    onShowExistingRemoteMcpChange: (checked: boolean) => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function RemoteMcpSyncBulkSelectionCheckbox({ selectedCount, totalSelectable, onSelectAll, onClearAll, }: {
    selectedCount: number;
    totalSelectable: number;
    onSelectAll: () => void;
    onClearAll: () => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function RemoteMcpSyncSelectionList({ rows, selectedIds, emptyMessageId, onToggle, }: {
    rows: readonly RemoteMcpSyncRow[];
    selectedIds: ReadonlySet<string>;
    emptyMessageId?: string;
    onToggle: (id: string, checked: boolean) => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function RemoteMcpSyncDialog(props: RemoteMcpSyncDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=RemoteMcpSyncDialog.d.ts.map