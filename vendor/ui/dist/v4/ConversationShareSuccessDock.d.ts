import type { ConversationShareDisplayWarnings } from "@/store/conversationShareSelectionStore.js";
export interface ConversationShareSuccessDockProps {
    title: string;
    warnings?: ConversationShareDisplayWarnings | null;
    onOpen: () => void;
    onCopy: () => void;
    onDismiss: () => void;
}
export declare function ConversationShareSuccessDock({ title, warnings, onOpen, onCopy, onDismiss, }: ConversationShareSuccessDockProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ConversationShareSuccessDock.d.ts.map