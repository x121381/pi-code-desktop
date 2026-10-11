interface ImagePreviewContentProps {
    title: string;
    imageSource: string;
    fitToContainer?: boolean;
    sourcePath?: string;
}
export declare function getImagePreviewPixelRatio(sourceName: string): number;
export declare function ImagePreviewContent({ title, fitToContainer, imageSource, sourcePath, }: ImagePreviewContentProps): import("react/jsx-runtime").JSX.Element;
export declare function SvgPreviewContent({ title, svgContent, }: {
    title: string;
    svgContent: string;
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=previewPaneImageContent.d.ts.map