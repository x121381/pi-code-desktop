import type { PptxReferencePreviewNavigation } from "@/lib/codeViewer.js";
import { type PptxElementReferenceSource } from "@/lib/pptxElementReference.js";
export interface PptxPreviewViewerLabels {
    loading: string;
    loadError: string;
    noSlides: string;
    previousPage: string;
    nextPage: string;
    pageInput: string;
    zoomIn: string;
    zoomOut: string;
    thumbnails: string;
    thumbnail: (pageNumber: number) => string;
    exportPdf: string;
    exportingPdf: string;
    exportPdfSuccess: (path: string) => string;
    exportPdfFailed: string;
    selectElement: string;
    exitElementSelection: string;
    aiEdit: string;
    commentPlaceholder: string;
    cancelAiEdit: string;
    addToConversation: string;
    referencedPageMissing: (pageNumber: number) => string;
    referencedSourceChanged: (pageNumber: number) => string;
}
export declare function PptxPreviewViewer({ data, labels, onOpenBrowserUrl, className, fileName, referenceSource, referenceNavigation, referenceNavigationReady, }: {
    data: ArrayBuffer;
    labels: PptxPreviewViewerLabels;
    onOpenBrowserUrl?: (url: string) => void;
    className?: string;
    fileName?: string;
    referenceSource?: PptxElementReferenceSource;
    referenceNavigation?: PptxReferencePreviewNavigation;
    referenceNavigationReady?: boolean;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=pptx-preview-viewer.d.ts.map