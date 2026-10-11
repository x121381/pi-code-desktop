import type { BotConfig } from "@zcode/shared";
import { type BoundGroupRow } from "@/hooks/useBotBoundGroups.js";
export declare function BoundGroupsList({ rows, disabled, saving, onToggle, }: {
    rows: BoundGroupRow[];
    disabled: boolean;
    saving: string | null;
    onToggle: (chatId: string, enabled: boolean) => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function BoundGroupsCard({ bot }: {
    bot: BotConfig;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=BoundGroupsCard.d.ts.map