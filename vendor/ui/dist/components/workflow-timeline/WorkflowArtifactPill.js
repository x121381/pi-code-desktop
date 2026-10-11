import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ArrowUpRightIcon } from "lucide-react";
import { ArtifactKindIcon, artifactDisplayTitle, artifactKindMessageId, truncateArtifactChipTitle, } from "@/app-shell/workflow-artifacts/artifactPresentation.js";
import { cn } from "@/components/lib/utils.js";
import { useZCodeIntl } from "@/i18n/IntlProvider.js";
export function WorkflowArtifactPill({ artifact, className, detail, enterDelayMs, fill = false, onOpen, size = "md", testId = "workflow-artifact-pill", title, truncateTitle = false, variant = "pill", }) {
    const { intl } = useZCodeIntl();
    const fullTitle = artifactDisplayTitle(artifact);
    const label = truncateTitle ? truncateArtifactChipTitle(fullTitle) : fullTitle;
    const kindLabel = intl.formatMessage({ id: artifactKindMessageId(artifact.kind) });
    const openable = onOpen !== undefined;
    const version = artifact.version ?? 1;
    const showVersion = version >= 2;
    const versionLabel = intl.formatMessage({ id: "chat.toolCall.workflow.run.artifacts.version" }, { version: String(version) });
    const md = size === "md";
    // 有延迟的入场要 backwards 填充：等待期间保持起始帧（与子代理药丸同一条理由）。
    const style = enterDelayMs === undefined || enterDelayMs <= 0
        ? undefined
        : { animationDelay: `${enterDelayMs}ms`, animationFillMode: "backwards" };
    // 通知摘要复用 Read 链接语法，避免工具行中出现厚重的产物药丸。
    if (variant === "link")
        return (_jsxs("button", { type: "button", disabled: !openable, onClick: openable ? () => onOpen(artifact.id) : undefined, "data-testid": testId, "data-artifact-id": artifact.id, "data-artifact-kind": artifact.kind, "data-artifact-version": String(version), title: title ?? `${kindLabel} · ${fullTitle}`, className: "inline-flex min-w-0 max-w-full items-center gap-1.5 text-ui-base font-normal text-foreground-subtle enabled:cursor-pointer enabled:hover:underline", children: [_jsx(ArtifactKindIcon, { className: "size-4 shrink-0", kind: artifact.kind }), _jsx("span", { className: "min-w-0 truncate", children: label }), showVersion ? (_jsx("span", { "data-testid": "workflow-run-artifact-version", children: versionLabel })) : null] }));
    return (_jsxs("button", { "aria-label": openable
            ? `${intl.formatMessage({ id: "chat.toolCall.workflow.run.artifacts.open" })}: ${fullTitle}`
            : undefined, className: cn("wf-pill wf-arrive flex min-w-0 max-w-full items-center bg-surface text-left", md
            ? "h-8 gap-2 rounded-[9px] pl-2 pr-2.5 text-ui-sm"
            : "h-6 gap-1.5 rounded-md pl-1.5 pr-2 text-ui-xs", openable
            ? "wf-pill-open cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            : "cursor-default", fill && "w-full", className), "data-artifact-id": artifact.id, "data-artifact-kind": artifact.kind, "data-artifact-open": openable ? "true" : undefined, "data-artifact-version": String(version), "data-pill-size": size, "data-testid": testId, disabled: !openable, onClick: openable ? () => onOpen(artifact.id) : undefined, style: style, title: title ?? `${kindLabel} · ${fullTitle}`, type: "button", children: [_jsx(ArtifactKindIcon, { className: "size-4 shrink-0 text-foreground-subtle", kind: artifact.kind }), _jsx("span", { className: cn("wf-pill-name min-w-0 truncate text-foreground", fill && "flex-1"), children: label }), detail === undefined || detail === null ? null : (_jsx("span", { className: "flex shrink-0 items-center gap-1 font-mono text-ui-xs tabular-nums text-foreground-subtlest", children: detail })), showVersion || openable ? (_jsxs("span", { className: cn("wf-pill-tail grid shrink-0 place-items-center [&>*]:col-start-1 [&>*]:row-start-1", md ? "size-3.5" : "size-3"), "data-testid": "workflow-pill-tail", children: [showVersion ? (_jsx("span", { className: "wf-mark font-mono text-ui-xs leading-none tabular-nums text-foreground-subtlest", "data-testid": "workflow-run-artifact-version", title: versionLabel, children: intl.formatMessage({ id: "chat.toolCall.workflow.run.artifacts.versionTail" }, { version: String(version) }) }, version)) : null, openable ? (_jsx("span", { "aria-hidden": true, className: "wf-pill-go flex items-center justify-center text-foreground-subtlest", "data-testid": "workflow-artifact-pill-open", children: _jsx(ArrowUpRightIcon, { className: md ? "size-3.5" : "size-3" }) })) : null] })) : null] }));
}
//# sourceMappingURL=WorkflowArtifactPill.js.map