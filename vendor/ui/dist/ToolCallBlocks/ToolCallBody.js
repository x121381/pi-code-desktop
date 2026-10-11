import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { CodeBlock } from "../components/ai-elements/code-block.js";
import { MessageResponse } from "../components/ai-elements/message.js";
import { ToolInput, ToolOutput } from "../components/ai-elements/tool.js";
import { useServices } from "../hooks/useServices.js";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
export function ToolCallBody({ childToolList, displayModel, inlinePreviewOverride, toolCall, workspacePath, theme, codePreviewSettings, onOpenCodeViewer, onOpenFileLink, onOpenBrowserUrl, }) {
    const inlinePreview = inlinePreviewOverride ?? displayModel.inlinePreview;
    return (_jsx(_Fragment, { children: childToolList ?? (_jsxs(_Fragment, { children: [inlinePreview.type === "text" ? (_jsx(InlineCodeContent, { preview: inlinePreview.source, workspacePath: workspacePath, theme: theme, codePreviewSettings: codePreviewSettings, onOpenCodeViewer: onOpenCodeViewer, onOpenFileLink: onOpenFileLink, onOpenBrowserUrl: onOpenBrowserUrl })) : null, inlinePreview.type === "image" ? (_jsx(InlineImageContent, { preview: inlinePreview.source })) : null, displayModel.planResult ? (_jsx(InlinePlanResult, { plan: displayModel.planResult.plan, planFilePath: displayModel.planResult.planFilePath, workspacePath: workspacePath, theme: theme, codePreviewSettings: codePreviewSettings, onOpenCodeViewer: onOpenCodeViewer, onOpenFileLink: onOpenFileLink, onOpenBrowserUrl: onOpenBrowserUrl })) : null, displayModel.showInput && toolCall.input !== undefined ? (_jsx(ToolInput, { input: toolCall.input })) : null, displayModel.showOutput ? (_jsx(ToolOutput, { errorText: toolCall.error, output: toolCall.output })) : null, displayModel.showKind ? (_jsx("p", { className: "text-ui-base text-muted-foreground", children: toolCall.kind })) : null] })) }));
}
function InlineCodeContent({ preview, workspacePath, theme, codePreviewSettings, onOpenCodeViewer, onOpenFileLink, onOpenBrowserUrl, }) {
    if (preview.language === "markdown") {
        return (_jsx("div", { className: "max-h-60 overflow-auto rounded-xl border border-border bg-muted/15 px-3 py-3", children: _jsx(MessageResponse, { className: "min-w-0 break-words", workspacePath: workspacePath, theme: theme, codePreviewSettings: codePreviewSettings, onOpenCodeViewer: onOpenCodeViewer, 
                // 工具输出里的 markdown 文件链接之前只拿到 onOpenCodeViewer，
                // 点击会退化成 code viewer fallback；有 diff source 上下文时容易打开变更视图。
                // 这里优先交给 shell 的文件链接分流，文件看内容，目录走文件树 reveal。
                onOpenFileLink: onOpenFileLink, onOpenExternalUrl: onOpenBrowserUrl, children: preview.content }) }));
    }
    return (_jsx("div", { className: "max-h-60 overflow-auto rounded-xl bg-muted/15", children: _jsx(CodeBlock, { code: preview.content, language: preview.language, appTheme: theme }) }));
}
function InlineImageContent({ preview }) {
    const { fileService } = useServices();
    const { intl } = useZCodeIntl();
    const [imagePreview, setImagePreview] = useState(null);
    useEffect(() => {
        let cancelled = false;
        void fileService.readMediaPreview({ path: preview.path }).then((mediaPreview) => {
            if (!cancelled) {
                setImagePreview(mediaPreview);
            }
        });
        return () => {
            cancelled = true;
        };
    }, [fileService, preview.path]);
    if (!imagePreview) {
        return _jsx("p", { children: intl.formatMessage({ id: "chat.toolCall.loading" }) });
    }
    return _jsx("img", { src: imagePreview.dataBase64, alt: preview.title });
}
function InlinePlanResult({ plan, planFilePath, workspacePath, theme, codePreviewSettings, onOpenCodeViewer, onOpenFileLink, onOpenBrowserUrl, }) {
    const { intl } = useZCodeIntl();
    return (_jsxs("div", { className: "space-y-3 rounded-xl border border-outline/60 bg-muted/15 p-3", children: [planFilePath ? (_jsxs("div", { className: "flex flex-wrap items-center gap-2 text-ui-base text-on-surface-muted", children: [_jsx("span", { children: intl.formatMessage({ id: "chat.toolCall.planFile" }) }), _jsx("span", { className: "cursor-default rounded-md bg-muted/70 px-2 py-1 font-mono text-on-surface", children: planFilePath })] })) : null, _jsx(MessageResponse, { className: "size-full min-w-0 break-words whitespace-normal [&>*:first-child]:mt-0 [&>*:last-child]:mb-0", workspacePath: workspacePath, theme: theme, codePreviewSettings: codePreviewSettings, onOpenCodeViewer: onOpenCodeViewer, onOpenFileLink: onOpenFileLink, onOpenExternalUrl: onOpenBrowserUrl, children: plan })] }));
}
//# sourceMappingURL=ToolCallBody.js.map