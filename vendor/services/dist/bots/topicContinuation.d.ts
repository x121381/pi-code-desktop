interface TopicContinuationPorts<T> {
    readRunningRun(): Promise<string | undefined>;
    /** 必须等到指定 run 的权威终态；停止 RPC 返回不等于运行已经结束。 */
    stopAndWait(runId: string): Promise<void>;
    /** 只提交到既有 CLI admission，不能在这里另建 accepted queue。 */
    submit(messages: T[]): Promise<void>;
    failed(messageIds: string[], error: unknown): void | Promise<void>;
}
/** 仅协调未提交的材料；run 的权威状态仍由调用方从 CLI 获取。 */
export declare function createTopicContinuation<T>(ports: TopicContinuationPorts<T>): {
    receive(id: string, prepare: () => Promise<T>): boolean;
    cancel(): void;
    settled(): Promise<void>;
};
export {};
//# sourceMappingURL=topicContinuation.d.ts.map