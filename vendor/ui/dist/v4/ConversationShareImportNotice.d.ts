import type { Locale } from "@zcode/shared";
import type { ConversationRow } from "@zcode/shared/zcode-protocol-v4";
import type { MessageFileLinkTarget } from "@/components/ai-elements/message.js";
import type { CodeViewerSource } from "@/lib/codeViewer.js";
import type { CodePreviewSettings } from "@/lib/codePreviewSettings.js";
import type { Theme } from "@/useTheme.js";
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
export declare const ConversationShareImportNotice: import("react").MemoExoticComponent<({ rows, locale, theme, codePreviewSettings, artifactNames, artifactWorkspaceRelativePaths, workspacePath, workspaceIdentity, workspaceRemoteSessionId, unsupportedRowCount, onOpenShareUrl, onOpenFileLink, onOpenCodeViewer, }: {
    rows: readonly ConversationRow[];
    locale: Locale;
    theme?: Theme;
    codePreviewSettings?: CodePreviewSettings;
    artifactNames?: ReadonlyMap<string, string>;
    artifactWorkspaceRelativePaths?: ReadonlyMap<string, string>;
    workspacePath?: string;
    workspaceIdentity?: string;
    workspaceRemoteSessionId?: string;
    unsupportedRowCount?: number;
    onOpenShareUrl?: () => void;
    onOpenFileLink?: (target: MessageFileLinkTarget) => void;
    onOpenCodeViewer?: (source: CodeViewerSource) => void;
}) => import("react/jsx-runtime").JSX.Element>;
//# sourceMappingURL=ConversationShareImportNotice.d.ts.map