import type { V4ConversationFileRewindPreviewResult } from "@zcode/shared/zcode-protocol-v4";
interface ConversationFileRewindDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    preview: V4ConversationFileRewindPreviewResult | null;
    previewLoading: boolean;
    applying: boolean;
    error: string | null;
    onApply: () => void;
    variant?: "fileRewind" | "editConflict";
    onConversationOnly?: () => void;
}
export declare function ConversationFileRewindDialog({ open, onOpenChange, preview, previewLoading, applying, error, onApply, variant, onConversationOnly, }: ConversationFileRewindDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ConversationFileRewindDialog.d.ts.map