import type { WorkspaceFileEntry } from "@zcode/shared";
/** 单块目标大小（字符数）；调用方按 totalLength 分块拉取。 */
export declare const WORKSPACE_FILE_ENTRIES_CHUNK_SIZE = 4000000;
export declare function packWorkspaceFileEntries(entries: WorkspaceFileEntry[]): string;
/**
 * 解包并拼回完整 entries：name 取 relativePath 最后段，path 由 rootPath 拼出
 * （rootPath 以分隔符结尾与否都兼容；Windows 下用 \、其余用 /）。
 */
export declare function unpackWorkspaceFileEntries(packed: string, rootPath: string): WorkspaceFileEntry[];
//# sourceMappingURL=workspaceFileEntriesCodec.d.ts.map