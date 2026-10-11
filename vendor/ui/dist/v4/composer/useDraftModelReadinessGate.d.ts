import { type ZCodeProvider } from "@zcode/shared";
import type { IModelSelectionService, ModelSelectionView } from "@zcode/services";
import { type ModelConfigMissingUiError } from "@/lib/chatPrepareError.js";
type DraftModelReadinessStatus = "checking" | "ready" | "missing" | "check-failed";
export interface DraftModelReadinessGate {
    /** 只有 readiness 已确认或检查本身不可用时，才允许进入 workspace prepare/prewarm。 */
    agentStartupAllowed: boolean;
    error: ModelConfigMissingUiError | null;
    dismissError(): void;
    /** 首发 admission 的权威复查；false 表示应保留 composer 并返回 blocked。 */
    ensureReadyForSend(): Promise<boolean>;
    /** Host 门禁在 UI 复查后竞态命中时，将同一错误重新投影到草稿横幅。 */
    markProviderNotReady(): void;
}
export declare function resolveModelSelectionReadinessStatus(view: ModelSelectionView): Extract<DraftModelReadinessStatus, "ready" | "missing">;
/**
 * V4 草稿的 provider/model admission。
 *
 * V4 迁移删除了旧 useWorkspacePrepare 的 renderer readiness 门禁，草稿首发
 * 会先登记 pending command，再由 Host 以 provider_not_ready 拒绝。这个确定性拒绝随后会
 * 被恢复账本误判成 unknown。这里恢复 UI 前置门禁；Host 门禁继续负责进程级竞态兜底。
 */
export declare function useDraftModelReadinessGate(params: {
    workspacePath: string;
    workspaceIdentity?: string;
    provider?: ZCodeProvider;
    sessionId: string | null;
    modelSelectionService: Pick<IModelSelectionService, "getView" | "onDidChange">;
}): DraftModelReadinessGate;
export {};
//# sourceMappingURL=useDraftModelReadinessGate.d.ts.map