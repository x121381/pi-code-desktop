import type { PresentationPreviewDocument } from "@/presentation/types.js";
export interface PresentationPrintHost {
    dispose(): void;
}
export type PrintableFontScript = "latin" | "cjk" | "symbol";
export type PrintableFontAvailability = (family: string, script: PrintableFontScript) => boolean;
/**
 * 返回需要写入打印 DOM 的确定性字体栈；null 表示原首选字体已经可用，无需改动。
 */
export declare function resolvePrintableFontFamily(fontFamily: string, text: string, isFontAvailable: PrintableFontAvailability): string | null;
/**
 * 屏幕预览允许未安装字体走隐式 fallback，但 Chromium/Skia 打印不会稳定保留这层回退，
 * 导致对应文字没有写入 PDF。这里只改一次性打印 DOM，把真实可用字体提升到字体栈首位。
 */
export declare function materializePrintableFontFamilies(hostDocument: Document, host: HTMLElement, isFontAvailable?: PrintableFontAvailability): void;
/**
 * 把演示文稿的全部页面渲染进同页面的隐藏打印容器，供 printToPDF 以 print 媒体输出。
 * 预览是 lazySlides 懒渲染，这里必须全量逐页渲染，导出的 PDF 才包含所有页。
 */
export declare function renderPresentationToPrintHost(doc: PresentationPreviewDocument, hostDocument: Document): Promise<PresentationPrintHost>;
//# sourceMappingURL=presentationPdfPrintExport.d.ts.map