import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { ArrowUpRightIcon } from "lucide-react";
import { ArtifactDetail, ArtifactKindIcon, artifactDetailText, artifactDisplayTitle, artifactKindMessageId, } from "../../app-shell/workflow-artifacts/artifactPresentation.js";
import { cn } from "../../components/lib/utils.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
/**
 * 交付物行（侧板）：run 的 primary 产物在完成卡与 run 侧板上的样子。
 *
 * 它是**侧躺的瓦片**：同一只 16:10 预览框（160 × 100，与瓦片同一档——不是横幅），框旁是 kind 图标 +
 * 比说明行大一级的标题、作者写的 description（三行截断）、一行等宽的 `kind · size`，尾槽是瓦片的
 * （v{n}，悬停让位给 ↗）。强调来自位置、形态与文字，从不来自更大的预览，也从不来自任何标签——
 * UI 上没有「primary」这个词。
 *
 * 面板窄于 380px 时（容器查询 `wf-artifacts`，由侧板的节身声明）框收成 136 × 85；完成卡不声明
 * 容器，于是恒为 160 × 100。
 *
 * 整行是一颗 `<button>`：宿主没给回调时是禁用的按钮，与瓦片同一条门。与瓦片同一个结构（见
 * WorkflowArtifactTile 文件头）：预览框是按钮的兄弟节点并标 `inert`，按钮只包文字列，
 * 用铺满整行的 `::after` 接住点击。尾槽与细节沿用瓦片的 testid（`workflow-artifact-tile-version` /
 * `-open`、`workflow-run-artifact-badge` / `-bytes` / `-items`）：它们是同一套语法，读测试的人不该
 * 因为形态换了而找不到版本号。
 */
export function WorkflowArtifactRow({ artifact, enterDelayMs, labels, onOpen, preview, testId = "workflow-artifact-row", title: tooltip, }) {
    const { intl } = useZCodeIntl();
    const title = artifactDisplayTitle(artifact);
    const kindLabel = intl.formatMessage({ id: artifactKindMessageId(artifact.kind) });
    const hasDetail = artifactDetailText(artifact, labels) !== undefined;
    const description = artifact.description?.trim();
    const openable = onOpen !== undefined;
    const version = artifact.version ?? 1;
    const showVersion = version >= 2;
    const style = enterDelayMs === undefined || enterDelayMs <= 0
        ? undefined
        : { animationDelay: `${enterDelayMs}ms`, animationFillMode: "backwards" };
    return (_jsxs("div", { className: "wf-tile relative grid w-full min-w-0 grid-cols-[160px_minmax(0,1fr)] items-start gap-3 @max-[380px]/wf-artifacts:grid-cols-[136px_minmax(0,1fr)]", "data-variant": "row", children: [_jsx("div", { "aria-hidden": true, className: "wf-tile-frame wf-arrive relative h-[100px] w-[160px] overflow-hidden rounded-lg border border-border bg-panel @max-[380px]/wf-artifacts:h-[85px] @max-[380px]/wf-artifacts:w-[136px]", "data-testid": "workflow-artifact-row-frame", inert: true, style: style, children: preview }), _jsxs("button", { "aria-label": openable
                    ? `${intl.formatMessage({ id: "chat.toolCall.workflow.run.artifacts.open" })}: ${title}`
                    : undefined, className: cn("wf-tile-hit wf-arrive flex min-w-0 flex-col gap-0.5 rounded-lg bg-transparent p-0 pt-px text-left outline-none", openable ? "wf-tile-open cursor-pointer" : "cursor-default"), "data-artifact-id": artifact.id, "data-artifact-kind": artifact.kind, "data-artifact-open": openable ? "true" : undefined, "data-artifact-version": String(version), "data-testid": testId, "data-variant": "row", disabled: !openable, onClick: openable ? () => onOpen(artifact.id) : undefined, style: style, title: tooltip ?? `${kindLabel} · ${title}`, type: "button", children: [_jsxs("span", { className: "flex h-5 min-w-0 items-center gap-1.5", children: [_jsx(ArtifactKindIcon, { className: "size-4 shrink-0 text-foreground-subtle", kind: artifact.kind }), _jsx("span", { className: "wf-pill-name min-w-0 flex-1 truncate text-ui-base font-medium text-foreground", "data-testid": "workflow-artifact-row-title", children: title }), showVersion || openable ? (_jsxs("span", { className: "grid size-3 shrink-0 place-items-center [&>*]:col-start-1 [&>*]:row-start-1", children: [showVersion ? (_jsx("span", { className: "wf-mark font-mono text-ui-xs leading-none tabular-nums text-foreground-subtlest", "data-testid": "workflow-artifact-tile-version", title: intl.formatMessage({ id: "chat.toolCall.workflow.run.artifacts.version" }, { version: String(version) }), children: intl.formatMessage({ id: "chat.toolCall.workflow.run.artifacts.versionTail" }, { version: String(version) }) }, version)) : null, openable ? (_jsx("span", { "aria-hidden": true, className: "wf-pill-go flex items-center justify-center text-foreground-subtlest", "data-testid": "workflow-artifact-tile-open", children: _jsx(ArrowUpRightIcon, { className: "size-3" }) })) : null] })) : null] }), description === undefined || description.length === 0 ? null : (_jsx("span", { className: "line-clamp-3 text-ui-sm text-foreground-subtle [text-wrap:pretty]", "data-testid": "workflow-artifact-row-description", children: description })), _jsxs("span", { className: "mt-0.5 flex h-4 min-w-0 items-center gap-1.5 font-mono text-ui-xs tabular-nums text-foreground-subtlest", "data-testid": "workflow-artifact-row-detail", children: [_jsx("span", { children: kindLabel }), hasDetail ? (_jsxs(_Fragment, { children: [_jsx("span", { "aria-hidden": true, children: "\u00B7" }), _jsx("span", { className: "flex min-w-0 items-center gap-1 truncate", children: _jsx(ArtifactDetail, { artifact: artifact, labels: labels }) })] })) : null] })] })] }));
}
//# sourceMappingURL=WorkflowArtifactRow.js.map