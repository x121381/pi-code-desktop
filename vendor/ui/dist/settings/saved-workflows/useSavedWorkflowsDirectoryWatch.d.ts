import type { IFileWatcherService } from "@zcode/services";
/**
 * 目录监听：对话里 SaveWorkflow 落盘后中枢自动更新。
 * 目录不存在时 watch 会失败——那是常态（大多数项目没保存过工作流），静默跳过，靠切标签 / 手动
 * 刷新补上。非递归：只看这一层（Linux 上递归 fs.watch 有既知问题）。服务实例变化（远程重连）时
 * effect 依赖变化会拆掉旧 watcher 重建，旧 host 的 id 不会泄漏。
 *
 * 项目组传 `workspacePath`（拼出 `<ws>/.zcode/workflows`）；全局组传 `directory`（协议 list 回的
 * 绝对目录，即 `~/.zcode/workflows`），二者择一——`directory` 优先。
 */
export declare function useSavedWorkflowsDirectoryWatch({ fileWatcherService, workspacePath, directory, enabled, refresh, }: {
    fileWatcherService: IFileWatcherService;
    workspacePath?: string | null | undefined;
    directory?: string | null | undefined;
    enabled: boolean;
    refresh: (options: {
        bypassCache?: boolean;
    }) => Promise<void>;
}): void;
//# sourceMappingURL=useSavedWorkflowsDirectoryWatch.d.ts.map