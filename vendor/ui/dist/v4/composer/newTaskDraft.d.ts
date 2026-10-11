import type { ModelSelectionView } from "@zcode/services";
import { type V4ComposerDraft } from "@/v4/composer/composerDraftStore.js";
/** 普通新任务与首次分享导入共用初始化；保留 Recent 原意图，由公共 View 解析有效选择。 */
export declare function initializeNewTaskDraft(draft: V4ComposerDraft, workspacePath: string, workspaceIdentity: string | undefined, view: ModelSelectionView): V4ComposerDraft;
/** 在激活首次导入的 Session 前调用；不依赖模型可执行，也不把原新任务正文带入分享。 */
export declare function seedImportedSessionDraft(result: {
    workspacePath: string;
    workspaceIdentity?: string;
    sessionId: string;
    reused: boolean;
}): void;
//# sourceMappingURL=newTaskDraft.d.ts.map