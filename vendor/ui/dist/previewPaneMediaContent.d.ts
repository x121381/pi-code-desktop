import type { MediaCodeViewerSource } from "@/lib/codeViewer.js";
import type { SyntheticEvent } from "react";
interface PreviewPaneMediaContentProps {
    source: MediaCodeViewerSource;
    loading: boolean;
    url: string | null;
    error: string | null;
    labels: {
        loading: string;
        unavailable: string;
        unsupported: string;
    };
    onMediaError?: (event: SyntheticEvent<HTMLMediaElement>) => void;
    onMediaLoadedMetadata?: (event: SyntheticEvent<HTMLMediaElement>) => void;
}
export declare function PreviewPaneMediaContent({ source, loading, url, error, labels, onMediaError, onMediaLoadedMetadata, }: PreviewPaneMediaContentProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=previewPaneMediaContent.d.ts.map