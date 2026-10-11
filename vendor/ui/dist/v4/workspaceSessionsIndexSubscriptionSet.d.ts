import { type SessionsIndexAgentService, type SessionsIndexScope } from "@/v4/sessionsIndexRegistry.js";
import type { SessionsIndexStore } from "@/v4/sessionsIndexStore.js";
export interface WorkspaceSessionsIndexBinding {
    scope: SessionsIndexScope;
    agentService: SessionsIndexAgentService;
}
/**
 * 按 endpoint + workspaceKey 持有 sessions-index 订阅。
 *
 * 旧 hook 把整个 scopes 数组放进一个带 cleanup 的 effect；删除一个 workspace 时，
 * React 会先释放全部 sibling 订阅，再重新 acquire 剩余项，导致已有 snapshot/水位被空状态替换。
 * 这里把 scope 数组解释成 desired set，只对真正新增、删除或 endpoint 换代的 key 做副作用。
 */
export declare class WorkspaceSessionsIndexSubscriptionSet {
    private readonly onStoreChange;
    private readonly active;
    constructor(onStoreChange: () => void);
    reconcile(bindings: readonly WorkspaceSessionsIndexBinding[]): boolean;
    getStore(scope: Pick<SessionsIndexScope, "workspaceKey" | "endpointKey">): SessionsIndexStore | undefined;
    size(): number;
    /** hook 真正卸载（含 StrictMode cleanup）时统一释放；后续 reconcile 仍可重新建立。 */
    dispose(): void;
    private disposeEntry;
}
//# sourceMappingURL=workspaceSessionsIndexSubscriptionSet.d.ts.map