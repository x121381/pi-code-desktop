import { type ModelSelection } from "@zcode/shared";
import { type SubmissionMode } from "@zcode/shared/zcode-protocol-v4";
import type { ComposerMentionPrefill } from "@/store/zcodeSessionStoreTypes.js";
export interface V4ComposerDraft {
    text: string;
    editorStateJson?: string;
    mention?: ComposerMentionPrefill;
    /** 有合法 mode 表示已经初始化；没有模型仍是明确空态，不能按旧文本草稿补默认。 */
    mode?: SubmissionMode;
    planEnabled?: boolean;
    /** 已处理的工具变更，防止重连快照再次覆盖用户选择。 */
    lastPlanTransitionId?: string;
    lastPermissionGrantId?: string;
    modelSelection?: ModelSelection;
    /** 首次分享导入等待公共新任务初始化；不能由空 Session snapshot 抢先填充。 */
    initializeFromNewTask?: true;
    updatedAt: number;
}
export declare const V4_DRAFT_SCOPE_ROOT = "__draft__";
export declare function getV4ComposerDraftStorageKey(workspacePath: string, workspaceIdentity?: string): string;
export declare function readV4ComposerDraft(workspacePath: string, workspaceIdentity: string | undefined, scopeId: string): V4ComposerDraft | null;
export declare function persistV4ComposerDraft(workspacePath: string, workspaceIdentity: string | undefined, scopeId: string, draft: Omit<V4ComposerDraft, "updatedAt">): boolean;
export declare function clearV4ComposerDraft(workspacePath: string, workspaceIdentity: string | undefined, scopeId: string): boolean;
//# sourceMappingURL=composerDraftStore.d.ts.map