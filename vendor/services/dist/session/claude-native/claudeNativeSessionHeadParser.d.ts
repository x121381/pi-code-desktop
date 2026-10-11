import { type JsonLineRecord } from "#src/session/claude-native/jsonLineRecord.js";
export declare function hasClaudeNativeSidechainMarker(entries: readonly JsonLineRecord[]): boolean;
export declare function extractClaudeNativeSessionHeadInfo(entries: readonly JsonLineRecord[]): {
    workspacePath?: string;
    previewTitle?: string;
    createdAt?: number;
};
//# sourceMappingURL=claudeNativeSessionHeadParser.d.ts.map