export type OfficeFilePreviewKind = "excel" | "docx" | "doc";
export interface DocxPreviewFit {
    scale: number;
    width: number;
    height: number;
}
export declare function getOfficeFilePreviewKind(path?: string): OfficeFilePreviewKind | null;
export declare function calculateDocxPreviewFit({ availableWidth, naturalHeight, naturalWidth, }: {
    availableWidth: number;
    naturalHeight: number;
    naturalWidth: number;
}): DocxPreviewFit | null;
export declare function decodeBase64ToArrayBuffer(dataBase64: string): ArrayBuffer;
/**
 * 文档内容来自不受信任的 OOXML relationship，不能把 Target 原样交给 DOM。
 * 只允许普通 Web 外链和当前文档内部锚点；其余协议一律降级为不可点击文本。
 */
export declare function sanitizeDocumentHref(value: unknown): string | null;
export declare function sanitizeDocumentLinks(root: ParentNode): void;
/** 为各 Office renderer 安装统一的 DOM 净化和点击阻断；返回卸载函数。 */
export declare function installDocumentLinkSafety(root: HTMLElement, onOpenBrowserUrl?: (url: string) => void): () => void;
//# sourceMappingURL=officeFilePreview.d.ts.map