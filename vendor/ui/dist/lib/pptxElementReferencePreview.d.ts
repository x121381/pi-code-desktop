import type { PptxCodeViewerSource } from "@/lib/codeViewer.js";
import { type PptxElementReference } from "@/lib/pptxElementReference.js";
export interface PptxElementReferencePreviewScope {
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
}
export declare function createPptxElementReferencePreviewSource(reference: PptxElementReference, scope: PptxElementReferencePreviewScope): PptxCodeViewerSource | null;
//# sourceMappingURL=pptxElementReferencePreview.d.ts.map