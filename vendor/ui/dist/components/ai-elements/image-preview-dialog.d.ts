export interface ImagePreviewDialogItem {
    alt: string;
    error?: boolean;
    filename?: string;
    loading?: boolean;
    mediaType?: string;
    src?: string;
}
interface PreviewOffset {
    x: number;
    y: number;
}
interface PreviewSize {
    height: number;
    width: number;
}
export declare function clampImagePreviewOffset(offset: PreviewOffset, scale: number, imageSize: PreviewSize, viewportSize: PreviewSize): PreviewOffset;
export declare function sanitizeImageSourceForLog(source: string): string;
export declare function ImagePreviewDialog({ dialogTestId, imageTestId, initialIndex, items, onActiveIndexChange, onOpenChange, open, }: {
    dialogTestId?: string;
    imageTestId?: string;
    initialIndex: number;
    items: readonly ImagePreviewDialogItem[];
    onActiveIndexChange?: (index: number) => void;
    onOpenChange: (open: boolean) => void;
    open: boolean;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=image-preview-dialog.d.ts.map