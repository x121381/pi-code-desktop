import type { ConversationShareFailureIssue, ConversationSharePreflightResult, ConversationShareTurnPreflightResult } from "@zcode/services";
import type { ConversationRow } from "@zcode/shared/zcode-protocol-v4";
export interface ConversationShareTurnFingerprintContext {
    capabilitiesFingerprint?: string;
    logEpoch?: string;
    productTurnId?: string;
    remoteSessionId?: string;
    revision?: number;
    sessionId?: string;
    workspaceKey?: string;
}
export declare function conversationShareTurnFingerprint(rows: readonly ConversationRow[], productTurnId: string, workspacePath?: string, context?: ConversationShareTurnFingerprintContext): string;
export declare function conversationSharePreflightCacheKey(scopeKey: string, productTurnId: string): string;
/**
 * 聚合多个 turn 的预检结果时，去掉同一条无法定位到具体轮次/文件的全局错误。
 * 轮次或文件级问题保留各自定位字段，避免把用户真正需要处理的多个问题合并掉。
 */
export declare function dedupeConversationShareIssues(issues: readonly ConversationShareFailureIssue[]): ConversationShareFailureIssue[];
/**
 * 把一次预检结果拆成按 turn 的缓存条目。
 *
 * dev 下 host 进程不会随 services 重建重启，老 host 返回的结果没有 turnResults，
 * 调用方直接 `.map` 会抛异常并被下游 catch 报成「服务端预检失败」。这里对字段缺失做降级：
 * 找不到某个 turn 的明细就回落到整体 issues，宁可粒度粗一点也不能把成功的预检说成失败。
 */
export declare function buildConversationSharePreflightCacheEntries(result: ConversationSharePreflightResult, productTurnIds: readonly string[], turnFingerprints: ReadonlyMap<string, string>): ConversationShareTurnPreflightResult[];
export declare function getMissingConversationSharePreflightTurnIds(scopeKey: string, selectedProductTurnIds: readonly string[], cache: ReadonlyMap<string, ConversationShareTurnPreflightResult>, turnFingerprints?: ReadonlyMap<string, string>): string[];
/** 行数是整组选中项的约束，取消/新增轮次后必须重算，不能沿用某一批 RPC 的合计。 */
export declare function aggregateConversationShareBlockingIssues(entries: readonly ConversationShareTurnPreflightResult[]): ConversationShareFailureIssue[];
//# sourceMappingURL=conversationSharePreflightCache.d.ts.map