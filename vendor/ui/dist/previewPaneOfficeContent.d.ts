import type { FileBinaryPreview } from "@zcode/shared";
import { type OfficeFilePreviewKind } from "@/lib/officeFilePreview.js";
export declare function PreviewPaneOfficeContent({ error, kind, loading, onOpenBrowserUrl, preview, resolvedTheme, sourcePath, }: {
    error: string | null;
    kind: OfficeFilePreviewKind;
    loading: boolean;
    onOpenBrowserUrl?: (url: string) => void;
    preview: FileBinaryPreview | null;
    resolvedTheme: "light" | "dark";
    sourcePath: string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=previewPaneOfficeContent.d.ts.map