import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { orderArtifactsPrimaryFirst } from "@/app-shell/workflow-artifacts/artifactPresentation.js";
import { logger } from "@/logger.js";
import { useV4Conversation } from "@/v4/V4ConversationContext.js";
/**
 * 能力缺席（CLI 没有 `listArtifacts` 那套宿主查询）与「这个 run 没有产物」必须能区分：
 * 前者要让预置卡说「读不到详情」，后者是整区缺席。判据与 `useWorkflowRunJournalSummaries`
 * 同一读法——错误跨 JSON-RPC 之后只剩 message 可靠，所以 reasonCode 与能力名两个模式都收。
 */
function isWorkflowRunArtifactsCapabilityMissing(error) {
    const message = error instanceof Error ? error.message : String(error);
    return message.includes("capabilityUnsupported") || message.includes("ArtifactRows");
}
/**
 * 活投影里那组摘要的**形状签名**：`id:kind:version` 逐条拼起来。
 *
 * journal 重查的触发条件用它而不是用整个数组的引用：投影每来一条 `report` 都会造一个新数组
 * （`itemCount` 变了），但条目数变化**不改变**任何产物的版本或 spec——用引用当依赖会让一个
 * 每轮 report 的看板每轮重查一次 journal。反过来，新产物出现与同 id 发布新版都会改这个签名，
 * 而那两件事恰恰**必须**重查（新产物要 spec，新版要 versions）。
 */
function summariesSignature(summaries) {
    if (summaries === undefined)
        return "";
    return summaries.map((summary) => `${summary.id}:${summary.kind}:${summary.version}`).join("|");
}
function viewFromJournal(record) {
    return {
        id: record.id,
        kind: record.kind,
        ...(record.title === undefined ? {} : { title: record.title }),
        ...(record.description === undefined ? {} : { description: record.description }),
        ...(record.contentType === undefined ? {} : { contentType: record.contentType }),
        ...(record.sourcePath === undefined ? {} : { sourcePath: record.sourcePath }),
        ...(record.spec === undefined ? {} : { spec: record.spec }),
        // journal 的元素不带 bytes（字节挂在版本上），所以从最新版上取。
        ...(() => {
            const latest = record.versions.at(-1);
            return latest?.bytes === undefined ? {} : { bytes: latest.bytes };
        })(),
        version: record.version,
        versions: record.versions,
        itemCount: record.itemCount,
        ...(record.primary === true ? { primary: true } : {}),
    };
}
function viewFromSummary(summary) {
    return {
        id: summary.id,
        kind: summary.kind,
        ...(summary.title === undefined ? {} : { title: summary.title }),
        ...(summary.contentType === undefined ? {} : { contentType: summary.contentType }),
        ...(summary.bytes === undefined ? {} : { bytes: summary.bytes }),
        version: summary.version,
        itemCount: summary.itemCount ?? 0,
        ...(summary.primary === true ? { primary: true } : {}),
    };
}
/**
 * 合并两个来源。**顺序与身份由活投影决定**（它是 run 正在长出来的那份），journal 只补
 * 活投影刻意不带的字段；journal 里有而活投影里没有的 id 追加在末尾——那是投影上界 32
 * 拒新之后仍然真实存在的产物，丢掉它们等于让一个满额 run 的产物凭空消失。
 *
 * 之后交付物带头（其余仍按首次发布顺序）：活投影按发布顺序 upsert，journal 那条路端口已经
 * 排过，两条路在这里汇成同一个顺序。
 */
function mergeArtifacts(live, journal) {
    return orderArtifactsPrimaryFirst(mergeArtifactSources(live, journal));
}
function mergeArtifactSources(live, journal) {
    if (live === undefined) {
        return journal === undefined ? [] : journal.map(viewFromJournal);
    }
    const byId = new Map((journal ?? []).map((record) => [record.id, record]));
    const merged = live.map((summary) => {
        const record = byId.get(summary.id);
        if (record === undefined)
            return viewFromSummary(summary);
        byId.delete(summary.id);
        // 活投影的版本号更新（journal 查询可能落后一次发布）；spec / versions 只有 journal 有。
        // `itemCount` 也取活投影：它是刷新信号，落后一拍就少画一个点。
        return {
            ...viewFromJournal(record),
            ...viewFromSummary(summary),
            ...(record.versions.length === 0 ? {} : { versions: record.versions }),
            ...(record.spec === undefined ? {} : { spec: record.spec }),
            ...(record.sourcePath === undefined ? {} : { sourcePath: record.sourcePath }),
            ...(record.description === undefined ? {} : { description: record.description }),
        };
    });
    return [...merged, ...[...byId.values()].map(viewFromJournal)];
}
/**
 * 一个 workflow run 的产物清单。
 *
 * ```
 * 活投影 workflowRuns[].artifacts ─┐
 *   （新鲜、无 spec、上界 32）      ├─▶ merge ─▶ artifacts[]
 * journal workflowRunArtifacts ───┘
 *   （完整、含 versions + spec）
 * ```
 *
 * journal 查询在**两种情形**下都发：活投影在场时用来补 spec / versions（看板没有 spec 就
 * 画不出来），活投影缺席时它就是唯一来源（冷恢复 / 被 8-run 上限淘汰）。重查的触发是摘要的
 * **形状签名**变化，不是数组引用——见 `summariesSignature`。
 */
export function useWorkflowRunArtifacts(options) {
    const { workflowRunArtifacts } = useV4Conversation();
    const [journal, setJournal] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const [unavailable, setUnavailable] = useState(false);
    const [error, setError] = useState(null);
    // 请求版本号：切 run / 切会话后的迟到响应必须被丢弃，不能污染新 run 的清单。
    const requestVersionRef = useRef(0);
    const enabled = options.enabled !== false && options.sessionId.length > 0 && options.runId.length > 0;
    const signature = summariesSignature(options.live);
    const { sessionId, runId } = options;
    const fetchArtifacts = useCallback(async () => {
        const requestVersion = ++requestVersionRef.current;
        setLoading(true);
        setError(null);
        try {
            const result = await workflowRunArtifacts({ sessionId, runId });
            if (requestVersion !== requestVersionRef.current)
                return;
            setJournal(result.artifacts);
            setUnavailable(false);
            setLoading(false);
        }
        catch (caught) {
            if (requestVersion !== requestVersionRef.current)
                return;
            setLoading(false);
            if (isWorkflowRunArtifactsCapabilityMissing(caught)) {
                // 能力缺席不是错误：内容产物的卡片仍然从活投影画得出来，只有看板画不了。
                setJournal(undefined);
                setUnavailable(true);
                return;
            }
            const message = caught instanceof Error ? caught.message : String(caught);
            logger.warn("[workflow-artifacts] 读取产物清单失败", { error: message, runId, sessionId });
            setError(message);
        }
    }, [runId, sessionId, workflowRunArtifacts]);
    useEffect(() => {
        // 切 run / 切会话：先丢掉旧 run 的清单再重查。旧产物留在屏幕上比空白危险得多。
        requestVersionRef.current += 1;
        setJournal(undefined);
        setUnavailable(false);
        setError(null);
        if (!enabled) {
            setLoading(false);
            return;
        }
        void fetchArtifacts();
        // signature 是刻意的依赖：新产物出现 / 同 id 发新版都要重查，`itemCount` 变化不重查。
    }, [enabled, fetchArtifacts, signature]);
    return useMemo(() => ({
        artifacts: mergeArtifacts(options.live, journal),
        source: options.live === undefined ? "journal" : "live",
        loading,
        unavailable,
        error,
        complete: options.live !== undefined || journal !== undefined,
    }), [error, journal, loading, options.live, unavailable]);
}
//# sourceMappingURL=useWorkflowRunArtifacts.js.map