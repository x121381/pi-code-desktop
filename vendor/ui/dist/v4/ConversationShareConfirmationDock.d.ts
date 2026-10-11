import type { ConversationShareAccessMode } from "@zcode/shared";
import { type ConversationShareDisplayError, type ConversationShareDisplayWarnings, type ConversationShareProgressPhase } from "@/store/conversationShareSelectionStore.js";
export interface ConversationShareConfirmationDockProps {
    selectedCount: number;
    totalCount: number;
    title?: string;
    accessMode?: ConversationShareAccessMode;
    progressLabel?: string;
    progressPhase?: ConversationShareProgressPhase;
    completedArtifacts?: number;
    totalArtifacts?: number;
    onCancel: () => void;
    onBack: () => void;
    onConfirm: () => void;
    onTitleChange?: (title: string) => void;
    onAccessModeChange?: (accessMode: ConversationShareAccessMode) => void;
    disclosureAccepted?: boolean;
    onDisclosureAcceptedChange?: (accepted: boolean) => void;
    pending?: boolean;
    error?: ConversationShareDisplayError | null;
    warnings?: ConversationShareDisplayWarnings | null;
    /** 整轮取消选择，按 productTurnId 定位（turnOrdinal 只用于展示文案）。 */
    onDeselectTurn?: (productTurnId: string) => void;
    onDismissError?: () => void;
    onDismissWarnings?: () => void;
    onCopyRequestId?: () => void;
}
declare function ConversationShareConfirmationDockImpl({ selectedCount, totalCount, title, accessMode, progressLabel, progressPhase, completedArtifacts, totalArtifacts, onCancel, onBack, onConfirm, onTitleChange, onAccessModeChange, disclosureAccepted, onDisclosureAcceptedChange, pending, error, warnings, onDeselectTurn, onDismissError, onDismissWarnings, onCopyRequestId, }: ConversationShareConfirmationDockProps): import("react/jsx-runtime").JSX.Element;
export declare const ConversationShareConfirmationDock: import("react").MemoExoticComponent<typeof ConversationShareConfirmationDockImpl>;
export {};
//# sourceMappingURL=ConversationShareConfirmationDock.d.ts.map