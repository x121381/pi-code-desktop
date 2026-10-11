export type SubagentFileChanges = Map<string, "read" | "remove">;
export interface SubagentConfigLoadContext {
    signal: AbortSignal;
    waitForStableFile(path: string): Promise<boolean>;
}
/** 一个配置范围串行吸收文件变化，RPC 只消费上层已完成的 snapshot。 */
export declare function createSubagentConfigScope<T>(options: {
    root: string;
    file?: string;
    load(previous: T | undefined, changes: SubagentFileChanges | undefined, context: SubagentConfigLoadContext): Promise<T>;
    onSettled(): void;
}): {
    ready: Promise<void>;
    settle(): Promise<void>;
    readonly value: T | undefined;
    readonly failed: boolean;
    readonly busy: boolean;
    dispose(): void;
};
//# sourceMappingURL=subagentConfigScope.d.ts.map