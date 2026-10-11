import type { JsonLineRecord } from "#src/session/claude-native/jsonLineRecord.js";
import type { ClaudeNativeImportedSessionSource } from "#src/session/claude-native/claudeNativeImportedSessionTypes.js";
export declare function hasClaudeNativeSidechainMarker(entries: readonly JsonLineRecord[]): boolean;
export declare function stripClaudeNativeSyntheticNoResponsePlaceholderText(text: string): string;
export declare function extractClaudeNativeSessionHeadInfo(entries: readonly JsonLineRecord[]): {
    workspacePath?: string;
    previewTitle?: string;
    createdAt?: number;
};
export declare function parseClaudeNativeSessionRecords(params: {
    records: readonly JsonLineRecord[];
    workspacePath: string;
    sessionId: string;
    sourcePath: string;
    fallbackCreatedAt?: number;
    fallbackUpdatedAt?: number;
}): ClaudeNativeImportedSessionSource;
export interface ClaudeNativeVisibleAssistantTurn {
    turnIndex: number;
    content: string;
    terminal: boolean;
    userTimestamp?: number;
    timestamp?: number;
}
export interface ClaudeNativeUnknownCommandWarning {
    command: string;
    args?: string;
    timestamp?: number;
}
export declare function selectClaudeNativeVisibleAssistantTurnAfter(turns: readonly ClaudeNativeVisibleAssistantTurn[], lowerBoundMs: number): ClaudeNativeVisibleAssistantTurn | null;
export declare function parseClaudeNativeVisibleAssistantTurns(records: readonly JsonLineRecord[]): ClaudeNativeVisibleAssistantTurn[];
export declare function readClaudeNativeVisibleAssistantTurnsFile(filePath: string): Promise<ClaudeNativeVisibleAssistantTurn[]>;
export declare function parseClaudeNativeUnknownCommandWarnings(records: readonly JsonLineRecord[]): ClaudeNativeUnknownCommandWarning[];
export declare function selectClaudeNativeUnknownCommandWarningAfter(warnings: readonly ClaudeNativeUnknownCommandWarning[], lowerBoundMs: number): ClaudeNativeUnknownCommandWarning | null;
export declare function readClaudeNativeUnknownCommandWarningsFile(filePath: string): Promise<ClaudeNativeUnknownCommandWarning[]>;
export declare function parseClaudeNativeSessionFile(params: {
    filePath: string;
    workspacePath: string;
    sessionId: string;
    sourcePath?: string;
    fallbackCreatedAt?: number;
    fallbackUpdatedAt?: number;
}): Promise<ClaudeNativeImportedSessionSource>;
//# sourceMappingURL=claudeNativeSessionImportParser.d.ts.map