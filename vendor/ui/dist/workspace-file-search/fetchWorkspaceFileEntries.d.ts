import type { IFileService } from "@zcode/services";
/**
 * 分块拉取 workspace 文件索引的列式 packed 字符串。
 * 单条 RPC 大消息（65MB）在 renderer 接收端的分帧重组是 4.6-6.3s 主线程长任务，
 * 输入会冻结；分块（~4MB/块）+ 块间 setTimeout(0) 让出事件循环后，主线程每次
 * 只处理一小块（~50ms），键入事件始终能插队。整体耗时不变，但 UI 永不冻结。
 */
export declare function fetchWorkspaceFileEntriesPacked(fileService: Pick<IFileService, "listWorkspaceFilesLength" | "listWorkspaceFilesRange">, rootPath: string): Promise<string>;
//# sourceMappingURL=fetchWorkspaceFileEntries.d.ts.map