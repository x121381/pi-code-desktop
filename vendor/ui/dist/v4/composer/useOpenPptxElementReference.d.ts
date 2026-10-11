import type { CodeViewerSource } from "@/lib/codeViewer.js";
import type { PptxElementReference } from "@/lib/pptxElementReference.js";
export declare function useOpenPptxElementReference(options: {
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    onOpenCodeViewer?: (source: CodeViewerSource) => void;
}): (reference: PptxElementReference) => void;
//# sourceMappingURL=useOpenPptxElementReference.d.ts.map