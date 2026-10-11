import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowUpRightIcon } from "lucide-react";
import { ArtifactKindIcon, artifactDisplayTitle, artifactKindMessageId, } from "@/app-shell/workflow-artifacts/artifactPresentation.js";
import { cn } from "@/components/lib/utils.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
/** 内容拿不到时的纸页字形：一张小纸 + 右下角的扩展名徽字。诚实，不装饰。 */
export function ArtifactSheetGlyph({ badge }) {
    return (_jsxs("div", { className: "absolute inset-0 grid place-items-center", "data-testid": "workflow-artifact-sheet", children: [_jsxs("div", { className: "flex aspect-[3/4] w-[38%] max-w-[72px] flex-col gap-1.5 rounded-[4px] border border-border bg-card p-2.5 shadow-[0_1px_0_var(--color-workflow-rule)]", children: [_jsx("i", { className: "block h-[5px] w-[55%] rounded-sm bg-surface-hover" }), _jsx("i", { className: "block h-[3px] rounded-sm bg-surface-hover" }), _jsx("i", { className: "block h-[3px] rounded-sm bg-surface-hover" }), _jsx("i", { className: "block h-[3px] w-[70%] rounded-sm bg-surface-hover" })] }), badge === undefined ? null : (_jsx("span", { className: "absolute bottom-2 right-2 rounded-[4px] bg-surface-hover px-1.5 py-0.5 font-mono text-ui-xs text-foreground-subtle", "data-testid": "workflow-artifact-sheet-badge", children: badge }))] }));
}
export function WorkflowArtifactTile({ artifact, detail, enterDelayMs, onOpen, preview, testId = "workflow-artifact-tile", title: tooltip, }) {
    const { intl } = useZCodeIntl();
    const title = artifactDisplayTitle(artifact);
    const kindLabel = intl.formatMessage({ id: artifactKindMessageId(artifact.kind) });
    const openable = onOpen !== undefined;
    const version = artifact.version ?? 1;
    const showVersion = version >= 2;
    const style = enterDelayMs === undefined || enterDelayMs <= 0
        ? undefined
        : { animationDelay: `${enterDelayMs}ms`, animationFillMode: "backwards" };
    return (_jsxs("div", { className: "wf-tile relative flex min-w-0 flex-col gap-1.5", "data-variant": "tile", children: [_jsx("div", { "aria-hidden": true, className: "wf-tile-frame wf-arrive relative aspect-[16/10] w-full overflow-hidden rounded-lg border border-border bg-panel", "data-testid": "workflow-artifact-tile-frame", inert: true, style: style, children: preview ?? _jsx(ArtifactSheetGlyph, {}) }), _jsxs("button", { "aria-label": openable
                    ? `${intl.formatMessage({ id: "chat.toolCall.workflow.run.artifacts.open" })}: ${title}`
                    : undefined, className: cn("wf-tile-hit wf-arrive flex min-w-0 items-center gap-1.5 rounded-lg bg-transparent p-0 px-0.5 text-left text-ui-sm outline-none", openable ? "wf-tile-open cursor-pointer" : "cursor-default"), "data-artifact-id": artifact.id, "data-artifact-kind": artifact.kind, "data-artifact-open": openable ? "true" : undefined, "data-artifact-version": String(version), "data-testid": testId, "data-variant": "tile", disabled: !openable, onClick: openable ? () => onOpen(artifact.id) : undefined, style: style, title: tooltip ?? `${kindLabel} · ${title}`, type: "button", children: [_jsx(ArtifactKindIcon, { className: "size-4 shrink-0 text-foreground-subtle", kind: artifact.kind }), _jsx("span", { className: "wf-pill-name min-w-0 flex-1 truncate text-foreground", children: title }), detail === undefined || detail === null ? null : (_jsx("span", { className: "flex shrink-0 items-center gap-1 font-mono text-ui-xs tabular-nums text-foreground-subtlest", "data-testid": "workflow-artifact-tile-detail", children: detail })), showVersion || openable ? (_jsxs("span", { className: "grid size-3 shrink-0 place-items-center [&>*]:col-start-1 [&>*]:row-start-1", children: [showVersion ? (_jsx("span", { className: "wf-mark font-mono text-ui-xs leading-none tabular-nums text-foreground-subtlest", "data-testid": "workflow-artifact-tile-version", title: intl.formatMessage({ id: "chat.toolCall.workflow.run.artifacts.version" }, { version: String(version) }), children: intl.formatMessage({ id: "chat.toolCall.workflow.run.artifacts.versionTail" }, { version: String(version) }) }, version)) : null, openable ? (_jsx("span", { "aria-hidden": true, className: "wf-pill-go flex items-center justify-center text-foreground-subtlest", "data-testid": "workflow-artifact-tile-open", children: _jsx(ArrowUpRightIcon, { className: "size-3" }) })) : null] })) : null] })] }));
}
//# sourceMappingURL=WorkflowArtifactTile.js.map