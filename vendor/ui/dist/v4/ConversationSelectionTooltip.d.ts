import { type RefObject } from "react";
import type { ConversationRow } from "@zcode/shared/zcode-protocol-v4";
import { type ConversationSelectionReference } from "@/lib/conversationSelectionReference.js";
export declare function ConversationSelectionTooltip({ rootRef, rows, sourceSessionId, enabled, sideActionDisabled, onAddToCurrentTask, onAskInSideChat, }: {
    rootRef: RefObject<HTMLDivElement | null>;
    rows: readonly ConversationRow[];
    sourceSessionId: string;
    enabled: boolean;
    sideActionDisabled?: boolean;
    onAddToCurrentTask: (reference: ConversationSelectionReference) => void;
    onAskInSideChat: (reference: ConversationSelectionReference) => void;
}): import("react/jsx-runtime").JSX.Element | null;
//# sourceMappingURL=ConversationSelectionTooltip.d.ts.map