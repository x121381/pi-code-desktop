import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable max-lines -- context 面板聚合 Context windows、Coding Plan 和 Start Plan 三段紧耦合展示；后续拆分需要单独梳理弹层状态边界。 */
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, } from "react";
import { TID_CHAT_CONTEXT_USAGE_TRIGGER, } from "@zcode/shared";
import { Context, ContextContentBody, ContextContent, ContextTrigger, } from "@/components/ai-elements/context.js";
import { cn } from "@/components/lib/utils.js";
import { Progress } from "@/components/ui/progress.js";
import { useOptionalTabStore } from "@/store/TabStoreProvider.js";
import { isSettingsTab } from "@/store/tabStore.js";
import { ControlHintTooltip } from "@/ControlHintTooltip.js";
import { resolveCodingPlanUsageRemainingState } from "@/CodingPlanUsageRemainingPanel.js";
import { CodingPlanQuotaResetStatusContent } from "@/components/coding-plan-quota-reset/CodingPlanQuotaResetStatus.js";
import { useCodingPlanQuotaResetUi } from "@/hooks/useCodingPlanQuotaResetUi.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { CODING_PLAN_QUOTA_RESET_AUTOMATIC_PROCESSING_MS, CODING_PLAN_QUOTA_RESET_TYPES, advanceCodingPlanQuotaResetCelebration, pruneCodingPlanQuotaResetConfettiArms, resolveCodingPlanQuotaResetAutomaticPhase, } from "@/lib/codingPlanQuotaResetUi.js";
import { ChatCodingPlanUsageRemainingPanel, hasChatCodingPlanUsageRemaining, } from "@/chat-input-toolbar/CodingPlanContextUsage.js";
import { resolveChatCodingPlanResetOpportunityBadge } from "@/chat-input-toolbar/codingPlanResetOpportunityBadge.js";
import { ChatStartPlanBalancePanel, hasChatStartPlanBalance, } from "@/chat-input-toolbar/StartPlanContextBalance.js";
import { runContextPanelActionWithClose } from "@/chat-input-toolbar/contextPanelAction.js";
import { coordinateCodingPlanQuotaResetAutoPlay } from "@/chat-input-toolbar/codingPlanQuotaResetAutoPlay.js";
import { formatCompactTokenNumber } from "@/lib/tokenNumberFormat.js";
import { CONTEXT_QUOTA_RESET_URGENT_SECONDS, ContextQuotaResetOpportunityReminderContent, contextQuotaResetOpportunityDismissalStore, resolveContextQuotaResetOpportunityReminder, resolveContextQuotaResetOpportunityTriggerTone, resolveContextTriggerTooltipKind, shouldDismissContextQuotaResetOpportunityReminder, } from "@/chat-input-toolbar/contextQuotaResetOpportunityReminder.js";
const CONTEXT_PROGRESS_TONE_COLORS = [
    "var(--color-usage-chart-1)",
    "color-mix(in oklab, var(--color-usage-chart-1) 78%, var(--color-surface))",
    "color-mix(in oklab, var(--color-usage-chart-1) 58%, var(--color-surface))",
    "color-mix(in oklab, var(--color-usage-chart-1) 42%, var(--color-surface))",
    "color-mix(in oklab, var(--color-usage-chart-1) 28%, var(--color-surface))",
];
const PERCENT_MAX = 100;
const CACHE_HIT_RATE_DISPLAY_THRESHOLD = 0.78;
export function formatContextUsageTokenCount(value, locale, options = {}) {
    return formatCompactTokenNumber(locale, value, options);
}
export function formatContextUsageSummary({ locale, percent, size, used, }) {
    const percentageFormatter = new Intl.NumberFormat(locale, {
        maximumFractionDigits: 1,
        style: "percent",
    });
    return `${formatContextUsageTokenCount(used, locale)}/${formatContextUsageTokenCount(size, locale, {
        maximumFractionDigits: 0,
    })} (${percentageFormatter.format(percent)})`;
}
export function formatContextCacheHitRateLabel(hitRate, locale, options = {}) {
    if (hitRate === null || hitRate === undefined || !Number.isFinite(hitRate)) {
        return null;
    }
    // 生产面板只露出明显缓存收益，避免低命中率分散对上下文容量的注意力；
    // 开发环境需要观察 provider 的真实低命中值，因此允许绕过 78% 展示阈值。
    if (!options.showBelowThreshold &&
        hitRate < CACHE_HIT_RATE_DISPLAY_THRESHOLD) {
        return null;
    }
    return new Intl.NumberFormat(locale, {
        maximumFractionDigits: 1,
        style: "percent",
    }).format(Math.max(0, hitRate));
}
function getBreakdownToneStyle(index) {
    return {
        backgroundColor: CONTEXT_PROGRESS_TONE_COLORS[Math.min(index, CONTEXT_PROGRESS_TONE_COLORS.length - 1)] ?? CONTEXT_PROGRESS_TONE_COLORS[0],
    };
}
const BREAKDOWN_SOURCE_LABEL_ID = {
    messages: "chat.contextUsage.breakdown.messages",
    system_prompt: "chat.contextUsage.breakdown.systemPrompt",
    meta_user_context: "chat.contextUsage.breakdown.metaUserContext",
    skills: "chat.contextUsage.breakdown.skills",
    tool_prompt: "chat.contextUsage.breakdown.toolPrompt",
    system_tool_schemas: "chat.contextUsage.breakdown.systemTools",
    mcp_tool_schemas: "chat.contextUsage.breakdown.mcpTools",
};
const BREAKDOWN_SOURCE_ORDER = {
    messages: 0,
    system_prompt: 1,
    meta_user_context: 2,
    skills: 3,
    tool_prompt: 4,
    system_tool_schemas: 5,
    mcp_tool_schemas: 6,
};
export function buildContextUsageBreakdownSegments(breakdown) {
    const charsBySource = new Map();
    for (const item of breakdown ?? []) {
        if (!Number.isFinite(item.chars) || item.chars <= 0) {
            continue;
        }
        charsBySource.set(item.source, (charsBySource.get(item.source) ?? 0) + item.chars);
    }
    const totalChars = [...charsBySource.values()].reduce((sum, chars) => sum + chars, 0);
    if (totalChars <= 0) {
        return [];
    }
    return [...charsBySource.entries()]
        .map(([source, chars]) => ({
        chars,
        percent: chars / totalChars,
        source,
    }))
        .sort((left, right) => right.chars - left.chars ||
        BREAKDOWN_SOURCE_ORDER[left.source] -
            BREAKDOWN_SOURCE_ORDER[right.source]);
}
export function buildContextUsageProgressSegments(segments) {
    return segments.map((segment, index) => ({
        id: segment.source,
        percent: segment.percent,
        style: getBreakdownToneStyle(index),
    }));
}
export function getRenderableTaskUsage(taskUsage) {
    if (!taskUsage) {
        return null;
    }
    // ZCode Protocol 迁移后会单独补齐真实 contextUsed/contextWindow。
    // used=0 或非法值不代表可展示的上下文占用，避免把初始化/异常兜底渲染成误导性的 0%。
    if (!Number.isFinite(taskUsage.used) ||
        !Number.isFinite(taskUsage.size) ||
        taskUsage.used <= 0 ||
        taskUsage.size <= 0) {
        return null;
    }
    return taskUsage;
}
export function getContextCompressionCommand(_provider) {
    return "/compact";
}
// 自动/运营完成（startedAt 为空）当前生效的 used_at；手动完成不进入触发器交互。
function resolveAutomaticCompletedAt(entry) {
    return entry?.status === "completed" &&
        entry.startedAt === null &&
        entry.observedAt !== null
        ? entry.completedAt
        : null;
}
export function refreshContextUsageOnOpen(open, onAccess) {
    if (open) {
        void onAccess?.();
    }
}
export function ChatContextUsage({ codingPlanUsageRemaining, startPlanBalance, taskUsage, selectedProvider: _selectedProvider, intl, locale, }) {
    const isWorkspaceVisible = useOptionalTabStore((state) => !state.tabs.some((tab) => tab.id === state.activeTabId && isSettingsTab(tab)));
    const [contextOpen, setContextOpen] = useState(false);
    const [contextAccessRefreshing, setContextAccessRefreshing] = useState(false);
    const [quotaResetDialogOpen, setQuotaResetDialogOpen] = useState(false);
    const quotaResetDialogOpenRef = useRef(false);
    const contextUsageTriggerRef = useRef(null);
    const contextAccessRefreshSeqRef = useRef(0);
    const handleContextOpenChange = useCallback((open) => {
        // Dialog 打开后会把焦点移出 HoverCard，Radix 随即请求关闭 HoverCard；
        // 若此时卸载内容，Portal 中的重置弹框也会一起消失，因此弹框存活期间必须拒绝关闭。
        if (!open && quotaResetDialogOpenRef.current) {
            return;
        }
        setContextOpen(open);
        // hover 刷新入口不能只认 Coding Plan 的 onAccess：Start Plan（今日余额）与
        // Coding Plan 连接方式互斥，start plan 用户 hover 时整条刷新链路都不触发，余额只能被动等
        // 设置页/侧栏刷新。改为两段配置任一提供 onAccess 即发起本次静默 access 刷新（互斥下实际只有一个存在）。
        const accessRefresh = codingPlanUsageRemaining?.onAccess ?? startPlanBalance?.onAccess;
        if (!open || !accessRefresh) {
            return;
        }
        // silent access refresh 有缓存快照时不会把 entitlement.loading 置 true。
        // header 的刷新图标必须跟随本次 hover 触发的远端 promise，而不是只看快照 loading。
        const refreshSeq = contextAccessRefreshSeqRef.current + 1;
        contextAccessRefreshSeqRef.current = refreshSeq;
        setContextAccessRefreshing(true);
        Promise.resolve(accessRefresh()).finally(() => {
            if (contextAccessRefreshSeqRef.current === refreshSeq) {
                setContextAccessRefreshing(false);
            }
        });
    }, [codingPlanUsageRemaining?.onAccess, startPlanBalance?.onAccess]);
    const handleQuotaResetDialogOpenChange = useCallback((open) => {
        quotaResetDialogOpenRef.current = open;
        setQuotaResetDialogOpen(open);
        if (!open) {
            setContextOpen(false);
        }
    }, []);
    const renderableTaskUsage = getRenderableTaskUsage(taskUsage);
    const codingPlanUsageRemainingWithClose = useMemo(() => {
        if (!codingPlanUsageRemaining) {
            return undefined;
        }
        const base = {
            ...codingPlanUsageRemaining,
            refreshing: contextAccessRefreshing || codingPlanUsageRemaining.refreshing === true,
        };
        if (!codingPlanUsageRemaining.onUsageClick) {
            return base;
        }
        return {
            ...base,
            onUsageClick: () => runContextPanelActionWithClose({
                action: codingPlanUsageRemaining.onUsageClick,
                close: () => setContextOpen(false),
            }),
        };
    }, [codingPlanUsageRemaining, contextAccessRefreshing]);
    const startPlanBalanceWithClose = useMemo(() => {
        if (!startPlanBalance) {
            return undefined;
        }
        const base = {
            ...startPlanBalance,
            // 静默 access 刷新不置 entitlement.loading，今日余额标题旁 spinner 需要跟随
            // 本次 hover 触发的 promise（contextAccessRefreshing），语义对齐 Coding Plan 段的 refreshing。
            refreshing: contextAccessRefreshing || startPlanBalance.refreshing === true,
        };
        if (!startPlanBalance.onUpgradeClick) {
            return base;
        }
        return {
            ...base,
            onUpgradeClick: () => {
                // HoverCard 内按钮点击不会像外部 hover leave 一样自动关闭面板。
                // 升级入口会切到设置页，必须先收起 context 面板，避免旧浮层残留在新页面上。
                setContextOpen(false);
                startPlanBalance.onUpgradeClick?.();
            },
        };
    }, [startPlanBalance, contextAccessRefreshing]);
    const hasCodingPlanUsageRemaining = codingPlanUsageRemainingWithClose
        ? hasChatCodingPlanUsageRemaining(codingPlanUsageRemainingWithClose)
        : false;
    const hasStartPlanBalance = hasChatStartPlanBalance(startPlanBalanceWithClose);
    // 自动重置：触发器和面板复用同一完整 Personal/Team scope；共享 in-flight 避免重复请求。
    const resetCodingPlanState = useMemo(() => codingPlanUsageRemainingWithClose
        ? resolveCodingPlanUsageRemainingState(codingPlanUsageRemainingWithClose)
        : null, [codingPlanUsageRemainingWithClose]);
    const resetSourceKey = resetCodingPlanState?.displayedProviderId ?? null;
    // MCP 与不足三张的主额度同排；主额度占满三列时才在下一行贯穿，浮层始终保持统一宽度。
    const contextPanelWidthClass = "!w-80";
    const resetUi = useCodingPlanQuotaResetUi({
        sourceKey: resetSourceKey,
        preferredProviderId: resetCodingPlanState?.displayedEntitlement?.providerId,
        accountAccess: resetCodingPlanState?.displayedEntitlement?.accountAccess,
        onEntitlementRefresh: codingPlanUsageRemainingWithClose?.onEntitlementRefresh,
    });
    const opportunityBadge = resolveChatCodingPlanResetOpportunityBadge(resetCodingPlanState, resetUi);
    const [opportunityNow, setOpportunityNow] = useState(() => Date.now());
    const opportunityDismissal = useSyncExternalStore(contextQuotaResetOpportunityDismissalStore.subscribe, contextQuotaResetOpportunityDismissalStore.getSnapshot, contextQuotaResetOpportunityDismissalStore.getSnapshot);
    useEffect(() => {
        const now = Date.now();
        if (!opportunityBadge.visible ||
            opportunityBadge.expiresAt === null ||
            opportunityBadge.expiresAt <= now) {
            return;
        }
        setOpportunityNow(now);
        let countdownTimer;
        let urgentThresholdTimer;
        const startUrgentCountdown = () => {
            const update = () => {
                const currentNow = Date.now();
                setOpportunityNow(currentNow);
                const expired = (opportunityBadge.expiresAt ?? 0) <= currentNow;
                if (expired && countdownTimer !== undefined) {
                    window.clearInterval(countdownTimer);
                    countdownTimer = undefined;
                }
                return expired;
            };
            if (!update()) {
                countdownTimer = window.setInterval(update, 1_000);
            }
        };
        const untilUrgent = opportunityBadge.expiresAt -
            now -
            CONTEXT_QUOTA_RESET_URGENT_SECONDS * 1_000;
        if (untilUrgent <= 0) {
            startUrgentCountdown();
        }
        else {
            urgentThresholdTimer = window.setTimeout(startUrgentCountdown, untilUrgent);
        }
        return () => {
            if (countdownTimer !== undefined)
                window.clearInterval(countdownTimer);
            if (urgentThresholdTimer !== undefined)
                window.clearTimeout(urgentThresholdTimer);
        };
    }, [opportunityBadge.expiresAt, opportunityBadge.visible, resetSourceKey]);
    const opportunityReminder = resolveContextQuotaResetOpportunityReminder({
        dismissal: opportunityDismissal,
        now: opportunityNow,
        opportunity: { ...opportunityBadge, sourceKey: resetSourceKey },
    });
    const opportunityTriggerTone = resolveContextQuotaResetOpportunityTriggerTone({
        now: opportunityNow,
        opportunity: { ...opportunityBadge, sourceKey: resetSourceKey },
    });
    const dismissOpportunityReminder = useCallback(() => {
        if (!opportunityReminder)
            return;
        contextQuotaResetOpportunityDismissalStore.dismiss(opportunityReminder);
    }, [opportunityReminder?.opportunityKey, opportunityReminder?.phase]);
    useEffect(() => {
        // 设置覆盖层保留工作区挂载；后台监听不能把设置页点击算作提醒已读。
        if (!isWorkspaceVisible || !opportunityReminder || contextOpen)
            return;
        const handleOutsidePointerDown = (event) => {
            if (shouldDismissContextQuotaResetOpportunityReminder(event.target, contextUsageTriggerRef.current)) {
                dismissOpportunityReminder();
            }
        };
        document.addEventListener("pointerdown", handleOutsidePointerDown, true);
        return () => document.removeEventListener("pointerdown", handleOutsidePointerDown, true);
    }, [
        isWorkspaceVisible,
        contextOpen,
        dismissOpportunityReminder,
        opportunityReminder?.opportunityKey,
        opportunityReminder?.phase,
    ]);
    // 五小时与周额度各自维护撒花轨迹，避免一类完成压制另一类的触发器动效。
    const resetCelebrationStateByTypeRef = useRef({ FIVE_HOUR: null, WEEK: null });
    const fiveHourEntry = resetUi.entry;
    const weekEntry = resetUi.week.entry;
    // 自动/运营完成（startedAt 为空）只是播放候选；status 入口不能直接驱动 Tooltip/撒花。
    const automaticCompletionCandidateByType = useMemo(() => ({
        FIVE_HOUR: resolveAutomaticCompletedAt(fiveHourEntry),
        WEEK: resolveAutomaticCompletedAt(weekEntry),
    }), [fiveHourEntry, weekEntry]);
    const [claimedAutomaticCompletion, setClaimedAutomaticCompletion] = useState({
        sourceKey: null,
        completedAtByType: { FIVE_HOUR: null, WEEK: null },
    });
    const claimedAutomaticCompletionRef = useRef(claimedAutomaticCompletion);
    claimedAutomaticCompletionRef.current = claimedAutomaticCompletion;
    const latestAutomaticCompletionCandidateRef = useRef({
        sourceKey: resetSourceKey,
        completedAtByType: automaticCompletionCandidateByType,
    });
    latestAutomaticCompletionCandidateRef.current = {
        sourceKey: resetSourceKey,
        completedAtByType: automaticCompletionCandidateByType,
    };
    const [autoPlayReservationRetryTick, setAutoPlayReservationRetryTick] = useState(0);
    // Main 返回 claim winner 前 Composer 可能已经卸载或切换 source。现在先获取带 token
    // 的临时 reservation，只有组件与候选仍有效且即将展示时才 commit played；失效 winner release，
    // busy loser 保留 observedAt，等待真实 played 广播或 reservation 释放后重试。
    useEffect(() => {
        let active = true;
        const retryTimers = [];
        const previous = claimedAutomaticCompletionRef.current;
        const sameSource = previous.sourceKey === resetSourceKey;
        const synchronized = {
            sourceKey: resetSourceKey,
            completedAtByType: {
                FIVE_HOUR: sameSource &&
                    previous.completedAtByType.FIVE_HOUR ===
                        automaticCompletionCandidateByType.FIVE_HOUR
                    ? previous.completedAtByType.FIVE_HOUR
                    : null,
                WEEK: sameSource &&
                    previous.completedAtByType.WEEK ===
                        automaticCompletionCandidateByType.WEEK
                    ? previous.completedAtByType.WEEK
                    : null,
            },
        };
        if (previous.sourceKey !== synchronized.sourceKey ||
            previous.completedAtByType.FIVE_HOUR !==
                synchronized.completedAtByType.FIVE_HOUR ||
            previous.completedAtByType.WEEK !== synchronized.completedAtByType.WEEK) {
            claimedAutomaticCompletionRef.current = synchronized;
            setClaimedAutomaticCompletion(synchronized);
        }
        for (const resetType of CODING_PLAN_QUOTA_RESET_TYPES) {
            const completedAt = automaticCompletionCandidateByType[resetType];
            if (completedAt === null ||
                synchronized.completedAtByType[resetType] === completedAt) {
                continue;
            }
            void coordinateCodingPlanQuotaResetAutoPlay({
                reserve: () => resetUi.reserveAutomaticCompletion(resetType, completedAt),
                isCurrent: () => {
                    const latest = latestAutomaticCompletionCandidateRef.current;
                    return (active &&
                        latest.sourceKey === resetSourceKey &&
                        latest.completedAtByType[resetType] === completedAt);
                },
                commit: resetUi.commitAutomaticCompletion,
                release: resetUi.releaseAutomaticCompletion,
                onCommitted: () => {
                    const current = claimedAutomaticCompletionRef.current;
                    const completedAtByType = current.sourceKey === resetSourceKey
                        ? current.completedAtByType
                        : { FIVE_HOUR: null, WEEK: null };
                    if (completedAtByType[resetType] === completedAt) {
                        return;
                    }
                    const next = {
                        sourceKey: resetSourceKey,
                        completedAtByType: {
                            ...completedAtByType,
                            [resetType]: completedAt,
                        },
                    };
                    claimedAutomaticCompletionRef.current = next;
                    setClaimedAutomaticCompletion(next);
                },
            }).then((result) => {
                if (result.status !== "retry" || !active) {
                    return;
                }
                const latest = latestAutomaticCompletionCandidateRef.current;
                if (latest.sourceKey !== resetSourceKey ||
                    latest.completedAtByType[resetType] !== completedAt) {
                    return;
                }
                retryTimers.push(setTimeout(() => {
                    if (active) {
                        setAutoPlayReservationRetryTick((tick) => tick + 1);
                    }
                }, result.retryAfterMs));
            });
        }
        return () => {
            active = false;
            for (const timer of retryTimers) {
                clearTimeout(timer);
            }
        };
    }, [
        automaticCompletionCandidateByType.FIVE_HOUR,
        automaticCompletionCandidateByType.WEEK,
        autoPlayReservationRetryTick,
        resetSourceKey,
        resetUi.commitAutomaticCompletion,
        resetUi.releaseAutomaticCompletion,
        resetUi.reserveAutomaticCompletion,
    ]);
    // Tooltip/撒花只消费本窗口已经 claim 成功且仍对应当前候选的 used_at。
    const automaticCompletedAtByType = useMemo(() => {
        if (claimedAutomaticCompletion.sourceKey !== resetSourceKey) {
            return { FIVE_HOUR: null, WEEK: null };
        }
        return {
            FIVE_HOUR: claimedAutomaticCompletion.completedAtByType.FIVE_HOUR ===
                automaticCompletionCandidateByType.FIVE_HOUR
                ? claimedAutomaticCompletion.completedAtByType.FIVE_HOUR
                : null,
            WEEK: claimedAutomaticCompletion.completedAtByType.WEEK ===
                automaticCompletionCandidateByType.WEEK
                ? claimedAutomaticCompletion.completedAtByType.WEEK
                : null,
        };
    }, [
        automaticCompletionCandidateByType.FIVE_HOUR,
        automaticCompletionCandidateByType.WEEK,
        claimedAutomaticCompletion,
        resetSourceKey,
    ]);
    const [resetTooltipNow, setResetTooltipNow] = useState(() => Date.now());
    // 已被 hover 收起的自动完成 used_at(按类型记录)；新的自动完成 used_at 不同会自动重新展示,
    // 因此某一类型完成时无需清空另一类型的收起状态。
    const [resetTooltipDismissed, setResetTooltipDismissed] = useState({
        FIVE_HOUR: null,
        WEEK: null,
    });
    // 待补播撒花的自动完成 used_at(按类型记录)；hover 展开面板后由对应额度条「已重置」位置各迸发一次。
    const [armedAutoConfetti, setArmedAutoConfetti] = useState({
        FIVE_HOUR: null,
        WEEK: null,
    });
    const isTypeDismissed = useCallback((resetType) => {
        const completedAt = automaticCompletedAtByType[resetType];
        return (completedAt !== null && resetTooltipDismissed[resetType] === completedAt);
    }, [automaticCompletedAtByType, resetTooltipDismissed]);
    const phaseByType = useMemo(() => ({
        FIVE_HOUR: automaticCompletedAtByType.FIVE_HOUR === null
            ? null
            : resolveCodingPlanQuotaResetAutomaticPhase(fiveHourEntry, resetTooltipNow, isTypeDismissed("FIVE_HOUR")),
        WEEK: automaticCompletedAtByType.WEEK === null
            ? null
            : resolveCodingPlanQuotaResetAutomaticPhase(weekEntry, resetTooltipNow, isTypeDismissed("WEEK")),
    }), [
        automaticCompletedAtByType.FIVE_HOUR,
        automaticCompletedAtByType.WEEK,
        fiveHourEntry,
        weekEntry,
        resetTooltipNow,
        isTypeDismissed,
    ]);
    // 两类同时处于自动提示阶段时，优先展示更晚被观察到的那一类（更贴近“刚刚发生”）。
    const activeResetType = useMemo(() => {
        const candidates = CODING_PLAN_QUOTA_RESET_TYPES.filter((resetType) => phaseByType[resetType] !== null);
        if (candidates.length === 0) {
            return null;
        }
        return candidates.reduce((chosen, resetType) => {
            const chosenObserved = (chosen === "WEEK" ? weekEntry : fiveHourEntry)?.observedAt ?? 0;
            const currentObserved = (resetType === "WEEK" ? weekEntry : fiveHourEntry)?.observedAt ?? 0;
            return currentObserved > chosenObserved ? resetType : chosen;
        });
    }, [phaseByType, fiveHourEntry, weekEntry]);
    const resetTooltipPhase = activeResetType
        ? phaseByType[activeResetType]
        : null;
    const activeEntry = activeResetType === "WEEK"
        ? weekEntry
        : activeResetType === "FIVE_HOUR"
            ? fiveHourEntry
            : null;
    const triggerTooltipKind = resolveContextTriggerTooltipKind(resetTooltipPhase, opportunityReminder?.phase ?? null);
    // Tooltip Portal 位于 body，工作区的 opacity/inert 隐藏不了它；必须跟随 Root 的设置标签可见性。
    const resetStatusTooltipOpen = isWorkspaceVisible && triggerTooltipKind !== null && !contextOpen;
    // 发现新的自动/运营完成：按类型重新计时合成“正在重置”,并 arm 对应额度条补播撒花。
    // 每类各自记录,一类完成不影响另一类；dismissed 按 used_at 记录,新 used_at 会自动重新展示。
    useEffect(() => {
        const armedByType = {};
        for (const resetType of CODING_PLAN_QUOTA_RESET_TYPES) {
            const entry = resetType === "WEEK" ? weekEntry : fiveHourEntry;
            const automaticCompletedAt = automaticCompletedAtByType[resetType];
            const result = advanceCodingPlanQuotaResetCelebration(resetCelebrationStateByTypeRef.current[resetType], {
                sourceKey: resetSourceKey,
                completedAt: entry?.completedAt ?? null,
                automaticCompletion: automaticCompletedAt !== null,
            });
            resetCelebrationStateByTypeRef.current[resetType] = result.state;
            if (result.shouldCelebrate && automaticCompletedAt !== null) {
                armedByType[resetType] = automaticCompletedAt;
            }
        }
        if (Object.keys(armedByType).length > 0) {
            setResetTooltipNow(Date.now());
            setArmedAutoConfetti((prev) => ({ ...prev, ...armedByType }));
        }
    }, [automaticCompletedAtByType, fiveHourEntry, weekEntry, resetSourceKey]);
    // 跨窗口"已播"广播会把正在展示的自动完成 observedAt 置空；此时已 arm 的
    // 补播撒花必须同步清除，否则本窗口 hover 面板时仍会撒花，违背“多窗口只播一次”。
    useEffect(() => {
        setArmedAutoConfetti((prev) => pruneCodingPlanQuotaResetConfettiArms(prev, automaticCompletedAtByType));
    }, [automaticCompletedAtByType]);
    // 合成“正在重置”阶段到期后切换为“已重置”（随后一直保留直到 hover 收起）。
    useEffect(() => {
        const observedAt = activeEntry?.observedAt ?? null;
        if (resetTooltipPhase !== "processing" || observedAt === null) {
            return;
        }
        const remaining = observedAt + CODING_PLAN_QUOTA_RESET_AUTOMATIC_PROCESSING_MS - Date.now();
        const timer = window.setTimeout(() => setResetTooltipNow(Date.now()), Math.max(0, remaining));
        return () => window.clearTimeout(timer);
    }, [resetTooltipPhase, activeEntry?.observedAt]);
    // 用户 hover 触发器展开额度面板：把当前处于自动提示阶段的**每一类**都标记收起,
    // 交由面板内对应重置项从同一位置补播撒花(两类可能同时处于提示阶段)。
    useEffect(() => {
        if (!contextOpen) {
            return;
        }
        if (opportunityReminder) {
            dismissOpportunityReminder();
        }
        setResetTooltipDismissed((prev) => {
            let changed = false;
            const next = { ...prev };
            for (const resetType of CODING_PLAN_QUOTA_RESET_TYPES) {
                const completedAt = automaticCompletedAtByType[resetType];
                if (phaseByType[resetType] !== null &&
                    completedAt !== null &&
                    next[resetType] !== completedAt) {
                    next[resetType] = completedAt;
                    changed = true;
                }
            }
            return changed ? next : prev;
        });
    }, [
        contextOpen,
        phaseByType,
        automaticCompletedAtByType,
        opportunityReminder?.opportunityKey,
        opportunityReminder?.phase,
        dismissOpportunityReminder,
    ]);
    const handleAutoResetCelebrated = useCallback((completedAt) => {
        setArmedAutoConfetti((prev) => {
            let changed = false;
            const next = { ...prev };
            for (const resetType of CODING_PLAN_QUOTA_RESET_TYPES) {
                if (next[resetType] === completedAt) {
                    next[resetType] = null;
                    changed = true;
                }
            }
            return changed ? next : prev;
        });
    }, []);
    const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);
    const contextUsageLabel = useMemo(() => {
        if (!renderableTaskUsage) {
            return null;
        }
        return intl.formatMessage({ id: "chat.contextUsage" }, {
            used: numberFormatter.format(renderableTaskUsage.used),
            total: numberFormatter.format(renderableTaskUsage.size),
        });
    }, [intl, numberFormatter, renderableTaskUsage]);
    const cacheHitRateLabel = useMemo(() => {
        return formatContextCacheHitRateLabel(renderableTaskUsage?.cache?.hitRate, locale, {
            showBelowThreshold: import.meta.env.DEV,
        });
    }, [locale, renderableTaskUsage]);
    const breakdownSegments = useMemo(() => buildContextUsageBreakdownSegments(renderableTaskUsage?.breakdown), [renderableTaskUsage?.breakdown]);
    const progressSegments = useMemo(() => buildContextUsageProgressSegments(breakdownSegments), [breakdownSegments]);
    const percentageFormatter = useMemo(() => new Intl.NumberFormat(locale, {
        maximumFractionDigits: 1,
        style: "percent",
    }), [locale]);
    if ((!renderableTaskUsage || !contextUsageLabel) &&
        !hasCodingPlanUsageRemaining &&
        !hasStartPlanBalance) {
        return null;
    }
    const usagePercent = renderableTaskUsage
        ? Math.min(Math.max(renderableTaskUsage.used / renderableTaskUsage.size, 0), 1)
        : 0;
    const compactTokenUsageLabel = renderableTaskUsage
        ? formatContextUsageSummary({
            locale,
            percent: usagePercent,
            size: renderableTaskUsage.size,
            used: renderableTaskUsage.used,
        })
        : null;
    const triggerLabel = contextUsageLabel ??
        (hasCodingPlanUsageRemaining
            ? intl.formatMessage({ id: "sidebar.usage.plan.title" })
            : intl.formatMessage({
                id: "settings.modelProvider.startPlan.balance.title",
            }));
    const contextUsedTokens = renderableTaskUsage?.used ?? 0;
    const contextMaxTokens = renderableTaskUsage?.size ?? 1;
    return (_jsxs(Context, { usedTokens: contextUsedTokens, maxTokens: contextMaxTokens, open: contextOpen, onOpenChange: handleContextOpenChange, children: [_jsx(ControlHintTooltip, { className: triggerTooltipKind === "reset-status"
                    ? undefined
                    : "bg-background py-0.5 pr-0.5", open: resetStatusTooltipOpen, side: "top", standalone: true, triggerRef: contextUsageTriggerRef, title: triggerTooltipKind === "reset-status" && resetTooltipPhase ? (_jsx(CodingPlanQuotaResetStatusContent, { status: resetTooltipPhase, resetType: activeResetType ?? "FIVE_HOUR" })) : opportunityReminder ? (_jsx(ContextQuotaResetOpportunityReminderContent, { count: opportunityReminder.count, intl: intl, onDismiss: dismissOpportunityReminder, phase: opportunityReminder.phase, remainingSeconds: opportunityReminder.remainingSeconds })) : null, children: _jsx("span", { className: "inline-flex shrink-0", children: _jsx(ContextTrigger, { "aria-label": triggerLabel, className: cn("text-foreground-subtle", opportunityTriggerTone === "available" && "text-success", opportunityTriggerTone === "urgent" &&
                            "bg-warning/10 text-warning"), "data-chat-toolbar-popover-trigger": "true", "data-testid": TID_CHAT_CONTEXT_USAGE_TRIGGER, onPointerDown: (event) => {
                            // Radix HoverCard 会在 touchstart 中阻止后续 click，手机端无法打开面板；
                            // 在触摸 pointerdown 阶段先打开，桌面端继续保持原有 hover/focus 语义。
                            if (!event.defaultPrevented &&
                                event.pointerType === "touch" &&
                                typeof window !== "undefined" &&
                                window.matchMedia?.("(hover: none)").matches) {
                                // 统一走受控 open handler，确保触摸打开也会触发额度 access 刷新和刷新态反馈。
                                if (!contextOpen) {
                                    handleContextOpenChange(true);
                                }
                            }
                        } }) }) }), _jsx(ContextContent, { className: cn(contextPanelWidthClass, "!rounded-xl !shadow-md"), side: "top", sideOffset: 2, children: _jsxs(ContextContentBody, { className: "space-y-3", children: [renderableTaskUsage && compactTokenUsageLabel ? (_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex min-w-0 mb-3 items-center gap-3", children: [_jsx("span", { className: "shrink-0 text-ui-base font-medium text-foreground", children: intl.formatMessage({ id: "chat.contextUsage.title" }) }), _jsx("span", { className: "ml-auto shrink-0 text-right font-mono text-ui-sm text-foreground-subtle", children: compactTokenUsageLabel })] }), _jsx(Progress, { className: "h-2 bg-surface", indicatorClassName: "min-w-2", segments: progressSegments, value: usagePercent * PERCENT_MAX })] })) : null, renderableTaskUsage &&
                            (breakdownSegments.length > 0 || cacheHitRateLabel) ? (_jsxs(_Fragment, { children: [breakdownSegments.length > 0 ? (_jsx("div", { "aria-label": intl.formatMessage({
                                        id: "chat.contextUsage.breakdown",
                                    }), className: "space-y-1.5", children: _jsx("div", { className: "grid gap-1.5", children: breakdownSegments.map((segment, index) => (_jsxs("div", { className: "flex min-w-0 items-center gap-2 text-ui-sm", children: [_jsx("span", { "aria-hidden": "true", className: "size-2 shrink-0 rounded-sm border border-border", style: getBreakdownToneStyle(index) }), _jsx("span", { className: "min-w-0 truncate text-foreground-subtle", children: intl.formatMessage({
                                                        id: BREAKDOWN_SOURCE_LABEL_ID[segment.source],
                                                    }) }), _jsx("span", { className: "ml-auto min-w-10 shrink-0 text-right font-mono text-ui-sm tabular-nums text-foreground", children: percentageFormatter.format(segment.percent) })] }, segment.source))) }) })) : null, cacheHitRateLabel ? (_jsxs("div", { className: cn("flex items-center justify-between gap-3 text-ui-sm", breakdownSegments.length > 0 &&
                                        "border-t border-border pt-3"), children: [_jsx("span", { className: "text-foreground-subtle", children: intl.formatMessage({
                                                id: "chat.contextUsage.cacheHitRate",
                                            }) }), _jsx("span", { className: "font-mono text-ui-sm text-foreground", children: cacheHitRateLabel })] })) : null] })) : null, codingPlanUsageRemainingWithClose && hasCodingPlanUsageRemaining ? (_jsx(ChatCodingPlanUsageRemainingPanel, { autoCelebrateArm: armedAutoConfetti, config: codingPlanUsageRemainingWithClose, intl: intl, locale: locale, quotaResetDialogOpen: quotaResetDialogOpen, separated: Boolean(renderableTaskUsage && compactTokenUsageLabel), onAutoCelebrated: handleAutoResetCelebrated, onQuotaResetDialogOpenChange: handleQuotaResetDialogOpenChange })) : null, startPlanBalanceWithClose && hasStartPlanBalance ? (_jsx(ChatStartPlanBalancePanel, { config: startPlanBalanceWithClose, intl: intl, locale: locale, separated: Boolean((renderableTaskUsage && compactTokenUsageLabel) ||
                                hasCodingPlanUsageRemaining) })) : null] }) })] }));
}
//# sourceMappingURL=contextUsage.js.map