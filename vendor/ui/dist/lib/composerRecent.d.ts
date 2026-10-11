import { type ModelSelection } from "@zcode/shared/model-selection";
import { type SubmissionMode } from "@zcode/shared/zcode-protocol-v4";
import type { ModelSelectionView } from "@zcode/services";
interface StorageLike {
    getItem(key: string): string | null;
    setItem(key: string, value: string): void;
}
interface ComposerRecent {
    readonly modelSelection?: ModelSelection;
    readonly mode?: SubmissionMode;
}
export declare function readComposerRecent(workspacePath: string, workspaceIdentity?: string, storage?: StorageLike | null): ComposerRecent | null;
/** 发起真实 Submission 时捕获；返回函数只在 accepted ACK 后调用。 */
export declare function captureComposerRecentSubmission(workspacePath: string, submission: {
    readonly modelSelection: ModelSelection;
    readonly mode: SubmissionMode;
}, workspaceIdentity?: string, storage?: StorageLike | null): () => void;
export declare function resolveDraftInitialModelSelection(view: ModelSelectionView | null, recent: ModelSelection | null): {
    readonly selection: ModelSelection | null;
    readonly invalidated: boolean;
};
export declare function isSelectionInView(view: ModelSelectionView, selection: ModelSelection): boolean;
export {};
//# sourceMappingURL=composerRecent.d.ts.map