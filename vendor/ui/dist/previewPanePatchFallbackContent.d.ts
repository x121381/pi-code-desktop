import type { CodePreviewSettings } from "@/store/index.js";
interface PatchFallbackContentProps {
    patch: string;
    codePreviewSettings: CodePreviewSettings;
    resolvedTheme: "light" | "dark";
    sourcePath?: string;
    sourceTitle?: string;
}
export declare function PatchFallbackContent({ patch, codePreviewSettings, resolvedTheme, sourcePath, sourceTitle, }: PatchFallbackContentProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=previewPanePatchFallbackContent.d.ts.map