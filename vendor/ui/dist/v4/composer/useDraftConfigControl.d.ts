import type { ZCodeConfigOption, ModelSelection, ZCodeProvider, ZCodeSlashCommand } from "@zcode/shared";
import type { SessionConfigState } from "@zcode/shared/zcode-protocol-v4";
import type { IModelSelectionService } from "@zcode/services";
import { type ModelSelectionRead } from "@/hooks/useModelSelectionView.js";
import { type V4ComposerDraft } from "@/v4/composer/composerDraftStore.js";
export declare function applyDraftModelSelection(current: Partial<SessionConfigState>, model: ModelSelection): Partial<SessionConfigState>;
export declare function shouldHydrateWorkspaceCatalog(params: {
    configOptions: readonly ZCodeConfigOption[];
    sessionId: string | null;
    slashCommands: readonly ZCodeSlashCommand[];
}): boolean;
export interface DraftConfigControl {
    modelSelectionRead: ModelSelectionRead;
    /** Renderer 下一次提交的配置；Session 只在 scope 首次初始化时提供种子。 */
    draftConfig: Partial<SessionConfigState>;
    /** 草稿已选 config（partial）；createSession 时经 buildDraftCreateConfigPayload 携带。 */
    draftConfigRef: React.RefObject<Partial<SessionConfigState>>;
    /** 当前草稿生命周期冻结的初始化 config；只供 prewarm/createSession 建立时使用。 */
    resolveInitialDraftConfig: () => Partial<SessionConfigState> | undefined;
    composerDraft: V4ComposerDraft;
    updateComposerContent: (content: Pick<V4ComposerDraft, "text" | "editorStateJson" | "mention">) => void;
    replaceComposerDraft: (draft: Omit<V4ComposerDraft, "updatedAt">) => void;
    /** 新任务被接纳后，把当前完整 Root Draft 原子式转移到真实 Session scope。 */
    promoteComposerDraft: (createdSessionId: string) => void;
    /** 在提交前捕获原意图；只在权威 accepted 后调用返回函数。 */
    captureAcceptedModelSelection: (selection: ModelSelection, expectedSelection?: ModelSelection) => () => void;
    handleDraftSelectModel: (modelProvider: string, model: string) => void;
    handleDraftSelectThought: (thought: string) => void;
    handleDraftSwitchMode: (mode: string) => void;
}
export declare function useDraftConfigControl(params: {
    workspacePath: string;
    workspaceIdentity?: string;
    provider?: ZCodeProvider;
    /** 会话切换读取对应 scope；已有空选择也必须保留。 */
    sessionId: string | null;
    /** 仅匹配当前 Session 的首份投影可用作初始化；null 表示还没恢复完成。 */
    sessionConfig?: Partial<SessionConfigState> | null;
    /** provider registry 已通过 renderer readiness 门禁后才允许拉起 Agent。 */
    agentStartupAllowed?: boolean;
    modelSelectionService: IModelSelectionService | null;
}): DraftConfigControl;
/** createSession payload 的草稿 config 片段（无选择时返回空对象，不携带 config 键）。 */
export declare function buildDraftCreateConfigPayload(draftConfig: Partial<SessionConfigState>, appFollowupMode?: SessionConfigState["followupMode"] | null): {
    config?: Partial<SessionConfigState>;
};
//# sourceMappingURL=useDraftConfigControl.d.ts.map