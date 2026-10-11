import type { BotGroupDelivery } from "@zcode/shared";
interface GroupDeliveryDependencies {
    read(id: string): Promise<BotGroupDelivery | undefined>;
    write(result: BotGroupDelivery): Promise<void>;
    authorized(result: BotGroupDelivery): Promise<boolean>;
    send(result: BotGroupDelivery): Promise<void | {
        providerMessageId: string;
    }>;
    onSettled?(): Promise<void>;
    delay?(milliseconds: number): Promise<void>;
}
/** 只保存和发送已生成结果；不持有任务执行或输入队列。 */
export declare function createGroupResultDelivery(deps: GroupDeliveryDependencies): ((result: BotGroupDelivery, retry?: boolean) => Promise<void>) & {
    isInFlight: (id: string) => boolean;
    project: (result: BotGroupDelivery) => BotGroupDelivery;
};
export {};
//# sourceMappingURL=groupResultDelivery.d.ts.map