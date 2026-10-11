export declare function WorkflowRetuneRow({ defaultConcurrency, onOpen, requested, runId, }: {
    /** 默认并发 D（那条 run 的投影读数 `run.concurrencyCeiling`）；未知时缺席。 */
    defaultConcurrency?: number;
    /** 打开这条 run 的详情页；宿主没给（只读面、灰度关）时这一行只是记录。 */
    onOpen?: () => void;
    requested: number | null;
    runId: string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=WorkflowRetuneRow.d.ts.map