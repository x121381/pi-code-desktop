import { Fragment as _Fragment, jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
export const SUMMARY_ROLL_TRANSITION_MS = 300;
export const SUMMARY_ROLL_HOLD_MS = 500;
export const SUMMARY_ROLL_TOTAL_MS = SUMMARY_ROLL_TRANSITION_MS + SUMMARY_ROLL_HOLD_MS;
const SUMMARY_ROLL_TIMER_DRIFT_SKIP_MS = 250;
const SUMMARY_ROLL_MAX_PENDING = 2;
const SUMMARY_ROLL_TRANSITION = {
    duration: SUMMARY_ROLL_TRANSITION_MS / 1000,
    ease: [0.4, 0, 0.2, 1],
};
function getCurrentTimestamp() {
    if (typeof performance !== "undefined") {
        return performance.now();
    }
    return Date.now();
}
export function resolveQueuedSummaryPlaybackQueue(queuedContent, timerDriftMs) {
    if (timerDriftMs > SUMMARY_ROLL_TIMER_DRIFT_SKIP_MS && queuedContent.length > 1) {
        return queuedContent.slice(-1);
    }
    return [...queuedContent];
}
export function shouldAnimateQueuedSummaryContent({ enabled, disableAnimation, reducedMotion, }) {
    return enabled && disableAnimation !== true && !reducedMotion;
}
export function shouldRefreshQueuedSummaryContent(current, next) {
    return (current.key === next.key &&
        (current.trailingText !== next.trailingText || current.refreshVersion !== next.refreshVersion));
}
function usePrefersReducedMotion() {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
    useEffect(() => {
        if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
            return;
        }
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        const update = () => {
            setPrefersReducedMotion(query.matches);
        };
        update();
        if (typeof query.addEventListener === "function") {
            query.addEventListener("change", update);
            return () => {
                query.removeEventListener("change", update);
            };
        }
        query.addListener(update);
        return () => {
            query.removeListener(update);
        };
    }, []);
    return prefersReducedMotion;
}
export function QueuedSummaryContent({ contentKey, contentRefreshVersion, primaryText, secondaryText, trailingText, enabled, disableAnimation = false, }) {
    const reducedMotion = usePrefersReducedMotion();
    const shouldAnimate = shouldAnimateQueuedSummaryContent({
        enabled,
        disableAnimation,
        reducedMotion,
    });
    const createSnapshot = () => ({
        key: contentKey,
        refreshVersion: contentRefreshVersion,
        primaryText,
        secondaryText,
        trailingText,
    });
    const [displayedContent, setDisplayedContent] = useState(createSnapshot);
    const displayedContentRef = useRef(displayedContent);
    const queuedContentRef = useRef([]);
    const animationTimerRef = useRef(null);
    const isAnimatingRef = useRef(false);
    useEffect(() => {
        displayedContentRef.current = displayedContent;
    }, [displayedContent]);
    useEffect(() => {
        const clearAnimationTimer = () => {
            if (animationTimerRef.current !== null) {
                window.clearTimeout(animationTimerRef.current);
                animationTimerRef.current = null;
            }
        };
        const enqueue = (snapshot) => {
            const queue = queuedContentRef.current;
            const existingIndex = queue.findIndex((item) => item.key === snapshot.key);
            if (existingIndex >= 0) {
                // 文件摘要正在等待播放时，持续到达的 diff 只更新同一快照，不能因为 key 去重
                // 留下最早的 +N/-N，也不能为每次数值变化新增整条滚动项。
                const nextQueue = [...queue];
                nextQueue[existingIndex] = snapshot;
                queuedContentRef.current = nextQueue;
                return;
            }
            if (queue.length === 0) {
                queuedContentRef.current = [snapshot];
                return;
            }
            // 摘要滚动总共只能有三格：当前显示、下一条、可插队条。
            // queuedContentRef 只保存后两格；第二条不能被覆盖，新摘要只能替换第三格。
            queuedContentRef.current = [queue[0], snapshot].slice(0, SUMMARY_ROLL_MAX_PENDING);
        };
        const promote = (snapshot) => {
            displayedContentRef.current = snapshot;
            setDisplayedContent(snapshot);
            isAnimatingRef.current = true;
            clearAnimationTimer();
            const expectedTimerAt = getCurrentTimestamp() + SUMMARY_ROLL_TOTAL_MS;
            animationTimerRef.current = window.setTimeout(() => {
                isAnimatingRef.current = false;
                animationTimerRef.current = null;
                const queuedContent = queuedContentRef.current;
                const timerDrift = getCurrentTimestamp() - expectedTimerAt;
                // 主线程繁忙时 timeout 会晚到；如果继续逐条补播旧摘要，
                // 用户会在卡顿恢复后看到过期状态排队播放，体感上会更卡。
                const nextQueue = resolveQueuedSummaryPlaybackQueue(queuedContent, timerDrift);
                const [nextQueued, ...restQueued] = nextQueue;
                if (!nextQueued) {
                    queuedContentRef.current = [];
                    return;
                }
                queuedContentRef.current = restQueued;
                promote(nextQueued);
            }, SUMMARY_ROLL_TOTAL_MS);
        };
        const nextContent = createSnapshot();
        if (!shouldAnimate) {
            clearAnimationTimer();
            isAnimatingRef.current = false;
            queuedContentRef.current = [];
            displayedContentRef.current = nextContent;
            setDisplayedContent(nextContent);
            return;
        }
        if (displayedContentRef.current.key === nextContent.key) {
            // 同一 Changes child 的 diff 和同一 streaming Assistant message 都不能重播整条摘要；
            // 前者更新尾部计数，后者用显式 version 原位刷新正文。
            if (shouldRefreshQueuedSummaryContent(displayedContentRef.current, nextContent)) {
                displayedContentRef.current = nextContent;
                setDisplayedContent(nextContent);
            }
            return;
        }
        if (isAnimatingRef.current) {
            enqueue(nextContent);
            return;
        }
        if (queuedContentRef.current.length > 0) {
            enqueue(nextContent);
            return;
        }
        promote(nextContent);
    }, [contentKey, contentRefreshVersion, shouldAnimate, trailingText]);
    useEffect(() => {
        return () => {
            if (animationTimerRef.current !== null) {
                window.clearTimeout(animationTimerRef.current);
            }
        };
    }, []);
    if (!shouldAnimate) {
        return (_jsxs(_Fragment, { children: [primaryText, secondaryText, trailingText] }));
    }
    return (_jsxs("span", { className: "relative inline-flex min-w-0 items-center gap-2 overflow-hidden align-middle", children: [_jsx(AnimatePresence, { initial: false, mode: "popLayout", children: _jsxs(motion.span, { className: "inline-flex min-w-0 items-center gap-2", initial: { y: "0.8em", opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: "-0.8em", opacity: 0 }, transition: SUMMARY_ROLL_TRANSITION, children: [displayedContent.primaryText, displayedContent.secondaryText] }, displayedContent.key) }), displayedContent.trailingText] }));
}
//# sourceMappingURL=QueuedSummaryContent.js.map