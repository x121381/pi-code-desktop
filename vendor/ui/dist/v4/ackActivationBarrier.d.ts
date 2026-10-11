export interface AckActivationBarrier<T extends {
    topic: string;
    subscriptionId: string;
}> {
    begin(topic: string): object;
    bind(token: object, subscriptionId: string): void;
    cancel(token: object): void;
    activate(subscriptionId: string): {
        topic: string;
        previousSubscriptionId: string | null;
    } | undefined;
    forget(subscriptionId: string): void;
    accept(frame: T): void;
    /** runtime/attachment generation invalidation：丢弃全部 active/pending ownership。 */
    clear(): void;
}
/** transport-local physical-wire barrier；同 topic 并发 pending 各自等 ACK 决定 owner。 */
export declare function createAckActivationBarrier<T extends {
    topic: string;
    subscriptionId: string;
}>(deliver: (frame: T) => void): AckActivationBarrier<T>;
//# sourceMappingURL=ackActivationBarrier.d.ts.map