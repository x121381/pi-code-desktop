import type { ZCodeImportSessionsResult, ZCodeImportableSessionCandidate } from "@zcode/shared";
import type { ClaudeSessionMigrationSupportState } from "@/hooks/useClaudeSessionMigration.js";
export declare function MigrationCandidatesCard({ supportState, candidates, selectedSessionIds, selectedCount, importError, lastImportResult, isImporting, dateTimeFormatter, onToggleSelection, onSelectAll, onClearSelection, onImportSelected, }: {
    supportState: ClaudeSessionMigrationSupportState;
    candidates: ZCodeImportableSessionCandidate[];
    selectedSessionIds: string[];
    selectedCount: number;
    importError: string | null;
    lastImportResult: ZCodeImportSessionsResult | null;
    isImporting: boolean;
    dateTimeFormatter: Intl.DateTimeFormat;
    onToggleSelection: (sessionId: string) => void;
    onSelectAll: () => void;
    onClearSelection: () => void;
    onImportSelected: () => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=MigrationCandidatesCard.d.ts.map