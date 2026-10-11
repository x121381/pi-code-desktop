import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MessageResponse } from "../../components/ai-elements/message.js";
import { useZCodeIntl } from "../../i18n/IntlProvider.js";
import { formatAgentMessage } from "./agentHelpers.js";
export function AgentPromptSection({ prompt, workspacePath, theme, codePreviewSettings, onOpenCodeViewer, onOpenFileLink, onOpenBrowserUrl, }) {
    const { intl } = useZCodeIntl();
    const promptLabel = formatAgentMessage(intl, "chat.toolCall.agent.prompt", "Prompt");
    return (_jsx("section", { className: "space-y-2", children: _jsxs("div", { className: "rounded-lg border border-border flex flex-col", children: [_jsx("div", { className: "flex min-w-0 items-center p-3", children: _jsx("h4", { className: "min-w-0 text-ui-base font-medium tracking-wide text-foreground-subtlest uppercase", children: promptLabel }) }), _jsx("div", { className: "overflow-auto max-h-50", "data-markdown-table-sticky-scrollbar": "disabled", children: _jsx(MessageResponse, { className: "px-3 py-2 min-w-0 break-words text-ui-base [&>*:first-child]:mt-0 [&>*:last-child]:mb-0", workspacePath: workspacePath, theme: theme, codePreviewSettings: codePreviewSettings, onOpenCodeViewer: onOpenCodeViewer, onOpenFileLink: onOpenFileLink, onOpenExternalUrl: onOpenBrowserUrl, children: prompt }) })] }) }));
}
//# sourceMappingURL=agentPromptSection.js.map