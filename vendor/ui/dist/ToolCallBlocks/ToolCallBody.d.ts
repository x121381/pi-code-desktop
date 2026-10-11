import { type ReactNode } from "react";
import { type MessageFileLinkTarget } from "@/components/ai-elements/message.js";
import type { CodeViewerSource } from "@/lib/codeViewer.js";
import type { CodePreviewSettings } from "@/lib/codePreviewSettings.js";
import type { TaskChatToolCallTreeNode } from "@/lib/toolCallTree.js";
import type { ToolDisplayModel, ToolInlinePreview } from "@/lib/toolDisplay.js";
import type { Theme } from "@/useTheme.js";
export declare function ToolCallBody({ childToolList, displayModel, inlinePreviewOverride, toolCall, workspacePath, theme, codePreviewSettings, onOpenCodeViewer, onOpenFileLink, onOpenBrowserUrl, }: {
    childToolList: ReactNode;
    displayModel: ToolDisplayModel;
    inlinePreviewOverride?: ToolInlinePreview;
    toolCall: TaskChatToolCallTreeNode["toolCall"];
    workspacePath: string;
    /** 应用主题（store 耦合剥离）：透传给 markdown / 代码块渲染，缺省按 "system" 兜底。 */
    theme?: Theme;
    /** 代码预览设置（store 耦合剥离）：透传给 markdown 渲染，需保持引用稳定。 */
    codePreviewSettings?: CodePreviewSettings;
    onOpenCodeViewer?: (source: CodeViewerSource) => void;
    onOpenFileLink?: (target: MessageFileLinkTarget) => void;
    onOpenBrowserUrl?: (url: string) => void;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ToolCallBody.d.ts.map