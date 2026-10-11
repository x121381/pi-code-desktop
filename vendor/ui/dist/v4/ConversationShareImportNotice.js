import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { memo } from "react";
import { SquareArrowRightEnter } from "lucide-react";
import { useZCodeIntl } from "../i18n/IntlProvider.js";
import { ConversationShareReadonlyTimeline } from "../v4/ConversationShareReadonlyTimeline.js";
// 注入边界：只读时间线被匿名公开分享页共用，不能静态依赖 open-with 子树；
// OpenSplitButton（platform hooks、tab store、文件树模型等 Desktop 能力）只能在本 Desktop
// 消费侧引入并经 artifactOpenAction 注入，公开页入口图因此不含该子树。
import { OpenSplitButton } from "../OpenSplitButton.js";
const EMPTY_ARTIFACT_NAMES = new Map();
const EMPTY_ARTIFACT_WORKSPACE_RELATIVE_PATHS = new Map();
/**
 * 导入分享后，会话顶部的只读块 + 分割线。
 * 使用导入图标，避免与 Fork 标记混淆。
 *
 * 只读块直接复用分享页的渲染器，因此不需要把公开 rows 反向映射成 Message
 * （那个方向有损且未定义；Fork 之所以简单是因为它克隆真实 Message）。
 *
 * 本地结果物不走分享页的 artifactUrls/window.open；只有导入端显式传入
 * workspaceRelativePath 与 Desktop 打开回调时，才复用正常预览卡片的打开控件。
 */
export const ConversationShareImportNotice = memo(function ConversationShareImportNotice({ rows, locale, theme, codePreviewSettings, artifactNames = EMPTY_ARTIFACT_NAMES, artifactWorkspaceRelativePaths = EMPTY_ARTIFACT_WORKSPACE_RELATIVE_PATHS, workspacePath, workspaceIdentity, workspaceRemoteSessionId, unsupportedRowCount = 0, onOpenShareUrl, onOpenFileLink, onOpenCodeViewer, }) {
    const { intl } = useZCodeIntl();
    const label = intl.formatMessage({ id: "conversationShare.import.dividerLabel" });
    return (_jsxs("div", { "data-conversation-share-import-notice": "true", className: "flex w-full flex-col", children: [_jsx(ConversationShareReadonlyTimeline, { rows: rows, locale: locale, ...(theme ? { theme } : {}), ...(codePreviewSettings ? { codePreviewSettings } : {}), artifactNames: artifactNames, artifactWorkspaceRelativePaths: artifactWorkspaceRelativePaths, ...(workspacePath ? { workspacePath } : {}), ...(workspaceIdentity ? { workspaceIdentity } : {}), ...(workspaceRemoteSessionId ? { workspaceRemoteSessionId } : {}), unsupportedRowCount: unsupportedRowCount, artifactOpenAction: OpenSplitButton, onOpenFileLink: onOpenFileLink, onOpenCodeViewer: onOpenCodeViewer }), onOpenShareUrl ? (_jsxs("button", { type: "button", "data-conversation-share-import-divider": "true", className: "group/share-import flex w-full items-center gap-3 px-4 py-2 text-ui-base text-foreground-subtle hover:text-foreground", onClick: onOpenShareUrl, children: [_jsx("span", { "aria-hidden": "true", className: "h-px min-w-8 flex-1 bg-border/50" }), _jsx(SquareArrowRightEnter, { "aria-hidden": "true", className: "size-3.5 shrink-0" }), _jsx("span", { className: "min-w-0 break-words text-center leading-5 underline-offset-4 group-hover/share-import:underline", children: label }), _jsx("span", { "aria-hidden": "true", className: "h-px min-w-8 flex-1 bg-border/50" })] })) : (_jsxs("div", { "data-conversation-share-import-divider": "true", className: "flex w-full items-center gap-3 px-4 py-2 text-ui-base text-foreground-subtle", children: [_jsx("span", { "aria-hidden": "true", className: "h-px min-w-8 flex-1 bg-border/50" }), _jsx(SquareArrowRightEnter, { "aria-hidden": "true", className: "size-3.5 shrink-0" }), _jsx("span", { className: "min-w-0 break-words text-center leading-5", children: label }), _jsx("span", { "aria-hidden": "true", className: "h-px min-w-8 flex-1 bg-border/50" })] }))] }));
});
//# sourceMappingURL=ConversationShareImportNotice.js.map