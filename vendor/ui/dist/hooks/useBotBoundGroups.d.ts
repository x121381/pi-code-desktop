import type { BotConfig, BotState } from "@zcode/shared";
export interface BoundGroupRow {
    chatId: string;
    name: string;
    enabled: boolean;
    topicCount: number;
}
export declare function projectBoundGroups(states: BotState[], botId: string, ownerId?: string): BoundGroupRow[];
export declare function useBotBoundGroups(bot: BotConfig): {
    rows: BoundGroupRow[];
    loading: boolean;
    error: "load" | "save" | null;
    saving: string | null;
    reload: () => Promise<void>;
    toggle: (chatId: string, enabled: boolean) => Promise<void>;
    supported: boolean;
};
//# sourceMappingURL=useBotBoundGroups.d.ts.map