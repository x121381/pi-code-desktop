import type { BotTopicPreparation as Preparation, FeishuBotProvider } from "@zcode/shared";
import type { ConversationRow } from "@zcode/shared/zcode-protocol-v4";
export declare function useBotTopicPreparations(): readonly Preparation[];
export declare function BotTopicPreparationList({ items, acceptedRows, provider, }: {
    items: readonly Preparation[];
    acceptedRows?: readonly ConversationRow[];
    provider?: FeishuBotProvider;
}): import("react/jsx-runtime").JSX.Element | null;
export declare function BotTopicPreparation({ items }: {
    items: readonly Preparation[];
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=BotTopicPreparation.d.ts.map