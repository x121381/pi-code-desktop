import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowUpRightIcon, EllipsisIcon } from "lucide-react";
import { ArtifactDetail, ArtifactKindIcon, artifactDetailText, artifactDisplayTitle, artifactKindMessageId, } from "@/app-shell/workflow-artifacts/artifactPresentation.js";
import { cn } from "@/components/lib/utils.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
import { PILL_STAGGER_MS } from "./WorkflowTimeline.js";
/**
 * 产物索引（侧板）：交付物行之后的**其余产物**，一件一行。
 *
 * 规则只有一条：**预览要么读得清，要么不画**。交付物留着它的框；其余产物把框丢掉，只剩瓦片说明行
 * 那一套语法——kind 图标、完整标题、等宽细节（迷你瓦片曾把它藏进 tooltip）、尾槽（v{n}，悬停让位
 * 给 ↗）——独立成行。层级由此来自**形态**（有图的一件 vs 只有字的其余），而不是大框与小框。
 *
 * 一行 26px。卡上按 `repeat(auto-fit, minmax(220px, 1fr))` 流成两列（窄卡一列）；侧板恒为一列。
 * 与交付物行之间隔一条细线（`--color-workflow-rule`，四格数字前的那条），卡因此读作收据的三段：
 * 交付了什么、还做了什么、花了多少。
 *
 * 「还有 N 个」是一扇门不是一件产物：省略号图标、次要色的字、↗ 不等悬停就在（与名册的「还有 n 个」
 * 一行同一条规则），点开 run 侧板看全部。
 *
 * 每一行永远是一颗 `<button>`：宿主没给回调时是**禁用**的按钮（「交付了什么」是事实，「能不能
 * 打开」是能力），与药丸、瓦片同一条门。悬停 / 聚焦时整行填 `surface-hover`（像侧栏行），填色向
 * 文字左右各多出 6px（负外边距），文字本身仍与交付物框的左边对齐。
 *
 * ⚠ 术语：artifact = 脚本经 `artifact.*` 发布给用户看的产出。
 */
function enterStyle(enterDelayMs) {
    return enterDelayMs === undefined || enterDelayMs <= 0
        ? undefined
        : { animationDelay: `${enterDelayMs}ms`, animationFillMode: "backwards" };
}
const LINE_CLASS = "wf-line wf-arrive -mx-1.5 flex h-[26px] min-w-0 items-center gap-2 rounded-md bg-transparent px-1.5 text-left text-ui-sm outline-none";
function WorkflowArtifactLine({ artifact, enterDelayMs, labels, onOpen, testId = "workflow-artifact-line", title: tooltip, }) {
    const { intl } = useZCodeIntl();
    const title = artifactDisplayTitle(artifact);
    const kindLabel = intl.formatMessage({ id: artifactKindMessageId(artifact.kind) });
    const hasDetail = artifactDetailText(artifact, labels) !== undefined;
    const openable = onOpen !== undefined;
    const version = artifact.version ?? 1;
    const showVersion = version >= 2;
    return (_jsxs("button", { "aria-label": openable
            ? `${intl.formatMessage({ id: "chat.toolCall.workflow.run.artifacts.open" })}: ${title}`
            : undefined, className: cn(LINE_CLASS, openable ? "wf-line-open cursor-pointer" : "cursor-default"), "data-artifact-id": artifact.id, "data-artifact-kind": artifact.kind, "data-artifact-open": openable ? "true" : undefined, "data-artifact-version": String(version), "data-testid": testId, "data-variant": "line", disabled: !openable, onClick: openable ? () => onOpen(artifact.id) : undefined, style: enterStyle(enterDelayMs), title: tooltip ?? `${kindLabel} · ${title}`, type: "button", children: [_jsx(ArtifactKindIcon, { className: "wf-line-icon size-3.5 shrink-0 text-foreground-subtle", kind: artifact.kind }), _jsx("span", { className: "min-w-0 flex-1 truncate text-foreground", children: title }), hasDetail ? (_jsx("span", { className: "flex shrink-0 items-center gap-1 font-mono text-ui-xs tabular-nums text-foreground-subtlest", "data-testid": "workflow-artifact-line-detail", children: _jsx(ArtifactDetail, { artifact: artifact, labels: labels }) })) : null, showVersion || openable ? (_jsxs("span", { className: "grid size-3 shrink-0 place-items-center [&>*]:col-start-1 [&>*]:row-start-1", children: [showVersion ? (_jsx("span", { className: "wf-mark font-mono text-ui-xs leading-none tabular-nums text-foreground-subtlest", "data-testid": "workflow-artifact-tile-version", title: intl.formatMessage({ id: "chat.toolCall.workflow.run.artifacts.version" }, { version: String(version) }), children: intl.formatMessage({ id: "chat.toolCall.workflow.run.artifacts.versionTail" }, { version: String(version) }) }, version)) : null, openable ? (_jsx("span", { "aria-hidden": true, className: "wf-pill-go flex items-center justify-center text-foreground-subtlest", "data-testid": "workflow-artifact-tile-open", children: _jsx(ArrowUpRightIcon, { className: "size-3" }) })) : null] })) : null] }));
}
/** 「还有 N 个」——门，不是产物。砍过的清单不知道 N，写 `…`。 */
function WorkflowArtifactMoreLine({ count, enterDelayMs, onOpen, testId = "workflow-artifact-more-line", truncated = false, }) {
    const { intl } = useZCodeIntl();
    const openable = onOpen !== undefined;
    return (_jsxs("button", { className: cn(LINE_CLASS, openable ? "wf-line-open cursor-pointer" : "cursor-default"), "data-testid": testId, "data-variant": "more", disabled: !openable, onClick: onOpen, style: enterStyle(enterDelayMs), title: intl.formatMessage({ id: "chat.toolCall.workflow.openRunDetails" }), type: "button", children: [_jsx(EllipsisIcon, { "aria-hidden": true, className: "size-3.5 shrink-0 text-foreground-subtlest" }), _jsx("span", { className: "min-w-0 flex-1 truncate text-foreground-subtle", children: intl.formatMessage({ id: "chat.toolCall.workflow.completion.moreArtifacts" }, { count: truncated ? "…" : count.toLocaleString() }) }), openable ? (_jsx("span", { className: "grid size-3 shrink-0 place-items-center", children: _jsx("span", { "aria-hidden": true, className: "wf-pill-go wf-pill-go-rest flex items-center justify-center text-foreground-subtlest", "data-testid": "workflow-artifact-tile-open", children: _jsx(ArrowUpRightIcon, { className: "size-3" }) }) })) : null] }));
}
/**
 * 索引本身：行 + 可选的门。`columns="auto"` 是卡上的两列流（≥ 2 × 220px 才成两列），`"one"` 是侧板
 * 的单列。`rule` 在上方画那条细线（跟在交付物行之后时要；索引独占卡时不要）。行依次落地，从
 * `firstDelayMs` 起每行错 30ms，门排在最后一行之后。
 */
export function WorkflowArtifactIndex({ artifacts, columns = "auto", firstDelayMs = 0, folded = 0, labels, lineTestId, more = false, moreTestId, onOpenArtifact, onOpenRun, rule = false, testId = "workflow-artifact-index", tooltipOf, truncated = false, }) {
    return (_jsxs("div", { className: cn("grid gap-x-5", columns === "auto" ? "grid-cols-[repeat(auto-fit,minmax(220px,1fr))]" : "grid-cols-1", rule && "border-t border-[var(--color-workflow-rule)] pt-1.5"), "data-columns": columns, "data-testid": testId, children: [artifacts.map((artifact, index) => (_jsx(WorkflowArtifactLine, { artifact: artifact, enterDelayMs: firstDelayMs + PILL_STAGGER_MS * index, labels: labels, ...(lineTestId === undefined ? {} : { testId: lineTestId }), ...(tooltipOf === undefined ? {} : { title: tooltipOf(artifact) }), ...(onOpenArtifact === undefined ? {} : { onOpen: onOpenArtifact }) }, artifact.id))), more ? (_jsx(WorkflowArtifactMoreLine, { count: folded, enterDelayMs: firstDelayMs + PILL_STAGGER_MS * artifacts.length, truncated: truncated, ...(moreTestId === undefined ? {} : { testId: moreTestId }), ...(onOpenRun === undefined ? {} : { onOpen: onOpenRun }) })) : null] }));
}
//# sourceMappingURL=WorkflowArtifactIndex.js.map