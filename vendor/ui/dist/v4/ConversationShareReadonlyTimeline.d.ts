import { type ComponentType } from "react";
import { type Locale } from "@zcode/shared";
import type { ConversationRow } from "@zcode/shared/zcode-protocol-v4";
import { type MessageFileLinkTarget } from "@/components/ai-elements/message.js";
import { type CodePreviewSettings } from "@/lib/codePreviewSettings.js";
import type { Theme } from "@/useTheme.js";
import type { CodeViewerSource } from "@/lib/codeViewer.js";
import type { OpenSplitButtonTarget } from "@/OpenSplitButton.js";
export interface ConversationShareReadonlyTimelineProps {
    rows: readonly ConversationRow[];
    locale?: Locale;
    theme?: Theme;
    codePreviewSettings?: CodePreviewSettings;
    artifactUrls?: ReadonlyMap<string, string>;
    artifactNames?: ReadonlyMap<string, string>;
    artifactWorkspaceRelativePaths?: ReadonlyMap<string, string>;
    workspacePath?: string;
    workspaceIdentity?: string;
    workspaceRemoteSessionId?: string;
    onOpenFileLink?: (target: MessageFileLinkTarget) => void;
    onOpenCodeViewer?: (source: CodeViewerSource) => void;
    /**
     * Desktop 侧注入的 artifact 打开动作组件（实现即 OpenSplitButton）。
     * 公开分享页不传：一是公开页没有本地打开能力，二是避免 open-with 子树进公开页 bundle。
     */
    artifactOpenAction?: ConversationShareArtifactOpenAction;
    /**
     * 本 build 认不出、已被跳过的行数（见 decodeConversationShareRows）。
     *
     * >0 时在时间线顶部出一条中性提示。必须提示：分享内容是跨版本流动的，老客户端/老落地页
     * 镜像遇到新 row kind 时会静默少几行，用户没法自己发现——他会以为分享者就发了这些。
     */
    unsupportedRowCount?: number;
}
/** 注入契约：Desktop 侧提供的「带本地打开动作」组件，与 OpenSplitButton 的关键 props 对齐。 */
export type ConversationShareArtifactOpenAction = ComponentType<{
    target: OpenSplitButtonTarget;
    onOpenFileLink?: (target: MessageFileLinkTarget) => void;
    onOpenCodeViewer?: (source: CodeViewerSource) => void;
}>;
export declare function ConversationShareReadonlyTimeline({ rows, locale, theme, codePreviewSettings, artifactUrls, artifactNames, artifactWorkspaceRelativePaths, workspacePath, workspaceIdentity, workspaceRemoteSessionId, onOpenFileLink, onOpenCodeViewer, artifactOpenAction, unsupportedRowCount, }: ConversationShareReadonlyTimelineProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ConversationShareReadonlyTimeline.d.ts.map