import type { ClaudeNativeImportedSessionSource } from "#src/session/claude-native/claudeNativeImportedSessionTypes.js";
import type { LegacyTaskSessionFile } from "#src/session/legacyTaskSessionFile.js";
export declare function buildImportedClaudeTaskId(workspacePath: string, sessionId: string): string;
export declare function buildImportedClaudeTaskFile(source: ClaudeNativeImportedSessionSource, filterPaths?: readonly string[], taskIdOverride?: string): LegacyTaskSessionFile;
//# sourceMappingURL=buildImportedClaudeTaskFile.d.ts.map