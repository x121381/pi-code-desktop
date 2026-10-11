import { type ReactElement } from "react";
export declare const INLINE_FALLBACK_FILE_ICON_SRC: string;
export interface FileDisplayDescriptor {
    fileIcon: string;
    fileIconSrc: string;
    fileName: string;
    filePath: string | null;
    normalizedPath: string;
}
export interface FileDisplayOptions {
    basePath?: string;
    kind?: "file" | "directory";
    showIcon?: boolean;
    showFilePath?: boolean;
    iconSize?: number;
    className?: string;
    fileNameClassName?: string;
    filePathClassName?: string;
}
export declare function setDefaultFileDisplayBasePath(basePath: string | null): void;
export declare function buildMaterialFileIconSrc(iconName: string): string;
export declare const FOLDER_FILE_ICON_SRC: string;
export declare const DOCUMENT_FILE_ICON_SRC: string;
export declare function resolveFileDisplayDescriptor(filePath: string, options?: Pick<FileDisplayOptions, "basePath" | "kind">): FileDisplayDescriptor;
export declare function createFileDisplayDom(filePath: string, options?: FileDisplayOptions): HTMLSpanElement;
export declare function FileDisplayInline({ path, options, }: {
    path: string;
    options?: FileDisplayOptions;
}): ReactElement;
export declare function FileDisplayIcon({ src, size, className, }: {
    src: string;
    size?: number;
    className?: string;
}): ReactElement;
export declare function getFileDisplayPath(filePath: string, basePath?: string): string;
//# sourceMappingURL=fileDisplay.d.ts.map