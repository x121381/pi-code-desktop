import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useRef } from "react";
import { MarkdownSelectionTooltip } from "./v4/MarkdownSelectionTooltip.js";
import { MessageResponse } from "./components/ai-elements/message.js";
export function MarkdownPreviewContent({ content, sourceKey, sourceTitle, sourcePath, selectionTarget, workspacePath, theme, codePreviewSettings, onOpenBrowserUrl, }) {
    const rootRef = useRef(null);
    const selectionScope = useMemo(() => ({}), [content, sourceKey, sourcePath, selectionTarget?.workspaceKey, selectionTarget?.sessionId]);
    return (_jsxs("div", { ref: rootRef, "data-markdown-preview": "true", className: "w-full h-full bg-background overflow-auto", children: [selectionTarget && sourceKey ? (_jsx(MarkdownSelectionTooltip, { scopeKey: selectionScope, rootRef: rootRef, sourceKey: sourceKey, sourceTitle: sourceTitle ?? sourceKey, sourcePath: sourcePath, target: selectionTarget })) : null, _jsx("div", { className: "min-h-full bg-background p-4", children: _jsx(MessageResponse, { className: "min-w-0 break-words", workspacePath: workspacePath, theme: theme, codePreviewSettings: codePreviewSettings, onOpenExternalUrl: onOpenBrowserUrl, children: content }) })] }));
}
//# sourceMappingURL=previewPaneMarkdownContent.js.map