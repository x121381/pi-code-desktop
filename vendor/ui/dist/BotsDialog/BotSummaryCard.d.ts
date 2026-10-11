import { type KeyboardEvent } from "react";
import type { BotConfig, BotServiceStatus } from "@zcode/shared";
export declare function BotSummaryCard({ bot, runtime, selectedBotDisplayName, selectedBotName, fallbackBotName, renaming, onStartRename, onCommitNameDraft, onNameDraftChange, onNameCompositionEnd, onNameCompositionStart, onNameInputKeyDown, onPatchBot, }: {
    bot: BotConfig;
    runtime: BotServiceStatus["botRuntime"][number] | undefined;
    selectedBotDisplayName: string;
    selectedBotName: string;
    fallbackBotName: string;
    renaming: boolean;
    onStartRename: () => void;
    onCommitNameDraft: () => void;
    onNameDraftChange: (value: string) => void;
    onNameCompositionEnd?: () => void;
    onNameCompositionStart?: () => void;
    onNameInputKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
    onPatchBot: (patch: Partial<BotConfig>) => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function BotReplyGranularityCard({ bot, onPatchBot, }: {
    bot: BotConfig;
    onPatchBot: (patch: Partial<BotConfig>) => void;
}): import("react/jsx-runtime").JSX.Element;
export declare function BotDangerCard({ onDelete }: {
    onDelete: () => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=BotSummaryCard.d.ts.map