import type { PluginSyncCandidate, PluginSyncImportResult, PluginSyncRemoteStatus, RemoteTarget, ZCodePluginOptionValue, ZCodePluginInfo, ZCodePluginUserConfigOption, ZCodePluginsOverviewResult } from "@zcode/shared";
import type { IPluginSyncService, IZCodeAgentService } from "@zcode/services";
export type RemotePluginSyncDialogStep = "loading" | "selection" | "preflighting" | "syncing" | "complete";
type RemotePluginSyncKind = "inline" | "marketplace";
interface RemotePluginSyncPluginOptions {
    configuredOptions: Record<string, ZCodePluginOptionValue>;
    userConfig: Record<string, ZCodePluginUserConfigOption>;
}
type RemotePluginSyncAgentService = Pick<IZCodeAgentService, "addPluginMarketplace" | "cancelPluginOperation" | "configurePlugin" | "getPluginsOverview" | "installPlugin" | "listPlugins" | "setPluginEnabled">;
export interface RemotePluginSyncCandidate {
    id: string;
    kind: RemotePluginSyncKind;
    name: string;
    pluginId: string;
    marketplace: string;
    description?: string;
    version?: string;
    path?: string;
    enabled: boolean;
    componentTypes: string[];
    inlineCandidate?: PluginSyncCandidate;
    pluginOptions?: RemotePluginSyncPluginOptions;
    marketplacePlugin?: {
        marketplaceSourceArchive?: {
            marketplaceId: string;
            source: Record<string, unknown>;
        };
        marketplaceSourceInput?: string;
        pluginName: string;
    };
}
interface RemotePluginSyncCandidateStatus {
    candidateId: string;
    exists: boolean;
    path?: string;
    reason?: "samePluginId" | "targetExists";
    remoteMarketplaceExists?: boolean;
}
export interface RemotePluginSyncRow {
    candidate: RemotePluginSyncCandidate;
    exists: boolean;
    path?: string;
    reason?: "samePluginId" | "targetExists";
    remoteMarketplaceExists?: boolean;
}
type RemotePluginSyncResultStatus = PluginSyncImportResult["results"][number]["status"] | "stopped";
interface RemotePluginSyncResultItem extends Omit<PluginSyncImportResult["results"][number], "status"> {
    status: RemotePluginSyncResultStatus;
}
export interface RemotePluginSyncRunResult {
    results: RemotePluginSyncResultItem[];
}
export declare function shouldFinishRemotePluginSyncRun(currentRun: AbortController | null, run: AbortController): boolean;
type RemotePluginSyncProgressStatus = "queued" | "syncing" | RemotePluginSyncResultStatus;
export interface RemotePluginSyncProgressEvent {
    candidateId: string;
    log: string;
    pluginId: string;
    result?: RemotePluginSyncResultItem;
    status: RemotePluginSyncProgressStatus;
}
interface RemotePluginSyncStopControl {
    cancelOperation?: (operationId: string) => Promise<void>;
    isStopped: (candidateId: string) => boolean;
    waitForStop?: (candidateId: string) => Promise<void>;
}
interface RemotePluginSyncDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    localPluginSyncService: IPluginSyncService;
    remotePluginSyncService: IPluginSyncService;
    localZCodeAgentService?: RemotePluginSyncAgentService | null;
    remoteZCodeAgentService?: RemotePluginSyncAgentService | null;
    remoteTarget: RemoteTarget;
    localWorkspacePath?: string;
    workspacePath: string;
    workspaceIdentity?: string;
    onSynced: () => Promise<void> | void;
}
export declare function buildRemotePluginSyncRows(candidates: readonly PluginSyncCandidate[], statuses: readonly PluginSyncRemoteStatus[]): RemotePluginSyncRow[];
export declare function buildRemotePluginSyncRowsForCandidates(candidates: readonly RemotePluginSyncCandidate[], statuses: readonly RemotePluginSyncCandidateStatus[]): RemotePluginSyncRow[];
export declare function resolveDefaultRemotePluginSyncSelection(rows: readonly RemotePluginSyncRow[]): Set<string>;
export declare function filterRemotePluginSyncRows(rows: readonly RemotePluginSyncRow[], showExistingRemotePlugins: boolean): RemotePluginSyncRow[];
export declare function shouldAllowRemotePluginSyncDialogOpenChange(step: RemotePluginSyncDialogStep, nextOpen: boolean): boolean;
export declare function buildMarketplaceRemotePluginSyncCandidates(overview: ZCodePluginsOverviewResult, plugins: readonly ZCodePluginInfo[]): RemotePluginSyncCandidate[];
export declare function buildMarketplaceRemotePluginStatuses(candidates: readonly RemotePluginSyncCandidate[], remoteOverview: ZCodePluginsOverviewResult): RemotePluginSyncCandidateStatus[];
export declare function syncSelectedRemotePlugins(params: {
    localPluginSyncService: IPluginSyncService;
    onItemProgress?: (event: RemotePluginSyncProgressEvent) => void;
    remotePluginSyncService: IPluginSyncService;
    remoteWorkspaceIdentity?: string;
    remoteWorkspacePath: string;
    remoteZCodeAgentService?: RemotePluginSyncAgentService | null;
    rows: readonly RemotePluginSyncRow[];
    signal?: AbortSignal;
    stopControl?: RemotePluginSyncStopControl;
}): Promise<RemotePluginSyncRunResult>;
export declare function RemotePluginSyncDialog(props: RemotePluginSyncDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=RemotePluginSyncDialog.d.ts.map