import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { buildPresetLabels } from "@/app-shell/workflow-artifacts/artifactPresentation.js";
import { cn } from "@/components/lib/utils.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { workDurationParts, workDurationUnitSeparator } from "@/lib/workDuration.js";
import { WORKFLOW_RUN_KIND_ID, WorkflowCardHeader, WorkflowRunStatus, } from "./WorkflowCardChrome.js";
import { completionArtifactCellCount, completionArtifactLayout, WorkflowCompletionArtifacts, } from "./WorkflowCompletionArtifacts.js";
import { PILL_STAGGER_MS } from "./WorkflowTimeline.js";
export { COMPLETION_INDEX_MAX } from "./WorkflowCompletionArtifacts.js";
/** 数字翻上来的时长；四格同一拍，与条上药丸依次落地的节奏相接。 */
const COUNT_UP_MS = 640;
/**
 * tokens 的紧凑写法：`812` / `386.4k` / `1.30M`。千位一位小数、百万两位——固定位数让四格
 * 的等宽数字在 run 与 run 之间对得齐。全值进 title。
 */
export function formatCompactCount(count) {
    if (count < 1_000)
        return { value: count.toLocaleString(), unit: "" };
    if (count < 1_000_000)
        return { value: (count / 1_000).toFixed(1), unit: "k" };
    return { value: (count / 1_000_000).toFixed(2), unit: "M" };
}
function easeOutCubic(t) {
    return 1 - (1 - t) ** 3;
}
/** 只在浏览器**明确**说了「不减少运动」时才翻数字；问不到（静态渲染、jsdom）就直接落终值。 */
function motionAllowed() {
    return (typeof window !== "undefined" &&
        typeof window.matchMedia === "function" &&
        window.matchMedia("(prefers-reduced-motion: no-preference)").matches);
}
/**
 * 数字从 0 翻到目标值。**首帧就是目标值**（静态渲染、测试、reduced-motion 看到的都是终值），
 * 挂载之后才回到 0 再翻上来——「页面在静止时是完整的」。
 */
function useCountUp(target) {
    const [shown, setShown] = useState(target);
    useEffect(() => {
        if (target === undefined || !motionAllowed() || typeof requestAnimationFrame !== "function") {
            setShown(target);
            return;
        }
        let frame = 0;
        const start = performance.now();
        const tick = (now) => {
            const progress = Math.min(1, (now - start) / COUNT_UP_MS);
            setShown(Math.round(target * easeOutCubic(progress)));
            if (progress < 1)
                frame = requestAnimationFrame(tick);
        };
        setShown(0);
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [target]);
    return shown;
}
function Figure({ delayMs, label, parts, testKey, title, }) {
    const { intl } = useZCodeIntl();
    const unavailable = intl.formatMessage({ id: "chat.toolCall.workflow.completion.unavailable" });
    const style = { animationDelay: `${delayMs}ms`, animationFillMode: "backwards" };
    return (_jsxs("div", { className: "wf-arrive flex min-w-0 flex-col", "data-testid": `workflow-completion-figure-${testKey}`, "data-value": parts === undefined ? undefined : parts.map((part) => part.value + part.unit).join(" "), style: style, children: [_jsx("span", { "aria-label": parts === undefined ? unavailable : undefined, className: cn("whitespace-nowrap font-mono text-ui-lg leading-tight tabular-nums", parts === undefined ? "text-foreground-subtlest" : "font-medium text-foreground"), title: title, children: parts === undefined
                    ? "—"
                    : parts.map((part, index) => (_jsxs("span", { children: [index > 0 ? " " : null, part.value, part.unit.length === 0 ? null : (_jsx("span", { className: "text-ui-sm font-normal text-foreground-subtle", children: part.unit }))] }, index))) }), _jsx("span", { className: "truncate text-ui-sm text-foreground-subtle", children: label })] }));
}
export function WorkflowCompletionCard({ artifacts, artifactsTruncated = false, figures, headerLeading, headerTrailing, name, onOpenArtifact, onOpenRun, renderPreview, testIdKey, }) {
    const { intl, locale } = useZCodeIntl();
    const format = intl.formatMessage.bind(intl);
    const labels = useMemo(() => buildPresetLabels((descriptor, values) => intl.formatMessage(descriptor, values)), [intl]);
    const layout = useMemo(() => completionArtifactLayout(artifacts, artifactsTruncated), [artifacts, artifactsTruncated]);
    // 四格的数字翻上来；时长翻的是毫秒，再拆成「11m 48s」。
    const durationMs = useCountUp(figures.durationMs);
    const tokens = useCountUp(figures.tokens);
    const subagents = useCountUp(figures.subagents);
    const phases = useCountUp(figures.phases);
    const separator = workDurationUnitSeparator(locale);
    const timeParts = durationMs === undefined
        ? undefined
        : workDurationParts(durationMs, format).map((part) => ({
            value: String(part.value),
            unit: `${separator}${part.unit}`,
        }));
    const tokenParts = tokens === undefined ? undefined : [formatCompactCount(tokens)];
    const plain = (value) => value === undefined ? undefined : [{ value: value.toLocaleString(), unit: "" }];
    const figureDelay = PILL_STAGGER_MS * (completionArtifactCellCount(layout) + 1);
    return (_jsxs("section", { "aria-label": format({ id: WORKFLOW_RUN_KIND_ID.completed }), 
        // `@container/wf-card`：窄卡（<480px）上动词只剩图标——判据必须是**卡自己的宽度**，
        // 视口断点在分栏、侧板与手机三种窄法之间对不上（docs/dynamic-workflow/transcript-and-notifications.md）。
        className: "wf-motion wf-arrive @container/wf-card flex w-full min-w-0 flex-col gap-2.5 rounded-xl border border-border/70 bg-card/70 px-3.5 pb-3 pt-1.5", "data-testid": `workflow-completion-card-${testIdKey}`, "data-workflow-completion-card": "true", children: [_jsx(WorkflowCardHeader, { expanded: false, kind: format({ id: WORKFLOW_RUN_KIND_ID.completed }), name: name, status: _jsx(WorkflowRunStatus, { status: "completed", testId: "workflow-completion-status" }), ...(headerLeading === undefined ? {} : { leading: headerLeading }), ...(headerTrailing === undefined ? {} : { trailing: headerTrailing }), ...(onOpenRun === undefined ? {} : { onOpenDetails: onOpenRun }) }), _jsx(WorkflowCompletionArtifacts, { artifactsTruncated: artifactsTruncated, labels: labels, layout: layout, ...(renderPreview === undefined ? {} : { renderPreview }), ...(onOpenArtifact === undefined ? {} : { onOpenArtifact }), ...(onOpenRun === undefined ? {} : { onOpenRun }) }), _jsxs("div", { className: "grid grid-cols-4 gap-x-3 border-t border-[var(--color-workflow-rule)] pt-2.5", "data-testid": "workflow-completion-figures", children: [_jsx(Figure, { delayMs: figureDelay, label: format({ id: "chat.toolCall.workflow.completion.time" }), parts: timeParts, testKey: "time" }), _jsx(Figure, { delayMs: figureDelay + PILL_STAGGER_MS, label: format({ id: "chat.toolCall.workflow.completion.tokens" }), parts: tokenParts, testKey: "tokens", ...(figures.tokens === undefined
                            ? {}
                            : {
                                title: format({ id: "chat.toolCall.workflow.card.tokens" }, { count: figures.tokens.toLocaleString() }),
                            }) }), _jsx(Figure, { delayMs: figureDelay + PILL_STAGGER_MS * 2, label: format({ id: "chat.toolCall.workflow.completion.subagents" }), parts: plain(subagents), testKey: "subagents" }), _jsx(Figure, { delayMs: figureDelay + PILL_STAGGER_MS * 3, label: format({ id: "chat.toolCall.workflow.completion.phases" }), parts: plain(phases), testKey: "phases" })] })] }));
}
//# sourceMappingURL=WorkflowCompletionCard.js.map