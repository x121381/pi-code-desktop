import type { PdfViewerSource } from "@/components/ui/pdf-viewer.js";
export interface ChatMediaAttachmentPreviewTarget {
    filename: string;
    mediaType: string;
    url?: string;
    pdfSource?: PdfViewerSource;
    textContent?: string;
}
export declare function ChatMediaAttachmentPreviewDialog({ attachment, open, onOpenChange, loading, error, }: {
    attachment: ChatMediaAttachmentPreviewTarget | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    loading?: boolean;
    error?: boolean;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ChatMediaAttachmentPreviewDialog.d.ts.map