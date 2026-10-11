import { type MediaPreviewKind } from "@zcode/shared";
import type { IFileService } from "../file/file.js";
export type MediaPreviewPreparation = {
    kind: "local-url";
    mediaType: string;
    path: string;
    size: number;
    url: string;
} | {
    kind: "host-range-url";
    mediaType: string;
    path: string;
    previewId: string;
    size: number;
    url: string;
    urlExpiresAt: number;
} | {
    kind: "inline";
    dataBase64: string;
    mediaType: string;
    path: string;
    size: number;
};
export interface IMediaPreviewService {
    prepare(params: {
        path: string;
        expectedKind: MediaPreviewKind;
    }): Promise<MediaPreviewPreparation>;
    refreshPlaybackUrl?(params: {
        previewId: string;
    }): Promise<{
        url: string;
        expiresAt: number;
    }>;
    release?(params: {
        previewId: string;
    }): Promise<void>;
}
export declare const IMediaPreviewService: import("../descriptors.js").ServiceDescriptor<IMediaPreviewService>;
export declare function createMediaPreviewService(options: {
    fileService: IFileService;
    authorizeLocalMediaPreviewPath?: (path: string) => Promise<string>;
    createLocalMediaPreviewUrl?: (path: string) => string;
    inlineMaxBytes?: number;
}): IMediaPreviewService;
//# sourceMappingURL=mediaPreview.d.ts.map