import type { HTMLAttributes } from "react";
import "react-pdf/dist/Page/TextLayer.css";
export interface PdfViewerRangeSource {
    totalBytes: number;
    initialData?: Uint8Array;
    requestRange: (offset: number, length: number) => Promise<Uint8Array>;
}
export type PdfViewerSource = string | Blob | ArrayBuffer | Uint8Array | PdfViewerRangeSource;
export interface PdfViewerLabels {
    loading: string;
    loadError: string;
    noData: string;
    previousPage: string;
    nextPage: string;
    pageInput: string;
    zoomIn: string;
    zoomOut: string;
}
export interface PdfViewerProps extends HTMLAttributes<HTMLDivElement> {
    source: PdfViewerSource;
    labels?: Partial<PdfViewerLabels>;
    onLoadError?: (error: Error) => void;
}
export declare function PdfViewer({ source, labels, onLoadError, className, ...props }: PdfViewerProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=pdf-viewer.d.ts.map