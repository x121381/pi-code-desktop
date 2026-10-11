import type { JsonLineRecord } from "#src/session/claude-native/jsonLineRecord.js";
export declare function readJsonLinesFile(filePath: string): Promise<JsonLineRecord[]>;
export declare function readJsonLinesFileHead(filePath: string, maxLines: number): Promise<JsonLineRecord[]>;
//# sourceMappingURL=sessionHistoryJsonl.d.ts.map