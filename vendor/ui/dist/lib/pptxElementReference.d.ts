import type { PresentationPageElement } from "@/presentation/types.js";
export declare const PPTX_ELEMENT_REFERENCE_ADD_TO_CHAT_EVENT = "zcode:pptx-element-reference-add-to-chat";
export interface PptxElementReference extends PresentationPageElement {
    id: string;
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    sourcePath: string;
    sourceTitle: string;
    sourceFingerprint: string;
    selectedText?: string;
    comment?: string;
    textFingerprint?: string;
    capturedAt: number;
}
export interface PptxElementReferenceSource {
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    sourcePath: string;
    sourceTitle: string;
}
interface ParsedPptxElementReferencePrompt {
    visibleContent: string;
    pptxElementReferences: PptxElementReference[];
}
type PptxElementReferenceAddToChatEvent = CustomEvent<PptxElementReference>;
export declare function getPptxElementReferenceWorkspaceKey(workspacePath: string, workspaceIdentity?: string): string;
export declare function isPptxElementReferenceInWorkspaceScope(reference: Pick<PptxElementReference, "workspacePath" | "workspaceIdentity" | "remoteSessionId">, scope: {
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
}): boolean;
export declare function isPptxElementReferencePayload(payload: unknown): payload is PptxElementReference;
export declare function createPptxElementReferenceId(): string;
export declare function sha256Fingerprint(value: ArrayBuffer | string): Promise<string>;
export declare function createPptxElementReference(options: {
    element: PresentationPageElement;
    workspacePath: string;
    workspaceIdentity?: string;
    remoteSessionId?: string;
    sourcePath: string;
    sourceTitle: string;
    sourceFingerprint: string;
    selectedText?: string;
    comment?: string;
}): Promise<PptxElementReference>;
export declare function addPptxElementReference(references: readonly PptxElementReference[], reference: PptxElementReference): readonly PptxElementReference[];
export declare function buildPromptWithPptxElementReferences(text: string, references: readonly PptxElementReference[]): string;
export declare function parsePromptPptxElementReferences(content: string): ParsedPptxElementReferencePrompt;
export declare function isPptxElementReferenceAddToChatEvent(event: Event): event is PptxElementReferenceAddToChatEvent;
export declare function dispatchPptxElementReferenceAddToChat(reference: PptxElementReference): void;
export {};
//# sourceMappingURL=pptxElementReference.d.ts.map