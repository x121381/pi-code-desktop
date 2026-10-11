import type { ZCodeImportSessionsResult, ZCodeImportableSessionCandidate } from "@zcode/shared";
export type ClaudeMigrationRange = "all" | "7d" | "30d" | "90d";
type ClaudeMigrationWorkspaceFilterMode = "all" | "current";
export declare const UNLIMITED_SCAN_LIMIT_INPUT = "unlimited";
export declare function resolveClaudeMigrationScanLimit(limitInput: string): number | undefined;
export interface ClaudeSessionMigrationSupportState {
    supported: boolean;
    reason?: "desktopOnly";
}
export declare function useClaudeSessionMigration(params: {
    workspacePath: string | null;
    workspaceIdentity?: string;
    isDesktop?: boolean;
}): {
    supportState: ClaudeSessionMigrationSupportState;
    workspaceFilterMode: ClaudeMigrationWorkspaceFilterMode;
    setWorkspaceFilterMode: (mode: ClaudeMigrationWorkspaceFilterMode) => void;
    hasCurrentWorkspaceFilter: boolean;
    range: ClaudeMigrationRange;
    setRange: import("react").Dispatch<import("react").SetStateAction<ClaudeMigrationRange>>;
    limitInput: string;
    setLimitInput: import("react").Dispatch<import("react").SetStateAction<string>>;
    scanLimit: number | undefined;
    candidates: ZCodeImportableSessionCandidate[];
    selectedSessionIds: string[];
    selectedCount: number;
    scanError: string | null;
    importError: string | null;
    lastImportResult: ZCodeImportSessionsResult | null;
    isScanning: boolean;
    isImporting: boolean;
    scan: () => Promise<void>;
    importSessions: (sessionIds: string[]) => Promise<ZCodeImportSessionsResult | null>;
    importSelectedSessions: () => Promise<ZCodeImportSessionsResult | null>;
    toggleSessionSelection: (sessionId: string) => void;
    selectAllSessions: () => void;
    clearSelectedSessions: () => void;
};
export {};
//# sourceMappingURL=useClaudeSessionMigration.d.ts.map