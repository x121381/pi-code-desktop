import type { BotGroupInputProgress, BotGroupInputStatus } from "@zcode/shared";
export declare function createGroupQueueCardSync(deps: {
    read(key: string): Promise<BotGroupInputProgress | undefined>;
    mutate(key: string, update: (current: BotGroupInputProgress) => BotGroupInputProgress): Promise<BotGroupInputProgress | undefined>;
    render(key: string, messageId: string, status: BotGroupInputStatus): Promise<void>;
}): {
    update: (key: string, status: BotGroupInputStatus) => Promise<void>;
    attach: (key: string, cardMessageId: string) => Promise<void>;
};
//# sourceMappingURL=groupQueueCard.d.ts.map