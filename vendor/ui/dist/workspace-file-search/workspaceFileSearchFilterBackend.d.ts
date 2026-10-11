import type { WorkspaceFileEntry } from "@zcode/shared";
import { type FilterWorkspaceFileSearchCandidatesOptions } from "./workspaceFileSearch.js";
/**
 * 工作区文件搜索过滤后端抽象：候选打分+top-K 排序的执行位置。
 *
 * 背景：放开 node_modules 等目录后候选基数
 * 可达数十万，主线程同步打分每键 50-300ms 会阻塞输入——打分已移入 Web Worker。
 * 数据搬运同样不能走结构化克隆：37 万 entries 的 postMessage 克隆实测 ~471ms
 * 主线程同步阻塞（打开 @ 面板整窗冻结数秒的主因之一），因此 worker 传输改用
 * 列式打包字符串（实测 ~31ms），worker 内解码构建候选。
 *
 * 同步实现保留两个用途：(1) Worker 不可用/运行失败的降级路径，行为与历史版本一致；
 * (2) 单测环境（Node 下无 Web Worker）注入。
 */
export interface WorkspaceFileSearchFilterBackend {
    /** 全量候选更新（列式 packed 字符串 + rootPath 用于拼回 name/path）；调用后既有 filter 结果作废。 */
    setPacked(packed: string, rootPath: string): void;
    /**
     * 按 query 过滤并返回有序 entry 列表（已映射回原始对象，≤limit 条）。
     * Promise 永不 reject：过期结果（setEntries 或更新的 filter 之后）解析为 null，
     * 调用方据此丢弃。
     */
    filter(query: string, options: FilterWorkspaceFileSearchCandidatesOptions): Promise<WorkspaceFileEntry[] | null>;
    dispose(): void;
}
export declare function createSyncWorkspaceFileSearchFilterBackend(): WorkspaceFileSearchFilterBackend;
export declare function createWorkerWorkspaceFileSearchFilterBackend(): WorkspaceFileSearchFilterBackend;
//# sourceMappingURL=workspaceFileSearchFilterBackend.d.ts.map