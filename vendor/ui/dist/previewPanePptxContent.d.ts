import type { PptxPreviewViewerLabels } from "@/components/ui/pptx-preview-viewer.js";
import type { PptxElementReferenceSource } from "@/lib/pptxElementReference.js";
import type { PptxReferencePreviewNavigation } from "@/lib/codeViewer.js";
export declare function PptxPreviewContent({ data, fileName, labels, onOpenBrowserUrl, referenceSource, referenceNavigation, referenceNavigationReady, }: {
    data: ArrayBuffer;
    labels: PptxPreviewViewerLabels;
    fileName?: string;
    referenceSource?: PptxElementReferenceSource;
    referenceNavigation?: PptxReferencePreviewNavigation;
    referenceNavigationReady?: boolean;
    onOpenBrowserUrl?: (url: string) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=previewPanePptxContent.d.ts.map