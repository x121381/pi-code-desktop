import type { PdfViewerLabels } from "@/components/ui/pdf-viewer.js";
import type { PptxPreviewViewerLabels } from "@/components/ui/pptx-preview-viewer.js";
/**
 * 两个重量级叶子查看器（PDF / PPTX）的本地化标签。
 *
 * 抽出来的理由：`PreviewPane` 与 dwf 的 `workflow-artifact` tab 都要喂同一批 `codeViewer.*`
 * 文案给同一对组件。各写一份的结果是其中一处漏译或漏一个键——而这两个 labels 对象都是
 * **必填全字段**的接口，漏一个是类型错误，漏译却只是运行时看到 message id。
 */
export declare function usePdfViewerLabels(): PdfViewerLabels;
export declare function usePptxViewerLabels(): PptxPreviewViewerLabels;
//# sourceMappingURL=usePreviewViewerLabels.d.ts.map