export declare const MarketingRefreshContext: import("react").Context<(() => void) | null>;
/** 仅观察任务完成边沿；活动查询仍由窗口唯一 poller 调度。 */
export declare function useMarketingTaskCompletionRefresh({ workspacePath, workspaceIdentity, endpointKey, rpcReady, }: {
    workspacePath: string;
    workspaceIdentity?: string;
    endpointKey?: string;
    rpcReady: boolean;
}): void;
//# sourceMappingURL=useMarketingTaskCompletionRefresh.d.ts.map