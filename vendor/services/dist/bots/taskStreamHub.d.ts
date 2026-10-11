interface Disposable {
    dispose(): void;
}
/** 同一任务只有一个实时源；接收目标自己串行消费，单个渠道失败不阻塞其他渠道。 */
export declare function createBotTaskStreamHub<Event>(): {
    add(taskKey: string, targetKey: string, subscribe: (listener: (event: Event) => Promise<void>) => Disposable, listener: (event: Event) => Promise<void> | void): Disposable;
    dispose(): void;
};
export {};
//# sourceMappingURL=taskStreamHub.d.ts.map