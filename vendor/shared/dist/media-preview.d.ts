/** Assistant/workspace media preview formats shared by renderer and Host. */
export type MediaPreviewKind = "audio" | "video";
export interface MediaPreviewFormat {
    extension: string;
    kind: MediaPreviewKind;
    mediaType: string;
}
export declare const MEDIA_PREVIEW_FORMATS: readonly MediaPreviewFormat[];
export declare function getMediaPreviewFormat(path: string): MediaPreviewFormat | null;
//# sourceMappingURL=media-preview.d.ts.map