import type { IModelSelectionService, ModelSelectionView, ModelSelectionViewInput } from "@zcode/services";
export type ModelSelectionState = {
    status: "loading";
} | {
    status: "ready";
    view: ModelSelectionView;
} | {
    status: "unavailable";
    reason: "remote-waiting" | "missing-target";
} | {
    status: "error";
    error: Error;
};
export interface ModelSelectionRead {
    state: ModelSelectionState;
    reload(): void;
}
/** 订阅明确 Host Service；返回状态在同一次 render 即绑定新 owner，不暴露旧 Host View。 */
export declare function useModelSelectionServiceView(service: IModelSelectionService | null | undefined, enabled?: boolean, unavailableReason?: "remote-waiting" | "missing-target", input?: ModelSelectionViewInput): ModelSelectionRead;
/** 模型候选只来自明确 Workspace Target；等待远端时不读取 Local/Base Host。 */
export declare function useModelSelectionView(workspacePath: string | null | undefined, remoteSessionId?: string | null, workspaceIdentity?: string | null, remoteTarget?: unknown, input?: ModelSelectionViewInput): ModelSelectionRead;
//# sourceMappingURL=useModelSelectionView.d.ts.map